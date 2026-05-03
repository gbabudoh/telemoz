import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.userType !== "pro") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const proId = session.user.id;

    const invoices = await prisma.invoice.findMany({
      where: { proId },
      orderBy: { createdAt: "desc" },
      include: {
        client: {
          select: { name: true, email: true }
        },
        project: {
          select: { title: true }
        },
        items: true
      }
    }) as (Prisma.InvoiceGetPayload<{ 
      include: { 
        client: { select: { name: true, email: true } }, 
        project: { select: { title: true } },
        items: true 
      } 
    }>)[];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mappedInvoices = (invoices as any[]).map(inv => ({
      id: inv.id,
      invoiceNumber: inv.invoiceNumber,
      client: inv.client.name,
      clientEmail: inv.client.email,
      project: inv.project?.title || "Direct Billing",
      items: inv.items as unknown as InvoiceItem[],
      subtotal: inv.subtotal,
      tax: inv.tax,
      total: inv.total,
      currency: inv.currency,
      status: inv.status,
      dueDate: inv.dueDate.toISOString().split('T')[0],
      createdAt: inv.createdAt.toISOString().split('T')[0],
      paidAt: inv.paidAt?.toISOString().split('T')[0],
      isEscrow: inv.isEscrow,
      escrowStatus: inv.escrowStatus,
      milestoneTitle: inv.milestoneTitle,
    }));

    return NextResponse.json({ invoices: mappedInvoices });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.userType !== "pro") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const proId = session.user.id;
    const body = await req.json();

    // To create an invoice, we need a clientId.
    // If the clientEmail is provided, we look up the user.
    const clientUser = await prisma.user.findUnique({
      where: { email: body.clientEmail }
    });

    if (!clientUser) {
      return NextResponse.json({ error: "Client not found. Please ensure the client has a Telemoz account." }, { status: 404 });
    }

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber: body.invoiceNumber || `INV-${Date.now()}`,
        proId,
        clientId: clientUser.id,
        projectId: body.projectId || null,
        items: {
          create: (body.items as InvoiceItem[]).map(item => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.total
          }))
        },
        subtotal: body.subtotal,
        tax: body.tax || 0,
        total: body.total,
        currency: body.currency || "GBP",
        status: body.status || "draft",
        dueDate: new Date(body.dueDate),
        isEscrow: body.isEscrow || false,
        escrowStatus: body.isEscrow ? "awaiting_deposit" : null,
        milestoneTitle: body.milestoneTitle || null,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
      include: {
        client: { select: { name: true, email: true } },
        project: { select: { title: true } },
        items: true
      }
    }) as Prisma.InvoiceGetPayload<{ 
      include: { 
        client: { select: { name: true, email: true } }, 
        project: { select: { title: true } },
        items: true 
      } 
    }>;

    return NextResponse.json({
      invoice: {
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        client: invoice.client.name,
        clientEmail: invoice.client.email,
        project: invoice.project?.title || "Direct Billing",
        items: invoice.items as unknown as InvoiceItem[],
        subtotal: invoice.subtotal,
        tax: invoice.tax,
        total: invoice.total,
        currency: invoice.currency,
        status: invoice.status,
        dueDate: invoice.dueDate.toISOString().split('T')[0],
        createdAt: invoice.createdAt.toISOString().split('T')[0],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        isEscrow: (invoice as any).isEscrow,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        escrowStatus: (invoice as any).escrowStatus,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        milestoneTitle: (invoice as any).milestoneTitle,
      }
    });
  } catch (error) {
    console.error("Error creating invoice:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
