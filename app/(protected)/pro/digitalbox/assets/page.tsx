"use client";

import {
  FolderOpen, Plus, X, AlertCircle, Trash2,
  Image, FileText, Film, Type, Palette, Link as LinkIcon,
  Download, Upload,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BrandAsset {
  id: string;
  name: string;
  type: string;
  fileUrl: string;
  mimeType: string | null;
  sizeBytes: number | null;
  notes: string | null;
  clientName: string | null;
  project: { id: string; title: string } | null;
  createdAt: string;
}

const ASSET_TYPES = ["logo", "brand_guideline", "creative", "copy", "video", "font", "other"];
const typeConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  logo:            { label: "Logo",            icon: <Image className="h-5 w-5" />,    color: "text-blue-500 bg-blue-50" },
  brand_guideline: { label: "Brand Guide",     icon: <Palette className="h-5 w-5" />,  color: "text-purple-500 bg-purple-50" },
  creative:        { label: "Creative",        icon: <Image className="h-5 w-5" />,    color: "text-pink-500 bg-pink-50" },
  copy:            { label: "Copy",            icon: <FileText className="h-5 w-5" />, color: "text-amber-500 bg-amber-50" },
  video:           { label: "Video",           icon: <Film className="h-5 w-5" />,     color: "text-red-500 bg-red-50" },
  font:            { label: "Font",            icon: <Type className="h-5 w-5" />,     color: "text-green-500 bg-green-50" },
  other:           { label: "Other",           icon: <FolderOpen className="h-5 w-5" />, color: "text-gray-500 bg-gray-50" },
};

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const emptyForm = { name: "", type: "logo", fileUrl: "", mimeType: "", notes: "", clientName: "", projectId: "" };

