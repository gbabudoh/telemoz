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

    // Calculate date 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get total revenue from paid invoices in last 30 days
    const paidInvoices = await Invoice.find({
      proId,
      status: "paid",
      paidAt: { $gte: thirtyDaysAgo },
    });

    const totalRevenue = paidInvoices.reduce((sum, invoice) => sum + (invoice.total || 0), 0);

    // Calculate profit (assuming 75% profit margin for now - can be made configurable)
    const profitMargin = 0.75;
    const profitMarginAmount = totalRevenue * profitMargin;

    // Get active clients count (unique clients with active projects or recent invoices)
    const activeClientsSet = new Set();
    
    // Clients with active projects
    const activeProjects = await Project.find({
      proId,
      status: { $in: ["planning", "active"] },
    });
    activeProjects.forEach((project) => {
      if (project.clientId) {
        activeClientsSet.add(project.clientId.toString());
      }
    });

    // Clients with invoices in last 30 days
    const recentInvoices = await Invoice.find({
      proId,
      createdAt: { $gte: thirtyDaysAgo },
    });
    recentInvoices.forEach((invoice) => {
      if (invoice.clientId) {
        activeClientsSet.add(invoice.clientId.toString());
      }
    });

    const activeClients = activeClientsSet.size;

    // Get active projects count
    const activeProjectsCount = await Project.countDocuments({
      proId,
      status: { $in: ["planning", "active"] },
    });

    // Calculate percentage changes (for now, return 0 as we don't have historical data)
    // In production, you'd compare with previous period
    const revenueChange = 0;
    const profitChange = 0;
    const clientsChange = 0;
    const projectsChange = 0;

    return NextResponse.json({
      stats: {
        totalRevenue: Math.round(totalRevenue * 100) / 100, // Round to 2 decimal places
        profitMargin: Math.round(profitMarginAmount * 100) / 100,
        activeClients,
        activeProjects: activeProjectsCount,
        revenueChange,
        profitChange,
        clientsChange,
        projectsChange,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}

