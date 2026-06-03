import crypto from "crypto";

const TWITTER_CLIENT_ID = process.env.TWITTER_ADS_CLIENT_ID || "";
const TWITTER_CLIENT_SECRET = process.env.TWITTER_ADS_CLIENT_SECRET || "";
const NEXTAUTH_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";

const TWITTER_AUTH_BASE = "https://twitter.com/i/oauth2";
const TWITTER_TOKEN_URL = "https://api.twitter.com/2/oauth2/token";
const TWITTER_ADS_BASE = "https://ads-api.twitter.com/12";

// PKCE helpers
export function generateCodeVerifier(): string {
  return crypto.randomBytes(32).toString("base64url");
}

export function generateCodeChallenge(verifier: string): string {
  return crypto.createHash("sha256").update(verifier).digest("base64url");
}

export function getTwitterAuthUrl(codeChallenge: string, state: string) {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: TWITTER_CLIENT_ID,
    redirect_uri: `${NEXTAUTH_URL}/api/integrations/twitter/callback`,
    scope: "tweet.read users.read offline.access ads_read",
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });
  return `${TWITTER_AUTH_BASE}/authorize?${params.toString()}`;
}

export async function getTwitterTokens(code: string, codeVerifier: string) {
  const credentials = Buffer.from(`${TWITTER_CLIENT_ID}:${TWITTER_CLIENT_SECRET}`).toString("base64");
  const res = await fetch(TWITTER_TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: `${NEXTAUTH_URL}/api/integrations/twitter/callback`,
      code_verifier: codeVerifier,
    }),
  });
  return res.json() as Promise<{
    access_token: string;
    refresh_token?: string;
    expires_in: number;
    scope: string;
    token_type: string;
  }>;
}

export async function refreshTwitterToken(refreshToken: string) {
  const credentials = Buffer.from(`${TWITTER_CLIENT_ID}:${TWITTER_CLIENT_SECRET}`).toString("base64");
  const res = await fetch(TWITTER_TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });
  return res.json();
}

export async function getTwitterAdAccounts(accessToken: string) {
  const res = await fetch(`${TWITTER_ADS_BASE}/accounts`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return res.json();
}

export async function getTwitterCampaignStats(
  accountId: string,
  accessToken: string,
  startDate: string,
  endDate: string
) {
  const params = new URLSearchParams({
    start_time: `${startDate}T00:00:00Z`,
    end_time: `${endDate}T23:59:59Z`,
    granularity: "DAY",
    metric_groups: "ENGAGEMENT,BILLING",
    placement: "ALL_ON_TWITTER",
  });

  const res = await fetch(
    `${TWITTER_ADS_BASE}/stats/accounts/${accountId}?${params.toString()}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  return res.json();
}
