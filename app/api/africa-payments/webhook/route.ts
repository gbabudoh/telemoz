import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyFlutterwaveTransaction } from "@/lib/africa-payments";

export async function POST(req: NextRequest) {
  try {
    // Flutterwave secret hash verification
    const secretHash = process.env.FLUTTERWAVE_WEBHOOK_HASH;
    const signature = req.headers.get("verif-hash");

    if (secretHash && signature !== secretHash) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = await req.json();
    
    // We only care about successful transactions
    if (payload.status !== "successful") {
      return NextResponse.json({ status: "ignored" });
    }

    const transactionId = payload.id;
    const tx_ref = payload.tx_ref;

    // Double verify with Flutterwave API to prevent spoofing
    const verification = await verifyFlutterwaveTransaction(transactionId);

    if (
      verification.status === "success" &&
      verification.data.status === "successful" &&
      verification.data.amount >= payload.amount
    ) {
      const userId = verification.data.meta.userId;

      // Update the user's subscription status
      await prisma.user.update({
        where: { id: userId },
        data: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          subscriptionTier: "africa" as any,
          subscriptionStatus: "active",
        },
      });

      console.log(`Successfully updated subscription for user ${userId} via Flutterwave (Ref: ${tx_ref})`);
    }

    return NextResponse.json({ status: "success" });
  } catch (error: unknown) {
    console.error("Flutterwave webhook error:", error);
    return NextResponse.json({ error: "Webhook handling failed" }, { status: 500 });
  }
}
