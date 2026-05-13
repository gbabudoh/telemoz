const META_APP_ID = process.env.META_APP_ID || "";
const META_APP_SECRET = process.env.META_APP_SECRET || "";
const NEXTAUTH_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";

export function getMetaAuthUrl() {
  const redirectUri = encodeURIComponent(`${NEXTAUTH_URL}/api/integrations/meta/callback`);
  return `https://www.facebook.com/v18.0/dialog/oauth?client_id=${META_APP_ID}&redirect_uri=${redirectUri}&scope=ads_read,read_insights,business_management`;
}

export async function getMetaTokens(code: string) {
  const redirectUri = encodeURIComponent(`${NEXTAUTH_URL}/api/integrations/meta/callback`);
  const response = await fetch(
    `https://graph.facebook.com/v18.0/oauth/access_token?client_id=${META_APP_ID}&redirect_uri=${redirectUri}&client_secret=${META_APP_SECRET}&code=${code}`
  );
  return response.json();
}

export async function getLongLivedMetaToken(shortLivedToken: string) {
  const response = await fetch(
    `https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${META_APP_ID}&client_secret=${META_APP_SECRET}&fb_exchange_token=${shortLivedToken}`
  );
  return response.json();
}

export async function getMetaAdAccounts(accessToken: string) {
  const response = await fetch(
    `https://graph.facebook.com/v18.0/me/adaccounts?fields=name,account_id&access_token=${accessToken}`
  );
  return response.json();
}

export async function getMetaInsights(adAccountId: string, accessToken: string, datePreset: string = "last_30d") {
  const response = await fetch(
    `https://graph.facebook.com/v18.0/${adAccountId}/insights?fields=impressions,clicks,spend,conversions&date_preset=${datePreset}&access_token=${accessToken}`
  );
  return response.json();
}