export default function AssetsPage() {
  const [assets, setAssets] = useState<BrandAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/pro/assets")
      .then(r => r.json())
      .then(d => setAssets(d.assets ?? []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = assets.filter(a => {
    const matchesFilter = filter === "all" || a.type === filter;
    const matchesSearch = !search || a.name.toLowerCase().includes(search.toLowerCase()) || (a.clientName?.toLowerCase().includes(search.toLowerCase()) ?? false);
    return matchesFilter && matchesSearch;
  });

  const handleSave = async () => {
    setFormError("");
    if (!form.name || !form.fileUrl) { setFormError("Name and file URL are required."); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/pro/assets", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, projectId: form.projectId || null, clientName: form.clientName || null }),
      });
      if (!res.ok) { setFormError((await res.json()).error ?? "Failed to save"); return; }
      const { asset } = await res.json();
      setAssets(prev => [asset, ...prev]);
      setIsAdding(false);
      setForm(emptyForm);
    } catch { setFormError("Network error."); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    const res = await fetch(`/api/pro/assets?id=${id}`, { method: "DELETE" });
    if (res.ok) setAssets(prev => prev.filter(a => a.id !== id));
    setDeleting(null);
  };

  const stats = ASSET_TYPES.map(t => ({ type: t, count: assets.filter(a => a.type === t).length })).filter(s => s.count > 0);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Brand Assets</h1>
          <p className="text-gray-500 font-medium mt-1">Organise logos, creatives, copy, and brand files by client</p>
        </div>
        <button onClick={() => setIsAdding(true)}
          className="h-11 px-5 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-sm flex items-center gap-2 cursor-pointer shadow-sm">
          <Plus className="h-4 w-4" /> Add Asset
        </button>
      </div>

      {/* Summary chips */}
      {stats.length > 0 && (
        <div className="flex gap-3 flex-wrap">
          {stats.map(s => {
            const tc = typeConfig[s.type];
            return (
              <div key={s.type} className={`flex items-center gap-2 px-3 py-2 rounded-xl ${tc.color} border border-current/10`}>
                {tc.icon}
                <span className="text-sm font-bold">{tc.label}</span>
                <span className="text-sm font-black">{s.count}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Search + filter */}
      <div className="flex gap-3 flex-wrap items-center">
        <input type="text" placeholder="Search assets..." value={search} onChange={e => setSearch(e.target.value)}
          className="h-10 px-4 rounded-xl border border-gray-200 text-sm font-medium outline-none focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 transition-all w-60" />
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setFilter("all")}
            className={`h-8 px-4 rounded-lg text-sm font-bold transition-all cursor-pointer ${filter === "all" ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-500"}`}>
            All
          </button>
          {ASSET_TYPES.map(t => (
            <button key={t} onClick={() => setFilter(t)}
              className={`h-8 px-4 rounded-lg text-sm font-bold capitalize transition-all cursor-pointer ${filter === t ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-500 hover:border-gray-300"}`}>
              {typeConfig[t].label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400 font-medium">Loading assets...</div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-20 w-20 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-5">
            <FolderOpen className="h-9 w-9 text-gray-300" />
          </div>
          <h3 className="text-lg font-black text-gray-900 mb-1">No assets yet</h3>
          <p className="text-gray-400 font-medium text-sm max-w-xs mb-6">
            Store logos, brand guidelines, ad creatives, and other files in one organised place.
          </p>
          <button onClick={() => setIsAdding(true)}
            className="h-10 px-5 rounded-xl bg-gray-900 text-white font-bold text-sm flex items-center gap-2 cursor-pointer">
            <Plus className="h-4 w-4" /> Add Asset
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map(asset => {
            const tc = typeConfig[asset.type] ?? typeConfig.other;
            return (
              <div key={asset.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-gray-200 transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${tc.color}`}>
                    {tc.icon}
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a href={asset.fileUrl} target="_blank" rel="noopener noreferrer"
                      className="h-8 w-8 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 cursor-pointer">
                      <Download className="h-3.5 w-3.5" />
                    </a>
                    <button onClick={() => handleDelete(asset.id)} disabled={deleting === asset.id}
                      className="h-8 w-8 rounded-xl border border-gray-200 flex items-center justify-center text-red-400 hover:text-red-600 cursor-pointer disabled:opacity-50">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <h3 className="font-black text-gray-900 text-sm mb-1 truncate">{asset.name}</h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${tc.color}`}>{tc.label}</span>
                  {asset.clientName && <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{asset.clientName}</span>}
                  {asset.project && <span className="text-xs text-gray-400 bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{asset.project.title}</span>}
                  {asset.sizeBytes && <span className="text-xs text-gray-400">{formatBytes(asset.sizeBytes)}</span>}
                </div>
                {asset.notes && <p className="text-xs text-gray-400 mt-2 line-clamp-2">{asset.notes}</p>}
                <div className="flex items-center gap-1 mt-3">
                  <LinkIcon className="h-3 w-3 text-gray-400" />
                  <a href={asset.fileUrl} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-[#0a9396] truncate hover:underline">{asset.fileUrl}</a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Asset Modal */}
      <AnimatePresence>
        {isAdding && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}>
              <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                <h2 className="text-xl font-black text-gray-900">Add Brand Asset</h2>
                <button onClick={() => { setIsAdding(false); setForm(emptyForm); setFormError(""); }}
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

                <div className="p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 text-center">
                  <Upload className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 font-medium">File upload coming soon</p>
                  <p className="text-xs text-gray-400">Enter the file URL below for now</p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[13px] font-black uppercase tracking-wider text-gray-500">
                    Asset Name <span className="text-red-400">*</span>
                  </label>
                  <input type="text" placeholder="e.g. Client Logo v2"
                    value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 transition-all" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[13px] font-black uppercase tracking-wider text-gray-500">Type</label>
                    <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 transition-all">
                      {ASSET_TYPES.map(t => <option key={t} value={t}>{typeConfig[t].label}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[13px] font-black uppercase tracking-wider text-gray-500">Client</label>
                    <input type="text" placeholder="Client name (optional)"
                      value={form.clientName} onChange={e => setForm(f => ({ ...f, clientName: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 transition-all" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[13px] font-black uppercase tracking-wider text-gray-500">
                    File URL <span className="text-red-400">*</span>
                  </label>
                  <input type="url" placeholder="https://..."
                    value={form.fileUrl} onChange={e => setForm(f => ({ ...f, fileUrl: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 transition-all" />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[13px] font-black uppercase tracking-wider text-gray-500">Notes</label>
                  <textarea rows={2} placeholder="Usage notes, version info..."
                    value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 transition-all resize-none" />
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={() => { setIsAdding(false); setForm(emptyForm); }}
                    className="flex-1 h-11 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 cursor-pointer">
                    Cancel
                  </button>
                  <button onClick={handleSave} disabled={saving}
                    className="flex-1 h-11 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-sm cursor-pointer disabled:opacity-50">
                    {saving ? "Saving..." : "Add Asset"}
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
