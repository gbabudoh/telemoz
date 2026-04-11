"use client";

import {
  BarChart3, Plus, X, AlertCircle, TrendingUp,
  Play, Pause, CheckCircle2, XCircle, MousePointer,
  Eye, DollarSign, Target, Trash2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Campaign {
  id: string;
  name: string;
  platform: string;
  objective: string | null;
  startDate: string;
  endDate: string | null;
  budget: number | null;
  currency: string;
  status: "draft" | "active" | "paused" | "completed" | "cancelled";
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  revenue: number;
  project: { id: string; title: string } | null;
}

const PLATFORMS = ["meta", "google", "linkedin", "tiktok", "email", "seo", "other"];
const platformLabels: Record<string, string> = {
  meta: "Meta (Facebook/Instagram)", google: "Google Ads", linkedin: "LinkedIn Ads",
  tiktok: "TikTok Ads", email: "Email Marketing", seo: "SEO", other: "Other",
};
const platformColors: Record<string, string> = {
  meta: "bg-blue-100 text-blue-700", google: "bg-red-100 text-red-700",
  linkedin: "bg-sky-100 text-sky-700", tiktok: "bg-pink-100 text-pink-700",
  email: "bg-amber-100 text-amber-700", seo: "bg-green-100 text-green-700",
  other: "bg-gray-100 text-gray-600",
};
const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  draft:     { label: "Draft",     color: "bg-gray-100 text-gray-600",      icon: <X className="h-3 w-3" /> },
  active:    { label: "Active",    color: "bg-emerald-50 text-emerald-600", icon: <Play className="h-3 w-3" /> },
  paused:    { label: "Paused",    color: "bg-amber-50 text-amber-600",     icon: <Pause className="h-3 w-3" /> },
  completed: { label: "Completed", color: "bg-blue-50 text-blue-600",       icon: <CheckCircle2 className="h-3 w-3" /> },
  cancelled: { label: "Cancelled", color: "bg-red-50 text-red-500",         icon: <XCircle className="h-3 w-3" /> },
};

