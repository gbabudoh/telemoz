import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getMetaTokens, getLongLivedMetaToken } from "@/lib/integrations/meta";
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
    console.error("Meta OAuth Error:", error);
    return NextResponse.redirect(new URL("/pro/settings?error=meta_auth_failed", req.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL("/pro/settings?error=no_code", req.url));
  }

  try {
    const tokens = await getMetaTokens(code);
    
    if (!tokens.access_token) {
      throw new Error("No access token received");
    }

    // Upgrade to long-lived token (60 days)
    const longLived = await getLongLivedMetaToken(tokens.access_token);
    const finalToken = longLived.access_token || tokens.access_token;

    const userId = session.user.id;
    const providerAccountId = session.user.email || userId;

    const integration = await prisma.externalIntegration.upsert({
      where: {
        userId_provider_providerAccountId: {
          userId,
          provider: "meta_ads",
          providerAccountId,
        },
      },
      update: {
        status: "active",
      },
      create: {
        userId,
        provider: "meta_ads",
        providerAccountId,
        accountName: "Meta Ads Manager",
        status: "active",
      },
    });

    await prisma.integrationCredential.upsert({
      where: { integrationId: integration.id },
      update: {
        accessToken: encrypt(finalToken),
        expiresAt: longLived.expires_in ? new Date(Date.now() + longLived.expires_in * 1000) : undefined,
      },
      create: {
        integrationId: integration.id,
        accessToken: encrypt(finalToken),
        expiresAt: longLived.expires_in ? new Date(Date.now() + longLived.expires_in * 1000) : undefined,
      },
    });

    return NextResponse.redirect(new URL("/pro/settings?success=meta_connected", req.url));
  } catch (error) {
    console.error("Failed to connect Meta:", error);
    return NextResponse.redirect(new URL("/pro/settings?error=connection_failed", req.url));
  }
}
