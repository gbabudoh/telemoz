"use client";

import { StatCard } from "@/components/ui/StatCard";
import { Chart } from "@/components/ui/Chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Users,
  Briefcase,
  DollarSign,
  TrendingUp,
  UserCheck,
  UserX,
  FileText,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Shield,
  Activity,
  Zap,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";

interface PlatformStats {
  totalUsers: number;
  totalPros: number;
  totalClients: number;
  totalAdmins: number;
  activeProjects: number;
  completedProjects: number;
  totalRevenue: number;
  totalCommission: number;
  pendingInvoices: number;
  activeUsers: number;
  inactiveUsers: number;
}

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<PlatformStats>({
    totalUsers: 0,
    totalPros: 0,
    totalClients: 0,
    totalAdmins: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalRevenue: 0,
    totalCommission: 0,
    pendingInvoices: 0,
    activeUsers: 0,
    inactiveUsers: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/stats");
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user?.userType === "admin") {
      fetchStats();
    }
  }, [session]);

  const chartData = [
    { month: "Oct", users: 120, projects: 45, revenue: 12500 },
    { month: "Nov", users: 180, projects: 62, revenue: 18500 },
    { month: "Dec", users: 250, projects: 89, revenue: 24500 },
  ];

  const recentActivities = [
    { id: 1, type: "user", action: "New pro registered", user: "Sarah Johnson", time: "2 hours ago", icon: UserCheck },
    { id: 2, type: "project", action: "Project completed", project: "SEO Optimization", time: "5 hours ago", icon: CheckCircle2 },
    { id: 3, type: "payment", action: "Payment received", amount: "£2,500", time: "1 day ago", icon: DollarSign },
    { id: 4, type: "user", action: "New client registered", user: "TechStart Inc.", time: "1 day ago", icon: Users },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading platform statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 p-2">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Control Center</h1>
          </div>
          <p className="text-gray-600">Platform overview and management dashboard</p>
        </div>
        <Badge variant="primary" size="lg" className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-0">
          <Shield className="h-4 w-4 mr-1" />
          Admin Access
        </Badge>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-l-4 border-l-purple-600 bg-gradient-to-br from-white to-purple-50/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                  <p className="text-xs text-purple-600 mt-1">+12% this month</p>
                </div>
                <div className="rounded-lg bg-purple-100 p-3">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-l-4 border-l-indigo-600 bg-gradient-to-br from-white to-indigo-50/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Projects</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.activeProjects}</p>
                  <p className="text-xs text-indigo-600 mt-1">+8% this month</p>
                </div>
                <div className="rounded-lg bg-indigo-100 p-3">
                  <Briefcase className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="border-l-4 border-l-emerald-600 bg-gradient-to-br from-white to-emerald-50/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                  <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
                  <p className="text-xs text-emerald-600 mt-1">+15% this month</p>
                </div>
                <div className="rounded-lg bg-emerald-100 p-3">
                  <DollarSign className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="border-l-4 border-l-amber-600 bg-gradient-to-br from-white to-amber-50/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Platform Commission</p>
                  <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.totalCommission)}</p>
                  <p className="text-xs text-amber-600 mt-1">+15% this month</p>
                </div>
                <div className="rounded-lg bg-amber-100 p-3">
                  <TrendingUp className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* User Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700 mb-1 font-medium">Professionals</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPros}</p>
                <p className="text-xs text-gray-600 mt-1">Active: {stats.activeUsers}</p>
              </div>
              <div className="rounded-lg bg-blue-200 p-3">
                <UserCheck className="h-6 w-6 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700 mb-1 font-medium">Clients</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalClients}</p>
                <p className="text-xs text-gray-600 mt-1">Active: {stats.activeUsers}</p>
              </div>
              <div className="rounded-lg bg-emerald-200 p-3">
                <Users className="h-6 w-6 text-emerald-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700 mb-1 font-medium">Completed Projects</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedProjects}</p>
                <p className="text-xs text-gray-600 mt-1">Total completed</p>
              </div>
              <div className="rounded-lg bg-purple-200 p-3">
                <CheckCircle2 className="h-6 w-6 text-purple-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-2 border-purple-200 bg-gradient-to-br from-white to-purple-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-900">
              <Activity className="h-5 w-5" />
              Platform Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              data={chartData}
              type="line"
              dataKey="month"
              dataKeys={["users", "projects", "revenue"]}
              title="Monthly Growth Trends"
              colors={["#6366f1", "#10b981", "#06b6d4"]}
            />
          </CardContent>
        </Card>
        <Card className="border-2 border-indigo-200 bg-gradient-to-br from-white to-indigo-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-indigo-900">
              <Zap className="h-5 w-5" />
              User Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              data={[
                { name: "Pros", value: stats.totalPros, color: "#6366f1" },
                { name: "Clients", value: stats.totalClients, color: "#10b981" },
                { name: "Admins", value: stats.totalAdmins, color: "#ec4899" },
              ]}
              type="pie"
              dataKey="name"
              dataKeys={["value"]}
              title="User Types"
            />
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/admin/users">
          <Card className="hover:shadow-xl transition-all cursor-pointer border-2 border-purple-200 hover:border-purple-400 bg-gradient-to-br from-white to-purple-50/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Manage Users</p>
                  <p className="text-lg font-semibold text-gray-900">User Management</p>
                </div>
                <div className="rounded-lg bg-purple-100 p-2">
                  <ArrowRight className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/projects">
          <Card className="hover:shadow-xl transition-all cursor-pointer border-2 border-indigo-200 hover:border-indigo-400 bg-gradient-to-br from-white to-indigo-50/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">All Projects</p>
                  <p className="text-lg font-semibold text-gray-900">Project Management</p>
                </div>
                <div className="rounded-lg bg-indigo-100 p-2">
                  <ArrowRight className="h-5 w-5 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/transactions">
          <Card className="hover:shadow-xl transition-all cursor-pointer border-2 border-emerald-200 hover:border-emerald-400 bg-gradient-to-br from-white to-emerald-50/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Payments</p>
                  <p className="text-lg font-semibold text-gray-900">Transactions</p>
                </div>
                <div className="rounded-lg bg-emerald-100 p-2">
                  <ArrowRight className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/settings">
          <Card className="hover:shadow-xl transition-all cursor-pointer border-2 border-amber-200 hover:border-amber-400 bg-gradient-to-br from-white to-amber-50/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Platform</p>
                  <p className="text-lg font-semibold text-gray-900">System Settings</p>
                </div>
                <div className="rounded-lg bg-amber-100 p-2">
                  <ArrowRight className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Activity */}
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-white to-purple-50/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-900">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div
                  key={activity.id}
                  className="flex items-center gap-4 p-4 rounded-lg bg-white border border-purple-100 hover:border-purple-200 transition-colors"
                >
                  <div className="rounded-full bg-purple-100 p-2">
                    <Icon className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-600">
                      {activity.user || activity.project || activity.amount}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
