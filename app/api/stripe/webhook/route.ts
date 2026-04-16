import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import Stripe from "stripe";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      { error: "Missing signature or webhook secret" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {

      // ── Subscription lifecycle ─────────────────────────────────────────────

      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode === "subscription" && session.customer && session.subscription) {
          const customerId = typeof session.customer === "string" ? session.customer : session.customer.id;
          const sub = await stripe.subscriptions.retrieve(
            typeof session.subscription === "string" ? session.subscription : session.subscription.id
          );
          const priceId = sub.items.data[0]?.price.id;
          const tier = priceToTier(priceId);
          await prisma.user.updateMany({
            where: { stripeCustomerId: customerId },
            data: {
              subscriptionTier: tier,
              subscriptionStatus: "active",
            },
          });
        }
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
        const priceId = sub.items.data[0]?.price.id;
        const tier = priceToTier(priceId);
        const status = stripeStatusToLocal(sub.status);
        await prisma.user.updateMany({
          where: { stripeCustomerId: customerId },
          data: { subscriptionTier: tier, subscriptionStatus: status },
        });
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
        await prisma.user.updateMany({
          where: { stripeCustomerId: customerId },
          data: { subscriptionTier: "starter", subscriptionStatus: "canceled" },
        });
        break;
      }

      case "invoice.payment_failed": {
        const inv = event.data.object as Stripe.Invoice;
        const customerId = typeof inv.customer === "string" ? inv.customer : inv.customer?.id;
        if (customerId) {
          await prisma.user.updateMany({
            where: { stripeCustomerId: customerId },
            data: { subscriptionStatus: "past_due" },
          });
        }
        break;
      }

      // ── Payment intent (one-off project payments) ──────────────────────────

      case "payment_intent.succeeded": {
        const pi = event.data.object as Stripe.PaymentIntent;
        // Match against Invoice by stripePaymentIntentId and mark paid
        await prisma.invoice.updateMany({
          where: { stripePaymentIntentId: pi.id },
          data: {
            status: "paid",
            paidAt: new Date(),
            paymentMethod: pi.payment_method_types?.[0] ?? "card",
          },
        });
        break;
      }

      case "payment_intent.payment_failed": {
        const pi = event.data.object as Stripe.PaymentIntent;
        // Could surface this as an alert — for now just log
        console.error(`PaymentIntent failed: ${pi.id} — ${pi.last_payment_error?.message}`);
        break;
      }

      // ── Stripe Connect (pro payouts) ───────────────────────────────────────

      case "account.updated": {
        // A connected account completed or updated their onboarding
        const account = event.data.object as Stripe.Account;
        if (account.details_submitted && account.charges_enabled) {
          // Mark the pro as verified/active for payouts
          await prisma.user.updateMany({
            where: { stripeAccountId: account.id },
            data: { }, // extend schema with payoutsEnabled if needed
          });
        }
        break;
      }

      default:
        // Silently ignore unhandled event types
        break;
    }
  } catch (err) {
    console.error(`Error handling Stripe event ${event.type}:`, err);
    // Return 200 so Stripe doesn't retry — log the error internally
  }

  return NextResponse.json({ received: true });
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function priceToTier(priceId?: string): "starter" | "standard" | "pro" {
  if (!priceId) return "starter";
  if (priceId === process.env.STRIPE_PRO_PRICE_ID) return "pro";
  if (priceId === process.env.STRIPE_STANDARD_PRICE_ID) return "standard";
  return "starter";
}

function stripeStatusToLocal(
  status: Stripe.Subscription.Status
): "active" | "canceled" | "past_due" {
  if (status === "active" || status === "trialing") return "active";
  if (status === "past_due" || status === "unpaid") return "past_due";
  return "canceled";
}
