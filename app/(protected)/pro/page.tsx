"use client";

import { StatCard } from "@/components/ui/StatCard";
import { Chart } from "@/components/ui/Chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  TrendingUp,
  DollarSign,
  Users,
  FolderKanban,
  AlertCircle,
  CheckCircle2,
  Clock,
  Zap,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

// Mock data for charts (will be replaced with real data later)
const revenueData = [
  { month: "Jan", revenue: 4500, profit: 3200 },
  { month: "Feb", revenue: 5200, profit: 3800 },
  { month: "Mar", revenue: 4800, profit: 3500 },
  { month: "Apr", revenue: 6100, profit: 4500 },
  { month: "May", revenue: 5500, profit: 4100 },
  { month: "Jun", revenue: 6800, profit: 5100 },
];

const projectStatusData = [
  { name: "On Track", value: 3, color: "#10b981" },
  { name: "Needs Attention", value: 1, color: "#f59e0b" },
  { name: "Completed", value: 5, color: "#6366f1" },
];

const recentInquiries = [
  {
    id: 1,
    client: "TechStart Inc.",
    project: "SEO Optimization Campaign",
    budget: 2500,
    status: "new",
    time: "2 hours ago",
  },
  {
    id: 2,
    client: "E-Commerce Pro",
    project: "PPC Management",
    budget: 1800,
    status: "reviewed",
    time: "5 hours ago",
  },
  {
    id: 3,
    client: "Local Business Hub",
    project: "Social Media Strategy",
    budget: 1200,
    status: "new",
    time: "1 day ago",
  },
];

const actionItems = [
  {
    id: 1,
    type: "urgent",
    title: "Client X: SEO Audit - Technical Fixes",
    description: "3 days overdue",
    icon: AlertCircle,
  },
  {
    id: 2,
    type: "billing",
    title: "Client Y: Invoice #1002",
    description: "7 days past due",
    icon: DollarSign,
  },
  {
    id: 3,
    type: "performance",
    title: "Client Z (PPC): ROAS dropped 15%",
    description: "Last 48 hours",
    icon: TrendingUp,
  },
];

interface DashboardStats {
  totalRevenue: number;
  profitMargin: number;
  activeClients: number;
  activeProjects: number;
  revenueChange: number;
  profitChange: number;
  clientsChange: number;
  projectsChange: number;
}

export default function ProDashboard() {
  const { data: session } = useSession();
  const userName = session?.user?.name || "there";
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    profitMargin: 0,
    activeClients: 0,
    activeProjects: 0,
    revenueChange: 0,
    profitChange: 0,
    clientsChange: 0,
    projectsChange: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/pro/dashboard-stats");
        if (response.ok) {
          const data = await response.json();
          setStats(data.stats);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user) {
      fetchStats();
    }
  }, [session]);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {userName}</h1>
          <p className="text-gray-600 mt-1">Here&apos;s what&apos;s happening with your business today</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success">Profile: 95% Complete</Badge>
          <Button variant="outline" size="sm" className="cursor-pointer">
            Get Telemoz Certified
          </Button>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatCard
            title="Total Revenue (30d)"
            value={isLoading ? 0 : stats.totalRevenue}
            change={stats.revenueChange !== 0 ? stats.revenueChange : undefined}
            trend={stats.revenueChange > 0 ? "up" : stats.revenueChange < 0 ? "down" : "neutral"}
            icon={DollarSign}
            gradient="linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
            animate={!isLoading}
            format="currency"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatCard
            title="Profit Margin"
            value={isLoading ? 0 : stats.profitMargin}
            change={stats.profitChange !== 0 ? stats.profitChange : undefined}
            trend={stats.profitChange > 0 ? "up" : stats.profitChange < 0 ? "down" : "neutral"}
            icon={TrendingUp}
            gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)"
            animate={!isLoading}
            format="currency"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatCard
            title="Active Clients"
            value={isLoading ? 0 : stats.activeClients}
            change={stats.clientsChange !== 0 ? stats.clientsChange : undefined}
            trend={stats.clientsChange > 0 ? "up" : stats.clientsChange < 0 ? "down" : "neutral"}
            icon={Users}
            gradient="linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)"
            animate={!isLoading}
            format="number"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatCard
            title="Active Projects"
            value={isLoading ? 0 : stats.activeProjects}
            change={stats.projectsChange !== 0 ? stats.projectsChange : undefined}
            trend={stats.projectsChange > 0 ? "up" : stats.projectsChange < 0 ? "down" : "neutral"}
            icon={FolderKanban}
            gradient="linear-gradient(135deg, #ec4899 0%, #db2777 100%)"
            animate={!isLoading}
            format="number"
          />
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Chart
            title="Revenue & Profit Trends"
            description="Last 6 months performance"
            data={revenueData}
            type="area"
            dataKey="month"
            dataKeys={["revenue", "profit"]}
            colors={["#6366f1", "#10b981"]}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Chart
            title="Project Status Overview"
            description="Current project distribution"
            data={projectStatusData}
            type="pie"
            dataKey="name"
            dataKeys={["value"]}
          />
        </motion.div>
      </div>

      {/* Action Center & Recent Inquiries */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Action Center */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary-400 cursor-pointer" />
              Action Center
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {actionItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-4 hover:border-[#0a9396]/50 transition-colors shadow-sm"
                >
                  <div className="rounded-lg bg-red-500/20 p-2">
                    <Icon className="h-4 w-4 text-red-500 cursor-pointer" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.title}</p>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="cursor-pointer">
                    View
                  </Button>
                </motion.div>
              );
            })}
          </CardContent>
        </Card>

        {/* Recent Inquiries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary-400 cursor-pointer" />
              Recent Project Inquiries
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentInquiries.map((inquiry, index) => (
              <motion.div
                key={inquiry.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 hover:border-[#0a9396]/50 transition-colors shadow-sm"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-gray-900">{inquiry.client}</p>
                    <Badge
                      variant={inquiry.status === "new" ? "primary" : "default"}
                      size="sm"
                    >
                      {inquiry.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{inquiry.project}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>{formatCurrency(inquiry.budget)}</span>
                    <span>•</span>
                    <span>{inquiry.time}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="cursor-pointer">
                    View
                  </Button>
                  <Button size="sm" className="cursor-pointer">Respond</Button>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card variant="glass">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Marketplace Rating</p>
                <p className="text-2xl font-bold text-gray-900">4.8/5</p>
              </div>
              <div className="rounded-full bg-emerald-500/20 p-3">
                <CheckCircle2 className="h-6 w-6 text-emerald-400 cursor-pointer" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card variant="glass">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Inquiry Conversion</p>
                <p className="text-2xl font-bold text-gray-900">68%</p>
              </div>
              <div className="rounded-full bg-primary-500/20 p-3">
                <TrendingUp className="h-6 w-6 text-primary-400 cursor-pointer" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card variant="glass">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Avg. Response Time</p>
                <p className="text-2xl font-bold text-gray-900">2.4h</p>
              </div>
              <div className="rounded-full bg-cyan-500/20 p-3">
                <Clock className="h-6 w-6 text-cyan-400 cursor-pointer" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

