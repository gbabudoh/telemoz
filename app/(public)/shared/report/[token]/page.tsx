import prisma from "@/lib/prisma";
import { ClientReport } from "@/components/reporting/ClientReport";
import { notFound } from "next/navigation";
import { subDays } from "date-fns";

interface ShareReport {
  id: string;
  token: string;
  projectId: string;
  proId: string;
  viewCount: number;
  project: {
    title: string;
    client: { name: string };
  };
  pro: { name: string };
}

async function getReportData(token: string) {
  const share = await prisma.reportShare.findUnique({
    where: { token },
    include: {
      project: {
        include: {
          client: true,
          pro: true,
        }
      },
      pro: true,
    }
  }) as ShareReport | null;

  if (!share) return null;

  // Increment view count
  await prisma.reportShare.update({
    where: { id: share.id },
    data: { viewCount: { increment: 1 } }
  });

  // Fetch marketing data for the project's integrations
  // For the MVP, we fetch metrics where the campaign matches the pro's integrations
  // and potentially filtered by project if campaigns are linked to projects.
  
  const startDate = subDays(new Date(), 30);

  const metrics = await prisma.campaignMetric.findMany({
    where: {
      campaign: {
        proId: share.proId,
        // If campaigns were linked to projects, we would filter by projectId here.
        // For now, we fetch all pro's metrics for this client/report view.
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

  // Aggregate totals
  const totals = metrics.reduce((acc, curr) => ({
    impressions: acc.impressions + curr.impressions,
    clicks: acc.clicks + curr.clicks,
    spend: acc.spend + curr.spend,
    conversions: acc.conversions + curr.conversions,
  }), { impressions: 0, clicks: 0, spend: 0, conversions: 0 });

  // Group by date
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

  // Platform breakdown
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

  return {
    data: {
      totals,
      chartData: Object.values(chartDataMap),
      platformData: Object.values(platformDataMap),
    },
    clientName: share.project.client.name,
    projectName: share.project.title,
    proName: share.pro.name,
    period: "Last 30 Days"
  };
}

export default async function PublicReportPage({ params }: { params: { token: string } }) {
  const report = await getReportData(params.token);

  if (!report) {
    notFound();
  }

  return (
    <div className="bg-gray-50 py-20 px-4">
      <ClientReport 
        data={report.data}
        clientName={report.clientName}
        projectName={report.projectName}
        proName={report.proName}
        period={report.period}
      />
    </div>
  );
}
