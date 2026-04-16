import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  void request;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = await params;

    const project = await prisma.project.findFirst({
      where: { id: projectId, clientId: session.user.id },
      include: {
        pro: { select: { name: true } },
        campaigns: {
          include: {
            dailyMetrics: { orderBy: { date: "asc" } },
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Build monthly chart data from daily metrics
    const monthlyMap = new Map<string, { traffic: number; leads: number; conversions: number }>();
    for (const campaign of project.campaigns) {
      for (const metric of campaign.dailyMetrics) {
        const key = new Date(metric.date).toLocaleDateString("en-GB", { month: "short" });
        const existing = monthlyMap.get(key) ?? { traffic: 0, leads: 0, conversions: 0 };
        monthlyMap.set(key, {
          traffic: existing.traffic + metric.impressions,
          leads: existing.leads + metric.clicks,
          conversions: existing.conversions + metric.conversions,
        });
      }
    }

    const chartData = Array.from(monthlyMap.entries()).map(([month, data]) => ({
      month,
      ...data,
    }));

    const totals = project.campaigns.reduce(
      (acc, c) => ({
        traffic: acc.traffic + c.impressions,
        leads: acc.leads + c.clicks,
        conversions: acc.conversions + c.conversions,
      }),
      { traffic: 0, leads: 0, conversions: 0 }
    );

    return NextResponse.json({
      project: {
        id: project.id,
        title: project.title,
        pro: project.pro?.name ?? "Unassigned",
        status: project.status,
      },
      stats: totals,
      chartData,
    });
  } catch (error) {
    console.error("Error fetching project report:", error);
    return NextResponse.json({ error: "Failed to fetch report" }, { status: 500 });
  }
}
