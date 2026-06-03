"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FileText, Clock, Eye, FolderKanban, ChevronRight, BarChart3, Inbox } from "lucide-react";

interface Snapshot {
  id: string;
  title: string;
  period: string;
  cadence: string;
  viewedAt: string | null;
  createdAt: string;
  project: { id: string; title: string } | null;
  pro: { id: string; name: string; image: string | null };
}

export default function ClientReportSnapshotsPage() {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/client/report-snapshots")
      .then(r => r.json())
      .then(d => setSnapshots(d.snapshots ?? []))
      .finally(() => setLoading(false));
  }, []);

  const unread = snapshots.filter(s => !s.viewedAt).length;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            Performance Reports
            {unread > 0 && (
              <span className="h-6 px-2.5 rounded-full bg-[#0a9396] text-white text-xs font-black flex items-center">
                {unread} new
              </span>
            )}
          </h1>
          <p className="text-gray-500 font-medium mt-1">Reports delivered by your professionals</p>
        </div>
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#0a9396] to-emerald-400 flex items-center justify-center shadow-lg">
          <BarChart3 className="h-6 w-6 text-white" />
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : snapshots.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="h-20 w-20 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-5">
            <Inbox className="h-9 w-9 text-gray-300" />
          </div>
          <h3 className="text-lg font-black text-gray-900 mb-1">No reports yet</h3>
          <p className="text-gray-400 font-medium text-sm max-w-xs">
            Your professional will send performance reports here on a scheduled basis.
          </p>
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.06 } } }}
          className="space-y-3"
        >
          {snapshots.map(snap => (
            <motion.div
              key={snap.id}
              variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
              onClick={() => router.push(`/client/reports/snapshots/${snap.id}`)}
              className={`group bg-white rounded-2xl border shadow-sm p-5 flex items-center gap-5 cursor-pointer hover:shadow-md hover:border-[#0a9396]/30 transition-all ${!snap.viewedAt ? "border-[#0a9396]/40 bg-[#0a9396]/[0.02]" : "border-gray-100"}`}
            >
              {/* Icon */}
              <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${!snap.viewedAt ? "bg-gradient-to-br from-[#0a9396] to-emerald-400" : "bg-gray-100"}`}>
                <FileText className={`h-5 w-5 ${!snap.viewedAt ? "text-white" : "text-gray-400"}`} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-black text-gray-900 truncate">{snap.title}</h3>
                  {!snap.viewedAt && (
                    <span className="h-5 px-2 rounded-full bg-[#0a9396] text-white text-[10px] font-black uppercase tracking-wide flex items-center shrink-0">New</span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400 font-medium flex-wrap">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />{snap.period}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full font-bold capitalize ${snap.cadence === "weekly" ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"}`}>
                    {snap.cadence}
                  </span>
                  {snap.project && (
                    <span className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-full">
                      <FolderKanban className="h-3 w-3" />{snap.project.title}
                    </span>
                  )}
                  <span>From {snap.pro.name}</span>
                </div>
              </div>

              {/* Right */}
              <div className="flex items-center gap-3 shrink-0">
                {snap.viewedAt && (
                  <span className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                    <Eye className="h-3.5 w-3.5" /> Viewed
                  </span>
                )}
                <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-[#0a9396] transition-colors" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
