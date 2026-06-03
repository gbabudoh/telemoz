const BING_CLIENT_ID = process.env.BING_ADS_CLIENT_ID || "";
const BING_CLIENT_SECRET = process.env.BING_ADS_CLIENT_SECRET || "";
const BING_DEVELOPER_TOKEN = process.env.BING_ADS_DEVELOPER_TOKEN || "";
const NEXTAUTH_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";

const BING_AUTH_BASE = "https://login.microsoftonline.com/common/oauth2/v2.0";
const BING_API_BASE = "https://campaign.api.bingads.microsoft.com/api/advertiser/v13";

export function getBingAuthUrl() {
  const params = new URLSearchParams({
    client_id: BING_CLIENT_ID,
    response_type: "code",
    redirect_uri: `${NEXTAUTH_URL}/api/integrations/bing/callback`,
    scope: "https://ads.microsoft.com/ads.manage offline_access",
    response_mode: "query",
  });
  return `${BING_AUTH_BASE}/authorize?${params.toString()}`;
}

export async function getBingTokens(code: string) {
  const res = await fetch(`${BING_AUTH_BASE}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: BING_CLIENT_ID,
      client_secret: BING_CLIENT_SECRET,
      grant_type: "authorization_code",
      code,
      redirect_uri: `${NEXTAUTH_URL}/api/integrations/bing/callback`,
    }),
  });
  return res.json() as Promise<{
    access_token: string;
    refresh_token: string;
    expires_in: number;
    scope: string;
  }>;
}

export async function refreshBingToken(refreshToken: string) {
  const res = await fetch(`${BING_AUTH_BASE}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: BING_CLIENT_ID,
      client_secret: BING_CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });
  return res.json();
}

export async function getBingAccounts(accessToken: string) {
  const res = await fetch(`${BING_API_BASE}/CustomerManagement/v13/GetAccountsInfo`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      DeveloperToken: BING_DEVELOPER_TOKEN,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });
  return res.json();
}

export async function getBingCampaignReport(
  accountId: string,
  accessToken: string,
  startDate: string,
  endDate: string
) {
  const [startY, startM, startD] = startDate.split("-");
  const [endY, endM, endD] = endDate.split("-");

  const body = {
    ReportRequest: {
      ExcludeColumnHeaders: false,
      ExcludeReportFooter: true,
      ExcludeReportHeader: true,
      Format: "Csv",
      ReportName: "CampaignPerformance",
      ReturnOnlyCompleteData: false,
      Type: "CampaignPerformanceReport",
      Aggregation: "Daily",
      Columns: ["TimePeriod", "CampaignName", "Impressions", "Clicks", "Spend", "Conversions"],
      Filter: {},
      Scope: { AccountIds: [accountId] },
      Time: {
        CustomDateRangeStart: { Day: startD, Month: startM, Year: startY },
        CustomDateRangeEnd: { Day: endD, Month: endM, Year: endY },
      },
    },
  };

  const res = await fetch(`${BING_API_BASE}/Reporting/v13/SubmitGenerateReport`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      DeveloperToken: BING_DEVELOPER_TOKEN,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return res.json();
}
