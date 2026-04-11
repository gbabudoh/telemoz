"use client";

import {
  FilePenLine, Plus, Send, CheckCircle2, X, AlertCircle,
  Trash2, Eye, PenLine, Clock, FileX,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ContractClient { id: string; name: string; email: string; }
interface Contract {
  id: string;
  title: string;
  content: string;
  value: number | null;
  currency: string;
  status: "draft" | "sent" | "signed" | "expired" | "cancelled";
  proSignedAt: string | null;
  clientSignedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  client: ContractClient;
}

const CONTRACT_TEMPLATE = `# Services Agreement

**This agreement** is entered into between the service provider ("Pro") and the client ("Client") as detailed in the proposal.

## 1. Scope of Services
The Pro agrees to deliver the services as outlined in the attached proposal, including all deliverables and milestones described therein.

## 2. Payment Terms
Client agrees to pay the agreed fee as specified. Payment is due within 14 days of invoice. Late payments incur a 2% monthly interest charge.

## 3. Intellectual Property
Upon full payment, all deliverables created specifically for this project transfer to the Client. The Pro retains the right to display work in their portfolio.

## 4. Confidentiality
Both parties agree to keep confidential any proprietary information shared during the engagement.

## 5. Termination
Either party may terminate this agreement with 14 days written notice. Work completed to date will be invoiced accordingly.

## 6. Limitation of Liability
The Pro's total liability shall not exceed the total fees paid under this agreement.

## 7. Governing Law
This agreement is governed by the laws of England and Wales.`;

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  draft:     { label: "Draft",     color: "bg-gray-100 text-gray-600",      icon: <FilePenLine className="h-3.5 w-3.5" /> },
  sent:      { label: "Sent",      color: "bg-blue-50 text-blue-600",       icon: <Send className="h-3.5 w-3.5" /> },
  signed:    { label: "Signed",    color: "bg-emerald-50 text-emerald-600", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  expired:   { label: "Expired",   color: "bg-amber-50 text-amber-600",     icon: <Clock className="h-3.5 w-3.5" /> },
  cancelled: { label: "Cancelled", color: "bg-red-50 text-red-500",         icon: <FileX className="h-3.5 w-3.5" /> },
};

const emptyForm = {
  clientName: "", clientEmail: "", title: "", content: CONTRACT_TEMPLATE,
  value: "", currency: "GBP", expiresAt: "",
};

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState<Contract | null>(null);
  const [signing, setSigning] = useState<string | null>(null);
  const [sending, setSending] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/pro/contracts")
      .then(r => r.json())
      .then(d => setContracts(d.contracts ?? []))
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: "Total", value: contracts.length },
    { label: "Awaiting Signature", value: contracts.filter(c => c.status === "sent").length },
    { label: "Signed", value: contracts.filter(c => c.status === "signed").length },
    { label: "Total Value", value: `£${contracts.filter(c => c.value).reduce((s, c) => s + (c.value ?? 0), 0).toLocaleString()}` },
  ];

  const filtered = filter === "all" ? contracts : contracts.filter(c => c.status === filter);

  const handleSave = async (send = false) => {
    setFormError("");
    if (!form.clientName || !form.clientEmail || !form.title || !form.content) {
      setFormError("Please fill in all required fields.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/pro/contracts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: form.clientEmail,
          title: form.title, content: form.content,
          value: form.value || null, currency: form.currency,
          expiresAt: form.expiresAt || null,
        }),
      });
      if (!res.ok) { setFormError((await res.json()).error ?? "Failed to save"); return; }
      let { contract } = await res.json();
      contract = { ...contract, client: { id: contract.clientId, name: form.clientName, email: form.clientEmail } };

      if (send) {
        const r2 = await fetch(`/api/pro/contracts/${contract.id}`, {
          method: "PATCH", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "sent" }),
        });
        if (r2.ok) contract = { ...contract, ...(await r2.json()).contract };
      }
      setContracts(prev => [contract, ...prev]);
      setIsCreating(false);
      setForm(emptyForm);
    } catch { setFormError("Network error."); }
    finally { setSaving(false); }
  };

  const handleSign = async (id: string) => {
    setSigning(id);
    const res = await fetch(`/api/pro/contracts/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "sign" }),
    });
    if (res.ok) {
      const { contract } = await res.json();
      setContracts(prev => prev.map(c => c.id === id ? { ...c, ...contract } : c));
    }
    setSigning(null);
  };

  const handleSend = async (id: string) => {
    setSending(id);
    const res = await fetch(`/api/pro/contracts/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "sent" }),
    });
    if (res.ok) setContracts(prev => prev.map(c => c.id === id ? { ...c, status: "sent" } : c));
    setSending(null);
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    const res = await fetch(`/api/pro/contracts/${id}`, { method: "DELETE" });
    if (res.ok) setContracts(prev => prev.filter(c => c.id !== id));
    setDeleting(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Contracts</h1>
          <p className="text-gray-500 font-medium mt-1">Create and manage client agreements</p>
        </div>
        <button onClick={() => setIsCreating(true)}
          className="h-11 px-5 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-sm flex items-center gap-2 transition-colors cursor-pointer shadow-sm">
          <Plus className="h-4 w-4" /> New Contract
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-sm text-gray-400 font-medium mb-1">{s.label}</p>
            <p className="text-2xl font-black text-gray-900">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        {["all", "draft", "sent", "signed", "expired"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`h-8 px-4 rounded-lg text-sm font-bold capitalize transition-all cursor-pointer ${filter === f ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-500 hover:border-gray-300"}`}>
            {f === "all" ? "All" : statusConfig[f]?.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400 font-medium">Loading contracts...</div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-20 w-20 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-5">
            <FilePenLine className="h-9 w-9 text-gray-300" />
          </div>
          <h3 className="text-lg font-black text-gray-900 mb-1">No contracts yet</h3>
          <p className="text-gray-400 font-medium text-sm max-w-xs mb-6">
            Draft a contract, send it to your client, and get it signed — all in one place.
          </p>
          <button onClick={() => setIsCreating(true)}
            className="h-10 px-5 rounded-xl bg-gray-900 text-white font-bold text-sm flex items-center gap-2 cursor-pointer">
            <Plus className="h-4 w-4" /> Create Contract
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(c => {
            const sc = statusConfig[c.status];
            return (
              <div key={c.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-5 hover:border-gray-200 transition-all">
                <div className="h-11 w-11 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                  <FilePenLine className="h-5 w-5 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-black text-gray-900 truncate">{c.title}</h3>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${sc.color}`}>
                      {sc.icon}{sc.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 font-medium">{c.client.name}</p>
                  <div className="flex items-center gap-4 mt-1">
                    {c.value && <p className="text-xs text-gray-400">{c.currency} {c.value.toLocaleString()}</p>}
                    <p className="text-xs text-gray-400">
                      Pro: {c.proSignedAt ? "Signed" : "Unsigned"} · Client: {c.clientSignedAt ? "Signed" : "Unsigned"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => setPreview(c)}
                    className="h-9 w-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 cursor-pointer">
                    <Eye className="h-4 w-4" />
                  </button>
                  {c.status === "draft" && (
                    <button onClick={() => handleSend(c.id)} disabled={sending === c.id}
                      className="h-9 px-3 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 text-xs font-bold flex items-center gap-1.5 hover:bg-blue-100 transition-all cursor-pointer disabled:opacity-50">
                      <Send className="h-3.5 w-3.5" />{sending === c.id ? "Sending..." : "Send"}
                    </button>
                  )}
                  {(c.status === "sent" || c.status === "draft") && !c.proSignedAt && (
                    <button onClick={() => handleSign(c.id)} disabled={signing === c.id}
                      className="h-9 px-3 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-100 transition-all cursor-pointer disabled:opacity-50">
                      <PenLine className="h-3.5 w-3.5" />{signing === c.id ? "Signing..." : "Sign"}
                    </button>
                  )}
                  {c.status === "draft" && (
                    <button onClick={() => handleDelete(c.id)} disabled={deleting === c.id}
                      className="h-9 w-9 rounded-xl border border-gray-200 flex items-center justify-center text-red-400 hover:text-red-600 cursor-pointer disabled:opacity-50">
                      <Trash2 className="h-3.5 w-3.5" />
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
            <motion.div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}>
              <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                <h2 className="text-xl font-black text-gray-900">New Contract</h2>
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
                  {["clientName", "clientEmail"].map(key => (
                    <div key={key} className="space-y-1.5">
                      <label className="block text-[13px] font-black uppercase tracking-wider text-gray-500">
                        {key === "clientName" ? "Client Name" : "Client Email"} <span className="text-red-400">*</span>
                      </label>
                      <input type={key === "clientEmail" ? "email" : "text"}
                        placeholder={key === "clientName" ? "Jane Smith" : "jane@company.com"}
                        value={(form as Record<string, string>)[key]}
                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 transition-all" />
                    </div>
                  ))}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[13px] font-black uppercase tracking-wider text-gray-500">
                    Contract Title <span className="text-red-400">*</span>
                  </label>
                  <input type="text" placeholder="e.g. Digital Marketing Services Agreement"
                    value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 transition-all" />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[13px] font-black uppercase tracking-wider text-gray-500">Contract Value</label>
                    <input type="number" placeholder="0.00" value={form.value}
                      onChange={e => setForm(f => ({ ...f, value: e.target.value }))}
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
                    <label className="block text-[13px] font-black uppercase tracking-wider text-gray-500">Expires</label>
                    <input type="date" value={form.expiresAt} onChange={e => setForm(f => ({ ...f, expiresAt: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 transition-all" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[13px] font-black uppercase tracking-wider text-gray-500">
                    Contract Body <span className="text-red-400">*</span>
                    <span className="ml-2 text-gray-400 normal-case font-medium text-xs">(Markdown supported)</span>
                  </label>
                  <textarea rows={12} value={form.content}
                    onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono text-gray-900 outline-none focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 transition-all resize-none" />
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={() => handleSave(false)} disabled={saving}
                    className="flex-1 h-11 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-all cursor-pointer disabled:opacity-50">
                    {saving ? "Saving..." : "Save Draft"}
                  </button>
                  <button onClick={() => handleSave(true)} disabled={saving}
                    className="flex-1 h-11 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50">
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
                  <p className="text-sm text-gray-500 mt-0.5">{preview.client.name}</p>
                </div>
                <button onClick={() => setPreview(null)}
                  className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900 cursor-pointer">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-400 mb-1">Pro Signature</p>
                    <p className={`text-sm font-black ${preview.proSignedAt ? "text-emerald-600" : "text-gray-400"}`}>
                      {preview.proSignedAt ? `Signed ${new Date(preview.proSignedAt).toLocaleDateString("en-GB")}` : "Not signed"}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-400 mb-1">Client Signature</p>
                    <p className={`text-sm font-black ${preview.clientSignedAt ? "text-emerald-600" : "text-gray-400"}`}>
                      {preview.clientSignedAt ? `Signed ${new Date(preview.clientSignedAt).toLocaleDateString("en-GB")}` : "Not signed"}
                    </p>
                  </div>
                </div>
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">{preview.content}</pre>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
