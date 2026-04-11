import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.userType !== "pro") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const items = await prisma.contentItem.findMany({
    where: { proId: session.user.id },
    include: { project: { select: { id: true, title: true } } },
    orderBy: { scheduledAt: "asc" },
  });

  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.userType !== "pro") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { title, type, platform, content, caption, scheduledAt, projectId } = body;

  if (!title) return NextResponse.json({ error: "title is required" }, { status: 400 });

  const item = await prisma.contentItem.create({
    data: {
      proId: session.user.id,
      title,
      type: type ?? "post",
      platform: platform ?? null,
      content: content ?? null,
      caption: caption ?? null,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      projectId: projectId ?? null,
      status: "draft",
      approvalStatus: "pending_review",
    },
    include: { project: { select: { id: true, title: true } } },
  });

  return NextResponse.json({ item }, { status: 201 });
}
