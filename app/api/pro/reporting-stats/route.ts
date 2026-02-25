import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.userType !== "pro") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const proId = session.user.id;
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "6months"; // 1month, 3months, 6months, 1year

    // Calculate date range based on period
    const now = new Date();
    const startDate = new Date();
    
    switch (period) {
      case "1month":
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "3months":
        startDate.setMonth(now.getMonth() - 3);
        break;
      case "6months":
        startDate.setMonth(now.getMonth() - 6);
        break;
      case "1year":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(now.getMonth() - 6);
    }

    // Get total revenue from all paid invoices
    const revenueAggregation = await prisma.invoice.aggregate({
      where: {
        proId,
        status: "paid",
      },
      _sum: {
        total: true,
      },
    });

    const totalRevenue = revenueAggregation._sum.total || 0;

    // Get previous period for comparison (same duration before startDate)
    const periodMonths = now.getMonth() - startDate.getMonth() + (now.getFullYear() - startDate.getFullYear()) * 12;
    const previousStartDate = new Date(startDate);
    previousStartDate.setMonth(previousStartDate.getMonth() - periodMonths);

    const previousRevenueAggregation = await prisma.invoice.aggregate({
      where: {
        proId,
        status: "paid",
        paidAt: {
          gte: previousStartDate,
          lt: startDate,
        },
      },
      _sum: {
        total: true,
      },
    });

    const previousRevenue = previousRevenueAggregation._sum.total || 0;
    const revenueChange = previousRevenue > 0 
      ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 
      : 0;

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
        createdAt: { gte: startDate },
      },
      select: { clientId: true },
    });

    const activeClientsSet = new Set([
      ...activeProjects.map((p: { clientId: string }) => p.clientId),
      ...recentInvoices.map((i: { clientId: string }) => i.clientId),
    ]);

    const activeClients = activeClientsSet.size;

    // Get previous period active clients
    const previousProjects = await prisma.project.findMany({
      where: {
        proId,
        status: { in: ["planning", "active"] },
        createdAt: {
          gte: previousStartDate,
          lt: startDate,
        },
      },
      select: { clientId: true },
    });
    
    const previousClientsSet = new Set(previousProjects.map((p: { clientId: string }) => p.clientId));
    const previousActiveClients = previousClientsSet.size;
    const clientsChange = previousActiveClients > 0
      ? ((activeClients - previousActiveClients) / previousActiveClients) * 100
      : 0;

    // Get completed projects count
    const completedProjects = await prisma.project.count({
      where: {
        proId,
        status: "completed",
      },
    });

    const previousCompletedProjects = await prisma.project.count({
      where: {
        proId,
        status: "completed",
        updatedAt: {
          gte: previousStartDate,
          lt: startDate,
        },
      },
    });

    const projectsChange = previousCompletedProjects > 0
      ? ((completedProjects - previousCompletedProjects) / previousCompletedProjects) * 100
      : 0;

    // Calculate average project value
    const projectAggregation = await prisma.project.aggregate({
      where: {
        proId,
        budget: { gt: 0 },
      },
      _avg: {
        budget: true,
      },
    });
    
    const avgProjectValue = projectAggregation._avg.budget || 0;

    // Get previous period average project value
    const previousProjectAggregation = await prisma.project.aggregate({
      where: {
        proId,
        budget: { gt: 0 },
        createdAt: {
          gte: previousStartDate,
          lt: startDate,
        },
      },
      _avg: {
        budget: true,
      },
    });
    
    const previousAvgProjectValue = previousProjectAggregation._avg.budget || 0;

    const avgProjectValueChange = previousAvgProjectValue > 0
      ? ((avgProjectValue - previousAvgProjectValue) / previousAvgProjectValue) * 100
      : 0;

    // Get monthly revenue data for charts
    const monthlyRevenueData = [];
    const monthlyClientsData = [];
    
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      const monthRevenueAggregation = await prisma.invoice.aggregate({
        where: {
          proId,
          status: "paid",
          paidAt: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
        _sum: {
          total: true,
        },
      });
      
      const monthRevenue = monthRevenueAggregation._sum.total || 0;
      const monthProfit = monthRevenue * 0.75; // 75% profit margin
      
      monthlyRevenueData.push({
        month: monthStart.toLocaleDateString("en-GB", { month: "short" }),
        revenue: Math.round(monthRevenue * 100) / 100,
        profit: Math.round(monthProfit * 100) / 100,
      });

      // Get clients for this month
      const monthClientsAggregation = await prisma.project.findMany({
        where: {
          proId,
          createdAt: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
        select: { clientId: true },
      });
      
      const monthClientsSet = new Set(monthClientsAggregation.map((p: { clientId: string }) => p.clientId));
      
      monthlyClientsData.push({
        month: monthStart.toLocaleDateString("en-GB", { month: "short" }),
        clients: monthClientsSet.size,
      });
    }

    // Get project status distribution
    const projectStatusCounts = await prisma.project.groupBy({
      by: ["status"],
      where: { proId },
      _count: {
        status: true,
      },
    });

    const projectStatusData = projectStatusCounts.map((item: { status: string; _count: { status: number } }) => {
      const statusMap: Record<string, { name: string; color: string }> = {
        completed: { name: "Completed", color: "#10b981" },
        active: { name: "In Progress", color: "#6366f1" },
        planning: { name: "Planning", color: "#f59e0b" },
        on_hold: { name: "On Hold", color: "#ef4444" },
        cancelled: { name: "Cancelled", color: "#6b7280" },
      };
      
      const statusInfo = statusMap[item.status] || { name: item.status, color: "#6b7280" };
      
      return {
        name: statusInfo.name,
        value: item._count.status,
        color: statusInfo.color,
      };
    });

    return NextResponse.json({
      stats: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        revenueChange: Math.round(revenueChange * 100) / 10,
        activeClients,
        clientsChange: Math.round(clientsChange * 100) / 10,
        completedProjects,
        projectsChange: Math.round(projectsChange * 100) / 10,
        avgProjectValue: Math.round(avgProjectValue * 100) / 100,
        avgProjectValueChange: Math.round(avgProjectValueChange * 100) / 10,
      },
      charts: {
        revenueData: monthlyRevenueData,
        clientGrowthData: monthlyClientsData,
        projectStatusData,
      },
    });
  } catch (error: unknown) {
    console.error("Error fetching reporting stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch reporting stats" },
      { status: 500 }
    );
  }
}

