import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getTwitterTokens } from "@/lib/integrations/twitter";
import { encrypt } from "@/lib/encryption";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const storedVerifier = req.cookies.get("twitter_code_verifier")?.value;
  const storedState = req.cookies.get("twitter_oauth_state")?.value;

  if (error) {
    return NextResponse.redirect(new URL("/pro/settings?activeTab=integrations&error=twitter_auth_failed", req.url));
  }

  if (!code || !storedVerifier) {
    return NextResponse.redirect(new URL("/pro/settings?activeTab=integrations&error=no_code", req.url));
  }

  if (state !== storedState) {
    return NextResponse.redirect(new URL("/pro/settings?activeTab=integrations&error=state_mismatch", req.url));
  }

  try {
    const tokens = await getTwitterTokens(code, storedVerifier);

    if (!tokens.access_token) {
      throw new Error("No access token received");
    }

    const userId = session.user.id;
    const providerAccountId = session.user.email || userId;

    const integration = await prisma.externalIntegration.upsert({
      where: {
        userId_provider_providerAccountId: {
          userId,
          provider: "twitter_ads",
          providerAccountId,
        },
      },
      update: { status: "active" },
      create: {
        userId,
        provider: "twitter_ads",
        providerAccountId,
        accountName: "X (Twitter) Ads",
        status: "active",
      },
    });

    await prisma.integrationCredential.upsert({
      where: { integrationId: integration.id },
      update: {
        accessToken: encrypt(tokens.access_token),
        refreshToken: tokens.refresh_token ? encrypt(tokens.refresh_token) : undefined,
        expiresAt: tokens.expires_in ? new Date(Date.now() + tokens.expires_in * 1000) : undefined,
        scope: tokens.scope,
      },
      create: {
        integrationId: integration.id,
        accessToken: encrypt(tokens.access_token),
        refreshToken: tokens.refresh_token ? encrypt(tokens.refresh_token) : undefined,
        expiresAt: tokens.expires_in ? new Date(Date.now() + tokens.expires_in * 1000) : undefined,
        scope: tokens.scope,
      },
    });

    const redirectUrl = new URL("/pro/settings?activeTab=integrations&success=twitter_connected", req.url);
    const response = NextResponse.redirect(redirectUrl);
    // Clear PKCE cookies
    response.cookies.delete("twitter_code_verifier");
    response.cookies.delete("twitter_oauth_state");
    return response;
  } catch (error) {
    console.error("Failed to connect Twitter/X Ads:", error);
    return NextResponse.redirect(new URL("/pro/settings?activeTab=integrations&error=connection_failed", req.url));
  }
}
