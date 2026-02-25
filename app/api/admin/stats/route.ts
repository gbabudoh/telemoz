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

    if (session.user.userType !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // User Statistics
    const [
      totalUsers,
      totalPros,
      totalClients,
      totalAdmins,
      activeUsers,
      inactiveUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { userType: "pro" } }),
      prisma.user.count({ where: { userType: "client" } }),
      prisma.user.count({ where: { userType: "admin" } }),
      prisma.user.count({ where: { subscriptionStatus: "active" } }),
      prisma.user.count({ where: { subscriptionStatus: { not: "active" } } }),
    ]);

    // Project Statistics
    const [activeProjects, completedProjects] = await Promise.all([
      prisma.project.count({ where: { status: { in: ["planning", "active"] } } }),
      prisma.project.count({ where: { status: "completed" } }),
    ]);

    // Revenue Statistics
    const revenueAggregation = await prisma.invoice.aggregate({
      where: { status: "paid" },
      _sum: { total: true },
    });
    const totalRevenue = revenueAggregation._sum.total || 0;
    const totalCommission = totalRevenue * 0.13; // 13% commission
    const pendingInvoices = await prisma.invoice.count({ 
      where: { status: { in: ["sent", "overdue"] } } 
    });

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
  } catch (error: unknown) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin statistics" },
      { status: 500 }
    );
  }
}

