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
  AlertCircle,
  CheckCircle2,
  Clock,
  Zap,
  Sparkles,
  ArrowRight,
  Activity
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

// Mock data for charts
const revenueData = [
  { month: "Jan", revenue: 4500, profit: 3200 },
  { month: "Feb", revenue: 5200, profit: 3800 },
  { month: "Mar", revenue: 4800, profit: 3500 },
  { month: "Apr", revenue: 6100, profit: 4500 },
  { month: "May", revenue: 5500, profit: 4100 },
  { month: "Jun", revenue: 6800, profit: 5100 },
];

const projectStatusData = [
  { name: "On Track", value: 3, color: "#0a9396" }, // Emerald/Teal
  { name: "Needs Attention", value: 1, color: "#f59e0b" }, // Amber
  { name: "Completed", value: 5, color: "#8b5cf6" }, // Violet
];

const recentInquiries = [
  {
    id: 1,
    client: "TechStart Inc.",
    project: "SEO Optimization Campaign",
    budget: 2500,
    status: "new",
    time: "2 hours ago",
    avatar: "T"
  },
  {
    id: 2,
    client: "E-Commerce Pro",
    project: "PPC Management",
    budget: 1800,
    status: "reviewed",
    time: "5 hours ago",
    avatar: "E"
  },
  {
    id: 3,
    client: "Local Business Hub",
    project: "Social Media Strategy",
    budget: 1200,
    status: "new",
    time: "1 day ago",
    avatar: "L"
  },
];

