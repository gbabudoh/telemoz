"use client";

import {
  CalendarDays, Plus, X, AlertCircle, CheckCircle2,
  Clock, Send, Edit3, Trash2, Instagram, Globe,
  Mail, Video, FileText, Megaphone,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ContentItem {
  id: string;
  title: string;
  type: string;
  platform: string | null;
  content: string | null;
  caption: string | null;
  scheduledAt: string | null;
  publishedAt: string | null;
  status: "draft" | "pending_approval" | "approved" | "scheduled" | "published" | "rejected";
  approvalStatus: string;
  rejectionNote: string | null;
  project: { id: string; title: string } | null;
}

const CONTENT_TYPES = ["post", "ad", "email", "video", "blog", "story", "other"];
const typeIcons: Record<string, React.ReactNode> = {
  post: <Instagram className="h-4 w-4" />, ad: <Megaphone className="h-4 w-4" />,
  email: <Mail className="h-4 w-4" />, video: <Video className="h-4 w-4" />,
  blog: <FileText className="h-4 w-4" />, story: <Instagram className="h-4 w-4" />,
  other: <Globe className="h-4 w-4" />,
};

const statusConfig: Record<string, { label: string; color: string }> = {
  draft:            { label: "Draft",            color: "bg-gray-100 text-gray-600" },
  pending_approval: { label: "Pending Approval", color: "bg-amber-50 text-amber-600" },
  approved:         { label: "Approved",         color: "bg-emerald-50 text-emerald-600" },
  scheduled:        { label: "Scheduled",        color: "bg-blue-50 text-blue-600" },
  published:        { label: "Published",        color: "bg-purple-50 text-purple-600" },
  rejected:         { label: "Rejected",         color: "bg-red-50 text-red-500" },
};

const emptyForm = { title: "", type: "post", platform: "", content: "", caption: "", scheduledAt: "", scheduledTime: "", projectId: "" };

export default function ContentCalendarPage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [view, setView] = useState<"list" | "calendar">("list");

  useEffect(() => {
    fetch("/api/pro/content")
      .then(r => r.json())
      .then(d => setItems(d.items ?? []))
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: "Total", value: items.length },
    { label: "Scheduled", value: items.filter(i => i.status === "scheduled").length, color: "text-blue-600" },
    { label: "Published", value: items.filter(i => i.status === "published").length, color: "text-purple-600" },
    { label: "Pending Approval", value: items.filter(i => i.status === "pending_approval").length, color: "text-amber-600" },
  ];

  const filtered = filter === "all" ? items : items.filter(i => i.status === filter);

  const handleSave = async (sendForApproval = false) => {
    setFormError("");
    if (!form.title) { setFormError("Title is required."); return; }
    setSaving(true);
    let scheduledAt: string | null = null;
    if (form.scheduledAt) {
      scheduledAt = form.scheduledTime
        ? `${form.scheduledAt}T${form.scheduledTime}:00`
        : `${form.scheduledAt}T00:00:00`;
    }
    try {
      const res = await fetch("/api/pro/content", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title, type: form.type, platform: form.platform || null,
          content: form.content || null, caption: form.caption || null,
          scheduledAt, projectId: form.projectId || null,
        }),
      });
      if (!res.ok) { setFormError((await res.json()).error ?? "Failed to save"); return; }
      let { item } = await res.json();
      if (sendForApproval) {
        const r2 = await fetch(`/api/pro/content/${item.id}`, {
          method: "PATCH", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "pending_approval" }),
        });
        if (r2.ok) item = (await r2.json()).item;
      } else if (scheduledAt) {
        const r2 = await fetch(`/api/pro/content/${item.id}`, {
          method: "PATCH", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "scheduled" }),
        });
        if (r2.ok) item = (await r2.json()).item;
      }
      setItems(prev => [item, ...prev]);
      setIsCreating(false);
      setForm(emptyForm);
    } catch { setFormError("Network error."); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    const res = await fetch(`/api/pro/content/${id}`, { method: "DELETE" });
    if (res.ok) setItems(prev => prev.filter(i => i.id !== id));
    setDeleting(null);
  };

  const handleMarkPublished = async (id: string) => {
    const res = await fetch(`/api/pro/content/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "published", publishedAt: new Date().toISOString() }),
    });
    if (res.ok) {
      const { item } = await res.json();
      setItems(prev => prev.map(i => i.id === id ? { ...i, ...item } : i));
    }
  };

  // Group by week for calendar view
  const groupedByDate = filtered.reduce<Record<string, ContentItem[]>>((acc, item) => {
    const key = item.scheduledAt
      ? new Date(item.scheduledAt).toLocaleDateString("en-GB", { weekday: "short", month: "short", day: "numeric" })
      : "Unscheduled";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Content Calendar</h1>
          <p className="text-gray-500 font-medium mt-1">Plan, schedule, and track content across all channels</p>
        </div>
        <button onClick={() => setIsCreating(true)}
          className="h-11 px-5 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-sm flex items-center gap-2 cursor-pointer shadow-sm">
          <Plus className="h-4 w-4" /> New Content
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-sm text-gray-400 font-medium mb-1">{s.label}</p>
            <p className={`text-2xl font-black ${s.color ?? "text-gray-900"}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-2 flex-wrap">
          {["all", "draft", "pending_approval", "scheduled", "published"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`h-8 px-4 rounded-lg text-sm font-bold transition-all cursor-pointer ${filter === f ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-500 hover:border-gray-300"}`}>
              {f === "all" ? "All" : statusConfig[f]?.label}
            </button>
          ))}
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {(["list", "calendar"] as const).map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`h-8 px-3 rounded-lg text-sm font-bold capitalize transition-all cursor-pointer ${view === v ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}>
              {v === "list" ? "List" : "Calendar"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400 font-medium">Loading content...</div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-20 w-20 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-5">
            <CalendarDays className="h-9 w-9 text-gray-300" />
          </div>
          <h3 className="text-lg font-black text-gray-900 mb-1">No content planned</h3>
          <p className="text-gray-400 font-medium text-sm max-w-xs mb-6">
            Plan and schedule content for social media, ads, email, and more.
          </p>
          <button onClick={() => setIsCreating(true)}
            className="h-10 px-5 rounded-xl bg-gray-900 text-white font-bold text-sm flex items-center gap-2 cursor-pointer">
            <Plus className="h-4 w-4" /> Create Content
          </button>
        </div>
      ) : view === "list" ? (
        <div className="space-y-3">
          {filtered.map(item => {
            const sc = statusConfig[item.status];
            return (
              <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4 hover:border-gray-200 transition-all">
                <div className="h-10 w-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                  {typeIcons[item.type] ?? typeIcons.other}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-1">
                    <h3 className="font-black text-gray-900 truncate">{item.title}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold whitespace-nowrap ${sc.color}`}>{sc.label}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="capitalize font-medium">{item.type}</span>
                    {item.platform && <span className="bg-gray-100 px-2 py-0.5 rounded-full font-medium">{item.platform}</span>}
                    {item.scheduledAt && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(item.scheduledAt).toLocaleDateString("en-GB", { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </span>
                    )}
                    {item.project && <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">{item.project.title}</span>}
                  </div>
                  {item.caption && <p className="text-sm text-gray-500 mt-1.5 line-clamp-1">{item.caption}</p>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {item.status === "scheduled" && (
                    <button onClick={() => handleMarkPublished(item.id)}
                      className="h-9 px-3 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 text-xs font-bold flex items-center gap-1.5 hover:bg-purple-100 cursor-pointer">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Published
                    </button>
                  )}
                  {item.status === "draft" && (
                    <button onClick={async () => {
                      const r = await fetch(`/api/pro/content/${item.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "pending_approval" }) });
                      if (r.ok) { const { item: u } = await r.json(); setItems(prev => prev.map(i => i.id === item.id ? { ...i, ...u } : i)); }
                    }}
                      className="h-9 px-3 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 text-xs font-bold flex items-center gap-1.5 hover:bg-amber-100 cursor-pointer">
                      <Send className="h-3.5 w-3.5" /> Submit
                    </button>
                  )}
                  <button onClick={() => handleDelete(item.id)} disabled={deleting === item.id}
                    className="h-9 w-9 rounded-xl border border-gray-200 flex items-center justify-center text-red-400 hover:text-red-600 cursor-pointer disabled:opacity-50">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // Calendar view — grouped by date
        <div className="space-y-6">
          {Object.entries(groupedByDate).map(([date, dateItems]) => (
            <div key={date}>
              <h3 className="text-sm font-black uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />{date}
              </h3>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {dateItems.map(item => {
                  const sc = statusConfig[item.status];
                  return (
                    <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:border-gray-200 transition-all">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500">
                          {typeIcons[item.type] ?? typeIcons.other}
                        </div>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${sc.color}`}>{sc.label}</span>
                      </div>
                      <h4 className="font-black text-gray-900 text-sm mb-1">{item.title}</h4>
                      {item.caption && <p className="text-xs text-gray-500 line-clamp-2">{item.caption}</p>}
                      {item.platform && <p className="text-xs text-gray-400 mt-2 font-medium">{item.platform}</p>}
                    </div>
                  );
                })}
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
            <motion.div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}>
              <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                <h2 className="text-xl font-black text-gray-900">New Content</h2>
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
                    Title <span className="text-red-400">*</span>
                  </label>
                  <input type="text" placeholder="e.g. Summer Sale Instagram Reel"
                    value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 transition-all" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[13px] font-black uppercase tracking-wider text-gray-500">Type</label>
                    <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 transition-all">
                      {CONTENT_TYPES.map(t => <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[13px] font-black uppercase tracking-wider text-gray-500">Platform</label>
                    <input type="text" placeholder="e.g. Instagram, TikTok"
                      value={form.platform} onChange={e => setForm(f => ({ ...f, platform: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 transition-all" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[13px] font-black uppercase tracking-wider text-gray-500">Caption / Body</label>
                  <textarea rows={3} placeholder="Post caption or content body..."
                    value={form.caption} onChange={e => setForm(f => ({ ...f, caption: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 transition-all resize-none" />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[13px] font-black uppercase tracking-wider text-gray-500">Notes / Brief</label>
                  <textarea rows={2} placeholder="Internal notes, links, hashtags..."
                    value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 transition-all resize-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[13px] font-black uppercase tracking-wider text-gray-500">Scheduled Date</label>
                    <input type="date" value={form.scheduledAt} onChange={e => setForm(f => ({ ...f, scheduledAt: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[13px] font-black uppercase tracking-wider text-gray-500">Time</label>
                    <input type="time" value={form.scheduledTime} onChange={e => setForm(f => ({ ...f, scheduledTime: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 transition-all" />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={() => handleSave(false)} disabled={saving}
                    className="flex-1 h-11 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 cursor-pointer disabled:opacity-50">
                    {saving ? "Saving..." : "Save Draft"}
                  </button>
                  <button onClick={() => handleSave(true)} disabled={saving}
                    className="flex-1 h-11 rounded-xl bg-[#0a9396] hover:bg-[#0a9396]/90 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm shadow-teal-500/20">
                    <Edit3 className="h-4 w-4" />{saving ? "Submitting..." : "Submit for Approval"}
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