const emptyForm = {
  name: "", platform: "meta", objective: "", startDate: "", endDate: "", budget: "", currency: "GBP", projectId: "",
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingMetrics, setEditingMetrics] = useState<Campaign | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [metrics, setMetrics] = useState({ impressions: "", clicks: "", conversions: "", spend: "", revenue: "" });
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("all");
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/pro/campaigns")
      .then(r => r.json())
      .then(d => setCampaigns(d.campaigns ?? []))
      .finally(() => setLoading(false));
  }, []);

  const totalSpend = campaigns.reduce((s, c) => s + c.spend, 0);
  const totalRevenue = campaigns.reduce((s, c) => s + c.revenue, 0);
  const totalImpressions = campaigns.reduce((s, c) => s + c.impressions, 0);
  const totalConversions = campaigns.reduce((s, c) => s + c.conversions, 0);

  const stats = [
    { label: "Active Campaigns", value: campaigns.filter(c => c.status === "active").length, icon: <Play className="h-4 w-4" />, color: "text-emerald-600" },
    { label: "Total Impressions", value: totalImpressions >= 1000 ? `${(totalImpressions / 1000).toFixed(1)}K` : totalImpressions, icon: <Eye className="h-4 w-4" />, color: "text-blue-600" },
    { label: "Total Conversions", value: totalConversions, icon: <Target className="h-4 w-4" />, color: "text-[#0a9396]" },
    { label: "Total Ad Spend", value: `£${totalSpend.toLocaleString()}`, icon: <DollarSign className="h-4 w-4" />, color: "text-gray-900" },
  ];

  const filtered = filter === "all" ? campaigns : campaigns.filter(c => c.status === filter);

  const handleSave = async () => {
    setFormError("");
    if (!form.name || !form.startDate) { setFormError("Campaign name and start date are required."); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/pro/campaigns", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, budget: form.budget || null, projectId: form.projectId || null }),
      });
      if (!res.ok) { setFormError((await res.json()).error ?? "Failed to save"); return; }
      const { campaign } = await res.json();
      setCampaigns(prev => [campaign, ...prev]);
      setIsCreating(false);
      setForm(emptyForm);
    } catch { setFormError("Network error."); }
    finally { setSaving(false); }
  };

  const handleStatusChange = async (id: string, status: string) => {
    const res = await fetch(`/api/pro/campaigns/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const { campaign } = await res.json();
      setCampaigns(prev => prev.map(c => c.id === id ? { ...c, ...campaign } : c));
    }
  };

  const handleUpdateMetrics = async () => {
    if (!editingMetrics) return;
    setSaving(true);
    const res = await fetch(`/api/pro/campaigns/${editingMetrics.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        impressions: metrics.impressions || editingMetrics.impressions,
        clicks: metrics.clicks || editingMetrics.clicks,
        conversions: metrics.conversions || editingMetrics.conversions,
        spend: metrics.spend || editingMetrics.spend,
        revenue: metrics.revenue || editingMetrics.revenue,
      }),
    });
    if (res.ok) {
      const { campaign } = await res.json();
      setCampaigns(prev => prev.map(c => c.id === editingMetrics.id ? { ...c, ...campaign } : c));
    }
    setEditingMetrics(null);
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    const res = await fetch(`/api/pro/campaigns/${id}`, { method: "DELETE" });
    if (res.ok) setCampaigns(prev => prev.filter(c => c.id !== id));
    setDeleting(null);
  };

  const ctr = (c: Campaign) => c.impressions > 0 ? ((c.clicks / c.impressions) * 100).toFixed(2) + "%" : "—";
  const roas = (c: Campaign) => c.spend > 0 ? (c.revenue / c.spend).toFixed(2) + "x" : "—";

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Campaign Tracker</h1>
          <p className="text-gray-500 font-medium mt-1">Track multi-channel marketing campaigns and performance</p>
        </div>
        <button onClick={() => setIsCreating(true)}
          className="h-11 px-5 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-sm flex items-center gap-2 cursor-pointer shadow-sm">
          <Plus className="h-4 w-4" /> New Campaign
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className={`h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center ${s.color}`}>{s.icon}</div>
            <div>
              <p className="text-sm text-gray-400 font-medium">{s.label}</p>
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        {["all", "draft", "active", "paused", "completed"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`h-8 px-4 rounded-lg text-sm font-bold capitalize transition-all cursor-pointer ${filter === f ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-500 hover:border-gray-300"}`}>
            {f === "all" ? "All" : statusConfig[f]?.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400 font-medium">Loading campaigns...</div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-20 w-20 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-5">
            <BarChart3 className="h-9 w-9 text-gray-300" />
          </div>
          <h3 className="text-lg font-black text-gray-900 mb-1">No campaigns yet</h3>
          <p className="text-gray-400 font-medium text-sm max-w-xs mb-6">
            Track campaign performance across Meta, Google, LinkedIn and more.
          </p>
          <button onClick={() => setIsCreating(true)}
            className="h-10 px-5 rounded-xl bg-gray-900 text-white font-bold text-sm flex items-center gap-2 cursor-pointer">
            <Plus className="h-4 w-4" /> New Campaign
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(c => {
            const sc = statusConfig[c.status];
            return (
              <div key={c.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:border-gray-200 transition-all">
                <div className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2.5">
                        <h3 className="font-black text-gray-900">{c.name}</h3>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${platformColors[c.platform]}`}>
                          {c.platform}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${sc.color}`}>
                          {sc.icon}{sc.label}
                        </span>
                      </div>
                      {c.objective && <p className="text-sm text-gray-500">{c.objective}</p>}
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span>{new Date(c.startDate).toLocaleDateString("en-GB")}</span>
                        {c.endDate && <span>→ {new Date(c.endDate).toLocaleDateString("en-GB")}</span>}
                        {c.budget && <span>Budget: {c.currency} {c.budget.toLocaleString()}</span>}
                        {c.project && <span className="bg-gray-100 px-2 py-0.5 rounded-full">{c.project.title}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => { setEditingMetrics(c); setMetrics({ impressions: String(c.impressions), clicks: String(c.clicks), conversions: String(c.conversions), spend: String(c.spend), revenue: String(c.revenue) }); }}
                      className="h-9 px-3 rounded-xl border border-gray-200 text-gray-500 text-xs font-bold hover:border-gray-300 flex items-center gap-1.5 cursor-pointer">
                      <TrendingUp className="h-3.5 w-3.5" /> Update Metrics
                    </button>
                    {c.status === "draft" && (
                      <button onClick={() => handleStatusChange(c.id, "active")}
                        className="h-9 px-3 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-100 cursor-pointer">
                        <Play className="h-3.5 w-3.5" /> Launch
                      </button>
                    )}
                    {c.status === "active" && (
                      <button onClick={() => handleStatusChange(c.id, "paused")}
                        className="h-9 px-3 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 text-xs font-bold flex items-center gap-1.5 hover:bg-amber-100 cursor-pointer">
                        <Pause className="h-3.5 w-3.5" /> Pause
                      </button>
                    )}
                    {c.status === "paused" && (
                      <button onClick={() => handleStatusChange(c.id, "active")}
                        className="h-9 px-3 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-100 cursor-pointer">
                        <Play className="h-3.5 w-3.5" /> Resume
                      </button>
                    )}
                    <button onClick={() => handleDelete(c.id)} disabled={deleting === c.id}
                      className="h-9 w-9 rounded-xl border border-gray-200 flex items-center justify-center text-red-400 hover:text-red-600 cursor-pointer disabled:opacity-50">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Metrics bar */}
                <div className="grid grid-cols-5 divide-x divide-gray-100 border-t border-gray-100 bg-gray-50">
                  {[
                    { label: "Impressions", value: c.impressions.toLocaleString(), icon: <Eye className="h-3.5 w-3.5" /> },
                    { label: "Clicks", value: c.clicks.toLocaleString(), icon: <MousePointer className="h-3.5 w-3.5" /> },
                    { label: "CTR", value: ctr(c), icon: <TrendingUp className="h-3.5 w-3.5" /> },
                    { label: "Conversions", value: c.conversions.toLocaleString(), icon: <Target className="h-3.5 w-3.5" /> },
                    { label: "ROAS", value: roas(c), icon: <BarChart3 className="h-3.5 w-3.5" /> },
                  ].map(m => (
                    <div key={m.label} className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">{m.icon}<span className="text-[11px] font-bold uppercase tracking-wide">{m.label}</span></div>
                      <p className="font-black text-gray-900 text-sm">{m.value}</p>
                    </div>
                  ))}
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
                <h2 className="text-xl font-black text-gray-900">New Campaign</h2>
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
                    Campaign Name <span className="text-red-400">*</span>
                  </label>
                  <input type="text" placeholder="e.g. Summer Sale Meta Campaign"
                    value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 transition-all" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[13px] font-black uppercase tracking-wider text-gray-500">Platform</label>
                    <select value={form.platform} onChange={e => setForm(f => ({ ...f, platform: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 transition-all">
                      {PLATFORMS.map(p => <option key={p} value={p}>{platformLabels[p]}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[13px] font-black uppercase tracking-wider text-gray-500">Currency</label>
                    <select value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 transition-all">
                      {["GBP", "USD", "EUR"].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[13px] font-black uppercase tracking-wider text-gray-500">Objective</label>
                  <input type="text" placeholder="e.g. Drive 500 conversions at £10 CPA"
                    value={form.objective} onChange={e => setForm(f => ({ ...f, objective: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 transition-all" />
                </div>

                <div className="grid grid-cols-3 gap-4">
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
                  <div className="space-y-1.5">
                    <label className="block text-[13px] font-black uppercase tracking-wider text-gray-500">Budget</label>
                    <input type="number" placeholder="5000" value={form.budget}
                      onChange={e => setForm(f => ({ ...f, budget: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 transition-all" />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={() => { setIsCreating(false); setForm(emptyForm); }}
                    className="flex-1 h-11 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 cursor-pointer">
                    Cancel
                  </button>
                  <button onClick={handleSave} disabled={saving}
                    className="flex-1 h-11 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-sm cursor-pointer disabled:opacity-50">
                    {saving ? "Saving..." : "Create Campaign"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Update Metrics Modal */}
      <AnimatePresence>
        {editingMetrics && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white rounded-3xl shadow-2xl w-full max-w-md"
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}>
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xl font-black text-gray-900">Update Metrics</h2>
                <button onClick={() => setEditingMetrics(null)}
                  className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900 cursor-pointer">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-sm text-gray-500 font-medium">{editingMetrics.name}</p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: "impressions", label: "Impressions" },
                    { key: "clicks", label: "Clicks" },
                    { key: "conversions", label: "Conversions" },
                    { key: "spend", label: `Spend (${editingMetrics.currency})` },
                    { key: "revenue", label: `Revenue (${editingMetrics.currency})` },
                  ].map(f => (
                    <div key={f.key} className="space-y-1.5">
                      <label className="block text-[13px] font-black uppercase tracking-wider text-gray-500">{f.label}</label>
                      <input type="number" value={(metrics as Record<string, string>)[f.key]}
                        onChange={e => setMetrics(m => ({ ...m, [f.key]: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 transition-all" />
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setEditingMetrics(null)}
                    className="flex-1 h-11 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 cursor-pointer">
                    Cancel
                  </button>
                  <button onClick={handleUpdateMetrics} disabled={saving}
                    className="flex-1 h-11 rounded-xl bg-[#0a9396] text-white font-bold text-sm cursor-pointer disabled:opacity-50 hover:bg-[#0a9396]/90">
                    {saving ? "Saving..." : "Update"}
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
