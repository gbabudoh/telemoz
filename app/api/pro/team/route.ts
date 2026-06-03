import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { addSeat, SEAT_LIMITS } from "@/lib/stripe";
import { sendEmail, teamInviteEmail } from "@/lib/email";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.userType !== "pro") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const agencyId = session.user.id;

  const [members, pendingInvites, agency] = await Promise.all([
    prisma.teamMember.findMany({
      where: { agencyId },
      include: { member: { select: { id: true, name: true, email: true, image: true } } },
      orderBy: { createdAt: "asc" },
    }),
    prisma.teamInvite.findMany({
      where: { agencyId, status: "pending" },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findUnique({
      where: { id: agencyId },
      select: { subscriptionTier: true },
    }),
  ]);

  const tier = agency?.subscriptionTier ?? "free";
  const seatLimit = SEAT_LIMITS[tier] ?? 0;
  const seatCount = members.length;

  return NextResponse.json({ members, pendingInvites, seatCount, seatLimit, tier });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.userType !== "pro") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { memberEmail, role } = body;

  if (!memberEmail) return NextResponse.json({ error: "memberEmail is required" }, { status: 400 });

  const allowedRoles = ["manager", "contributor"];
  if (role && !allowedRoles.includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const agencyId = session.user.id;

  // Check seat limit
  const [agency, currentSeats] = await Promise.all([
    prisma.user.findUnique({ where: { id: agencyId }, select: { subscriptionTier: true, stripeCustomerId: true, name: true } }),
    prisma.teamMember.count({ where: { agencyId } }),
  ]);

  const tier = agency?.subscriptionTier ?? "free";
  const seatLimit = SEAT_LIMITS[tier] ?? 0;

  if (currentSeats >= seatLimit) {
    return NextResponse.json({
      error: tier === "free"
        ? "Team seats are not available on the free plan. Upgrade to add team members."
        : `You've reached your seat limit (${seatLimit}) for the ${tier} plan.`,
    }, { status: 403 });
  }

  // Prevent duplicate pending invite
  const existingInvite = await prisma.teamInvite.findFirst({
    where: { agencyId, email: memberEmail.toLowerCase(), status: "pending" },
  });
  if (existingInvite) {
    return NextResponse.json({ error: "An invitation has already been sent to this email" }, { status: 409 });
  }

  // Prevent adding someone already on the team
  const existingMember = await prisma.user.findUnique({ where: { email: memberEmail.toLowerCase() } });
  if (existingMember) {
    if (existingMember.id === agencyId) {
      return NextResponse.json({ error: "You cannot add yourself as a team member" }, { status: 400 });
    }
    const alreadyMember = await prisma.teamMember.findUnique({
      where: { agencyId_memberId: { agencyId, memberId: existingMember.id } },
    });
    if (alreadyMember) {
      return NextResponse.json({ error: "This user is already a team member" }, { status: 409 });
    }
  }

  // Create invite (expires in 7 days)
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const invite = await prisma.teamInvite.create({
    data: {
      agencyId,
      email: memberEmail.toLowerCase(),
      role: role ?? "contributor",
      expiresAt,
    },
  });

  // Send invite email
  const acceptUrl = `${process.env.NEXTAUTH_URL}/team/invite/${invite.token}`;
  const agencyName = agency?.name ?? "Your team";
  try {
    const emailContent = teamInviteEmail(agencyName, invite.role, acceptUrl);
    await sendEmail({ to: memberEmail, ...emailContent });
  } catch (err) {
    console.error("Failed to send invite email:", err);
    // Don't fail the request — invite is created, email failure is non-fatal
  }

  return NextResponse.json({ invite }, { status: 201 });
}
