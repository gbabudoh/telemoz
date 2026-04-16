import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  void request;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clientId = session.user.id;

    // Pending invoices (sent or overdue)
    const pendingInvoices = await prisma.invoice.aggregate({
      where: {
        clientId,
        status: { in: ["sent", "overdue"] },
      },
      _sum: { total: true },
      _count: true,
    });

    // Portfolio ROAS: sum revenue / sum spend across all campaigns in client's projects
    const campaigns = await prisma.campaign.findMany({
      where: {
        project: { clientId },
      },
      select: { spend: true, revenue: true },
    });

    const totalSpend = campaigns.reduce((s, c) => s + c.spend, 0);
    const totalRevenue = campaigns.reduce((s, c) => s + c.revenue, 0);
    const portfolioROAS = totalSpend > 0 ? Math.round((totalRevenue / totalSpend) * 10) / 10 : null;

    return NextResponse.json({
      pendingInvoicesAmount: pendingInvoices._sum.total ?? 0,
      pendingInvoicesCount: pendingInvoices._count,
      portfolioROAS,
    });
  } catch (error) {
    console.error("Error fetching client dashboard stats:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
