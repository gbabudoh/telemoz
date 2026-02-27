"use client";

import { Chart } from "@/components/ui/Chart";
import {
  TrendingUp,
  Download,
  Calendar,
  Search,
  FileText,
  Eye,
  BarChart3,
  ArrowRight,
  Users,
  DollarSign,
  Target,
  Activity,
  Zap,
  Layout
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { formatCurrency } from "@/lib/utils";

const reports = [
  {
    id: 1,
    projectId: 1,
    projectName: "Q4 Social Media Campaign",
    pro: "Digital Marketing Pro",
    period: "October - December 2024",
    generatedDate: "2024-12-10",
    status: "active",
    metrics: {
      traffic: 45000,
      leads: 1570,
      conversions: 445,
      revenue: 12500,
      roas: 4.2,
    },
  },
  {
    id: 2,
    projectId: 2,
    projectName: "SEO Optimization",
    pro: "SEO Experts Ltd",
    period: "November - December 2024",
    generatedDate: "2024-12-05",
    status: "active",
    metrics: {
      traffic: 32000,
      leads: 980,
      conversions: 245,
      revenue: 8500,
      roas: 3.8,
    },
  },
  {
    id: 3,
    projectId: 3,
    projectName: "Email Marketing Campaign",
    pro: "Digital Marketing Pro",
    period: "September - November 2024",
    generatedDate: "2024-11-30",
    status: "completed",
    metrics: {
      traffic: 28000,
      leads: 1200,
      conversions: 380,
      revenue: 9500,
      roas: 4.5,
    },
  },
];

const overallStats = {
  totalTraffic: 105000,
  totalLeads: 3750,
  totalConversions: 1070,
  totalRevenue: 30500,
  avgROAS: 4.2,
  activeProjects: 2,
};

const chartData = [
  { month: "Oct", traffic: 22000, leads: 380, conversions: 120 },
  { month: "Nov", traffic: 28000, leads: 520, conversions: 145 },
  { month: "Dec", traffic: 35000, leads: 600, conversions: 180 },
  { month: "Jan", traffic: 45000, leads: 750, conversions: 210 },
];

export default function ClientReportsPage() {
  useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isExporting, setIsExporting] = useState(false);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.pro.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExport = async () => {
    setIsExporting(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsExporting(false);
    alert("Global Intelligence Export Successful. Archives synchronized.");
  };

  const handleDownloadPDF = async (id: number) => {
    setDownloadingId(id);
    // Simulate data preparation
    await new Promise(r => setTimeout(r, 1200));
    setDownloadingId(null);
    window.print();
  };

  return (
    <div className="relative min-h-screen bg-transparent">
      {/* Ambient Animated Orbs */}
      <div className="fixed top-[-5%] left-[-10%] w-[45%] h-[45%] rounded-full bg-[#0a9396]/10 blur-[130px] pointer-events-none mix-blend-multiply animate-pulse z-0" />
      <div className="fixed top-[15%] right-[-5%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[140px] pointer-events-none mix-blend-multiply animate-pulse-slow z-0" />
      <div className="fixed bottom-[-5%] left-[15%] w-[50%] h-[40%] rounded-full bg-teal-400/10 blur-[130px] pointer-events-none mix-blend-multiply opacity-60 animate-pulse z-0" />

      <div className="space-y-10 relative z-10 max-w-[1700px] mx-auto pb-12">
        {/* Glassmorphic Command Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/40 backdrop-blur-2xl border border-white rounded-[2.5rem] p-8 lg:p-10 shadow-[inset_0_2px_15px_rgb(255,255,255,0.7),0_10px_30px_rgb(0,0,0,0.03)] overflow-hidden relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a9396]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-2 w-2 rounded-full bg-[#0a9396] animate-ping" />
                <span className="text-[10px] font-black text-[#0a9396] tracking-[0.3em] uppercase">Intelligence Archive Active</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight leading-tight uppercase mb-2">
                Reports <span className="bg-gradient-to-r from-[#0a9396] to-indigo-600 bg-clip-text text-transparent">&</span> Analytics
              </h1>
              <p className="text-gray-500 font-bold tracking-tight text-[15px] max-w-2xl">
                Real-time performance telemetry and historical data synchronization for all active and completed mission vectors.
              </p>
            </div>
            <button 
              onClick={handleExport}
              disabled={isExporting}
              className="px-8 py-4 rounded-2xl bg-gray-900 hover:bg-black text-white font-black tracking-[0.1em] text-[13px] shadow-xl shadow-gray-900/20 transition-all cursor-pointer flex items-center gap-3 disabled:opacity-50 h-fit"
            >
              {isExporting ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              EXPORT GLOBAL MATRIX
            </button>
          </div>
        </motion.div>

        {/* Intelligence Ribbon (Stats) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: "Gross Traffic", value: overallStats.totalTraffic.toLocaleString(), icon: Activity, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Net Leads", value: overallStats.totalLeads.toLocaleString(), icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Conversions", value: overallStats.totalConversions.toLocaleString(), icon: Target, color: "text-purple-600", bg: "bg-purple-50" },
            { label: "Net Revenue", value: formatCurrency(overallStats.totalRevenue), icon: DollarSign, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "Avg ROAS", value: `${overallStats.avgROAS}x`, icon: BarChart3, color: "text-[#0a9396]", bg: "bg-teal-50" },
            { label: "Active Vectors", value: overallStats.activeProjects, icon: Layout, color: "text-indigo-600", bg: "bg-indigo-50" },
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * idx }}
              className="bg-white/40 backdrop-blur-xl border border-white rounded-[2rem] p-6 shadow-[inset_0_2px_15px_rgb(255,255,255,0.7),0_5px_15px_rgb(0,0,0,0.02)] group hover:-translate-y-1 transition-transform duration-300"
            >
              <div className={`w-10 h-10 rounded-xl ${stat.bg} border border-white/50 flex items-center justify-center mb-4 shadow-sm`}>
                <stat.icon className={`h-5 w-5 ${stat.color} group-hover:scale-110 transition-transform`} />
              </div>
              <p className="text-[10px] font-black text-gray-400 tracking-[0.1em] uppercase mb-1">{stat.label}</p>
              <p className="text-xl font-black text-gray-900 tracking-tight">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Evolutionary Trends Visualizer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/40 backdrop-blur-3xl border border-white rounded-[3rem] p-8 lg:p-10 shadow-[inset_0_2px_15px_rgb(255,255,255,0.7),0_20px_50px_rgb(0,0,0,0.05)]"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-900 rounded-2xl shadow-lg">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase">Network Performance</h3>
                <p className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase">Cross-Project Synchronized Flux</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0a9396]" />
                <span className="text-[10px] font-black text-gray-400 uppercase">Traffic</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                <span className="text-[10px] font-black text-gray-400 uppercase">Leads</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#6366f1]" />
                <span className="text-[10px] font-black text-gray-400 uppercase">Conv.</span>
              </div>
            </div>
          </div>
          <div className="h-[350px]">
            <Chart
              data={chartData}
              type="area"
              dataKey="month"
              dataKeys={["traffic", "leads", "conversions"]}
              className="border-none bg-transparent shadow-none"
              colors={["#0a9396", "#10b981", "#6366f1"]}
            />
          </div>
        </motion.div>

        {/* Intelligence Search & Filter */}
        <div className="bg-white/30 backdrop-blur-3xl border border-white/50 rounded-[2rem] p-4 lg:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0a9396] transition-colors" />
              <input
                placeholder="Search report vectors by mission name or specialist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/50 border border-gray-100 p-4 pl-12 rounded-2xl outline-none focus:ring-4 focus:ring-[#0a9396]/10 focus:border-[#0a9396]/20 font-bold transition-all placeholder:text-gray-300"
              />
            </div>
            <div className="flex p-1 bg-white/50 rounded-2xl border border-gray-100 gap-1 h-fit my-auto">
              {["all", "active", "completed"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-6 py-3 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest cursor-pointer ${
                    statusFilter === status 
                      ? "bg-gray-900 text-white shadow-lg" 
                      : "text-gray-400 hover:text-gray-900"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Reports Telemetry Deck */}
        <AnimatePresence mode="popLayout">
          {filteredReports.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white/40 backdrop-blur-xl border border-white rounded-[3rem] p-20 text-center"
            >
              <FileText className="h-20 w-20 text-gray-200 mx-auto mb-6 animate-pulse" />
              <h3 className="text-2xl font-black text-gray-900 uppercase mb-2">Matrix Clean</h3>
              <p className="text-gray-500 font-bold">No matching intelligence vectors found in current repository.</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {filteredReports.map((report, index) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  layout
                  className="bg-white/40 backdrop-blur-2xl border border-white rounded-[2.5rem] p-8 lg:p-10 shadow-[inset_0_2px_15px_rgb(255,255,255,0.7),0_10px_25px_rgb(0,0,0,0.03)] group hover:border-[#0a9396]/40 transition-all duration-500"
                >
                  <div className="flex flex-col lg:flex-row gap-10 items-center">
                    {/* Left Pane - Mission Specs */}
                    <div className="flex-1 space-y-6">
                      <div>
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <h3 className="text-2xl font-black text-gray-900 tracking-tight uppercase group-hover:text-[#0a9396] transition-colors">{report.projectName}</h3>
                          <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border ${
                            report.status === "active" 
                              ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                              : "bg-indigo-50 text-indigo-600 border-indigo-100"
                          }`}>
                            {report.status}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-gray-500 font-bold text-sm">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 opacity-50 text-[#0a9396]" />
                            {report.pro}
                          </div>
                          <div className="w-1 h-1 rounded-full bg-gray-200" />
                          <div className="flex items-center gap-2 text-gray-400">
                            <Calendar className="h-4 w-4 opacity-50" />
                            {report.period}
                          </div>
                        </div>
                      </div>

                      {/* Telemetry Metrics Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {[
                          { label: "Traffic", value: report.metrics.traffic.toLocaleString(), icon: Activity },
                          { label: "Leads", value: report.metrics.leads.toLocaleString(), icon: Target },
                          { label: "Conv.", value: report.metrics.conversions.toLocaleString(), icon: Zap },
                          { label: "Revenue", value: formatCurrency(report.metrics.revenue), icon: DollarSign },
                          { label: "ROAS", value: `${report.metrics.roas}x`, icon: TrendingUp },
                        ].map((m) => (
                          <div key={m.label} className="p-4 rounded-2xl bg-white/50 border border-white/80 shadow-sm space-y-1 group/met transition-all hover:bg-white">
                            <div className="flex items-center justify-between text-[10px] font-black text-gray-300 uppercase tracking-wider">
                              {m.label}
                              <m.icon className="h-3 w-3 opacity-30 group-hover/met:text-[#0a9396] group-hover/met:opacity-100 transition-all" />
                            </div>
                            <p className="text-lg font-black text-gray-900 tracking-tight">{m.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right Pane - Action Deck */}
                    <div className="lg:w-60 w-full flex-shrink-0 flex flex-col gap-3">
                      <Link href={`/client/reports/${report.projectId}`}>
                        <button className="w-full h-14 rounded-2xl bg-white border border-gray-100 text-gray-900 font-black uppercase tracking-[0.2em] text-[10px] shadow-sm hover:border-[#0a9396]/30 hover:bg-white transition-all group/act flex items-center justify-center gap-3 cursor-pointer">
                          <Eye className="h-4 w-4 group-hover/act:scale-110 transition-transform" />
                          Live Intel
                        </button>
                      </Link>
                      <button 
                        onClick={() => handleDownloadPDF(report.id)}
                        disabled={downloadingId !== null}
                        className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
                      >
                        {downloadingId === report.id ? (
                          <>
                            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            PREPARING...
                          </>
                        ) : (
                          <>
                            <Download className="h-4 w-4" />
                            Download PDF
                          </>
                        )}
                      </button>
                      <Link href={`/client/projects`} className="text-center">
                        <span className="text-[10px] font-black text-gray-400 hover:text-[#0a9396] uppercase tracking-widest cursor-pointer transition-colors flex items-center justify-center gap-2 group/prj">
                          Vector Status
                          <ArrowRight className="h-3 w-3 group-hover/prj:translate-x-1 transition-transform" />
                        </span>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
