import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";
import User from "@/models/User";
import Project from "@/models/Project";
import Invoice from "@/models/Invoice";

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

    if (session.user.userType !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectDB();

    // User Statistics
    const totalUsers = await User.countDocuments();
    const totalPros = await User.countDocuments({ userType: "pro" });
    const totalClients = await User.countDocuments({ userType: "client" });
    const totalAdmins = await User.countDocuments({ userType: "admin" });
    const activeUsers = await User.countDocuments({ subscriptionStatus: "active" });
    const inactiveUsers = await User.countDocuments({ subscriptionStatus: { $ne: "active" } });

    // Project Statistics
    const activeProjects = await Project.countDocuments({ status: { $in: ["planning", "active"] } });
    const completedProjects = await Project.countDocuments({ status: "completed" });

    // Revenue Statistics
    const invoices = await Invoice.find({ status: "paid" });
    const totalRevenue = invoices.reduce((sum, invoice) => sum + (invoice.total || 0), 0);
    const totalCommission = totalRevenue * 0.13; // 13% commission
    const pendingInvoices = await Invoice.countDocuments({ status: "pending" });

    return NextResponse.json({
      totalUsers,
      totalPros,
      totalClients,
      totalAdmins,
      activeProjects,
      completedProjects,
      totalRevenue,
      totalCommission,
      pendingInvoices,
      activeUsers,
      inactiveUsers,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin statistics" },
      { status: 500 }
    );
  }
}

