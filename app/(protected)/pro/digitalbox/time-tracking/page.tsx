"use client";

import { Clock, Plus, X, AlertCircle, Trash2, Timer, CheckCircle2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Project { id: string; title: string; }
interface TimeEntry {
  id: string;
  description: string;
  hours: number;
  date: string;
  billable: boolean;
  invoiced: boolean;
  project: Project | null;
  retainer: { id: string; title: string } | null;
}

const emptyForm = { description: "", hours: "", date: new Date().toISOString().split("T")[0], billable: true, projectId: "", retainerId: "" };

export default function TimeTrackingPage() {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLogging, setIsLogging] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Timer state
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerStart, setTimerStart] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/pro/time-entries")
      .then(r => r.json())
      .then(d => setEntries(d.entries ?? []))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  const formatTimer = (secs: number) => {
    const h = Math.floor(secs / 3600).toString().padStart(2, "0");
    const m = Math.floor((secs % 3600) / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const stopTimer = useCallback(() => {
    setTimerRunning(false);
    const hours = (timerSeconds / 3600).toFixed(2);
    setForm(f => ({ ...f, hours }));
    setIsLogging(true);
  }, [timerSeconds]);

  const totalHours = entries.reduce((s, e) => s + e.hours, 0);
  const billableHours = entries.filter(e => e.billable && !e.invoiced).reduce((s, e) => s + e.hours, 0);
  const thisWeek = entries.filter(e => {
    const d = new Date(e.date);
    const now = new Date();
    const weekStart = new Date(now); weekStart.setDate(now.getDate() - now.getDay());
    return d >= weekStart;
  }).reduce((s, e) => s + e.hours, 0);

  const stats = [
    { label: "Total Hours", value: totalHours.toFixed(1) + "h" },
    { label: "This Week", value: thisWeek.toFixed(1) + "h" },
    { label: "Billable (uninvoiced)", value: billableHours.toFixed(1) + "h", color: "text-[#0a9396]" },
    { label: "Entries", value: entries.length },
  ];

  const handleSave = async () => {
    setFormError("");
    if (!form.description || !form.hours || !form.date) {
      setFormError("Description, hours, and date are required.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/pro/time-entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: form.description, hours: form.hours, date: form.date,
          billable: form.billable,
          projectId: form.projectId || null,
          retainerId: form.retainerId || null,
        }),
      });
      if (!res.ok) { setFormError((await res.json()).error ?? "Failed to save"); return; }
      const { entry } = await res.json();
      setEntries(prev => [entry, ...prev]);
      setIsLogging(false);
      setForm(emptyForm);
      setTimerSeconds(0);
    } catch { setFormError("Network error."); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    const res = await fetch(`/api/pro/time-entries?id=${id}`, { method: "DELETE" });
    if (res.ok) setEntries(prev => prev.filter(e => e.id !== id));
    setDeleting(null);
  };

  // Group entries by date
  const grouped = entries.reduce<Record<string, TimeEntry[]>>((acc, e) => {
    const key = new Date(e.date).toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    if (!acc[key]) acc[key] = [];
    acc[key].push(e);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Time Tracking</h1>
          <p className="text-gray-500 font-medium mt-1">Log billable hours against projects and retainers</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => { timerRunning ? stopTimer() : (setTimerRunning(true), setTimerStart(Date.now())) }}
            className={`h-11 px-5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all cursor-pointer shadow-sm ${timerRunning ? "bg-red-500 hover:bg-red-600 text-white" : "bg-emerald-500 hover:bg-emerald-600 text-white"}`}>
            <Timer className="h-4 w-4" />
            {timerRunning ? `Stop  ${formatTimer(timerSeconds)}` : "Start Timer"}
          </button>
          <button onClick={() => setIsLogging(true)}
            className="h-11 px-5 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-sm flex items-center gap-2 cursor-pointer shadow-sm">
            <Plus className="h-4 w-4" /> Log Time
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-sm text-gray-400 font-medium mb-1">{s.label}</p>
            <p className={`text-2xl font-black ${s.color ?? "text-gray-900"}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400 font-medium">Loading time entries...</div>
      ) : entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-20 w-20 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-5">
            <Clock className="h-9 w-9 text-gray-300" />
          </div>
          <h3 className="text-lg font-black text-gray-900 mb-1">No time logged yet</h3>
          <p className="text-gray-400 font-medium text-sm max-w-xs mb-6">
            Track your hours to accurately bill clients and understand where your time goes.
          </p>
          <button onClick={() => setIsLogging(true)}
            className="h-10 px-5 rounded-xl bg-gray-900 text-white font-bold text-sm flex items-center gap-2 cursor-pointer">
            <Plus className="h-4 w-4" /> Log Time
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([date, dayEntries]) => (
            <div key={date}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-black uppercase tracking-wider text-gray-400">{date}</h3>
                <span className="text-sm font-bold text-gray-500">
                  {dayEntries.reduce((s, e) => s + e.hours, 0).toFixed(1)}h
                </span>
              </div>
              <div className="space-y-2">
                {dayEntries.map(entry => (
                  <div key={entry.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4 hover:border-gray-200 transition-all">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0 ${entry.billable ? "bg-[#0a9396]" : "bg-gray-400"}`}>
                      {entry.hours}h
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-sm">{entry.description}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        {entry.project && <span className="text-xs text-gray-400">{entry.project.title}</span>}
                        {entry.retainer && <span className="text-xs text-gray-400">{entry.retainer.title}</span>}
                        {entry.billable ? (
                          <span className="text-xs font-bold text-[#0a9396] flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Billable
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">Non-billable</span>
                        )}
                        {entry.invoiced && <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Invoiced</span>}
                      </div>
                    </div>
                    <button onClick={() => handleDelete(entry.id)} disabled={deleting === entry.id}
                      className="h-8 w-8 rounded-xl border border-gray-200 flex items-center justify-center text-red-400 hover:text-red-600 cursor-pointer disabled:opacity-50 shrink-0">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Log Time Modal */}
      <AnimatePresence>
        {isLogging && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white rounded-3xl shadow-2xl w-full max-w-md"
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}>
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xl font-black text-gray-900">Log Time</h2>
                <button onClick={() => { setIsLogging(false); setForm(emptyForm); setFormError(""); }}
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
                    Description <span className="text-red-400">*</span>
                  </label>
                  <input type="text" placeholder="e.g. Facebook ads setup and optimisation"
                    value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 transition-all" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[13px] font-black uppercase tracking-wider text-gray-500">
                      Hours <span className="text-red-400">*</span>
                    </label>
                    <input type="number" step="0.25" placeholder="1.5"
                      value={form.hours} onChange={e => setForm(f => ({ ...f, hours: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[13px] font-black uppercase tracking-wider text-gray-500">
                      Date <span className="text-red-400">*</span>
                    </label>
                    <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 transition-all" />
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <button onClick={() => setForm(f => ({ ...f, billable: !f.billable }))}
                    className={`relative h-6 w-11 rounded-full transition-colors cursor-pointer flex-shrink-0 ${form.billable ? "bg-[#0a9396]" : "bg-gray-300"}`}>
                    <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${form.billable ? "translate-x-5" : ""}`} />
                  </button>
                  <div>
                    <p className="text-sm font-black text-gray-900">Billable</p>
                    <p className="text-xs text-gray-400">Include in client invoicing</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={() => { setIsLogging(false); setForm(emptyForm); }}
                    className="flex-1 h-11 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 cursor-pointer">
                    Cancel
                  </button>
                  <button onClick={handleSave} disabled={saving}
                    className="flex-1 h-11 rounded-xl bg-[#0a9396] hover:bg-[#0a9396]/90 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm shadow-teal-500/20">
                    <Clock className="h-4 w-4" />{saving ? "Saving..." : "Log Time"}
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
