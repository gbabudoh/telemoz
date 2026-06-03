"use client";

import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Chart } from "@/components/ui/Chart";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  FolderKanban,
  Download,
  Calendar,
  FileText,
  PieChart,
  MousePointer2,
  Eye,
  Activity,
  Share2,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { exportToPDF, exportToExcel } from "@/lib/export";

interface ReportingStats {
  totalRevenue: number;
  revenueChange: number;
  activeClients: number;
  clientsChange: number;
  completedProjects: number;
  projectsChange: number;
  avgProjectValue: number;
  avgProjectValueChange: number;
}

interface ChartData {
  revenueData: Array<{ month: string; revenue: number; profit: number }>;
  clientGrowthData: Array<{ month: string; clients: number }>;
  projectStatusData: Array<{ name: string; value: number; color: string }>;
}

interface MarketingChartData {
  [key: string]: unknown;
  date: string;
  impressions: number;
  clicks: number;
  spend: number;
}

interface MarketingPlatformData {
  [key: string]: unknown;
  provider: string;
  _sum: {
    impressions: number | null;
    clicks: number | null;
    spend: number | null;
  };
}

interface MarketingAlert {
  id: string;
  message: string;
  read: boolean;
  type: string;
  createdAt: string;
}

interface Project {
  id: string;
  title: string;
}

