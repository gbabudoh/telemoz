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
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

const reports = [
  {
    id: 1,
    projectId: 1,
    projectName: "Q4 Social Media Campaign",
    pro: "Digital Marketing Pro",
    period: "October – December 2024",
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
    projectName: "SEO Optimisation",
    pro: "SEO Experts Ltd",
    period: "November – December 2024",
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
    period: "September – November 2024",
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

const statsConfig = [
  { label: "Total Traffic", value: overallStats.totalTraffic.toLocaleString(), icon: Activity },
  { label: "Total Leads", value: overallStats.totalLeads.toLocaleString(), icon: Users },
  { label: "Conversions", value: overallStats.totalConversions.toLocaleString(), icon: Target },
  { label: "Total Revenue", value: formatCurrency(overallStats.totalRevenue), icon: DollarSign },
  { label: "Avg. ROAS", value: `${overallStats.avgROAS}x`, icon: BarChart3 },
  { label: "Active Projects", value: overallStats.activeProjects, icon: TrendingUp },
];

export default function ClientReportsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
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
    await new Promise(r => setTimeout(r, 1200));
    setIsExporting(false);
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  const handleDownloadPDF = async (id: number) => {
    setDownloadingId(id);
    await new Promise(r => setTimeout(r, 1200));
    setDownloadingId(null);
    window.print();
  };

  const panelClass = "bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl shadow-sm overflow-hidden";

  return (
    <div className="relative min-h-screen bg-transparent">
      {/* Ambient orbs */}
      <div className="fixed top-[-5%] left-[-10%] w-[45%] h-[45%] rounded-full bg-[#0a9396]/10 blur-[130px] pointer-events-none mix-blend-multiply animate-pulse z-0" />
      <div className="fixed top-[15%] right-[-5%] w-[40%] h-[40%] rounded-full bg-[#6ece39]/8 blur-[140px] pointer-events-none mix-blend-multiply z-0" />
      <div className="fixed bottom-[-5%] left-[15%] w-[50%] h-[40%] rounded-full bg-[#0a9396]/8 blur-[130px] pointer-events-none mix-blend-multiply opacity-60 animate-pulse z-0" />

      <div className="space-y-8 relative z-10 max-w-[1700px] mx-auto pb-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={panelClass}
        >
          <div className="p-8 lg:p-10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="p-3.5 rounded-2xl bg-[#0a9396]/10 border border-[#0a9396]/20 shrink-0">
                  <BarChart3 className="h-8 w-8 text-[#0a9396]" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                    Reports & Analytics
                  </h1>
                  <p className="text-gray-500 text-sm mt-0.5 max-w-xl">
                    Performance data across all your active and completed campaigns.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <AnimatePresence>
                  {exportSuccess && (
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="flex items-center gap-2 text-sm text-[#5ab830] font-medium"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Exported successfully
                    </motion.div>
                  )}
                </AnimatePresence>
                <button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="px-6 py-3 rounded-xl bg-[#0a9396] hover:bg-[#087579] text-white font-semibold text-sm shadow-sm transition-all cursor-pointer flex items-center gap-2 disabled:opacity-60 h-fit"
                >
                  {isExporting ? (
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  Export All
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {statsConfig.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * idx }}
              className={`${panelClass} p-5 group hover:-translate-y-1 transition-transform duration-300`}
            >
              <div className="p-2.5 rounded-xl bg-linear-to-br from-[#0a9396]/10 to-[#6ece39]/10 w-fit mb-3">
                <stat.icon className="h-4 w-4 text-[#0a9396]" />
              </div>
              <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
              <p className="text-xl font-bold text-gray-900">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={panelClass}
        >
          <div className="p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-linear-to-br from-[#0a9396]/10 to-[#6ece39]/10">
                  <BarChart3 className="h-5 w-5 text-[#0a9396]" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">Performance Overview</h3>
                  <p className="text-xs text-gray-400">Across all projects</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#0a9396]" />
                  <span className="text-xs text-gray-400">Traffic</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#6ece39]" />
                  <span className="text-xs text-gray-400">Leads</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#087579]" />
                  <span className="text-xs text-gray-400">Conversions</span>
                </div>
              </div>
            </div>
            <div className="h-80">
              <Chart
                data={chartData}
                type="area"
                dataKey="month"
                dataKeys={["traffic", "leads", "conversions"]}
                className="border-none bg-transparent shadow-none"
                colors={["#0a9396", "#6ece39", "#087579"]}
              />
            </div>
          </div>
        </motion.div>

        {/* Search & Filter */}
        <div className={panelClass}>
          <div className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-300 group-focus-within:text-[#0a9396] transition-colors" />
                <input
                  placeholder="Search by project name or pro..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/60 focus:bg-white border border-gray-100 py-3 pl-11 pr-4 rounded-xl text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#0a9396]/20 transition-all placeholder:text-gray-300"
                />
              </div>
              <div className="flex items-center gap-2">
                {["all", "active", "completed"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2.5 rounded-xl transition-all text-xs font-medium capitalize cursor-pointer ${
                      statusFilter === status
                        ? "bg-[#0a9396] text-white shadow-sm"
                        : "text-gray-500 hover:text-gray-700 border border-gray-100 bg-white/60"
                    }`}
                  >
                    {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Report cards */}
        <AnimatePresence mode="popLayout">
          {filteredReports.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`${panelClass} p-16 text-center flex flex-col items-center`}
            >
              <div className="h-14 w-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
                <FileText className="h-7 w-7 text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">No reports found</h3>
              <p className="text-gray-500 text-sm">No reports match your current search or filter.</p>
            </motion.div>
          ) : (
            <div className="flex flex-col gap-5">
              {filteredReports.map((report, index) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  layout
                  className={`${panelClass} hover:shadow-md hover:border-[#0a9396]/20 transition-all duration-300 group`}
                >
                  <div className="p-6 lg:p-8 flex flex-col lg:flex-row gap-8 items-start lg:items-center">

                    {/* Report info */}
                    <div className="flex-1 space-y-5 min-w-0">
                      <div>
                        <div className="flex flex-wrap items-center gap-2.5 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#0a9396] transition-colors">{report.projectName}</h3>
                          <div className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${
                            report.status === "active"
                              ? "bg-[#6ece39]/10 text-[#5ab830] border-[#6ece39]/20"
                              : "bg-[#0a9396]/10 text-[#0a9396] border-[#0a9396]/20"
                          }`}>
                            {report.status}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1.5">
                            <Users className="h-3.5 w-3.5 text-[#0a9396]" />
                            {report.pro}
                          </div>
                          <div className="w-1 h-1 rounded-full bg-gray-200" />
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-gray-400" />
                            {report.period}
                          </div>
                        </div>
                      </div>

                      {/* Metrics */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                        {[
                          { label: "Traffic", value: report.metrics.traffic.toLocaleString(), icon: Activity },
                          { label: "Leads", value: report.metrics.leads.toLocaleString(), icon: Target },
                          { label: "Conversions", value: report.metrics.conversions.toLocaleString(), icon: Zap },
                          { label: "Revenue", value: formatCurrency(report.metrics.revenue), icon: DollarSign },
                          { label: "ROAS", value: `${report.metrics.roas}x`, icon: TrendingUp },
                        ].map((m) => (
                          <div key={m.label} className="p-3.5 rounded-xl bg-gray-50/80 border border-gray-100 space-y-1">
                            <div className="flex items-center justify-between">
                              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{m.label}</p>
                              <m.icon className="h-3 w-3 text-gray-300" />
                            </div>
                            <p className="text-base font-semibold text-gray-900">{m.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="lg:w-48 w-full flex-shrink-0 flex flex-col gap-2.5">
                      <Link href={`/client/reports/${report.projectId}`}>
                        <button className="w-full h-11 rounded-xl bg-white border border-gray-200 hover:border-[#0a9396]/30 text-gray-700 hover:text-gray-900 font-medium text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer">
                          <Eye className="h-4 w-4" />
                          View Report
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDownloadPDF(report.id)}
                        disabled={downloadingId !== null}
                        className="w-full h-11 rounded-xl bg-[#0a9396] hover:bg-[#087579] text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                      >
                        {downloadingId === report.id ? (
                          <>
                            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Preparing...
                          </>
                        ) : (
                          <>
                            <Download className="h-4 w-4" />
                            Download PDF
                          </>
                        )}
                      </button>
                      <Link href="/client/projects" className="text-center">
                        <span className="text-xs text-gray-400 hover:text-[#0a9396] cursor-pointer transition-colors flex items-center justify-center gap-1.5 group/prj">
                          View Project
                          <ArrowRight className="h-3 w-3 group-hover/prj:translate-x-0.5 transition-transform" />
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
