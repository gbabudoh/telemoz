import { google } from "googleapis";

const GOOGLE_ADS_CLIENT_ID = process.env.GOOGLE_ADS_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
const GOOGLE_ADS_CLIENT_SECRET = process.env.GOOGLE_ADS_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_ADS_DEVELOPER_TOKEN = process.env.GOOGLE_ADS_DEVELOPER_TOKEN || "";
const NEXTAUTH_URL = process.env.NEXTAUTH_URL;

export const googleAdsOAuth2Client = new google.auth.OAuth2(
  GOOGLE_ADS_CLIENT_ID,
  GOOGLE_ADS_CLIENT_SECRET,
  `${NEXTAUTH_URL}/api/integrations/google-ads/callback`
);

export const GOOGLE_ADS_SCOPES = [
  "https://www.googleapis.com/auth/adwords",
  "https://www.googleapis.com/auth/userinfo.email",
];

export function getGoogleAdsAuthUrl() {
  return googleAdsOAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: GOOGLE_ADS_SCOPES,
    prompt: "consent",
  });
}

export async function getGoogleAdsTokens(code: string) {
  const { tokens } = await googleAdsOAuth2Client.getToken(code);
  return tokens;
}

export async function listGoogleAdsCustomers(accessToken: string): Promise<Array<{ id: string; descriptiveName: string }>> {
  const res = await fetch(
    "https://googleads.googleapis.com/v16/customers:listAccessibleCustomers",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "developer-token": GOOGLE_ADS_DEVELOPER_TOKEN,
      },
    }
  );
  const data = await res.json();
  return (data.resourceNames || []).map((name: string) => ({
    id: name.replace("customers/", ""),
    descriptiveName: name,
  }));
}

export async function getGoogleAdsCampaignMetrics(
  customerId: string,
  accessToken: string,
  startDate: string,
  endDate: string
) {
  const query = `
    SELECT
      campaign.id,
      campaign.name,
      campaign.status,
      metrics.impressions,
      metrics.clicks,
      metrics.cost_micros,
      metrics.conversions,
      segments.date
    FROM campaign
    WHERE segments.date BETWEEN '${startDate}' AND '${endDate}'
    ORDER BY segments.date DESC
  `;

  const res = await fetch(
    `https://googleads.googleapis.com/v16/customers/${customerId}/googleAds:search`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "developer-token": GOOGLE_ADS_DEVELOPER_TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    }
  );

  const data = await res.json();
  return data.results || [];
}
