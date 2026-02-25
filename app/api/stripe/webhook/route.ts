import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";

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

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      // Handle successful checkout
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const session = event.data.object;
      // TODO: Update user subscription in database
      break;
    case "customer.subscription.updated":
      // Handle subscription update
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const subscription = event.data.object;
      // TODO: Update subscription status in database
      break;
    case "customer.subscription.deleted":
      // Handle subscription cancellation
      // TODO: Update subscription status in database
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

