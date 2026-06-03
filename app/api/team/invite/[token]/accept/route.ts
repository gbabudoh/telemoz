import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { addSeat } from "@/lib/stripe";

// POST /api/team/invite/[token]/accept — authenticated user accepts the invite
export async function POST(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    // Return the login redirect URL so the client can redirect preserving the token
    return NextResponse.json({ error: "Unauthenticated", loginRequired: true }, { status: 401 });
  }

  const { token } = await params;

  const invite = await prisma.teamInvite.findUnique({
    where: { token },
    include: { agency: { select: { id: true, stripeCustomerId: true, name: true } } },
  });

  if (!invite) return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
  if (invite.status === "accepted") return NextResponse.json({ error: "Already accepted" }, { status: 410 });
  if (invite.status !== "pending") return NextResponse.json({ error: "Invitation is no longer valid" }, { status: 410 });
  if (new Date() > invite.expiresAt) {
    await prisma.teamInvite.update({ where: { token }, data: { status: "expired" } });
    return NextResponse.json({ error: "Invitation has expired" }, { status: 410 });
  }

  // Ensure the logged-in user's email matches the invite email
  if (session.user.email.toLowerCase() !== invite.email.toLowerCase()) {
    return NextResponse.json({
      error: `This invitation was sent to ${invite.email}. Please log in with that account to accept.`,
    }, { status: 403 });
  }

  // Prevent duplicate membership
  const existing = await prisma.teamMember.findUnique({
    where: { agencyId_memberId: { agencyId: invite.agencyId, memberId: session.user.id } },
  });
  if (existing) {
    await prisma.teamInvite.update({ where: { token }, data: { status: "accepted", acceptedAt: new Date(), memberId: session.user.id } });
    return NextResponse.json({ success: true, alreadyMember: true });
  }

  // Bill the seat via Stripe
  let stripeSubscriptionItemId: string | null = null;
  if (invite.agency.stripeCustomerId) {
    try {
      stripeSubscriptionItemId = await addSeat(invite.agency.stripeCustomerId);
    } catch (err) {
      console.error("Stripe seat billing failed:", err);
      // Non-fatal — still create the member, flag for manual review
    }
  }

  // Create TeamMember + mark invite accepted in a transaction
  await prisma.$transaction([
    prisma.teamMember.create({
      data: {
        agencyId: invite.agencyId,
        memberId: session.user.id,
        role: invite.role,
        stripeSubscriptionItemId,
      },
    }),
    prisma.teamInvite.update({
      where: { token },
      data: { status: "accepted", acceptedAt: new Date(), memberId: session.user.id },
    }),
  ]);

  return NextResponse.json({ success: true, agencyId: invite.agencyId });
}
