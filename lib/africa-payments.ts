/**
 * African Payment Rails Utility
 * Handles localized payments via Flutterwave for the African Tier ($9.99/month)
 */

interface FlutterwaveInitResponse {
  status: string;
  message: string;
  data: {
    link: string;
  };
}

export const AFRICA_SUBSCRIPTION_AMOUNT = 9.99;

/**
 * Initializes a Flutterwave payment link for the monthly subscription
 */
export async function initializeAfricaSubscription({
  email,
  amount,
  tx_ref,
  name,
  userId,
}: {
  email: string;
  amount: number;
  tx_ref: string;
  name: string;
  userId: string;
}) {
  const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("Flutterwave secret key is not configured");
  }

  const response = await fetch("https://api.flutterwave.com/v3/payments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tx_ref,
      amount,
      currency: "USD", // We charge in USD but Flutterwave handles local rail conversion
      redirect_url: `${process.env.NEXTAUTH_URL}/pro/settings?tab=billing&status=success`,
      customer: {
        email,
        name,
      },
      meta: {
        userId,
        type: "subscription",
        tier: "africa",
      },
      customizations: {
        title: "Telemoz African Tier",
        description: "Monthly Pro Subscription - Local African Rails",
        logo: `${process.env.NEXTAUTH_URL}/logos/logo.png`,
      },
    }),
  });

  const data: FlutterwaveInitResponse = await response.json();

  if (data.status !== "success") {
    throw new Error(data.message || "Failed to initialize Flutterwave payment");
  }

  return data.data.link;
}

interface FlutterwaveVerifyResponse {
  status: string;
  message: string;
  data: {
    id: number;
    tx_ref: string;
    amount: number;
    currency: string;
    status: string;
    customer: {
      email: string;
      name: string;
    };
    meta: {
      userId: string;
      tier: string;
    };
  };
}

/**
 * Verifies a Flutterwave transaction status
 */
export async function verifyFlutterwaveTransaction(transactionId: string): Promise<FlutterwaveVerifyResponse> {
  const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("Flutterwave secret key is not configured");
  }

  const response = await fetch(`https://api.flutterwave.com/v3/transactions/${transactionId}/verify`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
  });

  const data: FlutterwaveVerifyResponse = await response.json();
  return data;
}
