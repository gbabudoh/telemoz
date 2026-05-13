import prisma from "@/lib/prisma";
import { generateText } from "@/lib/ai";
import { subDays } from "date-fns";

export interface Anomaly {
  type: "spike" | "drop";
  metric: string;
  provider: string;
  value: number;
  average: number;
  percentage: number;
  description: string;
}

export async function detectAnomalies(userId: string): Promise<Anomaly[]> {
  const anomalies: Anomaly[] = [];
  const lookbackDays = 14;
  const startDate = subDays(new Date(), lookbackDays);

  // 1. Fetch metrics for the user
  const metrics = await prisma.campaignMetric.findMany({
    where: {
      campaign: {
        integration: {
          userId: userId
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
      date: 'desc'
    }
  });

  if (metrics.length < 7) return [];

  // 2. Group by provider
  const platformGroups: Record<string, typeof metrics> = {};
  metrics.forEach(m => {
    const provider = m.campaign.integration?.provider;
    if (!provider) return;
    if (!platformGroups[provider]) platformGroups[provider] = [];
    platformGroups[provider].push(m);
  });

  // 3. Analyze each platform
  for (const [provider, providerMetrics] of Object.entries(platformGroups)) {
    if (providerMetrics.length < 3) continue;

    const latest = providerMetrics[0];
    const history = providerMetrics.slice(1, 8); // Previous 7 days
    
    const metricsToCheck = ['impressions', 'clicks', 'spend'] as const;

    for (const metric of metricsToCheck) {
      const currentValue = latest[metric] as number;
      if (currentValue === 0 && metric === 'spend') continue; // Ignore zero spend if it's usually zero

      const avgValue = history.reduce((sum, m) => sum + (m[metric] as number), 0) / history.length;
      
      if (avgValue === 0) continue;

      const variance = (currentValue - avgValue) / avgValue;

      // Threshold: 50% change
      if (Math.abs(variance) > 0.5) {
        const type = variance > 0 ? "spike" : "drop";
        
        // 4. Generate AI summary
        const prompt = `Analyze this marketing anomaly for a user:
        Platform: ${provider}
        Metric: ${metric}
        Current Value: ${currentValue}
        7-Day Average: ${avgValue.toFixed(2)}
        Change: ${(variance * 100).toFixed(1)}% (${type})
        
        Write a 1-sentence professional alert for the user. Example: "Your Meta Ads spend increased by 65% compared to last week - check your budget settings."`;

        let description = `Your ${provider} ${metric} saw a ${type} of ${(Math.abs(variance) * 100).toFixed(1)}%.`;
        try {
          const aiSummary = await generateText(prompt, { temperature: 0.7 });
          if (aiSummary) description = aiSummary.trim().replace(/^"|"$/g, '');
        } catch (e) {
          console.error("AI Anomaly Summary failed:", e);
        }

        anomalies.push({
          type,
          metric,
          provider,
          value: currentValue,
          average: avgValue,
          percentage: variance * 100,
          description
        });

        // 5. Create a notification in the database
        await prisma.notification.create({
          data: {
            userId: userId,
            title: `Marketing Alert: ${type.toUpperCase()} in ${provider}`,
            message: description,
            type: 'marketing_anomaly',
            link: '/pro/digitalbox/reporting',
            read: false
          }
        });
      }
    }
  }

  return anomalies;
}
