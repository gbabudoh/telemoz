"use client";

import { Badge } from "@/components/ui/Badge";
import { Chart } from "@/components/ui/Chart";
import { 
  TrendingUp, 
  MousePointer2, 
  Eye, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight,
  Globe,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";

interface ClientReportProps {
  data: {
    totals: { impressions: number; clicks: number; spend: number; conversions: number };
    chartData: Array<{ [key: string]: unknown; date: string; impressions: number; clicks: number; spend: number }>;
    platformData: Array<{ [key: string]: unknown; provider: string; _sum: { impressions: number | null; clicks: number | null; spend: number | null } }>;
  };
  clientName: string;
  projectName: string;
  proName: string;
  period: string;
}

export function ClientReport({ data, clientName, projectName, proName, period }: ClientReportProps) {
  const ctr = data.totals.impressions > 0 ? (data.totals.clicks / data.totals.impressions) * 100 : 0;
  const cpc = data.totals.clicks > 0 ? data.totals.spend / data.totals.clicks : 0;

  return (
    <div className="bg-white min-h-screen p-8 md:p-16 max-w-[1200px] mx-auto shadow-2xl rounded-[3rem] border border-gray-100 my-10">
      {/* Report Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16 border-b border-gray-100 pb-12">
        <div>
          <Badge variant="outline" className="mb-4 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] border-emerald-200 text-emerald-600 bg-emerald-50/50">
            Performance Report
          </Badge>
          <h1 className="text-5xl font-black text-gray-900 tracking-tight leading-none mb-4">
            {projectName}
          </h1>
          <p className="text-xl text-gray-500 font-medium">
            Prepared for <span className="text-gray-900 font-bold">{clientName}</span>
          </p>
        </div>
        
        <div className="text-right flex flex-col items-end">
          <div className="w-16 h-16 bg-gradient-to-br from-[#0a9396] to-[#015f63] rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-[#0a9396]/20">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <p className="text-sm font-black text-gray-400 uppercase tracking-widest">{period}</p>
          <p className="text-sm font-bold text-gray-900 mt-1">By {proName}</p>
        </div>
      </div>

      {/* Executive Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {[
          { label: "Total Reach", value: data.totals.impressions.toLocaleString(), icon: Eye, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Engagements", value: data.totals.clicks.toLocaleString(), icon: MousePointer2, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Conversions", value: data.totals.conversions.toLocaleString(), icon: Activity, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Ad Investment", value: `£${data.totals.spend.toLocaleString()}`, icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 rounded-[2rem] bg-gray-50/50 border border-gray-100 hover:bg-white hover:shadow-xl transition-all group"
          >
            <div className={`p-3 w-max rounded-xl ${stat.bg} ${stat.color} mb-6 group-hover:scale-110 transition-transform`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-3xl font-black text-gray-900 tracking-tight">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Primary Chart Area */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <Globe className="h-6 w-6 text-[#0a9396]" />
            Growth Trajectory
          </h2>
          <div className="flex gap-4">
             <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
               <div className="w-2 h-2 rounded-full bg-blue-500" /> Impressions
             </div>
             <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
               <div className="w-2 h-2 rounded-full bg-emerald-500" /> Clicks
             </div>
          </div>
        </div>
        <div className="h-[400px] w-full p-8 bg-gray-50/30 rounded-[2.5rem] border border-gray-100">
          <Chart 
            data={data.chartData}
            type="area"
            dataKey="date"
            dataKeys={["impressions", "clicks"]}
            colors={["#3b82f6", "#10b981"]}
          />
        </div>
      </div>

      {/* Platform & Efficiency Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div className="p-10 rounded-[2.5rem] bg-gray-900 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-10 -translate-y-10 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700">
             <TrendingUp className="w-64 h-64" />
          </div>
          <h2 className="text-2xl font-black mb-8 relative z-10">Efficiency Metrics</h2>
          <div className="space-y-8 relative z-10">
             <div className="flex justify-between items-end border-b border-white/10 pb-4">
                <div>
                   <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Avg. Click-Through Rate</p>
                   <p className="text-4xl font-black">{ctr.toFixed(2)}%</p>
                </div>
                <div className="flex items-center gap-1 text-emerald-400 font-bold mb-1">
                   <ArrowUpRight className="h-4 w-4" /> Healthy
                </div>
             </div>
             <div className="flex justify-between items-end border-b border-white/10 pb-4">
                <div>
                   <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Avg. Cost Per Click</p>
                   <p className="text-4xl font-black">£{cpc.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-1 text-emerald-400 font-bold mb-1">
                   <ArrowDownRight className="h-4 w-4" /> Optimized
                </div>
             </div>
          </div>
          <p className="mt-8 text-sm text-gray-400 font-medium leading-relaxed italic">
            &quot;Your campaigns are showing strong engagement patterns with a cost efficiency that outperforms industry benchmarks for {period}.&quot;
          </p>
        </div>

        <div className="p-10 rounded-[2.5rem] border border-gray-100 bg-white shadow-sm flex flex-col">
           <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-8">Platform Distribution</h2>
           <div className="flex-1 flex items-center justify-center">
             <div className="h-[250px] w-full">
               <Chart 
                  data={data.platformData.map(p => ({ name: p.provider, value: p._sum.impressions }))}
                  type="pie"
                  dataKey="name"
                  dataKeys={["value"]}
                  colors={["#0a9396", "#3b82f6", "#f59e0b", "#6366f1", "#10b981"]}
               />
             </div>
           </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pt-12 border-t border-gray-100">
         <p className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">
           Generated via Telemoz DigitalBOX &bull; {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
         </p>
      </div>
    </div>
  );
}
