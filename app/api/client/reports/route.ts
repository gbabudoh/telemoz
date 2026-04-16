import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  void request;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projects = await prisma.project.findMany({
      where: { clientId: session.user.id },
      include: {
        pro: { select: { name: true } },
        campaigns: {
          select: {
            impressions: true,
            clicks: true,
            conversions: true,
            spend: true,
            revenue: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    let totalTraffic = 0;
    let totalLeads = 0;
    let totalConversions = 0;
    let totalRevenue = 0;
    let totalSpend = 0;

    const reports = projects.map((project) => {
      const metrics = project.campaigns.reduce(
        (acc, c) => ({
          traffic: acc.traffic + c.impressions,
          leads: acc.leads + c.clicks,
          conversions: acc.conversions + c.conversions,
          revenue: acc.revenue + c.revenue,
          spend: acc.spend + c.spend,
        }),
        { traffic: 0, leads: 0, conversions: 0, revenue: 0, spend: 0 }
      );

      totalTraffic += metrics.traffic;
      totalLeads += metrics.leads;
      totalConversions += metrics.conversions;
      totalRevenue += metrics.revenue;
      totalSpend += metrics.spend;

      const roas = metrics.spend > 0 ? Math.round((metrics.revenue / metrics.spend) * 10) / 10 : 0;

      return {
        id: project.id,
        projectId: project.id,
        projectName: project.title,
        pro: project.pro?.name ?? "Unassigned",
        status: project.status,
        createdAt: project.createdAt,
        metrics: {
          traffic: metrics.traffic,
          leads: metrics.leads,
          conversions: metrics.conversions,
          revenue: metrics.revenue,
          roas,
        },
      };
    });

    const avgROAS =
      totalSpend > 0 ? Math.round((totalRevenue / totalSpend) * 10) / 10 : 0;

    return NextResponse.json({
      reports,
      overallStats: {
        totalTraffic,
        totalLeads,
        totalConversions,
        totalRevenue,
        avgROAS,
        activeProjects: projects.filter((p) =>
          ["planning", "active"].includes(p.status)
        ).length,
      },
    });
  } catch (error) {
    console.error("Error fetching client reports:", error);
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
  }
}
