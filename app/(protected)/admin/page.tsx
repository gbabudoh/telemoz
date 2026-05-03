"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Chart } from "@/components/ui/Chart";
import {
  Users,
  Briefcase,
  DollarSign,
  TrendingUp,
  UserCheck,
  CheckCircle2,
  Shield,
  Activity,
  Zap,
  ArrowUpRight,
  FolderKanban,
  CreditCard,
  Settings,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";

interface RecentUser {
  id: string;
  name: string;
  userType: string;
  createdAt: string;
}

interface RecentProject {
  id: string;
  title: string;
  status: string;
  createdAt: string;
}

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
  recentUsers: RecentUser[];
  recentProjects: RecentProject[];
}

const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.35, ease: "easeOut" },
  }),
};

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
    recentUsers: [],
    recentProjects: [],
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

  const recentActivities = [
    ...(stats.recentUsers || []).map((u: RecentUser) => ({
      id: `user-${u.id}`,
      action: `New ${u.userType} registered`,
      detail: u.name,
      time: formatRelativeTime(new Date(u.createdAt)),
      icon: UserCheck,
      color: "bg-[#0a9396]/10 text-[#0a9396]",
      timestamp: new Date(u.createdAt).getTime(),
    })),
    ...(stats.recentProjects || []).map((p: RecentProject) => ({
      id: `project-${p.id}`,
      action: "New project posted",
      detail: p.title,
      time: formatRelativeTime(new Date(p.createdAt)),
      icon: Briefcase,
      color: "bg-emerald-100 text-emerald-700",
      timestamp: new Date(p.createdAt).getTime(),
    })),
  ].sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);

  const chartData = [
    { month: "Oct", users: 120, projects: 45, revenue: 12500 },
    { month: "Nov", users: 180, projects: 62, revenue: 18500 },
    { month: "Dec", users: 250, projects: 89, revenue: 24500 },
  ];

  const quickActions = [
    {
      href: "/admin/users",
      icon: Users,
      title: "User Management",
      description: "Manage pros, clients & admins",
      count: stats.totalUsers,
      countLabel: "total users",
      border: "border-[#0a9396]/20 hover:border-[#0a9396]/50",
      bg: "from-[#0a9396]/5 to-cyan-50/30",
      iconBg: "bg-[#0a9396]/10",
      iconColor: "text-[#0a9396]",
    },
    {
      href: "/admin/projects",
      icon: FolderKanban,
      title: "Project Management",
      description: "Monitor & oversee all projects",
      count: stats.activeProjects,
      countLabel: "active projects",
      border: "border-indigo-200/60 hover:border-indigo-400/60",
      bg: "from-indigo-50/50 to-blue-50/30",
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
    },
    {
      href: "/admin/transactions",
      icon: CreditCard,
      title: "Transactions",
      description: "Track payments & commissions",
      count: stats.pendingInvoices,
      countLabel: "pending invoices",
      border: "border-emerald-200/60 hover:border-emerald-400/60",
      bg: "from-emerald-50/50 to-green-50/30",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      href: "/admin/settings",
      icon: Settings,
      title: "System Settings",
      description: "Configure platform & security",
      count: null,
      countLabel: "",
      border: "border-amber-200/60 hover:border-amber-400/60",
      bg: "from-amber-50/50 to-orange-50/30",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a9396] mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading platform statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="rounded-xl bg-[#0a9396] p-2 shadow-sm">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Admin Control Center</h1>
          </div>
          <p className="text-gray-500 text-sm">Platform overview and management dashboard</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            All Systems Operational
          </span>
          <Badge variant="primary" size="sm">
            <Shield className="h-3 w-3 mr-1" />
            Admin
          </Badge>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: stats.totalUsers, trend: "+12%", icon: Users, accent: "border-l-[#0a9396]", iconBg: "bg-[#0a9396]/10", iconColor: "text-[#0a9396]" },
          { label: "Active Projects", value: stats.activeProjects, trend: "+8%", icon: Briefcase, accent: "border-l-indigo-500", iconBg: "bg-indigo-100", iconColor: "text-indigo-600" },
          { label: "Total Revenue", value: formatCurrency(stats.totalRevenue), trend: "+15%", icon: DollarSign, accent: "border-l-emerald-500", iconBg: "bg-emerald-100", iconColor: "text-emerald-600" },
          { label: "Platform Commission", value: formatCurrency(stats.totalCommission), trend: "+15%", icon: TrendingUp, accent: "border-l-amber-500", iconBg: "bg-amber-100", iconColor: "text-amber-600" },
        ].map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <motion.div key={kpi.label} custom={i} initial="hidden" animate="visible" variants={CARD_VARIANTS}>
              <Card className={`border-l-4 ${kpi.accent} hover:shadow-md transition-shadow`}>
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">{kpi.label}</p>
                      <p className="text-2xl font-bold text-gray-900 tabular-nums">{kpi.value}</p>
                      <div className="flex items-center gap-1 mt-1.5">
                        <ArrowUpRight className="h-3 w-3 text-emerald-600" />
                        <span className="text-xs font-semibold text-emerald-600">{kpi.trend}</span>
                        <span className="text-xs text-gray-400">this month</span>
                      </div>
                    </div>
                    <div className={`rounded-xl ${kpi.iconBg} p-2.5`}>
                      <Icon className={`h-5 w-5 ${kpi.iconColor}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Secondary Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Professionals", value: stats.totalPros, sub: `${stats.activeUsers} active`, icon: UserCheck, bg: "from-[#0a9396]/5 to-cyan-50/30 border-[#0a9396]/20", iconBg: "bg-[#0a9396]/10", iconColor: "text-[#0a9396]" },
          { label: "Clients", value: stats.totalClients, sub: `${stats.inactiveUsers} inactive`, icon: Users, bg: "from-blue-50/50 to-indigo-50/30 border-blue-200/50", iconBg: "bg-blue-100", iconColor: "text-blue-600" },
          { label: "Completed Projects", value: stats.completedProjects, sub: "All time", icon: CheckCircle2, bg: "from-emerald-50/50 to-green-50/30 border-emerald-200/50", iconBg: "bg-emerald-100", iconColor: "text-emerald-600" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} custom={i + 4} initial="hidden" animate="visible" variants={CARD_VARIANTS}>
              <Card className={`bg-gradient-to-br ${stat.bg}`}>
                <CardContent className="pt-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-xs text-gray-500 mt-1">{stat.sub}</p>
                    </div>
                    <div className={`rounded-xl ${stat.iconBg} p-2.5`}>
                      <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div custom={7} initial="hidden" animate="visible" variants={CARD_VARIANTS}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-900">
                <Activity className="h-4 w-4 text-[#0a9396]" />
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
                colors={["#0a9396", "#10b981", "#6366f1"]}
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div custom={8} initial="hidden" animate="visible" variants={CARD_VARIANTS}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-900">
                <Zap className="h-4 w-4 text-[#0a9396]" />
                User Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Chart
                data={[
                  { name: "Pros", value: stats.totalPros, color: "#0a9396" },
                  { name: "Clients", value: stats.totalClients, color: "#10b981" },
                  { name: "Admins", value: stats.totalAdmins, color: "#6366f1" },
                ]}
                type="pie"
                dataKey="name"
                dataKeys={["value"]}
                title="User Types"
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Access */}
      <div>
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Quick Access</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <motion.div key={action.href} custom={i + 9} initial="hidden" animate="visible" variants={CARD_VARIANTS}>
                <Link href={action.href}>
                  <Card className={`group cursor-pointer hover:shadow-lg transition-all duration-200 bg-gradient-to-br ${action.bg} border ${action.border}`}>
                    <CardContent className="pt-5 pb-4">
                      <div className={`inline-flex rounded-xl ${action.iconBg} p-2.5 mb-3`}>
                        <Icon className={`h-5 w-5 ${action.iconColor}`} />
                      </div>
                      <p className="font-semibold text-gray-900 text-sm leading-snug">{action.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 mb-3">{action.description}</p>
                      {action.count !== null && (
                        <p className="text-xs text-gray-500">
                          <span className="text-xl font-bold text-gray-900 mr-1 tabular-nums">{action.count}</span>
                          {action.countLabel}
                        </p>
                      )}
                      <div className="flex items-center gap-1 mt-2 text-xs font-medium text-gray-400 group-hover:text-gray-700 transition-colors">
                        Open
                        <ArrowUpRight className="h-3 w-3" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <motion.div custom={13} initial="hidden" animate="visible" variants={CARD_VARIANTS}>
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-900">
                <Activity className="h-4 w-4 text-[#0a9396]" />
                Recent Activity
              </CardTitle>
              <Link href="/admin/reports">
                <Button variant="ghost" size="sm" className="text-xs text-[#0a9396] hover:text-[#087579]">
                  View all reports →
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentActivities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={activity.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className={`rounded-lg p-2 shrink-0 ${activity.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500 truncate">{activity.detail}</p>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">{activity.time}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function formatRelativeTime(date: Date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 172800) return "yesterday";
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}
