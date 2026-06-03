import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// POST /api/projects/[id]/milestones — pro adds a milestone
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.userType !== "pro") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: projectId } = await params;
  const { title, description, dueDate } = await request.json();

  if (!title?.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { proId: true },
  });

  if (!project || project.proId !== session.user.id) {
    return NextResponse.json({ error: "Not found or forbidden" }, { status: 404 });
  }

  const milestone = await prisma.milestone.create({
    data: {
      projectId,
      title: title.trim(),
      description: description?.trim() || "",
      status: "pending",
      dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 7 * 86400_000),
    },
  });

  return NextResponse.json({ milestone }, { status: 201 });
}

// GET /api/projects/[id]/milestones
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: projectId } = await params;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { proId: true, clientId: true },
  });

  if (!project || (project.proId !== session.user.id && project.clientId !== session.user.id)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const milestones = await prisma.milestone.findMany({
    where: { projectId },
    orderBy: { dueDate: "asc" },
  });

  return NextResponse.json({ milestones });
}
