import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const briefs = await prisma.projectBrief.findMany({
    where: { clientId: session.user.id },
    include: { project: { select: { id: true, title: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ briefs });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, objective, targetAudience, budget, currency, platforms, deliverables, timeline, additionalNotes, projectId } = body;

  if (!title || !objective) {
    return NextResponse.json({ error: "title and objective are required" }, { status: 400 });
  }

  const brief = await prisma.projectBrief.create({
    data: {
      clientId: session.user.id,
      title, objective,
      targetAudience: targetAudience ?? null,
      budget: budget ? parseFloat(budget) : null,
      currency: currency ?? "GBP",
      platforms: platforms ?? [],
      deliverables: deliverables ?? [],
      timeline: timeline ?? null,
      additionalNotes: additionalNotes ?? null,
      projectId: projectId ?? null,
    },
    include: { project: { select: { id: true, title: true } } },
  });

  return NextResponse.json({ brief }, { status: 201 });
}
