const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID || "";
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET || "";
const NEXTAUTH_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";

export function getLinkedInAuthUrl() {
  const redirectUri = encodeURIComponent(`${NEXTAUTH_URL}/api/integrations/linkedin/callback`);
  return `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LINKEDIN_CLIENT_ID}&redirect_uri=${redirectUri}&scope=r_ads_reporting,r_ads,rw_ads,r_liteprofile,r_emailaddress`;
}

export async function getLinkedInTokens(code: string) {
  const redirectUri = `${NEXTAUTH_URL}/api/integrations/linkedin/callback`;
  const response = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      client_id: LINKEDIN_CLIENT_ID,
      client_secret: LINKEDIN_CLIENT_SECRET,
    }),
  });
  return response.json();
}

export async function getLinkedInAdAccounts(accessToken: string) {
  const response = await fetch("https://api.linkedin.com/v2/adAccountsV2?q=search&search=(status:(values:List(ACTIVE)))", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "X-Restli-Protocol-Version": "2.0.0",
    },
  });
  return response.json();
}

export async function getLinkedInAnalytics(adAccountId: string, accessToken: string, startDate: string, endDate: string) {
  const response = await fetch(
    `https://api.linkedin.com/v2/adAnalyticsV2?q=analytics&pivot=ACCOUNT&dateRange=(start:(day:${startDate.split("-")[2]},month:${startDate.split("-")[1]},year:${startDate.split("-")[0]}),end:(day:${endDate.split("-")[2]},month:${endDate.split("-")[1]},year:${endDate.split("-")[0]}))&accounts=List(urn:li:sponsoredAccount:${adAccountId})&fields=impressions,clicks,costInLocalCurrency,externalConversions`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Restli-Protocol-Version": "2.0.0",
      },
    }
  );
  return response.json();
}
