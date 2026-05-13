import { google } from "googleapis";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const NEXTAUTH_URL = process.env.NEXTAUTH_URL;

export const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  `${NEXTAUTH_URL}/api/integrations/google/callback`
);

export const SEARCH_CONSOLE_SCOPES = [
  "https://www.googleapis.com/auth/webmasters.readonly",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email",
];

export function getGoogleAuthUrl() {
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SEARCH_CONSOLE_SCOPES,
    prompt: "consent", // Force to get refresh token
  });
}

export async function getGoogleTokens(code: string) {
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
}

export async function getSearchConsoleData(accessToken: string, siteUrl: string, startDate: string, endDate: string) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });
  
  const searchconsole = google.searchconsole({ version: "v1", auth });
  
  const res = await searchconsole.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate,
      endDate,
      dimensions: ["date"],
    },
  });
  
  return res.data.rows;
}
