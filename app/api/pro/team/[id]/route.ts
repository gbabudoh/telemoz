import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.userType !== "pro") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const body = await req.json();

  const member = await prisma.teamMember.findUnique({ where: { id } });
  if (!member || member.agencyId !== session.user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.teamMember.update({
    where: { id },
    data: { role: body.role },
    include: { member: { select: { id: true, name: true, email: true, image: true } } },
  });

  return NextResponse.json({ member: updated });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.userType !== "pro") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const member = await prisma.teamMember.findUnique({ where: { id } });
  if (!member || member.agencyId !== session.user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.teamMember.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
