import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.userType !== "pro") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const proId = session.user.id;

    // Calculate date 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get total revenue from paid invoices in last 30 days
    const revenueAggregation = await prisma.invoice.aggregate({
      where: {
        proId,
        status: "paid",
        paidAt: { gte: thirtyDaysAgo },
      },
      _sum: {
        total: true,
      },
    });

    const totalRevenue = revenueAggregation._sum.total || 0;

    // Calculate profit (assuming 75% profit margin)
    const profitMargin = 0.75;
    const profitMarginAmount = totalRevenue * profitMargin;

    // Get active clients count (unique clients with active projects or recent invoices)
    const activeProjects = await prisma.project.findMany({
      where: {
        proId,
        status: { in: ["planning", "active"] },
      },
      select: { clientId: true },
    });

    const recentInvoices = await prisma.invoice.findMany({
      where: {
        proId,
        createdAt: { gte: thirtyDaysAgo },
      },
      select: { clientId: true },
    });

    const activeClientsSet = new Set([
      ...activeProjects.map((p: { clientId: string }) => p.clientId),
      ...recentInvoices.map((i: { clientId: string }) => i.clientId),
    ]);

    const activeClients = activeClientsSet.size;

    // Get active projects count
    const activeProjectsCount = await prisma.project.count({
      where: {
        proId,
        status: { in: ["planning", "active"] },
      },
    });

    return NextResponse.json({
      stats: {
        totalRevenue: Math.round(totalRevenue * 100) / 100, // Round to 2 decimal places
        profitMargin: Math.round(profitMarginAmount * 100) / 100,
        activeClients,
        activeProjects: activeProjectsCount,
        revenueChange: 0,
        profitChange: 0,
        clientsChange: 0,
        projectsChange: 0,
      },
    });
  } catch (error: unknown) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}

