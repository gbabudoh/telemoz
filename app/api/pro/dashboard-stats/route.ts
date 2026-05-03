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

    // Calculate date 30 days ago and 60 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    // Get total revenue from paid invoices in last 30 days
    const revenueAggregation = await prisma.invoice.aggregate({
      where: {
        proId,
        status: "paid",
        paidAt: { gte: thirtyDaysAgo },
      },
      _sum: { total: true },
    });

    // Get revenue for previous 30 days to calculate change
    const prevRevenueAggregation = await prisma.invoice.aggregate({
      where: {
        proId,
        status: "paid",
        paidAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo },
      },
      _sum: { total: true },
    });

    const totalRevenue = revenueAggregation._sum.total || 0;
    const prevRevenue = prevRevenueAggregation._sum.total || 0;
    const revenueChange = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 100;

    // Calculate profit (assuming 75% profit margin)
    const profitMargin = 0.75;
    const profitMarginAmount = totalRevenue * profitMargin;

    // Get active clients count
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

    // Get project change (compare current active vs previous active - simplified)
    const prevActiveProjectsCount = await prisma.project.count({
      where: {
        proId,
        createdAt: { lt: thirtyDaysAgo },
        status: { in: ["planning", "active"] },
      },
    });
    const projectsChange = prevActiveProjectsCount > 0 ? ((activeProjectsCount - prevActiveProjectsCount) / prevActiveProjectsCount) * 100 : 0;

    // Get marketplace rating from profile
    const proProfile = await prisma.proProfile.findUnique({
      where: { userId: proId },
      select: { rating: true, reviewCount: true },
    });

    // Inquiry Conversion Rate
    const totalInquiries = await prisma.inquiry.count({ where: { proId } });
    const acceptedInquiries = await prisma.inquiry.count({
      where: { proId, status: "accepted" },
    });
    const conversionRate = totalInquiries > 0 ? (acceptedInquiries / totalInquiries) * 100 : 0;

    // Get revenue trend for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyInvoices = await prisma.invoice.findMany({
      where: {
        proId,
        status: "paid",
        paidAt: { gte: sixMonthsAgo },
      },
      select: { total: true, paidAt: true },
    });

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const revenueTrendMap: Record<string, { revenue: number; profit: number }> = {};

    for (let i = 0; i < 6; i++) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthName = months[d.getMonth()];
      revenueTrendMap[monthName] = { revenue: 0, profit: 0 };
    }

    monthlyInvoices.forEach((inv) => {
      if (inv.paidAt) {
        const monthName = months[inv.paidAt.getMonth()];
        if (revenueTrendMap[monthName]) {
          revenueTrendMap[monthName].revenue += inv.total;
          revenueTrendMap[monthName].profit += inv.total * profitMargin;
        }
      }
    });

    const revenueData = Object.entries(revenueTrendMap)
      .map(([month, data]) => ({
        month,
        revenue: Math.round(data.revenue * 100) / 100,
        profit: Math.round(data.profit * 100) / 100,
      }))
      .reverse();

    // Get project status distribution
    const statusCounts = await prisma.project.groupBy({
      by: ["status"],
      where: { proId },
      _count: { _all: true },
    });

    const statusColors: Record<string, string> = {
      active: "#0a9396",
      planning: "#3B82F6",
      completed: "#10B981",
      on_hold: "#F59E0B",
      cancelled: "#EF4444",
    };

    const projectStatusData = statusCounts.map((s) => ({
      name: s.status.charAt(0).toUpperCase() + s.status.slice(1).replace("_", " "),
      value: s._count._all,
      color: statusColors[s.status] || "#94A3B8",
    }));

    // Get recent inquiries
    const recentProjects = await prisma.project.findMany({
      where: {
        proId: null,
        status: "active",
      },
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        client: { select: { name: true } },
      },
    });

    const recentInquiries = recentProjects.map((p) => ({
      id: p.id,
      client: p.client.name,
      project: p.title,
      budget: p.budget || 0,
      status: "new",
      time: "Recent",
      avatar: p.client.name.charAt(0), // Use initial for avatar as expected by UI
    }));

    // Action Items
    const actionItems = [];
    const unpaidInvoicesCount = await prisma.invoice.count({
      where: { proId, status: "sent" },
    });
    if (unpaidInvoicesCount > 0) {
      actionItems.push({
        id: 1,
        type: "Payment",
        title: "Unpaid Invoices",
        description: `You have ${unpaidInvoicesCount} sent invoices waiting for payment.`,
        icon: "DollarSign", // Frontend expects icon name or component
        color: "text-amber-600",
        bg: "bg-amber-50",
      });
    }

    if (recentProjects.length > 0) {
      actionItems.push({
        id: 2,
        type: "Marketplace",
        title: "New Inquiries",
        description: `${recentProjects.length} new projects matching your profile are available.`,
        icon: "Users",
        color: "text-[#0a9396]",
        bg: "bg-emerald-50",
      });
    }

    return NextResponse.json({
      stats: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        profitMargin: Math.round(profitMarginAmount * 100) / 100,
        activeClients,
        activeProjects: activeProjectsCount,
        revenueChange: Math.round(revenueChange * 10) / 10,
        profitChange: Math.round(revenueChange * 0.8 * 10) / 10,
        clientsChange: 0, 
        projectsChange: Math.round(projectsChange * 10) / 10,
        rating: proProfile?.rating || 0,
        conversionRate: Math.round(conversionRate * 10) / 10,
        avgResponseTime: "2h", // Still mocked as we don't have tracking logic yet
      },
      revenueData,
      projectStatusData,
      recentInquiries,
      actionItems,
    });
  } catch (error: unknown) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}

