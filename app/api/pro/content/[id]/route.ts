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

  const item = await prisma.contentItem.findUnique({ where: { id } });
  if (!item || item.proId !== session.user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { title, type, platform, content, caption, scheduledAt, status, approvalStatus, rejectionNote } = body;

  const updated = await prisma.contentItem.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(type !== undefined && { type }),
      ...(platform !== undefined && { platform }),
      ...(content !== undefined && { content }),
      ...(caption !== undefined && { caption }),
      ...(scheduledAt !== undefined && { scheduledAt: scheduledAt ? new Date(scheduledAt) : null }),
      ...(status !== undefined && { status }),
      ...(approvalStatus !== undefined && { approvalStatus }),
      ...(rejectionNote !== undefined && { rejectionNote }),
    },
    include: { project: { select: { id: true, title: true } } },
  });

  return NextResponse.json({ item: updated });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.userType !== "pro") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const item = await prisma.contentItem.findUnique({ where: { id } });
  if (!item || item.proId !== session.user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.contentItem.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
