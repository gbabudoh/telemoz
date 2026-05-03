"use client";

import {
  FileText, Plus, Send, CheckCircle2, XCircle, Clock, Trash2,
  ChevronRight, AlertCircle, X, Eye, DollarSign, FilePenLine,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface ProposalClient { id: string; name: string; email: string; }
interface Proposal {
  id: string;
  title: string;
  summary: string;
  scope: string;
  deliverables: string[];
  timeline: string;
  price: number;
  currency: string;
  validUntil: string | null;
  status: "draft" | "sent" | "accepted" | "rejected" | "expired";
  notes: string | null;
  acceptedAt: string | null;
  rejectedAt: string | null;
  createdAt: string;
  client: ProposalClient;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  draft:    { label: "Draft",    color: "bg-gray-100 text-gray-600",     icon: <FileText className="h-3.5 w-3.5" /> },
  sent:     { label: "Sent",     color: "bg-blue-50 text-blue-600",      icon: <Send className="h-3.5 w-3.5" /> },
  accepted: { label: "Accepted", color: "bg-emerald-50 text-emerald-600",icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  rejected: { label: "Rejected", color: "bg-red-50 text-red-500",        icon: <XCircle className="h-3.5 w-3.5" /> },
  expired:  { label: "Expired",  color: "bg-amber-50 text-amber-600",    icon: <Clock className="h-3.5 w-3.5" /> },
};

const emptyForm = {
  clientName: "", clientEmail: "", title: "", summary: "",
  scope: "", deliverables: [""], timeline: "", price: "",
  currency: "GBP", validUntil: "", notes: "",
};

export default function ProposalsPage() {
  const router = useRouter();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [preview, setPreview] = useState<Proposal | null>(null);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetch("/api/pro/proposals")
      .then(r => r.json())
      .then(d => setProposals(d.proposals ?? []))
      .catch(() => setError("Failed to load proposals"))
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: "Total", value: proposals.length, color: "text-gray-900" },
    { label: "Sent", value: proposals.filter(p => p.status === "sent").length, color: "text-blue-600" },
    { label: "Accepted", value: proposals.filter(p => p.status === "accepted").length, color: "text-emerald-600" },
    { label: "Total Value", value: `£${proposals.filter(p => p.status === "accepted").reduce((s, p) => s + p.price, 0).toLocaleString()}`, color: "text-[#0a9396]" },
  ];

  const filtered = filter === "all" ? proposals : proposals.filter(p => p.status === filter);

  const handleSave = async (send = false) => {
    setFormError("");
    if (!form.clientName || !form.clientEmail || !form.title || !form.summary || !form.scope || !form.price) {
      setFormError("Please fill in all required fields.");
      return;
    }
    setSaving(true);
    try {
      // First create a temporary client entry via existing user lookup or stub
      const res = await fetch("/api/pro/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: form.clientEmail, // will be resolved on server via email lookup
          title: form.title,
          summary: form.summary,
          scope: form.scope,
          deliverables: form.deliverables.filter(Boolean),
          timeline: form.timeline,
          price: form.price,
          currency: form.currency,
          validUntil: form.validUntil || null,
          notes: form.notes || null,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        setFormError(d.error ?? "Failed to save proposal");
        return;
      }
      const data = await res.json();
      let proposal = data.proposal;
      if (send) {
        const sendRes = await fetch(`/api/pro/proposals/${proposal.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "sent" }),
        });
        if (sendRes.ok) proposal = (await sendRes.json()).proposal;
      }
      setProposals(prev => [{ ...proposal, client: { id: proposal.clientId, name: form.clientName, email: form.clientEmail } }, ...prev]);
      setIsCreating(false);
      setForm(emptyForm);
    } catch {
      setFormError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleSend = async (id: string) => {
    setSending(id);
    const res = await fetch(`/api/pro/proposals/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "sent" }),
    });
    if (res.ok) {
      setProposals(prev => prev.map(p => p.id === id ? { ...p, status: "sent" } : p));
    }
    setSending(null);
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    const res = await fetch(`/api/pro/proposals/${id}`, { method: "DELETE" });
    if (res.ok) setProposals(prev => prev.filter(p => p.id !== id));
    setDeleting(null);
  };

  const addDeliverable = () => setForm(f => ({ ...f, deliverables: [...f.deliverables, ""] }));
  const updateDeliverable = (i: number, v: string) =>
    setForm(f => ({ ...f, deliverables: f.deliverables.map((d, idx) => idx === i ? v : d) }));
  const removeDeliverable = (i: number) =>
    setForm(f => ({ ...f, deliverables: f.deliverables.filter((_, idx) => idx !== i) }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Proposals</h1>
          <p className="text-gray-500 font-medium mt-1">Create and send project proposals to clients</p>
        </div>
        <button onClick={() => setIsCreating(true)}
          className="h-11 px-5 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-sm flex items-center gap-2 transition-colors cursor-pointer shadow-sm">
          <Plus className="h-4 w-4" /> New Proposal
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-sm text-gray-400 font-medium mb-1">{s.label}</p>
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {["all", "draft", "sent", "accepted", "rejected"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`h-8 px-4 rounded-lg text-sm font-bold capitalize transition-all cursor-pointer ${filter === f ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-500 hover:border-gray-300"}`}>
            {f === "all" ? "All" : statusConfig[f]?.label}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-16 text-gray-400 font-medium">Loading proposals...</div>
      ) : error ? (
        <div className="text-center py-16 text-red-500 font-medium">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-20 w-20 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-5">
            <FileText className="h-9 w-9 text-gray-300" />
          </div>
          <h3 className="text-lg font-black text-gray-900 mb-1">No proposals yet</h3>
          <p className="text-gray-400 font-medium text-sm max-w-xs mb-6">
            Create a proposal to outline scope, deliverables, and pricing for a client.
          </p>
          <button onClick={() => setIsCreating(true)}
            className="h-10 px-5 rounded-xl bg-gray-900 text-white font-bold text-sm flex items-center gap-2 cursor-pointer">
            <Plus className="h-4 w-4" /> Create Proposal
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(p => {
            const sc = statusConfig[p.status];
            return (
              <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-5 hover:border-gray-200 transition-all">
                <div className="h-11 w-11 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-black text-gray-900 truncate">{p.title}</h3>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${sc.color}`}>
                      {sc.icon}{sc.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 font-medium">{p.client.name} · {p.client.email}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{p.timeline} · {p.currency} {p.price.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => setPreview(p)}
                    className="h-9 w-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:border-gray-300 transition-all cursor-pointer">
                    <Eye className="h-4 w-4" />
                  </button>
                  {p.status === "draft" && (
                    <button onClick={() => handleSend(p.id)} disabled={sending === p.id}
                      className="h-9 px-3 rounded-xl bg-[#0a9396]/10 text-[#0a9396] border border-[#0a9396]/20 text-xs font-bold flex items-center gap-1.5 hover:bg-[#0a9396]/20 transition-all cursor-pointer disabled:opacity-50">
                      <Send className="h-3.5 w-3.5" />{sending === p.id ? "Sending..." : "Send"}
                    </button>
                  )}
                  {(p.status === "draft") && (
                    <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id}
                      className="h-9 w-9 rounded-xl border border-gray-200 flex items-center justify-center text-red-400 hover:text-red-600 hover:border-red-200 transition-all cursor-pointer disabled:opacity-50">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                  {p.status === "accepted" && (
                    <button onClick={async () => {
                      const res = await fetch("/api/pro/contracts/from-proposal", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ proposalId: p.id }),
                      });
                      if (res.ok) router.push("/pro/digitalbox/contracts");
                    }}
                      className="h-9 px-3 rounded-xl bg-gray-900 text-white border border-gray-900 text-xs font-bold flex items-center gap-1.5 hover:bg-black transition-all cursor-pointer">
                      <FilePenLine className="h-3.5 w-3.5" /> Convert to Contract
                    </button>
                  )}
                  <ChevronRight className="h-4 w-4 text-gray-300" />
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
            <motion.div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}>
              <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                <h2 className="text-xl font-black text-gray-900">New Proposal</h2>
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

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Client Name", key: "clientName", placeholder: "Jane Smith", required: true },
                    { label: "Client Email", key: "clientEmail", placeholder: "jane@company.com", required: true, type: "email" },
                  ].map(f => (
                    <div key={f.key} className="space-y-1.5">
                      <label className="block text-[13px] font-black uppercase tracking-wider text-gray-500">
                        {f.label} {f.required && <span className="text-red-400">*</span>}
                      </label>
                      <input type={f.type ?? "text"} placeholder={f.placeholder}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        value={(form as any)[f.key]}
                        onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 placeholder-gray-400 outline-none focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 transition-all" />
                    </div>
                  ))}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[13px] font-black uppercase tracking-wider text-gray-500">
                    Proposal Title <span className="text-red-400">*</span>
                  </label>
                  <input type="text" placeholder="e.g. Q3 Social Media Campaign Strategy"
                    value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 placeholder-gray-400 outline-none focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 transition-all" />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[13px] font-black uppercase tracking-wider text-gray-500">
                    Executive Summary <span className="text-red-400">*</span>
                  </label>
                  <textarea rows={2} placeholder="Brief overview of the proposal..."
                    value={form.summary} onChange={e => setForm(f => ({ ...f, summary: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 placeholder-gray-400 outline-none focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 transition-all resize-none" />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[13px] font-black uppercase tracking-wider text-gray-500">
                    Scope of Work <span className="text-red-400">*</span>
                  </label>
                  <textarea rows={4} placeholder="Detailed description of what will be delivered..."
                    value={form.scope} onChange={e => setForm(f => ({ ...f, scope: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 placeholder-gray-400 outline-none focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 transition-all resize-none" />
                </div>

                <div className="space-y-2">
                  <label className="block text-[13px] font-black uppercase tracking-wider text-gray-500">Deliverables</label>
                  {form.deliverables.map((d, i) => (
                    <div key={i} className="flex gap-2">
                      <input type="text" placeholder={`Deliverable ${i + 1}`} value={d}
                        onChange={e => updateDeliverable(i, e.target.value)}
                        className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-900 placeholder-gray-400 outline-none focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 transition-all" />
                      {form.deliverables.length > 1 && (
                        <button onClick={() => removeDeliverable(i)}
                          className="h-10 w-10 rounded-xl border border-gray-200 flex items-center justify-center text-red-400 hover:text-red-600 cursor-pointer flex-shrink-0">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button onClick={addDeliverable}
                    className="h-9 px-4 rounded-xl border border-dashed border-gray-300 text-gray-500 text-sm font-bold hover:border-gray-400 transition-all cursor-pointer flex items-center gap-1.5">
                    <Plus className="h-3.5 w-3.5" /> Add Deliverable
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[13px] font-black uppercase tracking-wider text-gray-500">Timeline</label>
                    <input type="text" placeholder="e.g. 6 weeks"
                      value={form.timeline} onChange={e => setForm(f => ({ ...f, timeline: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 placeholder-gray-400 outline-none focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[13px] font-black uppercase tracking-wider text-gray-500">
                      Price <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input type="number" placeholder="0.00"
                        value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-3 text-sm font-medium text-gray-900 placeholder-gray-400 outline-none focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 transition-all" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[13px] font-black uppercase tracking-wider text-gray-500">Currency</label>
                    <select value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 outline-none focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 transition-all">
                      {["GBP", "USD", "EUR"].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[13px] font-black uppercase tracking-wider text-gray-500">Valid Until</label>
                  <input type="date" value={form.validUntil} onChange={e => setForm(f => ({ ...f, validUntil: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 outline-none focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 transition-all" />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[13px] font-black uppercase tracking-wider text-gray-500">Internal Notes</label>
                  <textarea rows={2} placeholder="Notes visible only to you..."
                    value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 placeholder-gray-400 outline-none focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 transition-all resize-none" />
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={() => handleSave(false)} disabled={saving}
                    className="flex-1 h-11 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-all cursor-pointer disabled:opacity-50">
                    {saving ? "Saving..." : "Save Draft"}
                  </button>
                  <button onClick={() => handleSave(true)} disabled={saving}
                    className="flex-1 h-11 rounded-xl bg-[#0a9396] hover:bg-[#0a9396]/90 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 shadow-sm shadow-teal-500/20">
                    <Send className="h-4 w-4" />{saving ? "Sending..." : "Save & Send"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {preview && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}>
              <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                <div>
                  <h2 className="text-xl font-black text-gray-900">{preview.title}</h2>
                  <p className="text-sm text-gray-500 mt-0.5">For {preview.client.name}</p>
                </div>
                <button onClick={() => setPreview(null)}
                  className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900 cursor-pointer">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <p className="text-xs text-gray-400 font-medium mb-1">Value</p>
                    <p className="text-xl font-black text-gray-900">{preview.currency} {preview.price.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <p className="text-xs text-gray-400 font-medium mb-1">Timeline</p>
                    <p className="text-xl font-black text-gray-900">{preview.timeline || "—"}</p>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <p className="text-xs text-gray-400 font-medium mb-1">Status</p>
                    <p className={`text-sm font-black capitalize ${statusConfig[preview.status]?.color.split(" ")[1]}`}>{preview.status}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-gray-500 mb-2">Summary</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{preview.summary}</p>
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-gray-500 mb-2">Scope of Work</h3>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{preview.scope}</p>
                </div>
                {preview.deliverables.length > 0 && (
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-gray-500 mb-2">Deliverables</h3>
                    <ul className="space-y-2">
                      {preview.deliverables.map((d, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />{d}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
