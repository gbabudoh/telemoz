import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getBingTokens } from "@/lib/integrations/bing";
import { encrypt } from "@/lib/encryption";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL("/pro/settings?activeTab=integrations&error=bing_auth_failed", req.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL("/pro/settings?activeTab=integrations&error=no_code", req.url));
  }

  try {
    const tokens = await getBingTokens(code);

    if (!tokens.access_token) {
      throw new Error("No access token received");
    }

    const userId = session.user.id;
    const providerAccountId = session.user.email || userId;

    const integration = await prisma.externalIntegration.upsert({
      where: {
        userId_provider_providerAccountId: {
          userId,
          provider: "bing_ads",
          providerAccountId,
        },
      },
      update: { status: "active" },
      create: {
        userId,
        provider: "bing_ads",
        providerAccountId,
        accountName: "Microsoft Advertising (Bing Ads)",
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

    return NextResponse.redirect(new URL("/pro/settings?activeTab=integrations&success=bing_connected", req.url));
  } catch (error) {
    console.error("Failed to connect Bing Ads:", error);
    return NextResponse.redirect(new URL("/pro/settings?activeTab=integrations&error=connection_failed", req.url));
  }
}
