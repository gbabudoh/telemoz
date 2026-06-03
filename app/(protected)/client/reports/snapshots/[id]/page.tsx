"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft, BarChart3, DollarSign, FolderKanban, Clock,
  CheckCircle2, AlertCircle, Megaphone, TrendingUp, Eye, Calendar,
} from "lucide-react";
import type { ReportData } from "@/lib/report-generator";

interface Snapshot {
  id: string;
  title: string;
  period: string;
  cadence: string;
  data: ReportData;
  viewedAt: string | null;
  createdAt: string;
  project: { id: string; title: string; status: string } | null;
  pro: { id: string; name: string; image: string | null };
}

const fmt = (n: number, currency = "GBP") =>
  `${currency === "GBP" ? "£" : "$"}${n.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const milestoneColor: Record<string, string> = {
  completed: "bg-emerald-50 text-emerald-700 border-emerald-100",
  "in-progress": "bg-blue-50 text-blue-700 border-blue-100",
  pending: "bg-gray-100 text-gray-600 border-gray-200",
};

export default function ReportSnapshotPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/client/report-snapshots/${id}`)
      .then(r => r.json())
      .then(d => {
        if (d.error) setError(d.error);
        else setSnapshot(d.snapshot);
      })
      .catch(() => setError("Failed to load report"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
        <div className="h-10 w-48 bg-gray-100 rounded-xl" />
        <div className="h-40 bg-gray-100 rounded-3xl" />
        <div className="grid grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-28 bg-gray-100 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  if (error || !snapshot) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <AlertCircle className="h-10 w-10 text-red-400 mx-auto mb-3" />
        <p className="text-gray-500 font-medium">{error || "Report not found"}</p>
        <button onClick={() => router.back()} className="mt-4 text-sm text-[#0a9396] font-bold hover:underline">Go back</button>
      </div>
    );
  }

  const { data } = snapshot;
  const currency = data.revenue.currency;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Back */}
      <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 font-bold text-sm transition-colors cursor-pointer">
        <ArrowLeft className="h-4 w-4" /> Back to Reports
      </button>

      {/* Header card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#0a9396] to-[#015f63] rounded-3xl p-8 text-white shadow-xl shadow-[#0a9396]/20"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full bg-white/20 capitalize`}>
                {snapshot.cadence} Report
              </span>
              {snapshot.viewedAt && (
                <span className="flex items-center gap-1 text-xs text-white/70 font-medium">
                  <Eye className="h-3.5 w-3.5" /> Viewed {new Date(snapshot.viewedAt).toLocaleDateString("en-GB")}
                </span>
              )}
            </div>
            <h1 className="text-3xl font-black tracking-tight mb-1">{snapshot.title}</h1>
            <div className="flex items-center gap-3 text-white/80 text-sm font-medium">
              <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{snapshot.period}</span>
              <span>·</span>
              <span>From {snapshot.pro.name}</span>
            </div>
          </div>
          <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shrink-0">
            <BarChart3 className="h-7 w-7 text-white" />
          </div>
        </div>

        {snapshot.project && (
          <div className="mt-5 pt-5 border-t border-white/20 flex items-center gap-2 text-sm text-white/80 font-medium">
            <FolderKanban className="h-4 w-4" />
            Project: <span className="font-black text-white">{snapshot.project.title}</span>
            <span className={`ml-2 text-xs px-2.5 py-0.5 rounded-full font-bold capitalize ${snapshot.project.status === "active" ? "bg-emerald-400/30 text-white" : "bg-white/20 text-white/80"}`}>
              {snapshot.project.status.replace("_", " ")}
            </span>
          </div>
        )}
      </motion.div>

      {/* Revenue stats */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Revenue</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Invoiced", value: fmt(data.revenue.total, currency), icon: DollarSign, color: "text-gray-900" },
            { label: "Paid", value: fmt(data.revenue.paid, currency), icon: CheckCircle2, color: "text-emerald-600" },
            { label: "Pending", value: fmt(data.revenue.pending, currency), icon: AlertCircle, color: "text-amber-500" },
            { label: "Invoices", value: String(data.revenue.invoiceCount), icon: FolderKanban, color: "text-blue-600" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{s.label}</p>
                <s.icon className={`h-4 w-4 ${s.color}`} />
              </div>
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Time tracked */}
      {(data.timeTracked.totalHours > 0) && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Time Tracked</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Total Hours", value: `${data.timeTracked.totalHours.toFixed(1)}h` },
              { label: "Billable Hours", value: `${data.timeTracked.billableHours.toFixed(1)}h` },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                  <Clock className="h-5 w-5 text-indigo-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{s.label}</p>
                  <p className="text-xl font-black text-gray-900">{s.value}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Milestones */}
      {data.milestones.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Milestones This Period</h2>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
            {data.milestones.map((m, i) => (
              <div key={i} className="p-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm truncate">{m.title}</p>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">
                    Due {new Date(m.dueDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                    {m.completedAt && ` · Completed ${new Date(m.completedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`}
                  </p>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border capitalize ${milestoneColor[m.status] ?? milestoneColor.pending}`}>
                  {m.status.replace("-", " ")}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Campaigns */}
      {data.campaigns.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Campaign Performance</h2>
          <div className="space-y-3">
            {data.campaigns.map((c, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#0a9396] to-emerald-400 flex items-center justify-center">
                    <Megaphone className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-black text-gray-900 text-sm">{c.name}</p>
                    <p className="text-xs text-gray-400 font-medium capitalize">{c.platform}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "Impressions", value: c.impressions.toLocaleString() },
                    { label: "Clicks", value: c.clicks.toLocaleString() },
                    { label: "Conversions", value: c.conversions.toLocaleString() },
                    { label: "Spend", value: fmt(c.spend, currency) },
                  ].map(m => (
                    <div key={m.label} className="bg-gray-50 rounded-xl p-3">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{m.label}</p>
                      <p className="text-lg font-black text-gray-900">{m.value}</p>
                    </div>
                  ))}
                </div>
                {c.impressions > 0 && c.clicks > 0 && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-gray-400 font-medium">
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                    CTR: <span className="font-black text-gray-700">{((c.clicks / c.impressions) * 100).toFixed(2)}%</span>
                    {c.spend > 0 && c.clicks > 0 && (
                      <> · CPC: <span className="font-black text-gray-700">{fmt(c.spend / c.clicks, currency)}</span></>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Footer */}
      <p className="text-center text-xs text-gray-300 font-medium pt-4">
        Generated {new Date(data.generatedAt).toLocaleString("en-GB", { dateStyle: "long", timeStyle: "short" })} · Delivered via Telemoz
      </p>
    </div>
  );
}
