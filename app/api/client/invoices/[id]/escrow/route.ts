import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

const TELEMOZ_COMMISSION = 0.10; // 10% platform fee

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.userType !== "client") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { action } = await req.json();

  if (action !== "release") {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const invoice = await prisma.invoice.findUnique({
    where: { id, clientId: session.user.id },
    include: {
      pro: { select: { id: true, name: true, stripeAccountId: true } },
    },
  });

  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const inv = invoice as any;

  if (inv.escrowStatus !== "held_in_escrow") {
    return NextResponse.json(
      { error: "Funds must be held in escrow before they can be released. The invoice has not been paid yet." },
      { status: 400 }
    );
  }

  // Calculate amounts
  const totalCents = Math.round(invoice.total * 100);
  const commissionCents = Math.round(totalCents * TELEMOZ_COMMISSION);
  const proPayoutCents = totalCents - commissionCents;

  const pro = invoice.pro;

  let stripeTransferId: string | null = null;

  // Transfer pro's share via Stripe Connect if they have a connected account
  if (pro.stripeAccountId) {
    try {
      const transfer = await stripe.transfers.create({
        amount: proPayoutCents,
        currency: invoice.currency.toLowerCase(),
        destination: pro.stripeAccountId,
        description: `Payout for invoice ${invoice.invoiceNumber} (${Math.round((1 - TELEMOZ_COMMISSION) * 100)}% of £${invoice.total})`,
        metadata: {
          invoiceId: invoice.id,
          invoiceNumber: invoice.invoiceNumber,
          commissionPercent: String(TELEMOZ_COMMISSION * 100),
          commissionAmount: String(commissionCents / 100),
          proPayoutAmount: String(proPayoutCents / 100),
        },
      });
      stripeTransferId = transfer.id;
    } catch (stripeError: unknown) {
      const message = stripeError instanceof Error ? stripeError.message : "Stripe transfer failed";
      console.error("Stripe transfer error:", stripeError);
      return NextResponse.json(
        { error: `Payment transfer failed: ${message}` },
        { status: 500 }
      );
    }
  } else {
    // Pro hasn't connected Stripe — mark as released in DB but no live transfer.
    // In production you'd queue a manual payout or notify the pro to connect.
    console.warn(`Pro ${pro.id} has no Stripe account — releasing escrow in DB only`);
  }

  // Update invoice in DB
  const updatedInvoice = await prisma.invoice.update({
    where: { id },
    data: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      escrowStatus: "released" as any,
      status: "paid",
      paidAt: new Date(),
      notes: stripeTransferId
        ? `Released via Stripe transfer ${stripeTransferId}. Telemoz commission: ${TELEMOZ_COMMISSION * 100}% (£${(commissionCents / 100).toFixed(2)}). Pro received: £${(proPayoutCents / 100).toFixed(2)}.`
        : `Released manually — pro account not connected to Stripe.`,
    },
  });

  return NextResponse.json({
    invoice: updatedInvoice,
    payout: {
      total: invoice.total,
      commission: commissionCents / 100,
      commissionPercent: TELEMOZ_COMMISSION * 100,
      proReceives: proPayoutCents / 100,
      stripeTransferId,
    },
  });
}
