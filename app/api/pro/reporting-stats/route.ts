import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";
import Invoice from "@/models/Invoice";
import Project from "@/models/Project";
import User from "@/models/User";

// Connect to MongoDB
async function connectDB() {
  if (mongoose.connections[0].readyState) {
    return;
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI || "");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.userType !== "pro") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectDB();

    const proId = new mongoose.Types.ObjectId(session.user.id);
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "6months"; // 1month, 3months, 6months, 1year

    // Calculate date range based on period
    const now = new Date();
    let startDate = new Date();
    
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
    const paidInvoices = await Invoice.find({
      proId,
      status: "paid",
    });

    const totalRevenue = paidInvoices.reduce((sum, invoice) => sum + (invoice.total || 0), 0);

    // Get previous period for comparison (same duration before startDate)
    const periodMonths = now.getMonth() - startDate.getMonth() + (now.getFullYear() - startDate.getFullYear()) * 12;
    const previousStartDate = new Date(startDate);
    previousStartDate.setMonth(previousStartDate.getMonth() - periodMonths);
    const previousEndDate = new Date(startDate);

    const previousPeriodInvoices = await Invoice.find({
      proId,
      status: "paid",
      paidAt: {
        $gte: previousStartDate,
        $lt: startDate,
      },
    });

    const previousRevenue = previousPeriodInvoices.reduce((sum, invoice) => sum + (invoice.total || 0), 0);
    const revenueChange = previousRevenue > 0 
      ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 
      : 0;

    // Get active clients count
    const activeClientsSet = new Set();
    const activeProjects = await Project.find({
      proId,
      status: { $in: ["planning", "active"] },
    });
    activeProjects.forEach((project) => {
      if (project.clientId) {
        activeClientsSet.add(project.clientId.toString());
      }
    });

    const recentInvoices = await Invoice.find({
      proId,
      createdAt: { $gte: startDate },
    });
    recentInvoices.forEach((invoice) => {
      if (invoice.clientId) {
        activeClientsSet.add(invoice.clientId.toString());
      }
    });

    const activeClients = activeClientsSet.size;

    // Get previous period active clients
    const previousProjects = await Project.find({
      proId,
      status: { $in: ["planning", "active"] },
      createdAt: {
        $gte: previousStartDate,
        $lt: startDate,
      },
    });
    const previousClientsSet = new Set();
    previousProjects.forEach((project) => {
      if (project.clientId) {
        previousClientsSet.add(project.clientId.toString());
      }
    });
    const previousActiveClients = previousClientsSet.size;
    const clientsChange = previousActiveClients > 0
      ? ((activeClients - previousActiveClients) / previousActiveClients) * 100
      : 0;

    // Get completed projects count
    const completedProjects = await Project.countDocuments({
      proId,
      status: "completed",
    });

    const previousCompletedProjects = await Project.countDocuments({
      proId,
      status: "completed",
      updatedAt: {
        $gte: previousStartDate,
        $lt: startDate,
      },
    });

    const projectsChange = previousCompletedProjects > 0
      ? ((completedProjects - previousCompletedProjects) / previousCompletedProjects) * 100
      : 0;

    // Calculate average project value
    const allProjects = await Project.find({ proId });
    const projectsWithBudget = allProjects.filter(p => p.budget && p.budget > 0);
    const avgProjectValue = projectsWithBudget.length > 0
      ? projectsWithBudget.reduce((sum, p) => sum + (p.budget || 0), 0) / projectsWithBudget.length
      : 0;

    // Get previous period average project value
    const previousProjectsWithBudget = await Project.find({
      proId,
      budget: { $gt: 0 },
      createdAt: {
        $gte: previousStartDate,
        $lt: startDate,
      },
    });
    const previousAvgProjectValue = previousProjectsWithBudget.length > 0
      ? previousProjectsWithBudget.reduce((sum, p) => sum + (p.budget || 0), 0) / previousProjectsWithBudget.length
      : 0;

    const avgProjectValueChange = previousAvgProjectValue > 0
      ? ((avgProjectValue - previousAvgProjectValue) / previousAvgProjectValue) * 100
      : 0;

    // Get monthly revenue data for charts
    const monthlyRevenueData = [];
    const monthlyProfitData = [];
    const monthlyClientsData = [];
    
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      const monthInvoices = await Invoice.find({
        proId,
        status: "paid",
        paidAt: {
          $gte: monthStart,
          $lte: monthEnd,
        },
      });
      
      const monthRevenue = monthInvoices.reduce((sum, invoice) => sum + (invoice.total || 0), 0);
      const monthProfit = monthRevenue * 0.75; // 75% profit margin
      
      monthlyRevenueData.push({
        month: monthStart.toLocaleDateString("en-GB", { month: "short" }),
        revenue: Math.round(monthRevenue * 100) / 100,
        profit: Math.round(monthProfit * 100) / 100,
      });

      // Get clients for this month
      const monthProjects = await Project.find({
        proId,
        createdAt: {
          $gte: monthStart,
          $lte: monthEnd,
        },
      });
      const monthClientsSet = new Set();
      monthProjects.forEach((project) => {
        if (project.clientId) {
          monthClientsSet.add(project.clientId.toString());
        }
      });
      monthlyClientsData.push({
        month: monthStart.toLocaleDateString("en-GB", { month: "short" }),
        clients: monthClientsSet.size,
      });
    }

    // Get project status distribution
    const projectStatusCounts = await Project.aggregate([
      { $match: { proId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const projectStatusData = projectStatusCounts.map((item) => {
      const statusMap: Record<string, { name: string; color: string }> = {
        completed: { name: "Completed", color: "#10b981" },
        active: { name: "In Progress", color: "#6366f1" },
        planning: { name: "Planning", color: "#f59e0b" },
        "on-hold": { name: "On Hold", color: "#ef4444" },
        cancelled: { name: "Cancelled", color: "#6b7280" },
      };
      
      const statusInfo = statusMap[item._id] || { name: item._id, color: "#6b7280" };
      
      return {
        name: statusInfo.name,
        value: item.count,
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
  } catch (error) {
    console.error("Error fetching reporting stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch reporting stats" },
      { status: 500 }
    );
  }
}

