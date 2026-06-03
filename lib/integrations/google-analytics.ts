import { google } from "googleapis";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const NEXTAUTH_URL = process.env.NEXTAUTH_URL;

export const ga4OAuth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  `${NEXTAUTH_URL}/api/integrations/google-analytics/callback`
);

export const GA4_SCOPES = [
  "https://www.googleapis.com/auth/analytics.readonly",
  "https://www.googleapis.com/auth/userinfo.email",
];

export function getGA4AuthUrl() {
  return ga4OAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: GA4_SCOPES,
    prompt: "consent",
  });
}

export async function getGA4Tokens(code: string) {
  const { tokens } = await ga4OAuth2Client.getToken(code);
  return tokens;
}

export async function listGA4Properties(accessToken: string) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });

  const analyticsAdmin = google.analyticsadmin({ version: "v1beta", auth });
  const res = await analyticsAdmin.properties.list({
    filter: "parent:accounts/-",
  });
  return res.data.properties || [];
}

export async function getGA4Report(
  propertyId: string,
  accessToken: string,
  startDate: string,
  endDate: string
) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });

  const analyticsData = google.analyticsdata({ version: "v1beta", auth });
  const res = await analyticsData.properties.runReport({
    property: `properties/${propertyId}`,
    requestBody: {
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: "date" }],
      metrics: [
        { name: "sessions" },
        { name: "totalUsers" },
        { name: "screenPageViews" },
        { name: "conversions" },
        { name: "bounceRate" },
      ],
    },
  });
  return res.data;
}
