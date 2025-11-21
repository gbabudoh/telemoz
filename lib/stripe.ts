import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Please add your Stripe secret key to .env.local");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-11-17.clover",
  typescript: true,
});

export const PRICING_PLANS = {
  starter: {
    priceId: process.env.STRIPE_STARTER_PRICE_ID || "",
    amount: 0,
    name: "Starter",
  },
  standard: {
    priceId: process.env.STRIPE_STANDARD_PRICE_ID || "",
    amount: 4900, // £49 in pence
    name: "DigitalBOX Standard",
  },
  pro: {
    priceId: process.env.STRIPE_PRO_PRICE_ID || "",
    amount: 9900, // £99 in pence
    name: "DigitalBOX Pro",
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

