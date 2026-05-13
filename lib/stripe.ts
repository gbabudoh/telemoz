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

