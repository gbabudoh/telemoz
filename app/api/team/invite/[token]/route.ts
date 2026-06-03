import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/team/invite/[token] — public: validate token and return invite details
export async function GET(_req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const invite = await prisma.teamInvite.findUnique({
    where: { token },
    include: { agency: { select: { name: true, image: true } } },
  });

  if (!invite) return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
  if (invite.status === "accepted") return NextResponse.json({ error: "Invitation already accepted" }, { status: 410 });
  if (invite.status === "revoked") return NextResponse.json({ error: "Invitation has been revoked" }, { status: 410 });
  if (new Date() > invite.expiresAt) {
    await prisma.teamInvite.update({ where: { token }, data: { status: "expired" } });
    return NextResponse.json({ error: "Invitation has expired" }, { status: 410 });
  }

  return NextResponse.json({
    inviteId: invite.id,
    email: invite.email,
    role: invite.role,
    agencyName: invite.agency.name,
    agencyImage: invite.agency.image,
    expiresAt: invite.expiresAt,
  });
}
