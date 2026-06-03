import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

// POST /api/client/invoices/[id]/pay
// Creates a Stripe Checkout Session so the client can deposit funds into escrow.
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.userType !== "client") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: { pro: { select: { name: true } } },
  });

  if (!invoice || invoice.clientId !== session.user.id) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  if (invoice.status === "paid") {
    return NextResponse.json({ error: "Invoice is already paid" }, { status: 400 });
  }

  const appUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  try {
    // Ensure the client has a Stripe customer record
    let stripeCustomerId = (await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { stripeCustomerId: true, email: true, name: true },
    }))?.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: session.user.email ?? undefined,
        name: session.user.name ?? undefined,
        metadata: { telemozUserId: session.user.id },
      });
      stripeCustomerId = customer.id;
      await prisma.user.update({
        where: { id: session.user.id },
        data: { stripeCustomerId },
      });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      customer: stripeCustomerId,
      line_items: [
        {
          price_data: {
            currency: invoice.currency.toLowerCase(),
            product_data: {
              name: `Invoice ${invoice.invoiceNumber}`,
              description: invoice.isEscrow
                ? `Escrow deposit${invoice.milestoneTitle ? ` — ${invoice.milestoneTitle}` : ""} · Funds held securely until you approve delivery`
                : `Payment to ${invoice.pro.name}`,
            },
            unit_amount: Math.round(invoice.total * 100), // Stripe uses smallest currency unit
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        // Embed the invoice ID so the webhook can match it
        metadata: {
          invoiceId: invoice.id,
          isEscrow: String(invoice.isEscrow),
        },
      },
      metadata: { invoiceId: invoice.id },
      success_url: `${appUrl}/client/invoicing?paid=true&invoice=${invoice.id}`,
      cancel_url: `${appUrl}/client/invoicing?cancelled=true`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create payment session";
    console.error("Stripe Checkout error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
