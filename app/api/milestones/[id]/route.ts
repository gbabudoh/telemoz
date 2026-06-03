import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// PATCH /api/milestones/[id] — update status (pro only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.userType !== "pro") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { status, title } = await request.json();

  const milestone = await prisma.milestone.findUnique({
    where: { id },
    include: { project: { select: { proId: true } } },
  });

  if (!milestone) {
    return NextResponse.json({ error: "Milestone not found" }, { status: 404 });
  }

  if (milestone.project.proId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updated = await prisma.milestone.update({
    where: { id },
    data: {
      ...(status !== undefined && { status }),
      ...(title !== undefined && { title }),
      ...(status === "completed" && { completedAt: new Date() }),
      ...(status !== "completed" && status !== undefined && { completedAt: null }),
    },
  });

  return NextResponse.json({ milestone: updated });
}

// DELETE /api/milestones/[id]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.userType !== "pro") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const milestone = await prisma.milestone.findUnique({
    where: { id },
    include: { project: { select: { proId: true } } },
  });

  if (!milestone || milestone.project.proId !== session.user.id) {
    return NextResponse.json({ error: "Not found or forbidden" }, { status: 404 });
  }

  await prisma.milestone.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
