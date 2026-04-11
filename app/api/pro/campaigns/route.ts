import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.userType !== "pro") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const campaigns = await prisma.campaign.findMany({
    where: { proId: session.user.id },
    include: { project: { select: { id: true, title: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ campaigns });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.userType !== "pro") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { name, platform, objective, startDate, endDate, budget, currency, projectId } = body;

  if (!name || !startDate) {
    return NextResponse.json({ error: "name and startDate are required" }, { status: 400 });
  }

  const campaign = await prisma.campaign.create({
    data: {
      proId: session.user.id,
      name,
      platform: platform ?? "other",
      objective: objective ?? null,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      budget: budget ? parseFloat(budget) : null,
      currency: currency ?? "GBP",
      projectId: projectId ?? null,
      status: "draft",
    },
    include: { project: { select: { id: true, title: true } } },
  });

  return NextResponse.json({ campaign }, { status: 201 });
}
