import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { subDays } from "date-fns";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const period = searchParams.get("period") || "30days";

  let startDate = subDays(new Date(), 30);
  if (period === "7days") startDate = subDays(new Date(), 7);
  if (period === "90days") startDate = subDays(new Date(), 90);

  try {
    // 1. Fetch aggregate metrics
    const metrics = await prisma.campaignMetric.findMany({
      where: {
        campaign: {
          integration: {
            userId: session.user.id
          }
        },
        date: {
          gte: startDate
        }
      },
      include: {
        campaign: {
          include: {
            integration: true
          }
        }
      },
      orderBy: {
        date: 'asc'
      }
    });

    // 2. Aggregate totals
    const totals = metrics.reduce((acc, curr) => ({
      impressions: acc.impressions + curr.impressions,
      clicks: acc.clicks + curr.clicks,
      spend: acc.spend + curr.spend,
      conversions: acc.conversions + curr.conversions,
    }), { impressions: 0, clicks: 0, spend: 0, conversions: 0 });

    // 3. Group by date for charts
    const chartDataMap: Record<string, { date: string; impressions: number; clicks: number; spend: number }> = {};
    metrics.forEach(m => {
      const dateStr = m.date.toISOString().split('T')[0];
      if (!chartDataMap[dateStr]) {
        chartDataMap[dateStr] = { date: dateStr, impressions: 0, clicks: 0, spend: 0 };
      }
      chartDataMap[dateStr].impressions += m.impressions;
      chartDataMap[dateStr].clicks += m.clicks;
      chartDataMap[dateStr].spend += m.spend;
    });

    const chartData = Object.values(chartDataMap);

    // 4. Platform breakdown (In-memory aggregation since Prisma doesn't support groupBy on relations)
    const platformDataMap: Record<string, { provider: string; _sum: { impressions: number; clicks: number; spend: number } }> = {};
    metrics.forEach(m => {
      const provider = m.campaign.integration?.provider;
      if (!provider) return;
      
      if (!platformDataMap[provider]) {
        platformDataMap[provider] = { provider, _sum: { impressions: 0, clicks: 0, spend: 0 } };
      }
      platformDataMap[provider]._sum.impressions += m.impressions;
      platformDataMap[provider]._sum.clicks += m.clicks;
      platformDataMap[provider]._sum.spend += m.spend;
    });

    const platformData = Object.values(platformDataMap);

    // 5. Check active integrations
    const activeIntegrations = await prisma.externalIntegration.findMany({
      where: { 
        userId: session.user.id,
        status: 'active'
      },
      select: { provider: true }
    });

    return NextResponse.json({
      totals,
      chartData,
      platformData,
      integrations: activeIntegrations
    });
  } catch (error) {
    console.error("Failed to fetch marketing metrics:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