const actionItems = [
  {
    id: 1,
    type: "urgent",
    title: "Client X: SEO Audit - Technical Fixes",
    description: "3 days overdue",
    icon: AlertCircle,
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
  {
    id: 2,
    type: "billing",
    title: "Client Y: Invoice #1002",
    description: "7 days past due",
    icon: DollarSign,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    id: 3,
    type: "performance",
    title: "Client Z (PPC): ROAS dropped 15%",
    description: "Last 48 hours",
    icon: TrendingUp,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
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
  const userName = session?.user?.name || "Architect";
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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120 } }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-gray-50 overflow-hidden pb-12 pt-4 px-4 sm:px-6 lg:px-8">
      {/* Ambient Lighting Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none mix-blend-multiply animate-pulse-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#0a9396]/10 blur-[120px] pointer-events-none mix-blend-multiply animate-pulse" />
      <div className="absolute top-[30%] left-[20%] w-[40%] h-[40%] rounded-full bg-violet-400/10 blur-[140px] pointer-events-none mix-blend-multiply animate-float-slow" />

      <div className="relative z-10 max-w-[1600px] mx-auto space-y-6">
        
        {/* Welcome Section */}
        <motion.div
           initial={{ opacity: 0, y: -20, scale: 0.98 }}
           animate={{ opacity: 1, y: 0, scale: 1 }}
           transition={{ type: "spring", stiffness: 100, damping: 20 }}
           className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] bg-white/40 p-1 backdrop-blur-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 group"
        >
           <div className="absolute inset-0 bg-gradient-to-r from-[#0a9396]/5 via-blue-500/5 to-violet-500/5 opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
           <div className="relative bg-white/60 rounded-[1.8rem] sm:rounded-[2.4rem] p-6 lg:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-inner border border-white">
             
             <div className="flex items-center gap-5">
               <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#0a9396] to-teal-400 p-0.5 shadow-lg shadow-[#0a9396]/20 relative overflow-hidden hidden sm:flex shrink-0">
                  <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <div className="h-full w-full rounded-[14px] bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                     <Sparkles className="h-8 w-8 text-white" />
                  </div>
               </div>
               <div>
                 <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tighter drop-shadow-sm flex items-center gap-3">
                   Welcome Array, {userName}
                   <div className="hidden lg:flex items-center relative group/badge cursor-default">
                     <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-[#0a9396] rounded-full blur opacity-40 group-hover/badge:opacity-80 transition-opacity duration-500 animate-pulse"></div>
                     <Badge variant="primary" size="lg" className="relative bg-gradient-to-r from-[#0a9396] to-teal-500 border border-white/30 shadow-lg text-[9px] uppercase tracking-[0.15em] h-7 w-auto min-w-max items-center px-4 gap-2.5 overflow-hidden font-black">
                       <span className="relative flex h-2 w-2 shrink-0">
                         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-100 opacity-75"></span>
                         <span className="relative inline-flex rounded-full h-2 w-2 bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]"></span>
                       </span>
                       <span className="relative z-10 text-white drop-shadow-sm leading-none pt-[1px]">PRO ACTIVE</span>
                       <div className="absolute inset-0 -translate-x-full group-hover/badge:translate-x-[150%] bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000 ease-in-out" />
                     </Badge>
                   </div>
                 </h1>
                 <p className="text-gray-500 font-bold tracking-wide mt-1 flex items-center gap-2 text-[15px]">
                   <Activity className="h-4 w-4 text-blue-500" />
                   System telemetry and business nodes are synced.
                 </p>
               </div>
             </div>

             <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
               <div className="hidden sm:flex flex-col items-end mr-2">
                 <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Node Integrity</div>
                 <div className="flex items-center gap-2">
                    <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden shrink-0">
                       <div className="h-full w-[95%] bg-gradient-to-r from-emerald-400 to-[#0a9396] rounded-full" />
                    </div>
                    <span className="text-xs font-black text-gray-700">95%</span>
                 </div>
               </div>
               <Button className="flex-1 md:flex-none cursor-pointer group/btn h-12 rounded-xl bg-gray-900 border-none hover:bg-black hover:shadow-lg hover:shadow-gray-900/20 hover:-translate-y-0.5 transition-all w-full sm:w-auto px-6 whitespace-nowrap">
                 <span className="font-bold tracking-wide">Get Certified</span>
                 <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1 text-teal-400" />
               </Button>
             </div>
           </div>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4"
        >
          {/* Key Metrics */}
          <motion.div variants={itemVariants} className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative h-full bg-white/60 backdrop-blur-xl rounded-[1.5rem] border border-white/80 p-1 shadow-[inset_0_1px_4px_rgb(255,255,255,0.5),0_4px_20px_rgb(0,0,0,0.02)]">
              <div className="absolute inset-0 bg-white/30 rounded-[1.5rem] mix-blend-overlay pointer-events-none" />
              <div className="relative z-10 w-full h-full bg-transparent p-0 *:!shadow-none *:!border-none *:!bg-transparent h-[140px]">
                <StatCard
                  title="Total Revenue (30d)"
                  value={isLoading ? 0 : stats.totalRevenue}
                  change={stats.revenueChange !== 0 ? stats.revenueChange : undefined}
                  trend={stats.revenueChange > 0 ? "up" : stats.revenueChange < 0 ? "down" : "neutral"}
                  icon={DollarSign}
                  gradient="linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)"
                  animate={!isLoading}
                  format="currency"
                />
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-br from-emerald-400 to-[#0a9396] rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative h-full bg-white/60 backdrop-blur-xl rounded-[1.5rem] border border-white/80 p-1 shadow-[inset_0_1px_4px_rgb(255,255,255,0.5),0_4px_20px_rgb(0,0,0,0.02)]">
              <div className="absolute inset-0 bg-white/30 rounded-[1.5rem] mix-blend-overlay pointer-events-none" />
              <div className="relative z-10 w-full h-full bg-transparent p-0 *:!shadow-none *:!border-none *:!bg-transparent h-[140px]">
                <StatCard
                  title="Profit Margin"
                  value={isLoading ? 0 : stats.profitMargin}
                  change={stats.profitChange !== 0 ? stats.profitChange : undefined}
                  trend={stats.profitChange > 0 ? "up" : stats.profitChange < 0 ? "down" : "neutral"}
                  icon={TrendingUp}
                  gradient="linear-gradient(135deg, #34d399 0%, #0a9396 100%)"
                  animate={!isLoading}
                  format="currency"
                />
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative h-full bg-white/60 backdrop-blur-xl rounded-[1.5rem] border border-white/80 p-1 shadow-[inset_0_1px_4px_rgb(255,255,255,0.5),0_4px_20px_rgb(0,0,0,0.02)]">
              <div className="absolute inset-0 bg-white/30 rounded-[1.5rem] mix-blend-overlay pointer-events-none" />
               <div className="relative z-10 w-full h-full bg-transparent p-0 *:!shadow-none *:!border-none *:!bg-transparent h-[140px]">
                <StatCard
                  title="Active Clients"
                  value={isLoading ? 0 : stats.activeClients}
                  change={stats.clientsChange !== 0 ? stats.clientsChange : undefined}
                  trend={stats.clientsChange > 0 ? "up" : stats.clientsChange < 0 ? "down" : "neutral"}
                  icon={Users}
                  gradient="linear-gradient(135deg, #22d3ee 0%, #3b82f6 100%)"
                  animate={!isLoading}
                  format="number"
                />
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-br from-violet-500 to-purple-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative h-full bg-white/60 backdrop-blur-xl rounded-[1.5rem] border border-white/80 p-1 shadow-[inset_0_1px_4px_rgb(255,255,255,0.5),0_4px_20px_rgb(0,0,0,0.02)]">
              <div className="absolute inset-0 bg-white/30 rounded-[1.5rem] mix-blend-overlay pointer-events-none" />
              <div className="relative z-10 w-full h-full bg-transparent p-0 *:!shadow-none *:!border-none *:!bg-transparent h-[140px]">
                <StatCard
                  title="Active Projects"
                  value={isLoading ? 0 : stats.activeProjects}
                  change={stats.projectsChange !== 0 ? stats.projectsChange : undefined}
                  trend={stats.projectsChange > 0 ? "up" : stats.projectsChange < 0 ? "down" : "neutral"}
                  icon={FolderKanban}
                  gradient="linear-gradient(135deg, #a855f7 0%, #8b5cf6 100%)"
                  animate={!isLoading}
                  format="number"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Charts Row */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-6 lg:grid-cols-2"
        >
          <motion.div variants={itemVariants} className="h-full">
            <div className="h-full bg-white/40 backdrop-blur-2xl rounded-[2rem] border border-white/60 shadow-[inset_0_2px_15px_rgb(255,255,255,0.7),0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden flex flex-col p-[1px] relative group">
              <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />
              <div className="relative z-10 flex-1 p-0 *:!shadow-none *:!border-none *:!bg-transparent">
                 <Chart
                   title="Revenue & Profit Trends"
                   description="Last 6 months telemetry"
                   data={revenueData}
                   type="area"
                   dataKey="month"
                   dataKeys={["revenue", "profit"]}
                   colors={["#3b82f6", "#0a9396"]}
                 />
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="h-full">
            <div className="h-full bg-white/40 backdrop-blur-2xl rounded-[2rem] border border-white/60 shadow-[inset_0_2px_15px_rgb(255,255,255,0.7),0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden flex flex-col p-[1px] relative group">
              <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />
              <div className="relative z-10 flex-1 p-0 *:!shadow-none *:!border-none *:!bg-transparent">
                 <Chart
                   title="Project Status Overview"
                   description="Current sector distribution"
                   data={projectStatusData}
                   type="pie"
                   dataKey="name"
                   dataKeys={["value"]}
                 />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Action Center & Recent Inquiries */}
        <motion.div 
           variants={containerVariants}
           initial="hidden"
           animate="show"
           className="grid grid-cols-1 gap-6 lg:grid-cols-2"
        >
          {/* Action Center */}
          <motion.div variants={itemVariants}>
            <div className="h-full bg-white/40 backdrop-blur-2xl rounded-[2rem] border border-white/60 shadow-[inset_0_2px_15px_rgb(255,255,255,0.7),0_10px_30px_rgb(0,0,0,0.03)] overflow-hidden relative group p-6 sm:p-8 flex flex-col">
              <div className="absolute -inset-10 bg-gradient-to-br from-amber-400/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-2xl pointer-events-none" />
              <div className="absolute -top-10 -right-10 text-amber-500/5 rotate-12 scale-150 pointer-events-none group-hover:scale-[1.8] group-hover:rotate-[24deg] transition-all duration-1000">
                <Zap size={200} />
              </div>

              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="p-3.5 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-lg shadow-amber-500/20 text-white">
                  <Zap className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">System Alerts</h2>
                  <p className="text-gray-500 font-medium text-[13px] tracking-wide">Action nodes pending resolution</p>
                </div>
              </div>

              <div className="space-y-4 relative z-10 flex-1">
                <AnimatePresence>
                  {actionItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="group/item flex items-center justify-between gap-4 p-4 rounded-2xl bg-white/60 border border-white hover:bg-white hover:shadow-lg hover:shadow-gray-200/50 hover:-translate-y-0.5 transition-all cursor-pointer backdrop-blur-sm"
                      >
                         <div className="flex items-center gap-4">
                           <div className={`p-3 rounded-xl ${item.bg} ${item.color} shadow-inner group-hover/item:scale-110 transition-transform`}>
                             <Icon className="h-5 w-5" />
                           </div>
                           <div>
                              <p className="font-bold text-gray-900 tracking-tight text-[15px]">{item.title}</p>
                              <p className="text-[13px] font-semibold text-gray-500 mt-0.5">{item.description}</p>
                           </div>
                         </div>
                         <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-full opacity-0 group-hover/item:opacity-100 -translate-x-2 group-hover/item:translate-x-0 transition-all bg-gray-50 hover:bg-gray-100 flex items-center justify-center">
                           <ArrowRight className="h-4 w-4 text-gray-600" />
                         </Button>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Recent Inquiries */}
          <motion.div variants={itemVariants}>
            <div className="h-full bg-white/40 backdrop-blur-2xl rounded-[2rem] border border-white/60 shadow-[inset_0_2px_15px_rgb(255,255,255,0.7),0_10px_30px_rgb(0,0,0,0.03)] overflow-hidden relative group p-6 sm:p-8 flex flex-col">
              <div className="absolute -inset-10 bg-gradient-to-bl from-[#0a9396]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-2xl pointer-events-none" />
              <div className="absolute -bottom-10 -right-10 text-[#0a9396]/5 -rotate-12 scale-150 pointer-events-none group-hover:scale-[1.8] group-hover:-rotate-[24deg] transition-all duration-1000">
                <Users size={200} />
              </div>

              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="p-3.5 bg-gradient-to-br from-teal-400 to-[#0a9396] rounded-2xl shadow-lg shadow-[#0a9396]/20 text-white">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">Active Pipelines</h2>
                  <p className="text-gray-500 font-medium text-[13px] tracking-wide">Client nodes entering funnel</p>
                </div>
              </div>

              <div className="space-y-4 relative z-10 flex-1">
                <AnimatePresence>
                  {recentInquiries.map((inquiry, index) => (
                    <motion.div
                      key={inquiry.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="group/item flex items-center justify-between gap-4 p-4 rounded-2xl bg-white/60 border border-white hover:bg-white hover:shadow-lg hover:shadow-gray-200/50 hover:-translate-y-0.5 transition-all cursor-pointer backdrop-blur-sm"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-blue-100 flex items-center justify-center text-lg font-black text-blue-600 shadow-inner shrink-0 group-hover/item:shadow-blue-200/50 transition-all">
                          {inquiry.avatar}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                             <h4 className="font-bold text-gray-900 tracking-tight text-[15px]">{inquiry.client}</h4>
                             <Badge variant={inquiry.status === "new" ? "primary" : "outline"} className="text-[10px] uppercase font-black px-1.5 py-0 h-5">
                               {inquiry.status}
                             </Badge>
                          </div>
                          <p className="text-[13px] font-semibold text-gray-500 truncate mt-0.5">{inquiry.project}</p>
                          <div className="flex items-center gap-2 mt-1.5 opacity-70">
                             <Badge variant="outline" className="text-[10px] font-bold border-gray-200 bg-gray-50/50 rounded-md py-0 h-[18px]">
                               {formatCurrency(inquiry.budget)}
                             </Badge>
                             <span className="text-gray-300">•</span>
                             <span className="text-[11px] font-bold text-gray-400 tracking-wide uppercase">{inquiry.time}</span>
                          </div>
                        </div>
                      </div>
                      
                      <Button className="hidden sm:inline-flex shrink-0 opacity-0 group-hover/item:opacity-100 -translate-x-2 group-hover/item:translate-x-0 transition-all bg-gray-900 text-white hover:bg-black rounded-xl cursor-pointer shadow-md">
                        Respond
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Quick Stats Footer row */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.8 }}
           className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {[
            { title: "Marketplace Rating", value: "4.8/5", icon: CheckCircle2, color: "emerald", gradient: "from-emerald-400 to-teal-500" },
            { title: "Inquiry Conversion", value: "68%", icon: TrendingUp, color: "blue", gradient: "from-blue-400 to-indigo-500" },
            { title: "Avg. Response Time", value: "2.4h", icon: Clock, color: "violet", gradient: "from-violet-400 to-purple-500" }
          ].map((stat, i) => (
             <div key={i} className="group relative bg-white/40 backdrop-blur-2xl rounded-2xl border border-white/60 p-5 flex items-center justify-between shadow-[inset_0_2px_15px_rgb(255,255,255,0.7),0_4px_20px_rgb(0,0,0,0.02)] hover:bg-white/60 transition-colors overflow-hidden cursor-pointer">
                <div className={`absolute top-0 bottom-0 left-0 w-1.5 bg-gradient-to-b ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className="relative z-10">
                  <p className="text-[12px] font-bold tracking-widest uppercase text-gray-500 mb-1">{stat.title}</p>
                  <p className="text-2xl font-black text-gray-900 tracking-tighter">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-${stat.color}-500/10 border border-${stat.color}-500/20 shadow-inner group-hover:bg-gradient-to-br ${stat.gradient} transition-all duration-300 relative z-10`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-500 group-hover:text-white transition-colors`} />
                </div>
             </div>
          ))}
        </motion.div>

      </div>
    </div>
  );
}
