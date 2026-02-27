"use client";


import { Chart } from "@/components/ui/Chart";
import { 
  Download, 
  Calendar, 
  TrendingUp, 
  Target, 
  BarChart3, 
  ArrowUpRight, 
  ShieldCheck,
  Zap,
  Activity
} from "lucide-react";
import { use, useState } from "react";
import { motion } from "framer-motion";

export default function ClientReportPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  const [isDownloading, setIsDownloading] = useState(false);

  // Mock report data
  const reportData = [
    { month: "Jan", traffic: 12000, leads: 450, conversions: 120 },
    { month: "Feb", traffic: 15000, leads: 520, conversions: 145 },
    { month: "Mar", traffic: 18000, leads: 600, conversions: 180 },
    { month: "Apr", traffic: 22000, leads: 750, conversions: 210 },
    { month: "May", traffic: 28000, leads: 920, conversions: 285 },
  ];

  const handleDownload = async () => {
    setIsDownloading(true);
    await new Promise(r => setTimeout(r, 2000));
    setIsDownloading(false);
    alert("Report Matrix Synchronized. PDF ready for local uplink.");
  };

  return (
    <div className="relative min-h-screen bg-transparent">
      {/* Ambient Animated Orbs */}
      <div className="fixed top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-[#0a9396]/10 blur-[130px] pointer-events-none mix-blend-multiply animate-pulse z-0" />
      <div className="fixed top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-400/10 blur-[140px] pointer-events-none mix-blend-multiply animate-pulse-slow z-0" />
      <div className="fixed bottom-[-10%] left-[20%] w-[45%] h-[45%] rounded-full bg-emerald-400/10 blur-[130px] pointer-events-none mix-blend-multiply opacity-70 animate-pulse z-0" />

      <div className="space-y-10 relative z-10 max-w-[1600px] mx-auto pb-12">
        {/* Cinematic Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/40 backdrop-blur-2xl border border-white rounded-[2.5rem] p-8 lg:p-10 shadow-[inset_0_2px_15px_rgb(255,255,255,0.7),0_10px_30px_rgb(0,0,0,0.03)] overflow-hidden relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a9396]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
            <div className="flex items-center gap-6">
              <div className="p-4 rounded-3xl bg-[#0a9396]/10 border border-[#0a9396]/20">
                <BarChart3 className="h-10 w-10 text-[#0a9396]" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight leading-tight mb-1 uppercase">
                  Telemetry <span className="bg-gradient-to-r from-[#0a9396] to-teal-500 bg-clip-text text-transparent">Nexus</span>
                </h1>
                <p className="text-gray-500 font-bold tracking-wide flex items-center gap-2 text-[15px]">
                  Performance Synchronization for Project Vector #{projectId}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="px-6 py-3.5 rounded-2xl bg-white border border-gray-100/50 hover:border-gray-200 text-gray-600 font-bold tracking-wide text-sm transition-all shadow-sm flex items-center gap-2 group/btn">
                <Calendar className="h-4 w-4 text-[#0a9396]" />
                Temporal Range
              </button>
              <button 
                onClick={handleDownload}
                disabled={isDownloading}
                className="px-8 py-3.5 rounded-2xl bg-gray-900 hover:bg-black text-white font-black tracking-[0.1em] text-[13px] shadow-xl shadow-gray-900/20 border-none transition-all cursor-pointer flex items-center gap-3 disabled:opacity-50"
              >
                {isDownloading ? (
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                EXPORT DATA MATRIX
              </button>
            </div>
          </div>
        </motion.div>

        {/* Intelligence Ribbons (Stats) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Network Influx", value: "45,820", sub: "+25.4%", icon: Activity, color: "text-[#0a9396]", bg: "bg-teal-50" },
            { title: "Lead Generation", value: "1,570", sub: "+18.2%", icon: Target, color: "text-indigo-600", bg: "bg-indigo-50" },
            { title: "Conversion Matrix", value: "445", sub: "+22.1%", icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
          ].map((stat, idx) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
              className="bg-white/40 backdrop-blur-xl border border-white rounded-[2rem] p-8 shadow-[inset_0_2px_15px_rgb(255,255,255,0.7),0_10px_30px_rgb(0,0,0,0.03)] group hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <div className={`p-4 rounded-2xl ${stat.bg} border border-white/50 shadow-sm`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[10px] font-black">
                  <ArrowUpRight className="h-3 w-3" />
                  {stat.sub}
                </div>
              </div>
              <div>
                <p className="text-[11px] font-black text-gray-400 tracking-[0.2em] uppercase mb-1">{stat.title}</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-4xl font-black text-gray-900 tracking-tight">{stat.value}</h3>
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
              </div>
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-br from-gray-100 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>

        {/* Cinematic Dashboard Terminal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white/40 backdrop-blur-3xl border border-white rounded-[3rem] p-8 lg:p-10 shadow-[inset_0_2px_15px_rgb(255,255,255,0.7),0_20px_50px_rgb(0,0,0,0.05)] overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-gradient-to-bl from-[#0a9396]/5 to-transparent blur-[100px] pointer-events-none" />
          
          <div className="flex items-center justify-between mb-10 relative z-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-900 rounded-2xl">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase">Evolutionary Trends</h3>
                <p className="text-[10px] font-black text-gray-400 tracking-[0.3em] uppercase">Multi-Vector Performance Sync</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500" />
                <span className="text-[10px] font-black text-gray-500 uppercase">Traffic</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <span className="text-[10px] font-black text-gray-500 uppercase">Leads</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-pink-500" />
                <span className="text-[10px] font-black text-gray-500 uppercase">Conv.</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 w-full h-[400px]">
            <Chart
              data={reportData}
              type="area"
              dataKey="month"
              dataKeys={["traffic", "leads", "conversions"]}
              className="border-none bg-transparent shadow-none"
            />
          </div>

          {/* Verification Footer */}
          <div className="mt-10 pt-8 border-t border-gray-100/50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-100">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span className="text-[10px] font-black text-gray-400 uppercase">Data Integrity: Verified</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-100">
                <Activity className="h-4 w-4 text-[#0a9396]" />
                <span className="text-[10px] font-black text-gray-400 uppercase">Feed Synchronized: 100%</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

