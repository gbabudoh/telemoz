import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { initializeAfricaSubscription, AFRICA_SUBSCRIPTION_AMOUNT } from "@/lib/africa-payments";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.userType !== "pro") {
      return NextResponse.json({ error: "Only professionals can subscribe" }, { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { email: true, name: true, id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate a unique transaction reference
    const tx_ref = `sub_africa_${user.id}_${Date.now()}`;

    const paymentLink = await initializeAfricaSubscription({
      email: user.email,
      name: user.name,
      userId: user.id,
      amount: AFRICA_SUBSCRIPTION_AMOUNT,
      tx_ref,
    });

    return NextResponse.json({ url: paymentLink });
  } catch (error: unknown) {
    console.error("African subscription error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to initialize African subscription payment";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
