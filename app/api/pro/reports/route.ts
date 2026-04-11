import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.userType !== "pro") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const reports = await prisma.scheduledReport.findMany({
    where: { proId: session.user.id },
    include: { project: { select: { id: true, title: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ reports });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.userType !== "pro") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { title, cadence, recipients, projectId } = body;

  if (!title || !recipients?.length) {
    return NextResponse.json({ error: "title and at least one recipient are required" }, { status: 400 });
  }

  // Compute next send date based on cadence
  const now = new Date();
  const nextSendAt = new Date(now);
  if (cadence === "weekly") {
    nextSendAt.setDate(now.getDate() + 7);
  } else {
    nextSendAt.setMonth(now.getMonth() + 1);
    nextSendAt.setDate(1);
  }

  const report = await prisma.scheduledReport.create({
    data: {
      proId: session.user.id,
      title,
      cadence: cadence ?? "monthly",
      recipients: Array.isArray(recipients) ? recipients : [recipients],
      projectId: projectId ?? null,
      nextSendAt,
      active: true,
    },
    include: { project: { select: { id: true, title: true } } },
  });

  return NextResponse.json({ report }, { status: 201 });
}
