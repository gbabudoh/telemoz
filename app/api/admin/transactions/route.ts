import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/admin/transactions - Get all transactions/invoices
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.userType !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const invoices = await prisma.invoice.findMany({
      include: {
        pro: { select: { name: true, email: true } },
        client: { select: { name: true, email: true } },
        project: { select: { title: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // Calculate commission (13% of total)
    const transactions = invoices.map((invoice: {
      id: string;
      invoiceNumber: string;
      pro: { name: string; email: string };
      client: { name: string; email: string };
      project: { title: string } | null;
      total: number | null;
      status: string;
      createdAt: Date;
      paidAt: Date | null;
    }) => ({
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      pro: invoice.pro,
      client: invoice.client,
      project: invoice.project,
      total: invoice.total || 0,
      commission: (invoice.total || 0) * 0.13,
      status: invoice.status,
      createdAt: invoice.createdAt,
      paidAt: invoice.paidAt,
    }));

    return NextResponse.json({ transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

