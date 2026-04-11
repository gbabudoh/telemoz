import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.userType !== "pro") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const members = await prisma.teamMember.findMany({
    where: { agencyId: session.user.id },
    include: { member: { select: { id: true, name: true, email: true, image: true } } },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ members });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.userType !== "pro") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { memberEmail, role } = body;

  if (!memberEmail) return NextResponse.json({ error: "memberEmail is required" }, { status: 400 });

  // Look up member by email
  const memberUser = await prisma.user.findUnique({ where: { email: memberEmail } });
  if (!memberUser) {
    return NextResponse.json({ error: "No user found with that email address" }, { status: 404 });
  }
  if (memberUser.id === session.user.id) {
    return NextResponse.json({ error: "You cannot add yourself as a team member" }, { status: 400 });
  }

  // Check for duplicate
  const existing = await prisma.teamMember.findUnique({
    where: { agencyId_memberId: { agencyId: session.user.id, memberId: memberUser.id } },
  });
  if (existing) {
    return NextResponse.json({ error: "This user is already a team member" }, { status: 409 });
  }

  const member = await prisma.teamMember.create({
    data: {
      agencyId: session.user.id,
      memberId: memberUser.id,
      role: role ?? "contributor",
    },
    include: { member: { select: { id: true, name: true, email: true, image: true } } },
  });

  return NextResponse.json({ member }, { status: 201 });
}
