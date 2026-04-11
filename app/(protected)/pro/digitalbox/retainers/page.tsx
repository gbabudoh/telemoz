"use client";

import {
  RefreshCw, Plus, X, AlertCircle, CheckCircle2,
  PauseCircle, XCircle, Clock, Repeat,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface RetainerClient { id: string; name: string; email: string; }
interface Retainer {
  id: string;
  title: string;
  description: string | null;
  monthlyRate: number;
  currency: string;
  hoursIncluded: number | null;
  billingDay: number;
  startDate: string;
  endDate: string | null;
  status: "active" | "paused" | "cancelled" | "completed";
  client: RetainerClient;
  createdAt: string;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  active:    { label: "Active",    color: "bg-emerald-50 text-emerald-600", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  paused:    { label: "Paused",    color: "bg-amber-50 text-amber-600",     icon: <PauseCircle className="h-3.5 w-3.5" /> },
  cancelled: { label: "Cancelled", color: "bg-red-50 text-red-500",         icon: <XCircle className="h-3.5 w-3.5" /> },
  completed: { label: "Completed", color: "bg-blue-50 text-blue-600",       icon: <Clock className="h-3.5 w-3.5" /> },
};

const emptyForm = {
  clientName: "", clientEmail: "", title: "", description: "",
  monthlyRate: "", currency: "GBP", hoursIncluded: "",
  billingDay: "1", startDate: "", endDate: "",
};

export default function RetainersPage() {
  const [retainers, setRetainers] = useState<Retainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/pro/retainers")
      .then(r => r.json())
      .then(d => setRetainers(d.retainers ?? []))
      .finally(() => setLoading(false));
  }, []);

  const mrr = retainers.filter(r => r.status === "active").reduce((s, r) => s + r.monthlyRate, 0);

  const stats = [
    { label: "Active Retainers", value: retainers.filter(r => r.status === "active").length, color: "text-emerald-600" },
    { label: "Monthly Revenue", value: `£${mrr.toLocaleString()}`, color: "text-[#0a9396]" },
    { label: "Annual Run Rate", value: `£${(mrr * 12).toLocaleString()}`, color: "text-gray-900" },
    { label: "Total Clients", value: new Set(retainers.map(r => r.client.id)).size, color: "text-gray-900" },
  ];

  const handleSave = async () => {
    setFormError("");
    if (!form.clientName || !form.clientEmail || !form.title || !form.monthlyRate || !form.startDate) {
      setFormError("Please fill in all required fields.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/pro/retainers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: form.clientEmail,
          title: form.title, description: form.description || null,
          monthlyRate: form.monthlyRate, currency: form.currency,
          hoursIncluded: form.hoursIncluded || null,
          billingDay: form.billingDay, startDate: form.startDate,
          endDate: form.endDate || null,
        }),
      });
      if (!res.ok) { setFormError((await res.json()).error ?? "Failed to save"); return; }
      const { retainer } = await res.json();
      setRetainers(prev => [{ ...retainer, client: { id: retainer.clientId, name: form.clientName, email: form.clientEmail } }, ...prev]);
      setIsCreating(false);
      setForm(emptyForm);
    } catch { setFormError("Network error."); }
    finally { setSaving(false); }
  };

  const handleStatusChange = async (id: string, status: string) => {
    setUpdating(id);
    const res = await fetch(`/api/pro/retainers/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const { retainer } = await res.json();
      setRetainers(prev => prev.map(r => r.id === id ? { ...r, ...retainer } : r));
    }
    setUpdating(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Retainers</h1>
          <p className="text-gray-500 font-medium mt-1">Manage monthly client retainer agreements</p>
        </div>
        <button onClick={() => setIsCreating(true)}
          className="h-11 px-5 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-sm flex items-center gap-2 transition-colors cursor-pointer shadow-sm">
          <Plus className="h-4 w-4" /> New Retainer
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-sm text-gray-400 font-medium mb-1">{s.label}</p>
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400 font-medium">Loading retainers...</div>
      ) : retainers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-20 w-20 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-5">
            <Repeat className="h-9 w-9 text-gray-300" />
          </div>
          <h3 className="text-lg font-black text-gray-900 mb-1">No retainers yet</h3>
          <p className="text-gray-400 font-medium text-sm max-w-xs mb-6">
            Set up monthly retainer agreements with clients for predictable recurring revenue.
          </p>
          <button onClick={() => setIsCreating(true)}
            className="h-10 px-5 rounded-xl bg-gray-900 text-white font-bold text-sm flex items-center gap-2 cursor-pointer">
            <Plus className="h-4 w-4" /> New Retainer
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {retainers.map(r => {
            const sc = statusConfig[r.status];
            return (
              <div key={r.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:border-gray-200 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-black text-gray-900 text-lg leading-tight">{r.title}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{r.client.name}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${sc.color}`}>
                    {sc.icon}{sc.label}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-1">Monthly Rate</p>
                    <p className="text-xl font-black text-gray-900">{r.currency} {r.monthlyRate.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-1">Hours / Month</p>
                    <p className="text-xl font-black text-gray-900">{r.hoursIncluded ?? "—"}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                  <span>Billing day: {r.billingDay}{r.billingDay === 1 ? "st" : r.billingDay === 2 ? "nd" : r.billingDay === 3 ? "rd" : "th"} of month</span>
                  <span>Started {new Date(r.startDate).toLocaleDateString("en-GB")}</span>
                </div>

                {r.description && <p className="text-sm text-gray-500 mb-4 leading-relaxed">{r.description}</p>}

                <div className="flex gap-2">
                  {r.status === "active" && (
                    <button onClick={() => handleStatusChange(r.id, "paused")} disabled={updating === r.id}
                      className="flex-1 h-9 rounded-xl border border-amber-200 bg-amber-50 text-amber-600 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-amber-100 transition-all cursor-pointer disabled:opacity-50">
                      <PauseCircle className="h-3.5 w-3.5" /> Pause
                    </button>
                  )}
                  {r.status === "paused" && (
                    <button onClick={() => handleStatusChange(r.id, "active")} disabled={updating === r.id}
                      className="flex-1 h-9 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-600 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-emerald-100 transition-all cursor-pointer disabled:opacity-50">
                      <RefreshCw className="h-3.5 w-3.5" /> Resume
                    </button>
                  )}
                  {(r.status === "active" || r.status === "paused") && (
                    <button onClick={() => handleStatusChange(r.id, "cancelled")} disabled={updating === r.id}
                      className="flex-1 h-9 rounded-xl border border-red-200 bg-red-50 text-red-500 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-red-100 transition-all cursor-pointer disabled:opacity-50">
                      <XCircle className="h-3.5 w-3.5" /> Cancel
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      <AnimatePresence>
        {isCreating && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}>
              <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                <h2 className="text-xl font-black text-gray-900">New Retainer</h2>
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

                {[
                  { label: "Client Name", key: "clientName", placeholder: "Jane Smith", required: true },
                  { label: "Client Email", key: "clientEmail", placeholder: "jane@company.com", required: true, type: "email" },
                  { label: "Retainer Title", key: "title", placeholder: "Monthly Marketing Retainer", required: true },
                ].map(f => (
                  <div key={f.key} className="space-y-1.5">
                    <label className="block text-[13px] font-black uppercase tracking-wider text-gray-500">
                      {f.label} {f.required && <span className="text-red-400">*</span>}
                    </label>
                    <input type={f.type ?? "text"} placeholder={f.placeholder}
                      value={(form as Record<string, string>)[f.key]}
                      onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 transition-all" />
                  </div>
                ))}

                <div className="space-y-1.5">
                  <label className="block text-[13px] font-black uppercase tracking-wider text-gray-500">Description</label>
                  <textarea rows={2} placeholder="What's included in this retainer..."
                    value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 transition-all resize-none" />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[13px] font-black uppercase tracking-wider text-gray-500">
                      Monthly Rate <span className="text-red-400">*</span>
                    </label>
                    <input type="number" placeholder="2500" value={form.monthlyRate}
                      onChange={e => setForm(f => ({ ...f, monthlyRate: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[13px] font-black uppercase tracking-wider text-gray-500">Currency</label>
                    <select value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 transition-all">
                      {["GBP", "USD", "EUR"].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[13px] font-black uppercase tracking-wider text-gray-500">Hours / Month</label>
                    <input type="number" placeholder="20" value={form.hoursIncluded}
                      onChange={e => setForm(f => ({ ...f, hoursIncluded: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[13px] font-black uppercase tracking-wider text-gray-500">Billing Day</label>
                    <input type="number" min={1} max={28} placeholder="1" value={form.billingDay}
                      onChange={e => setForm(f => ({ ...f, billingDay: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[13px] font-black uppercase tracking-wider text-gray-500">
                      Start Date <span className="text-red-400">*</span>
                    </label>
                    <input type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[13px] font-black uppercase tracking-wider text-gray-500">End Date</label>
                    <input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 transition-all" />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={() => { setIsCreating(false); setForm(emptyForm); }}
                    className="flex-1 h-11 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 cursor-pointer">
                    Cancel
                  </button>
                  <button onClick={handleSave} disabled={saving}
                    className="flex-1 h-11 rounded-xl bg-[#0a9396] hover:bg-[#0a9396]/90 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm shadow-teal-500/20">
                    <RefreshCw className="h-4 w-4" />{saving ? "Creating..." : "Create Retainer"}
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
