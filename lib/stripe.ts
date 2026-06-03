import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Please add your Stripe secret key to .env.local");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-11-17.clover",
  typescript: true,
});

export const PRICING_PLANS = {
  client: {
    priceId: process.env.STRIPE_CLIENT_PRICE_ID || "",
    amount: 0,
    name: "Client (Free)",
  },
  africa: {
    priceId: process.env.STRIPE_AFRICA_PRICE_ID || "",
    amount: 999, // $9.99 in cents
    name: "African Markets Tier",
  },
  international: {
    priceId: process.env.STRIPE_INTERNATIONAL_PRICE_ID || "",
    amount: 1999, // $19.99 in cents
    name: "International Markets Tier",
  },
};

export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
) {
  return await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: successUrl,
    cancel_url: cancelUrl,
  });
}

export async function createCustomer(email: string, name: string) {
  return await stripe.customers.create({
    email,
    name,
  });
}

export async function getSubscription(customerId: string) {
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: "active",
    limit: 1,
  });
  return subscriptions.data[0] || null;
}

// ── Per-seat billing ──────────────────────────────────────────────────────────

export const SEAT_PRICE_ID = process.env.STRIPE_SEAT_PRICE_ID || "";

// Seat limits per subscription tier (0 = seats not allowed on free plan)
export const SEAT_LIMITS: Record<string, number> = {
  free: 0,
  starter: 0, // legacy — same as free
  africa: 5,
  international: 20,
};

export async function addSeat(customerId: string): Promise<string> {
  const subscription = await getSubscription(customerId);
  if (!subscription) throw new Error("No active subscription found");

  // Check if a seat item already exists on this subscription and increment
  const existingItem = subscription.items.data.find(
    (item) => item.price.id === SEAT_PRICE_ID
  );

  if (existingItem) {
    const updated = await stripe.subscriptionItems.update(existingItem.id, {
      quantity: (existingItem.quantity ?? 0) + 1,
    });
    return updated.id;
  }

  // First seat — add a new subscription item
  const item = await stripe.subscriptionItems.create({
    subscription: subscription.id,
    price: SEAT_PRICE_ID,
    quantity: 1,
  });
  return item.id;
}

export async function removeSeat(
  customerId: string,
  subscriptionItemId: string
): Promise<void> {
  const subscription = await getSubscription(customerId);
  if (!subscription) return;

  const item = subscription.items.data.find((i) => i.id === subscriptionItemId);
  if (!item) return;

  if ((item.quantity ?? 1) > 1) {
    await stripe.subscriptionItems.update(subscriptionItemId, {
      quantity: (item.quantity ?? 1) - 1,
    });
  } else {
    await stripe.subscriptionItems.del(subscriptionItemId, {
      proration_behavior: "create_prorations",
    });
  }
}

