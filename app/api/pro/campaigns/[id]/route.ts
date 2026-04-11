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

  const campaign = await prisma.campaign.findUnique({ where: { id } });
  if (!campaign || campaign.proId !== session.user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { name, platform, objective, startDate, endDate, budget, status, impressions, clicks, conversions, spend, revenue } = body;

  const updated = await prisma.campaign.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(platform !== undefined && { platform }),
      ...(objective !== undefined && { objective }),
      ...(startDate !== undefined && { startDate: new Date(startDate) }),
      ...(endDate !== undefined && { endDate: endDate ? new Date(endDate) : null }),
      ...(budget !== undefined && { budget: budget ? parseFloat(budget) : null }),
      ...(status !== undefined && { status }),
      ...(impressions !== undefined && { impressions: parseInt(impressions) }),
      ...(clicks !== undefined && { clicks: parseInt(clicks) }),
      ...(conversions !== undefined && { conversions: parseInt(conversions) }),
      ...(spend !== undefined && { spend: parseFloat(spend) }),
      ...(revenue !== undefined && { revenue: parseFloat(revenue) }),
    },
    include: { project: { select: { id: true, title: true } } },
  });

  return NextResponse.json({ campaign: updated });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.userType !== "pro") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const campaign = await prisma.campaign.findUnique({ where: { id } });
  if (!campaign || campaign.proId !== session.user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.campaign.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
