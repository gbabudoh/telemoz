"use client";

import {
  SendHorizonal, Plus, X, AlertCircle, Trash2,
  Calendar, Mail, ToggleLeft, ToggleRight, ChevronDown, ChevronUp,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ScheduledReport {
  id: string;
  title: string;
  cadence: "weekly" | "monthly";
  recipients: string[];
  active: boolean;
  nextSendAt: string | null;
  lastSentAt: string | null;
  project: { id: string; title: string } | null;
  createdAt: string;
}

const emptyForm = { title: "", cadence: "monthly" as "weekly" | "monthly", recipientInput: "", recipients: [] as string[], projectId: "" };

export default function ScheduledReportsPage() {
  const [reports, setReports] = useState<ScheduledReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/pro/reports")
      .then(r => r.json())
      .then(d => setReports(d.reports ?? []))
      .finally(() => setLoading(false));
  }, []);

  const addRecipient = () => {
    const email = form.recipientInput.trim();
    if (!email || !/\S+@\S+\.\S+/.test(email)) return;
    if (form.recipients.includes(email)) return;
    setForm(f => ({ ...f, recipients: [...f.recipients, email], recipientInput: "" }));
  };

  const handleSave = async () => {
    setFormError("");
    if (!form.title || form.recipients.length === 0) {
      setFormError("Please provide a title and at least one recipient email.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/pro/reports", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: form.title, cadence: form.cadence, recipients: form.recipients, projectId: form.projectId || null }),
      });
      if (!res.ok) { setFormError((await res.json()).error ?? "Failed to save"); return; }
      const { report } = await res.json();
      setReports(prev => [report, ...prev]);
      setIsCreating(false);
      setForm(emptyForm);
    } catch { setFormError("Network error."); }
    finally { setSaving(false); }
  };

  const toggleActive = async (id: string, current: boolean) => {
    setToggling(id);
    const res = await fetch(`/api/pro/reports/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !current }),
    });
    if (res.ok) {
      const { report } = await res.json();
      setReports(prev => prev.map(r => r.id === id ? { ...r, ...report } : r));
    }
    setToggling(null);
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    const res = await fetch(`/api/pro/reports/${id}`, { method: "DELETE" });
    if (res.ok) setReports(prev => prev.filter(r => r.id !== id));
    setDeleting(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Automated Reports</h1>
          <p className="text-gray-500 font-medium mt-1">Schedule automated performance reports sent to clients</p>
        </div>
        <button onClick={() => setIsCreating(true)}
          className="h-11 px-5 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-sm flex items-center gap-2 cursor-pointer shadow-sm">
          <Plus className="h-4 w-4" /> New Schedule
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: "Active Schedules", value: reports.filter(r => r.active).length, color: "text-emerald-600" },
          { label: "Total Schedules", value: reports.length, color: "text-gray-900" },
          { label: "Weekly", value: reports.filter(r => r.cadence === "weekly").length, color: "text-blue-600" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-sm text-gray-400 font-medium mb-1">{s.label}</p>
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400 font-medium">Loading report schedules...</div>
      ) : reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-20 w-20 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-5">
            <SendHorizonal className="h-9 w-9 text-gray-300" />
          </div>
          <h3 className="text-lg font-black text-gray-900 mb-1">No report schedules yet</h3>
          <p className="text-gray-400 font-medium text-sm max-w-xs mb-6">
            Set up automated weekly or monthly reports that deliver performance summaries directly to clients.
          </p>
          <button onClick={() => setIsCreating(true)}
            className="h-10 px-5 rounded-xl bg-gray-900 text-white font-bold text-sm flex items-center gap-2 cursor-pointer">
            <Plus className="h-4 w-4" /> Create Schedule
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map(report => (
            <div key={report.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-gray-200 transition-all">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-black text-gray-900">{report.title}</h3>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full capitalize ${report.cadence === "weekly" ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"}`}>
                      {report.cadence}
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${report.active ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-500"}`}>
                      {report.active ? "Active" : "Paused"}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-400 flex-wrap">
                    <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{report.recipients.length} recipient{report.recipients.length !== 1 ? "s" : ""}</span>
                    {report.nextSendAt && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />Next: {new Date(report.nextSendAt).toLocaleDateString("en-GB")}
                      </span>
                    )}
                    {report.lastSentAt && (
                      <span>Last sent: {new Date(report.lastSentAt).toLocaleDateString("en-GB")}</span>
                    )}
                    {report.project && (
                      <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">{report.project.title}</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {report.recipients.map(r => (
                      <span key={r} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">{r}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4 shrink-0">
                  <button onClick={() => toggleActive(report.id, report.active)} disabled={toggling === report.id}
                    className="text-gray-400 hover:text-gray-700 cursor-pointer disabled:opacity-50">
                    {report.active
                      ? <ToggleRight className="h-7 w-7 text-emerald-500" />
                      : <ToggleLeft className="h-7 w-7" />}
                  </button>
                  <button onClick={() => handleDelete(report.id)} disabled={deleting === report.id}
                    className="h-9 w-9 rounded-xl border border-gray-200 flex items-center justify-center text-red-400 hover:text-red-600 cursor-pointer disabled:opacity-50">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <AnimatePresence>
        {isCreating && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}>
              <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                <h2 className="text-xl font-black text-gray-900">New Report Schedule</h2>
                <button onClick={() => { setIsCreating(false); setForm(emptyForm); setFormError(""); }}
                  className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900 cursor-pointer">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="p-6 space-y-5">
                <AnimatePresence>
                  {formError && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
                      <AlertCircle className="h-4 w-4 shrink-0" />{formError}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-1.5">
                  <label className="block text-[13px] font-black uppercase tracking-wider text-gray-500">
                    Report Name <span className="text-red-400">*</span>
                  </label>
                  <input type="text" placeholder="e.g. Monthly Campaign Performance Report"
                    value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 transition-all" />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[13px] font-black uppercase tracking-wider text-gray-500">Cadence</label>
                  <div className="flex gap-3">
                    {(["weekly", "monthly"] as const).map(c => (
                      <button key={c} onClick={() => setForm(f => ({ ...f, cadence: c }))}
                        className={`flex-1 h-11 rounded-xl border font-bold text-sm capitalize transition-all cursor-pointer ${form.cadence === c ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[13px] font-black uppercase tracking-wider text-gray-500">
                    Recipients <span className="text-red-400">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input type="email" placeholder="client@company.com"
                      value={form.recipientInput} onChange={e => setForm(f => ({ ...f, recipientInput: e.target.value }))}
                      onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addRecipient(); } }}
                      className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 transition-all" />
                    <button onClick={addRecipient}
                      className="h-11 px-4 rounded-xl bg-gray-100 text-gray-700 font-bold text-sm hover:bg-gray-200 cursor-pointer">
                      Add
                    </button>
                  </div>
                  {form.recipients.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {form.recipients.map(r => (
                        <span key={r} className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-full">
                          {r}
                          <button onClick={() => setForm(f => ({ ...f, recipients: f.recipients.filter(x => x !== r) }))}
                            className="text-gray-400 hover:text-gray-700 cursor-pointer">
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={() => { setIsCreating(false); setForm(emptyForm); }}
                    className="flex-1 h-11 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 cursor-pointer">
                    Cancel
                  </button>
                  <button onClick={handleSave} disabled={saving}
                    className="flex-1 h-11 rounded-xl bg-[#0a9396] hover:bg-[#0a9396]/90 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm shadow-teal-500/20">
                    <SendHorizonal className="h-4 w-4" />{saving ? "Creating..." : "Create Schedule"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
