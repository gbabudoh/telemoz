"use client";

import { motion } from "framer-motion";

export function DashboardMockup() {
  const bars = [38, 52, 45, 71, 63, 88, 76];
  const days = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-2xl border border-gray-200/60 bg-white">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-linear-to-r from-[#0a9396] to-[#005f73]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#6ece39] animate-pulse" />
          <span className="text-white text-sm font-semibold">Campaign Dashboard</span>
        </div>
        <span className="text-white/60 text-xs font-medium">Live</span>
      </div>

      {/* KPI metric cards */}
      <div className="grid grid-cols-3 gap-2 p-3 bg-gray-50/80 border-b border-gray-100">
        {[
          { label: "Total Reach", value: "284K", trend: "+18%" },
          { label: "Conversions", value: "4,290", trend: "+34%" },
          { label: "Avg. ROI", value: "312%", trend: "+12%" },
        ].map((metric) => (
          <div
            key={metric.label}
            className="bg-white rounded-xl p-2.5 shadow-sm border border-gray-100"
          >
            <p className="text-[10px] text-gray-500 mb-1 font-medium">{metric.label}</p>
            <p className="text-base font-bold text-gray-900 leading-none">{metric.value}</p>
            <p className="text-[10px] text-emerald-600 font-semibold mt-1">{metric.trend}</p>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="p-3">
        <p className="text-[10px] font-semibold text-gray-400 mb-2 uppercase tracking-wider">
          Weekly Performance
        </p>
        <div className="flex items-end gap-1.5 h-20">
          {bars.map((h, i) => (
            <motion.div
              key={i}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.5 + i * 0.08, duration: 0.4, ease: "easeOut" }}
              style={{ height: `${h}%` }}
              className={`flex-1 rounded-t origin-bottom ${
                i === 5
                  ? "bg-[#0a9396]"
                  : i === 6
                  ? "bg-[#0a9396]/70"
                  : "bg-[#0a9396]/20"
              }`}
            />
          ))}
        </div>
        <div className="flex gap-1.5 mt-1">
          {days.map((d, i) => (
            <span key={i} className="flex-1 text-center text-[9px] text-gray-400">
              {d}
            </span>
          ))}
        </div>
      </div>

      {/* Channel mix */}
      <div className="px-3 pb-3 space-y-1.5">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Channel Mix
        </p>
        {[
          { label: "Google Ads", pct: 42, color: "bg-[#0a9396]" },
          { label: "Social Media", pct: 31, color: "bg-[#6ece39]" },
          { label: "Email", pct: 17, color: "bg-[#005f73]" },
          { label: "Organic SEO", pct: 10, color: "bg-gray-300" },
        ].map((ch, i) => (
          <div key={ch.label} className="flex items-center gap-2">
            <span className="text-[10px] text-gray-500 w-20 shrink-0">{ch.label}</span>
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${ch.pct}%` }}
                transition={{ delay: 0.8 + i * 0.1, duration: 0.6, ease: "easeOut" }}
                className={`h-full rounded-full ${ch.color}`}
              />
            </div>
            <span className="text-[10px] font-bold text-gray-500 w-7 text-right">
              {ch.pct}%
            </span>
          </div>
        ))}
      </div>

      {/* Active campaigns footer */}
      <div className="px-3 pb-3 pt-2 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] text-gray-500 font-medium">3 Active Campaigns</span>
        </div>
        <span className="text-[10px] text-[#0a9396] font-semibold">View All →</span>
      </div>
    </div>
  );
}
