"use client";

import { StatCard } from "@/components/ui/StatCard";
import { Chart } from "@/components/ui/Chart";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  TrendingUp,
  DollarSign,
  Users,
  FolderKanban,
  CheckCircle2,
  Clock,
  Zap,
  Sparkles,
  ArrowRight,
  Store,
  BarChart3,
  MessageSquare,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";

type RevenuePoint = { month: string; revenue: number; profit: number };
type StatusPoint = { name: string; value: number; color: string };
type Inquiry = {
  id: number;
  client: string;
  project: string;
  budget: number;
  status: string;
  time: string;
  avatar: string;
};
type ActionItem = {
  id: number;
  type: string;
  title: string;
  description: string;
  icon: string | React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
};

interface DashboardStats {
  totalRevenue: number;
  profitMargin: number;
  activeClients: number;
  activeProjects: number;
  revenueChange: number;
  profitChange: number;
  clientsChange: number;
  projectsChange: number;
  rating: number;
  conversionRate: number;
  avgResponseTime: string;
}

const iconMap: Record<string, React.ElementType> = {
  DollarSign,
  Users,
  FolderKanban,
  CheckCircle2,
  Clock,
  Zap,
};

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
    rating: 0,
    conversionRate: 0,
    avgResponseTime: "—",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [revenueData, setRevenueData] = useState<RevenuePoint[]>([]);
  const [projectStatusData, setProjectStatusData] = useState<StatusPoint[]>([]);
  const [recentInquiries, setRecentInquiries] = useState<Inquiry[]>([]);
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/pro/dashboard-stats");
        if (response.ok) {
          interface DashboardResponse {
            stats: DashboardStats;
            revenueData: RevenuePoint[];
            projectStatusData: StatusPoint[];
            recentInquiries: Inquiry[];
            actionItems: ActionItem[];
          }
          const data = (await response.json()) as DashboardResponse;
          setStats(data.stats);
          setRevenueData(data.revenueData);
          setProjectStatusData(data.projectStatusData);
          setRecentInquiries(data.recentInquiries);
          setActionItems(data.actionItems);
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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 120 } },
  };

  const quickActions = [
    { label: "View Inquiries", href: "/pro/inquiries", icon: MessageSquare, bg: "bg-[#0a9396]/10", color: "text-[#0a9396]" },
    { label: "AI Tools", href: "/pro/digitalbox/ai-tools", icon: Zap, bg: "bg-amber-50", color: "text-amber-600" },
    { label: "Marketplace", href: "/marketplace", icon: Store, bg: "bg-[#6ece39]/10", color: "text-green-700" },
    { label: "Reporting", href: "/pro/digitalbox/reporting", icon: BarChart3, bg: "bg-purple-50", color: "text-purple-600" },
  ];

  const footerStats = [
    {
      title: "Marketplace Rating",
      value: stats.rating > 0 ? `${stats.rating}/5` : "—",
      icon: CheckCircle2,
      accentClass: "from-[#0a9396] to-[#6ece39]",
      iconBg: "bg-[#0a9396]/10 border-[#0a9396]/20",
      iconColor: "text-[#0a9396]",
    },
    {
      title: "Inquiry Conversion",
      value: stats.conversionRate > 0 ? `${stats.conversionRate}%` : "—",
      icon: TrendingUp,
      accentClass: "from-[#6ece39] to-[#0a9396]",
      iconBg: "bg-[#6ece39]/10 border-[#6ece39]/20",
      iconColor: "text-green-700",
    },
    {
      title: "Avg. Response Time",
      value: stats.avgResponseTime,
      icon: Clock,
      accentClass: "from-[#005f73] to-[#0a9396]",
      iconBg: "bg-[#005f73]/10 border-[#005f73]/20",
      iconColor: "text-[#005f73]",
    },
  ] as const;

  return (
    <div className="relative min-h-screen bg-transparent overflow-hidden pb-12">
      {/* Brand-aligned ambient blobs */}
      <div className="fixed top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-[#0a9396]/10 blur-[130px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] left-[20%] w-[45%] h-[45%] rounded-full bg-[#6ece39]/8 blur-[130px] pointer-events-none z-0" />

      <div className="relative z-10 max-w-[1600px] mx-auto space-y-6">

        {/* ── Welcome bar ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl p-6 shadow-sm"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-linear-to-br from-[#0a9396] to-[#6ece39] items-center justify-center shadow-sm shadow-[#0a9396]/20 shrink-0 hidden sm:flex">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                    Pro Dashboard
                  </p>
                  <Badge
                    variant="primary"
                    size="sm"
                    className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold"
                  >
                    <span className="relative flex h-1.5 w-1.5 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0a9396]/60 opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#0a9396]" />
                    </span>
                    Active
                  </Badge>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back,{" "}
                  <span className="text-[#0a9396]">{userName}</span>
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  Here&apos;s an overview of your business performance.
                </p>
              </div>
            </div>

            <Link href="/pro/inquiries" className="w-full sm:w-auto shrink-0">
              <button className="w-full sm:w-auto h-11 px-6 rounded-xl bg-[#0a9396] hover:bg-[#087579] text-white font-semibold text-sm shadow-sm shadow-[#0a9396]/20 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2">
                View Inquiries
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </motion.div>

        {/* ── Stats ────────────────────────────────────────────── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {[
            {
              title: "Total Revenue (30d)",
              value: isLoading ? 0 : stats.totalRevenue,
              change: stats.revenueChange || undefined,
              trend: (stats.revenueChange > 0 ? "up" : stats.revenueChange < 0 ? "down" : "neutral") as "up" | "down" | "neutral",
              icon: DollarSign,
              gradient: "linear-gradient(135deg, #0a9396 0%, #005f73 100%)",
              format: "currency" as const,
            },
            {
              title: "Profit Margin",
              value: isLoading ? 0 : stats.profitMargin,
              change: stats.profitChange || undefined,
              trend: (stats.profitChange > 0 ? "up" : stats.profitChange < 0 ? "down" : "neutral") as "up" | "down" | "neutral",
              icon: TrendingUp,
              gradient: "linear-gradient(135deg, #6ece39 0%, #3a8a1f 100%)",
              format: "percentage" as const,
            },
            {
              title: "Active Clients",
              value: isLoading ? 0 : stats.activeClients,
              change: stats.clientsChange || undefined,
              trend: (stats.clientsChange > 0 ? "up" : stats.clientsChange < 0 ? "down" : "neutral") as "up" | "down" | "neutral",
              icon: Users,
              gradient: "linear-gradient(135deg, #0a9396 0%, #94d2bd 100%)",
              format: "number" as const,
            },
            {
              title: "Active Projects",
              value: isLoading ? 0 : stats.activeProjects,
              change: stats.projectsChange || undefined,
              trend: (stats.projectsChange > 0 ? "up" : stats.projectsChange < 0 ? "down" : "neutral") as "up" | "down" | "neutral",
              icon: FolderKanban,
              gradient: "linear-gradient(135deg, #005f73 0%, #0a9396 100%)",
              format: "number" as const,
            },
          ].map((stat) => (
            <motion.div key={stat.title} variants={itemVariants}>
              <div className="relative group bg-white/60 backdrop-blur-xl rounded-2xl border border-white/80 p-1 shadow-sm hover:-translate-y-0.5 transition-transform duration-300 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-[#0a9396] to-[#6ece39] opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="*:shadow-none! *:border-none! *:bg-transparent! min-h-[140px]">
                  <StatCard
                    title={stat.title}
                    value={stat.value}
                    change={stat.change}
                    trend={stat.trend}
                    icon={stat.icon}
                    gradient={stat.gradient}
                    animate={!isLoading}
                    format={stat.format}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Quick Actions ─────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <Link key={action.href} href={action.href}>
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.05 }}
                  className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl p-4 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all cursor-pointer group flex items-center gap-3"
                >
                  <div
                    className={`h-9 w-9 rounded-xl ${action.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className={`h-4 w-4 ${action.color}`} />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 leading-tight">
                    {action.label}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* ── Charts ───────────────────────────────────────────── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-6 lg:grid-cols-2"
        >
          <motion.div variants={itemVariants} className="h-full">
            <div className="h-full bg-white/60 backdrop-blur-xl rounded-2xl border border-white/80 shadow-sm overflow-hidden flex flex-col">
              <Chart
                title="Revenue & Profit Trends"
                description="Revenue and profit over the past 6 months"
                data={revenueData}
                type="area"
                dataKey="month"
                dataKeys={["revenue", "profit"]}
                colors={["#0a9396", "#6ece39"]}
              />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="h-full">
            <div className="h-full bg-white/60 backdrop-blur-xl rounded-2xl border border-white/80 shadow-sm overflow-hidden flex flex-col">
              <Chart
                title="Project Status Overview"
                description="Breakdown of projects by current status"
                data={projectStatusData}
                type="pie"
                dataKey="name"
                dataKeys={["value"]}
              />
            </div>
          </motion.div>
        </motion.div>

        {/* ── Action Items + Recent Inquiries ───────────────────── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-6 lg:grid-cols-2"
        >
          {/* Action Items */}
          <motion.div variants={itemVariants}>
            <div className="h-full bg-white/60 backdrop-blur-xl rounded-2xl border border-white/80 shadow-sm overflow-hidden p-6 flex flex-col">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-linear-to-br from-amber-400 to-orange-500 rounded-2xl shadow-sm shadow-amber-500/20 text-white shrink-0">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                    Action Items
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Items requiring your attention
                  </p>
                </div>
              </div>

              <div className="space-y-3 flex-1">
                {actionItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="h-12 w-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center mb-3">
                      <Zap className="h-5 w-5 text-amber-400" />
                    </div>
                    <p className="text-sm font-semibold text-gray-500">
                      No action items right now.
                    </p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {actionItems.map((item, index) => {
                      const Icon =
                        typeof item.icon === "string"
                          ? (iconMap[item.icon] || Zap)
                          : item.icon;
                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -16 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.08 * index }}
                          className="group/item flex items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-gray-100 hover:shadow-md hover:border-[#0a9396]/20 hover:-translate-y-0.5 transition-all cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2.5 rounded-xl ${item.bg} ${item.color} group-hover/item:scale-110 transition-transform shrink-0`}
                            >
                              <Icon className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 text-sm">
                                {item.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {item.description}
                              </p>
                            </div>
                          </div>
                          <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-opacity shrink-0">
                            <ArrowRight className="h-3.5 w-3.5 text-gray-500" />
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                )}
              </div>
            </div>
          </motion.div>

          {/* Recent Inquiries */}
          <motion.div variants={itemVariants}>
            <div className="h-full bg-white/60 backdrop-blur-xl rounded-2xl border border-white/80 shadow-sm overflow-hidden p-6 flex flex-col">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-linear-to-br from-[#0a9396] to-[#005f73] rounded-2xl shadow-sm shadow-[#0a9396]/20 text-white shrink-0">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                    Recent Inquiries
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    New client requests from the marketplace
                  </p>
                </div>
              </div>

              <div className="space-y-3 flex-1">
                {recentInquiries.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="h-12 w-12 rounded-2xl bg-[#0a9396]/5 border border-[#0a9396]/10 flex items-center justify-center mb-3">
                      <Users className="h-5 w-5 text-[#0a9396]" />
                    </div>
                    <p className="text-sm font-semibold text-gray-500">
                      No inquiries yet.
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      New client requests will appear here.
                    </p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {recentInquiries.map((inquiry, index) => (
                      <motion.div
                        key={inquiry.id}
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.08 * index }}
                        className="group/item flex items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-gray-100 hover:shadow-md hover:border-[#0a9396]/20 hover:-translate-y-0.5 transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="h-11 w-11 rounded-xl bg-[#0a9396]/10 border border-[#0a9396]/15 flex items-center justify-center text-base font-black text-[#0a9396] shrink-0">
                            {inquiry.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-bold text-gray-900 text-sm">
                                {inquiry.client}
                              </h4>
                              <Badge
                                variant={inquiry.status === "new" ? "primary" : "outline"}
                                size="sm"
                                className="text-[10px] uppercase font-bold h-5 px-1.5"
                              >
                                {inquiry.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-500 truncate mt-0.5">
                              {inquiry.project}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[11px] font-bold text-[#0a9396]">
                                {formatCurrency(inquiry.budget)}
                              </span>
                              <span className="text-gray-300">·</span>
                              <span className="text-[11px] text-gray-400 uppercase tracking-wide font-semibold">
                                {inquiry.time}
                              </span>
                            </div>
                          </div>
                        </div>
                        {/* Respond button — visible on mobile, hover-reveal on desktop */}
                        <Button
                          size="sm"
                          className="shrink-0 bg-[#0a9396] hover:bg-[#087579] text-white rounded-xl text-xs px-3 h-8 sm:opacity-0 sm:group-hover/item:opacity-100 sm:-translate-x-1 sm:group-hover/item:translate-x-0 transition-all"
                        >
                          Respond
                        </Button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* ── Footer Stats ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {footerStats.map((stat) => (
            <div
              key={stat.title}
              className="group relative bg-white/60 backdrop-blur-xl rounded-2xl border border-white/80 p-5 flex items-center justify-between shadow-sm hover:-translate-y-0.5 transition-all duration-300 cursor-pointer overflow-hidden"
            >
              <div
                className={`absolute top-0 bottom-0 left-0 w-1 bg-linear-to-b ${stat.accentClass} opacity-0 group-hover:opacity-100 transition-opacity rounded-l-2xl`}
              />
              <div className="relative z-10">
                <p className="text-[11px] font-bold tracking-widest uppercase text-gray-400 mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-black text-gray-900 tracking-tighter">
                  {stat.value}
                </p>
              </div>
              <div
                className={`p-3 rounded-xl border shadow-sm ${stat.iconBg} group-hover:scale-110 transition-transform shrink-0`}
              >
                <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>
            </div>
          ))}
        </motion.div>

      </div>
    </div>
  );
}
