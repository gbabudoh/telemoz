import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.userType !== "pro") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 503 });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Dynamically import Stripe to avoid build errors when key isn't set
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(stripeSecretKey);

    let accountId = user.stripeAccountId;

    if (!user.email) {
      return NextResponse.json({ error: "Professional email is required for Stripe onboarding" }, { status: 400 });
    }

    if (!accountId) {
      const account = await stripe.accounts.create({
        type: "express",
        email: user.email,
        capabilities: { transfers: { requested: true } },
        business_type: "individual",
      });
      accountId = account.id;
      await prisma.user.update({
        where: { id: session.user.id },
        data: { stripeAccountId: accountId },
      });
    }

    const appUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${appUrl}/pro/settings?tab=billing&stripe=refresh`,
      return_url: `${appUrl}/pro/settings?tab=billing&stripe=success`,
      type: "account_onboarding",
    });

    return NextResponse.json({ url: accountLink.url });
  } catch (error: unknown) {
    console.error("Stripe Connect error:", error);
    const message = error instanceof Error ? error.message : "Failed to create Stripe onboarding link";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (!user.stripeAccountId) {
    return NextResponse.json({ connected: false, accountId: null });
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    return NextResponse.json({ connected: false, accountId: user.stripeAccountId, configured: false });
  }

  try {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(stripeSecretKey);
    const account = await stripe.accounts.retrieve(user.stripeAccountId);
    return NextResponse.json({
      connected: true,
      accountId: user.stripeAccountId,
      detailsSubmitted: account.details_submitted,
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
    });
  } catch {
    return NextResponse.json({ connected: false, accountId: user.stripeAccountId });
  }
}
