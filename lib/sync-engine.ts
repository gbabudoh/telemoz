import prisma from "@/lib/prisma";
import { ExternalIntegration } from "@prisma/client";
import { decrypt } from "@/lib/encryption";
import { getMetaInsights } from "@/lib/integrations/meta";
import { getLinkedInAnalytics } from "@/lib/integrations/linkedin";
import { getSearchConsoleData } from "@/lib/integrations/google";
import { subDays, format } from "date-fns";
import { detectAnomalies } from "@/lib/anomaly-detector";

export async function runFullSync() {
  const integrations = await prisma.externalIntegration.findMany({
    where: { status: "active" },
    include: { credentials: true },
  });

  const results = {
    total: integrations.length,
    success: 0,
    failed: 0,
    errors: [] as string[],
  };

  const endDate = format(new Date(), "yyyy-MM-dd");
  const startDate = format(subDays(new Date(), 7), "yyyy-MM-dd"); // Sync last 7 days to catch updates

  for (const integration of integrations) {
    if (!integration.credentials) continue;

    try {
      const accessToken = decrypt(integration.credentials.accessToken);
      
      if (integration.provider === "meta_ads") {
        await syncMetaAds(integration, accessToken, "last_7d");
      } else if (integration.provider === "linkedin_ads") {
        await syncLinkedInAds(integration, accessToken, startDate, endDate);
      } else if (integration.provider === "google_search_console") {
        await syncGoogleSearchConsole(integration, accessToken, startDate, endDate);
      }

      results.success++;
    } catch (error) {
      results.failed++;
      results.errors.push(`${integration.provider} (${integration.id}): ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  // Run anomaly detection for users with active integrations
  const uniqueUserIds = Array.from(new Set(integrations.map(i => i.userId)));
  for (const userId of uniqueUserIds) {
    try {
      await detectAnomalies(userId);
    } catch (error) {
      console.error(`Anomaly detection failed for user ${userId}:`, error);
    }
  }

  return results;
}

async function syncMetaAds(integration: ExternalIntegration, accessToken: string, datePreset: string) {
  const insights = await getMetaInsights(integration.providerAccountId, accessToken, datePreset);
  
  if (insights.data) {
    for (const day of insights.data) {
      await prisma.campaignMetric.upsert({
        where: {
          campaignId_date: {
            campaignId: integration.id, // Using integration ID as campaign ID for MVP
            date: new Date(day.date_start),
          },
        },
        update: {
          impressions: parseInt(day.impressions) || 0,
          clicks: parseInt(day.clicks) || 0,
          spend: parseFloat(day.spend) || 0,
        },
        create: {
          campaignId: integration.id,
          date: new Date(day.date_start),
          impressions: parseInt(day.impressions) || 0,
          clicks: parseInt(day.clicks) || 0,
          spend: parseFloat(day.spend) || 0,
        },
      });
    }
  }
}

async function syncLinkedInAds(integration: ExternalIntegration, accessToken: string, startDate: string, endDate: string) {
  const analytics = await getLinkedInAnalytics(integration.providerAccountId, accessToken, startDate, endDate);
  
  if (analytics.elements) {
    for (const entry of analytics.elements) {
      const date = new Date(`${entry.dateRange.start.year}-${entry.dateRange.start.month}-${entry.dateRange.start.day}`);
      await prisma.campaignMetric.upsert({
        where: {
          campaignId_date: {
            campaignId: integration.id,
            date: date,
          },
        },
        update: {
          impressions: entry.impressions || 0,
          clicks: entry.clicks || 0,
          spend: entry.costInLocalCurrency || 0,
          conversions: entry.externalConversions || 0,
        },
        create: {
          campaignId: integration.id,
          date: date,
          impressions: entry.impressions || 0,
          clicks: entry.clicks || 0,
          spend: entry.costInLocalCurrency || 0,
          conversions: entry.externalConversions || 0,
        },
      });
    }
  }
}

async function syncGoogleSearchConsole(integration: ExternalIntegration, accessToken: string, startDate: string, endDate: string) {
  const rows = await getSearchConsoleData(accessToken, integration.providerAccountId, startDate, endDate);
  
  if (rows) {
    for (const row of rows) {
      if (!row.keys || !row.keys[0]) continue;
      
      await prisma.campaignMetric.upsert({
        where: {
          campaignId_date: {
            campaignId: integration.id,
            date: new Date(row.keys[0]),
          },
        },
        update: {
          impressions: row.impressions || 0,
          clicks: row.clicks || 0,
        },
        create: {
          campaignId: integration.id,
          date: new Date(row.keys[0]),
          impressions: row.impressions || 0,
          clicks: row.clicks || 0,
        },
      });
    }
  }
}