export default function ReportingPage() {
  const { data: session } = useSession();
  const [dateRange] = useState("6months");
  const [stats, setStats] = useState<ReportingStats>({
    totalRevenue: 0,
    revenueChange: 0,
    activeClients: 0,
    clientsChange: 0,
    completedProjects: 0,
    projectsChange: 0,
    avgProjectValue: 0,
    avgProjectValueChange: 0,
  });
  const [chartData, setChartData] = useState<ChartData>({
    revenueData: [],
    clientGrowthData: [],
    projectStatusData: [],
  });
  const [alerts, setAlerts] = useState<MarketingAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [view, setView] = useState<"business" | "marketing">("business");
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [sharedLink, setSharedLink] = useState<string>("");
  const [isSharing, setIsSharing] = useState(false);
  
  const [marketingData, setMarketingData] = useState<{
    totals: { impressions: number; clicks: number; spend: number; conversions: number };
    chartData: MarketingChartData[];
    platformData: MarketingPlatformData[];
    integrations: Array<{ provider: string }>;
  } | null>(null);
  const [isMarketingLoading, setIsMarketingLoading] = useState(false);

  const handleExportPDF = async () => {
    setShowExportDropdown(false);
    await exportToPDF("reporting-content", `Reporting_Analytics_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleExportExcel = () => {
    setShowExportDropdown(false);
    
    // Prepare data for Excel
    const summaryData = [
      { Metric: "Total Revenue", Value: stats.totalRevenue, Change: `${stats.revenueChange}%` },
      { Metric: "Active Clients", Value: stats.activeClients, Change: `${stats.clientsChange}%` },
      { Metric: "Completed Projects", Value: stats.completedProjects, Change: `${stats.projectsChange}%` },
      { Metric: "Avg. Project Value", Value: stats.avgProjectValue, Change: `${stats.avgProjectValueChange}%` },
    ];

    const chartExportData = chartData.revenueData.map(item => ({
      Month: item.month,
      Revenue: item.revenue,
      Profit: item.profit
    }));

    // For simplicity, we'll just export the summary and revenue data
    // In a real app, we might create multiple sheets
    exportToExcel([...summaryData, { Metric: "---", Value: "---", Change: "---" }, ...chartExportData], `Reporting_Analytics_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/pro/reporting-stats?period=${dateRange}`);
        if (response.ok) {
          const data = await response.json();
          setStats(data.stats);
          setChartData(data.charts);
        }
      } catch (error) {
        console.error("Error fetching reporting stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user && view === "business") {
      fetchStats();
    }
  }, [session, dateRange, view]);

  // Fetch Marketing Stats
  useEffect(() => {
    const fetchMarketingStats = async () => {
      try {
        setIsMarketingLoading(true);
        const response = await fetch(`/api/pro/reporting/marketing?period=${dateRange}`);
        if (response.ok) {
          const data = await response.json();
          setMarketingData(data);
        }
      } catch (error) {
        console.error("Error fetching marketing stats:", error);
      } finally {
        setIsMarketingLoading(false);
      }
    };

    if (session?.user && view === "marketing") {
      fetchMarketingStats();
      fetchAlerts();
    }
  }, [session, dateRange, view]);

  useEffect(() => {
    const fetchProjects = async () => {
      const response = await fetch("/api/pro/projects");
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
        if (data.length > 0) setSelectedProjectId(data[0].id);
      }
    };
    if (session?.user) fetchProjects();
  }, [session]);

  const handleShareReport = async () => {
    if (!selectedProjectId) return;
    setIsSharing(true);
    try {
      const response = await fetch("/api/pro/reports/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: selectedProjectId }),
      });
      if (response.ok) {
        const data = await response.json();
        setSharedLink(data.shareUrl);
      }
    } catch (error) {
      console.error("Error sharing report:", error);
    } finally {
      setIsSharing(false);
    }
  };

  const fetchAlerts = async () => {
    try {
      const response = await fetch('/api/notifications?type=marketing_anomaly');
      if (response.ok) {
        const data: MarketingAlert[] = await response.json();
        setAlerts(data.filter((n) => !n.read));
      }
    } catch (error) {
      console.error("Error fetching alerts:", error);
    }
  };

  const statsConfig = [
    {
      label: "Total Revenue",
      value: stats.totalRevenue,
      change: stats.revenueChange,
      trend: stats.revenueChange >= 0 ? "up" : "down",
      icon: DollarSign,
      color: "from-[#0a9396] to-[#015f63]", 
      glow: "shadow-[#0a9396]/40",
      format: "currency" as const,
    },
    {
      label: "Active Clients",
      value: stats.activeClients,
      change: stats.clientsChange,
      trend: stats.clientsChange >= 0 ? "up" : "down",
      icon: Users,
      color: "from-[#F59E0B] to-[#D97706]", 
      glow: "shadow-[#F59E0B]/40",
      format: "number" as const,
    },
    {
      label: "Completed Projects",
      value: stats.completedProjects,
      change: stats.projectsChange,
      trend: stats.projectsChange >= 0 ? "up" : "down",
      icon: FolderKanban,
      color: "from-[#3B82F6] to-[#1D4ED8]", 
      glow: "shadow-[#3B82F6]/40",
      format: "number" as const,
    },
    {
      label: "Avg. Project Value",
      value: stats.avgProjectValue,
      change: stats.avgProjectValueChange,
      trend: stats.avgProjectValueChange >= 0 ? "up" : "down",
      icon: TrendingUp,
      color: "from-[#8B5CF6] to-[#6D28D9]", 
      glow: "shadow-[#8B5CF6]/40",
      format: "currency" as const,
    },
  ];

  const marketingStatsConfig = [
    {
      label: "Total Impressions",
      value: marketingData?.totals.impressions || 0,
      change: 0,
      trend: "up" as const,
      icon: Eye,
      color: "from-blue-400 to-blue-600",
      glow: "shadow-blue-500/40",
      format: "number" as const,
    },
    {
      label: "Total Clicks",
      value: marketingData?.totals.clicks || 0,
      change: 0,
      trend: "up" as const,
      icon: MousePointer2,
      color: "from-emerald-400 to-teal-500",
      glow: "shadow-emerald-500/40",
      format: "number" as const,
    },
    {
      label: "Ad Spend",
      value: marketingData?.totals.spend || 0,
      change: 0,
      trend: "down" as const,
      icon: DollarSign,
      color: "from-indigo-400 to-purple-600",
      glow: "shadow-indigo-500/40",
      format: "currency" as const,
    },
    {
      label: "Conversions",
      value: marketingData?.totals.conversions || 0,
      change: 0,
      trend: "up" as const,
      icon: Activity,
      color: "from-amber-400 to-orange-500",
      glow: "shadow-amber-500/40",
      format: "number" as const,
    },
  ];

  const activeStatsConfig = view === "business" ? statsConfig : marketingStatsConfig;
  const isCurrentlyLoading = view === "business" ? isLoading : isMarketingLoading;

  const formatValue = (num: number, format: "currency" | "number" | "percentage") => {
    if (format === "currency") {
      return `£${num.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    if (format === "number") {
      return num.toLocaleString("en-GB");
    }
    return `${num.toFixed(1)}%`;
  }

  // Animation Variants
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
    <div id="reporting-content" className="relative min-h-[calc(100vh-4rem)] bg-gray-50 overflow-x-hidden pb-32">
       {/* Ambient Global Lighting Elements */}
       <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-400/10 blur-[120px] pointer-events-none mix-blend-multiply animate-pulse-slow" />
       <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#0a9396]/10 blur-[120px] pointer-events-none mix-blend-multiply animate-pulse-slower" />
       <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none mix-blend-multiply animate-float-slow" />

       <div className="relative z-10 space-y-8 max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Ultra-Premium Glass Header */}
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-white/40 p-8 rounded-[2.5rem] border border-white/60 shadow-[inset_0_2px_15px_rgb(255,255,255,0.7),0_8px_30px_rgb(0,0,0,0.02)] backdrop-blur-2xl">
          <div>
            <div className="flex items-center gap-4">
               <div className="p-4 bg-gradient-to-br from-[#0a9396] to-[#015f63] rounded-2xl shadow-lg shadow-[#0a9396]/20 relative overflow-hidden group">
                   <div className="absolute inset-0 bg-white/20 w-full h-full transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                   <BarChart3 className="h-8 w-8 text-white relative z-10" />
               </div>
               <div>
                  <h1 className="text-4xl sm:text-[2.5rem] font-black tracking-tighter text-gray-900 flex items-center gap-3 mb-1">
                    {view === "business" ? "Reporting & Analytics" : "Marketing Performance"}
                    <Badge variant="primary" size="lg" className="hidden sm:flex bg-[#0a9396]/10 text-[#0a9396] border-[#0a9396]/20 py-1.5 px-3">
                      {view === "business" ? "Business" : "Marketing"}
                    </Badge>
                  </h1>
                  <p className="text-gray-500 font-bold tracking-wide">
                    {view === "business" 
                      ? "Track revenue, clients, and project performance in real time." 
                      : "Analyze ad spend, reach, and conversion performance across platforms."}
                  </p>
               </div>
            </div>
          </div>

          <div className="flex bg-gray-100/50 p-1.5 rounded-[1.5rem] border border-gray-200/50 backdrop-blur-md">
            <button
              onClick={() => setView("business")}
              className={`px-6 py-3 rounded-2xl font-black text-sm transition-all ${
                view === "business" 
                  ? "bg-white text-gray-900 shadow-xl shadow-gray-200/50" 
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              Business
            </button>
            <button
              onClick={() => setView("marketing")}
              className={`px-6 py-3 rounded-2xl font-black text-sm transition-all ${
                view === "marketing" 
                  ? "bg-white text-gray-900 shadow-xl shadow-gray-200/50" 
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              Marketing
            </button>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto h-14">
             <Button variant="outline" className="bg-white/50 backdrop-blur border-white hover:bg-white hover:shadow-lg text-gray-700 h-full px-6 rounded-2xl transition-all w-full sm:w-auto font-bold tracking-wide active:scale-95">
               <Calendar className="mr-2 h-5 w-5" />
               Date Range
             </Button>
             <div className="relative">
                <button
                  onClick={() => setShowExportDropdown(!showExportDropdown)}
                  className="group flex items-center gap-2.5 h-11 px-5 rounded-xl bg-[#0a9396] hover:bg-[#087579] text-white text-sm font-semibold shadow-md shadow-[#0a9396]/25 hover:shadow-lg hover:shadow-[#0a9396]/30 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
                >
                  <Download className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
                  Export Report
                  <span className="ml-0.5 opacity-60 text-xs">▾</span>
                </button>

                {showExportDropdown && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="absolute right-0 mt-3 w-56 bg-white/90 backdrop-blur-xl border border-white/60 rounded-2xl shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="p-2">
                       <button 
                         onClick={handleExportPDF}
                         className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 font-bold transition-all group/item"
                       >
                         <div className="p-2 bg-red-50 text-red-500 rounded-lg group-hover/item:bg-red-500 group-hover/item:text-white transition-colors">
                           <FileText className="h-4 w-4" />
                         </div>
                         <span>Export as PDF</span>
                       </button>
                       <button 
                         onClick={handleExportExcel}
                         className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 font-bold transition-all group/item"
                       >
                         <div className="p-2 bg-emerald-50 text-emerald-500 rounded-lg group-hover/item:bg-emerald-500 group-hover/item:text-white transition-colors">
                           <TrendingUp className="h-4 w-4" />
                         </div>
                         <span>Export as Excel</span>
                       </button>
                       <div className="h-px bg-gray-100 my-2 mx-2" />
                       <button 
                         onClick={handleShareReport}
                         disabled={isSharing || projects.length === 0}
                         className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 font-bold transition-all group/item disabled:opacity-50"
                       >
                         <div className="p-2 bg-blue-50 text-blue-500 rounded-lg group-hover/item:bg-blue-500 group-hover/item:text-white transition-colors">
                           <Share2 className="h-4 w-4" />
                         </div>
                         <span>{isSharing ? "Generating..." : "Share Live Link"}</span>
                       </button>
                    </div>
                  </motion.div>
                )}
             </div>
          </div>
        </div>

        {sharedLink && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0a9396] text-white p-6 rounded-[2rem] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6"
          >
             <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl">
                   <Share2 className="h-6 w-6" />
                </div>
                <div>
                   <h3 className="font-black text-lg leading-tight">Live Report Link Generated</h3>
                   <p className="text-white/80 font-medium text-sm">Send this secure link to your client to view real-time performance.</p>
                </div>
             </div>
             <div className="flex items-center gap-2 bg-white/10 p-2 rounded-2xl border border-white/20 w-full md:w-auto">
                <input 
                  readOnly 
                  value={sharedLink} 
                  className="bg-transparent border-none focus:ring-0 text-sm font-mono px-4 w-full md:w-64" 
                />
                <Button 
                  onClick={() => {
                    navigator.clipboard.writeText(sharedLink);
                    alert("Link copied to clipboard!");
                  }}
                  size="sm" 
                  className="bg-white text-[#0a9396] hover:bg-white/90 font-black"
                >
                  Copy Link
                </Button>
                <Button 
                  onClick={() => setSharedLink("")}
                  variant="ghost" 
                  size="sm" 
                  className="text-white hover:bg-white/10"
                >
                  Dismiss
                </Button>
             </div>
          </motion.div>
        )}

        {/* Cinematic Hero Stats Row */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {activeStatsConfig.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div key={stat.label} variants={itemVariants}>
                <div className="border border-white/60 bg-white/40 backdrop-blur-2xl rounded-[2rem] p-6 shadow-[inset_0_2px_15px_rgb(255,255,255,0.7),0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[inset_0_2px_15px_rgb(255,255,255,0.8),0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden group min-h-[160px] flex flex-col justify-between">
                  <div className="flex items-start justify-between mb-2 relative z-10">
                    <p className="text-[12px] font-black text-gray-500 uppercase tracking-widest">{stat.label}</p>
                    <div className={`rounded-xl bg-gradient-to-br ${stat.color} p-2.5 shadow-lg ${stat.glow} group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 relative`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  
                  <div className="relative z-10">
                    <h3 className="text-4xl font-black text-gray-900 tracking-tighter drop-shadow-sm mb-1">
                      {isCurrentlyLoading ? (
                         <span className="text-gray-300 animate-pulse">---</span>
                      ) : formatValue(stat.value, stat.format)}
                    </h3>
                    
                    {!isCurrentlyLoading && stat.change !== 0 ? (
                      <div className="flex items-center gap-2">
                         <span className={`text-[11px] font-black tracking-widest px-2.5 py-1 rounded-lg shadow-sm border ${
                            stat.trend === "up" ? "bg-emerald-500 border-emerald-400 text-white" : "bg-red-500 border-red-400 text-white"
                         }`}>
                           {stat.trend === "up" ? "+" : ""}{stat.change}%
                         </span>
                         <span className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">vs last period</span>
                      </div>
                    ) : (
                      <div className="h-6" /> // spacer
                    )}
                  </div>
                  
                  {/* Subtle Background Glow per card */}
                  <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full blur-[40px] opacity-20 bg-gradient-to-br ${stat.color} group-hover:opacity-30 transition-opacity`} />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Marketing Integration CTA */}
        {view === "marketing" && marketingData && (marketingData.integrations?.length ?? 0) === 0 && !isMarketingLoading && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-1 rounded-[2rem] bg-gradient-to-r from-blue-500/20 via-teal-500/20 to-indigo-500/20 border border-white/60 backdrop-blur-2xl"
          >
            <div className="bg-white/60 rounded-[1.8rem] p-6 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5 text-center md:text-left">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#0a9396] to-blue-500 flex items-center justify-center text-white shadow-lg shrink-0">
                  <Share2 className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 tracking-tight">Connect Your Marketing Ecosystem</h3>
                  <p className="text-gray-500 font-bold text-sm mt-1">Directly hook into Google, Meta, and LinkedIn to pull live performance data.</p>
                </div>
              </div>
              <Button 
                onClick={() => window.location.href = '/pro/settings?activeTab=integrations'}
                className="bg-gray-900 hover:bg-black text-white px-8 h-12 rounded-xl font-bold shadow-lg shadow-gray-200 shrink-0"
              >
                Go to Integrations
              </Button>
            </div>
          </motion.div>
        )}

        {/* Primary Dashboards Layer */}
        <motion.div 
           variants={containerVariants} 
           initial="hidden" 
           animate="show" 
           className="grid grid-cols-1 xl:grid-cols-3 gap-8"
        >
          {/* Revenue Span Graph / Marketing Reach */}
          <motion.div variants={itemVariants} className="xl:col-span-2">
            <div className="border border-white/60 bg-white/40 backdrop-blur-2xl rounded-[2.5rem] shadow-[inset_0_2px_15px_rgb(255,255,255,0.7),0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-xl transition-all overflow-hidden h-full flex flex-col relative group/chart">
               <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
               <div className="p-8 pb-4 relative z-10 flex justify-between items-start">
                 <div>
                   <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                     {view === "business" ? "Revenue & Profit" : "Reach & Engagement"} <span className={`w-2 h-2 rounded-full ${isCurrentlyLoading ? 'bg-amber-400' : 'bg-emerald-400'} animate-pulse`} />
                   </h2>
                   <p className="text-sm font-bold text-gray-500 tracking-wide mt-1">
                     {view === "business" ? "Last 6 months" : "Daily Performance Trends"}
                   </p>
                 </div>
                 <div className="hidden sm:flex bg-white/60 p-1.5 rounded-xl border border-white gap-2 shadow-sm font-bold tracking-widest text-[10px] uppercase text-gray-400">
                    {view === "business" ? (
                      <>
                        <div className="flex items-center gap-1.5 px-2"><div className="w-2 h-2 rounded bg-emerald-500" /> Revenue</div>
                        <div className="flex items-center gap-1.5 px-2"><div className="w-2 h-2 rounded bg-slate-400" /> Profit</div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-1.5 px-2"><div className="w-2 h-2 rounded bg-blue-500" /> Impressions</div>
                        <div className="flex items-center gap-1.5 px-2"><div className="w-2 h-2 rounded bg-emerald-500" /> Clicks</div>
                      </>
                    )}
                 </div>
               </div>
               
               <div className="p-8 pt-0 flex-1 relative z-10">
                {((view === "business" && chartData.revenueData.length > 0) || (view === "marketing" && (marketingData?.chartData?.length ?? 0) > 0)) ? (
                  <div className="h-[360px] w-full mt-4">
                    <Chart
                      data={view === "business" ? chartData.revenueData : (marketingData?.chartData || [])}
                      type="area"
                      dataKey={view === "business" ? "month" : "date"}
                      dataKeys={view === "business" ? ["revenue", "profit"] : ["impressions", "clicks"]}
                      colors={view === "business" ? ["#10b981", "#94a3b8"] : ["#3b82f6", "#10b981"]}
                    />
                  </div>
                ) : (
                  <div className="h-[360px] w-full flex items-center justify-center bg-gray-50/40 rounded-3xl border border-dashed border-gray-300 mt-4">
                    <p className="text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 animate-bounce" /> {isCurrentlyLoading ? "Loading data..." : "No data available"}
                    </p>
                  </div>
                )}
               </div>
            </div>
          </motion.div>

          {/* Client Metrics / Platform Spend */}
          <motion.div variants={itemVariants}>
            <div className="border border-white/60 bg-white/40 backdrop-blur-2xl rounded-[2.5rem] shadow-[inset_0_2px_15px_rgb(255,255,255,0.7),0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-xl transition-all overflow-hidden h-full flex flex-col relative">
               <div className="absolute -top-32 -right-32 w-64 h-64 bg-amber-500/10 blur-[60px] rounded-full pointer-events-none" />
               <div className="p-8 pb-4 relative z-10">
                 <h2 className="text-xl font-black text-gray-900 tracking-tight">
                   {view === "business" ? "Client Growth" : "Ad Spend"}
                 </h2>
                 <p className="text-xs font-bold text-gray-500 tracking-widest uppercase mt-1">
                   {view === "business" ? "New clients over time" : "Cumulative Spend"}
                 </p>
               </div>
               
               <div className="p-8 pt-0 flex-1 relative z-10">
                {((view === "business" && chartData.clientGrowthData.length > 0) || (view === "marketing" && (marketingData?.chartData?.length ?? 0) > 0)) ? (
                  <div className="h-[360px] w-full mt-4">
                    <Chart
                      data={view === "business" ? chartData.clientGrowthData : (marketingData?.chartData || [])}
                      type={view === "business" ? "line" : "area"}
                      dataKey={view === "business" ? "month" : "date"}
                      dataKeys={view === "business" ? ["clients"] : ["spend"]}
                      colors={[view === "business" ? "#f59e0b" : "#6366f1"]}
                    />
                  </div>
                ) : (
                  <div className="h-[360px] w-full flex items-center justify-center bg-gray-50/40 rounded-3xl border border-dashed border-gray-300 mt-4">
                    <p className="text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                      <Users className="w-4 h-4 animate-bounce" /> {isCurrentlyLoading ? "Loading data..." : "No data available"}
                    </p>
                  </div>
                )}
               </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Secondary Dashboard Intelligence Segment */}
        <motion.div 
           variants={containerVariants} 
           initial="hidden" 
           animate="show" 
           className="grid grid-cols-1 xl:grid-cols-2 gap-8"
        >
          {/* Machine Learning Insight Readouts */}
          <motion.div variants={itemVariants}>
            <div className="border border-white/60 bg-white/40 backdrop-blur-2xl rounded-[2.5rem] shadow-[inset_0_2px_15px_rgb(255,255,255,0.7),0_8px_30px_rgb(0,0,0,0.03)] transition-all h-full flex flex-col overflow-hidden relative group/insights">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0a9396]/5 to-transparent pointer-events-none opacity-0 group-hover/insights:opacity-100 transition-opacity duration-700" />
              
              <div className="p-8 border-b border-white/60 bg-white/20 relative z-10">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl shadow-md rotate-3 text-white">
                    <FileText className="h-5 w-5" />
                  </div>
                  Key Insights
                </h2>
                <p className="text-sm font-bold text-gray-500 mt-2 tracking-wide">AI-powered analysis of your performance.</p>
              </div>

              <div className="p-8 flex-1 bg-white/10 relative z-10 space-y-6">
                {/* AI Alerts Section */}
                {view === "marketing" && alerts.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-red-500 uppercase tracking-widest flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                      Critical Anomalies Detected
                    </h3>
                    {alerts.map((alert, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-5 rounded-2xl bg-red-50 border border-red-100 flex gap-4 items-start shadow-sm"
                      >
                        <div className="p-2 bg-red-500 text-white rounded-xl shadow-lg">
                          <Activity className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 leading-snug">{alert.message}</p>
                          <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mt-2">Action Required</p>
                        </div>
                      </motion.div>
                    ))}
                    <div className="h-px bg-gray-100 w-full my-6" />
                  </div>
                )}

                {/* Simulated AI "Scanning" Line */}
                <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden absolute top-0 left-0">
                   {isCurrentlyLoading ? (
                     <motion.div className="h-full bg-[#0a9396] w-1/3" animate={{ x: ['0%', '200%']}} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} />
                   ) : (
                     <div className="h-full bg-emerald-400 w-full" />
                   )}
                </div>

                {view === "business" ? (
                  <>
                    {stats.revenueChange !== 0 && (
                      <div className="p-6 rounded-3xl bg-white flex gap-5 border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative group/insight-card">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-transparent opacity-0 group-hover/insight-card:opacity-100 transition-opacity rounded-3xl" />
                        <div className="shrink-0 p-3 h-max bg-emerald-100/50 rounded-2xl relative z-10">
                           <TrendingUp className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div className="relative z-10">
                           <h4 className="font-extrabold text-gray-900 text-[17px] mb-1 leading-tight tracking-tight">Revenue Performance</h4>
                           <p className="text-[14px] text-gray-600 font-medium leading-relaxed">
                              Your revenue has <strong>{stats.revenueChange > 0 ? "increased" : "decreased"}</strong> by{" "}
                              <span className={`${stats.revenueChange > 0 ? 'text-emerald-600' : 'text-red-600'} font-bold`}>{Math.abs(stats.revenueChange)}%</span> compared to last period.
                           </p>
                        </div>
                      </div>
                    )}
                    {stats.activeClients > 0 && (
                      <div className="p-6 rounded-3xl bg-white flex gap-5 border border-white/80 shadow-[0_8px_30_rgb(0,0,0,0.02)] hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative group/insight-card">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-transparent opacity-0 group-hover/insight-card:opacity-100 transition-opacity rounded-3xl" />
                        <div className="shrink-0 p-3 h-max bg-blue-100/50 rounded-2xl relative z-10">
                           <Users className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="relative z-10">
                           <h4 className="font-extrabold text-gray-900 text-[17px] mb-1 leading-tight tracking-tight">Client Overview</h4>
                           <p className="text-[14px] text-gray-600 font-medium leading-relaxed">
                             You currently have <strong>{stats.activeClients} active client{stats.activeClients !== 1 ? "s" : ""}</strong> tracking well.
                           </p>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {marketingData && marketingData.totals.impressions > 0 && (
                      <div className="p-6 rounded-3xl bg-white flex gap-5 border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative group/insight-card">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-transparent opacity-0 group-hover/insight-card:opacity-100 transition-opacity rounded-3xl" />
                        <div className="shrink-0 p-3 h-max bg-blue-100/50 rounded-2xl relative z-10">
                           <Activity className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="relative z-10">
                           <h4 className="font-extrabold text-gray-900 text-[17px] mb-1 leading-tight tracking-tight">Reach & Awareness</h4>
                           <p className="text-[14px] text-gray-600 font-medium leading-relaxed">
                              Your content has reached <strong>{marketingData.totals.impressions.toLocaleString()}</strong> people.
                              {marketingData.totals.clicks > 0 && (
                                <span> With a CTR of <strong>{((marketingData.totals.clicks / marketingData.totals.impressions) * 100).toFixed(2)}%</strong>, your engagement is tracking well.</span>
                              )}
                           </p>
                        </div>
                      </div>
                    )}
                    {marketingData && marketingData.totals.spend > 0 && (
                      <div className="p-6 rounded-3xl bg-white flex gap-5 border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative group/insight-card">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-transparent opacity-0 group-hover/insight-card:opacity-100 transition-opacity rounded-3xl" />
                        <div className="shrink-0 p-3 h-max bg-purple-100/50 rounded-2xl relative z-10">
                           <DollarSign className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="relative z-10">
                           <h4 className="font-extrabold text-gray-900 text-[17px] mb-1 leading-tight tracking-tight">Ad Efficiency</h4>
                           <p className="text-[14px] text-gray-600 font-medium leading-relaxed">
                              You&apos;ve spent <strong>£{marketingData.totals.spend.toLocaleString()}</strong> on advertising.
                              {marketingData.totals.clicks > 0 && (
                                <span> Your average CPC is <strong>£{(marketingData.totals.spend / marketingData.totals.clicks).toFixed(2)}</strong>.</span>
                              )}
                           </p>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {!isCurrentlyLoading && !marketingData?.totals.impressions && view === "marketing" && (
                   <div className="h-full flex flex-col justify-center items-center text-center p-8 bg-white/40 rounded-3xl border border-dashed border-gray-300 relative overflow-hidden group/empty">
                     <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 border border-white shadow-sm group-hover/empty:scale-110 transition-transform">
                       <PieChart className="w-8 h-8 text-gray-400" />
                     </div>
                     <h3 className="text-gray-900 font-black text-xl mb-2">No Marketing Data</h3>
                     <p className="text-gray-500 font-medium max-w-[250px] leading-relaxed">Connect your ad accounts in Settings to see performance insights here.</p>
                   </div>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col gap-8">
            {/* Third Chart: Project states (Pie Chart) */}
            <div className="border border-white/60 bg-white/40 backdrop-blur-2xl rounded-[2.5rem] shadow-[inset_0_2px_15px_rgb(255,255,255,0.7),0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-xl transition-all overflow-hidden h-[380px] flex flex-col relative group/pie">
               <div className="absolute inset-0 bg-gradient-to-t from-white/30 to-transparent pointer-events-none" />
               <div className="p-8 pb-0 relative z-10">
                 <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center justify-between">
                   {view === "business" ? "Project Status" : "Platform Share"}
                   <button className="origin-right scale-75 md:scale-100 min-w-max shrink-0 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors uppercase tracking-widest text-[10px] text-gray-500 font-bold active:scale-95">Expand</button>
                 </h2>
               </div>
               
               <div className="p-8 flex-1 relative z-10 flex items-center justify-center">
                {((view === "business" && chartData.projectStatusData.length > 0) || (view === "marketing" && (marketingData?.platformData?.length ?? 0) > 0)) ? (
                  <div className="h-full w-full max-h-[220px]">
                    <Chart
                      data={view === "business" ? chartData.projectStatusData : (marketingData?.platformData || []).map(p => ({ name: p.provider, value: p._sum.impressions }))}
                      type="pie"
                      dataKey="name"
                      dataKeys={["value"]}
                      colors={["#0a9396", "#3b82f6", "#f59e0b", "#6366f1", "#10b981"]}
                    />
                  </div>
                ) : (
                  <div className="h-full w-full flex flex-col items-center justify-center bg-gray-50/40 rounded-3xl border border-dashed border-gray-300">
                    <PieChart className="w-8 h-8 text-gray-300 mb-2" />
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No data yet</p>
                  </div>
                )}
               </div>
            </div>

            {/* Offline Export Panel */}
            <div className="border border-white/60 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2.5rem] p-8 shadow-[0_20px_40px_rgb(99,102,241,0.2)] hover:shadow-[0_20px_50px_rgb(99,102,241,0.4)] hover:-translate-y-1 transition-all flex flex-col justify-between relative overflow-hidden group/pdf">
               <div className="absolute -top-32 -left-32 w-64 h-64 bg-white/20 blur-[50px] rounded-full group-hover/pdf:scale-150 transition-transform duration-700 ease-out" />
               <div className="absolute bottom-0 right-0 p-8 transform translate-x-10 translate-y-10 group-hover/pdf:translate-x-0 group-hover/pdf:translate-y-0 opacity-10 group-hover/pdf:opacity-20 transition-all duration-700">
                  <PieChart className="w-48 h-48 text-white" />
               </div>

               <div className="relative z-10 mb-6">
                 <div className="inline-flex items-center justify-center p-3.5 bg-white/10 rounded-2xl mb-5 text-white backdrop-blur-md shadow-inner border border-white/20">
                    <TrendingUp className="w-7 h-7" />
                 </div>
                 <h2 className="text-2xl font-black text-white tracking-tight mb-2 flex items-center gap-3">
                   Connect Google Analytics
                   <div className="relative flex h-3 w-3">
                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-40"></span>
                     <span className="relative inline-flex rounded-full h-3 w-3 bg-white/80"></span>
                   </div>
                 </h2>
                 <p className="text-indigo-100 font-medium leading-relaxed max-w-[350px]">
                    Connect your Google Analytics account to pull live site traffic, conversions, and audience data directly into your dashboard.
                 </p>
               </div>

               <div className="relative z-10 mt-auto">
                 <button className="w-full bg-white text-indigo-600 font-black h-14 rounded-2xl shadow-xl hover:shadow-[0_0_30px_rgb(255,255,255,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98] tracking-wide text-[15px] flex items-center justify-center group/btn">
                    <span>Connect GA4</span>
                    <TrendingUp className="ml-2 w-4 h-4 group-hover/btn:rotate-45 transition-transform" />
                 </button>
               </div>
            </div>
          </motion.div>
        </motion.div>

       </div>
    </div>
  );
}
