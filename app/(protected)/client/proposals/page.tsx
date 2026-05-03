"use client";

import {
  FileText, CheckCircle2, XCircle, Clock, Eye, DollarSign,
  Calendar, Send, X, AlertCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProposalPro { name: string; email: string; }
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
  pro: ProposalPro;
}

const statusConfig: Record<Proposal["status"], { label: string; color: string; icon: React.ReactNode }> = {
  draft:    { label: "Draft",    color: "bg-gray-100 text-gray-600",     icon: <FileText className="h-3.5 w-3.5" /> },
  sent:     { label: "Received", color: "bg-blue-50 text-blue-600",      icon: <Send className="h-3.5 w-3.5" /> },
  accepted: { label: "Accepted", color: "bg-emerald-50 text-emerald-600",icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  rejected: { label: "Rejected", color: "bg-red-50 text-red-500",        icon: <XCircle className="h-3.5 w-3.5" /> },
  expired:  { label: "Expired",  color: "bg-amber-50 text-amber-600",    icon: <Clock className="h-3.5 w-3.5" /> },
};

export default function ClientProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<Proposal | null>(null);
  const [actioning, setActioning] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/client/proposals")
      .then(r => r.json())
      .then(d => setProposals(d.proposals ?? []))
      .catch(() => setError("Failed to load proposals"))
      .finally(() => setLoading(false));
  }, []);

  const handleAction = async (id: string, status: "accepted" | "rejected") => {
    setActioning(id);
    try {
      const res = await fetch(`/api/client/proposals/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const { proposal } = await res.json();
        setProposals(prev => prev.map(p => p.id === id ? { ...p, ...proposal } : p));
        if (preview?.id === id) setPreview(prev => prev ? { ...prev, ...proposal } : null);
      }
    } catch {
      setError("Failed to update proposal status.");
    } finally {
      setActioning(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Project Proposals</h1>
        <p className="text-gray-500 font-medium mt-1">Review and manage proposals from your digital partners</p>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3 text-red-600 text-sm font-bold">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {( [
          { label: "Received", value: proposals.filter(p => p.status === "sent").length, color: "text-blue-600" },
          { label: "Accepted", value: proposals.filter(p => p.status === "accepted").length, color: "text-emerald-600" },
          { label: "Pending Value", value: `£${proposals.filter(p => p.status === "sent").reduce((s, p) => s + p.price, 0).toLocaleString()}`, color: "text-gray-900" },
        ] as { label: string; value: string | number; color: string }[]).map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-sm text-gray-400 font-medium mb-1">{s.label}</p>
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-16 text-gray-400 font-medium italic">Loading proposals...</div>
      ) : proposals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-20 w-20 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-5">
            <FileText className="h-9 w-9 text-gray-300" />
          </div>
          <h3 className="text-lg font-black text-gray-900 mb-1">No proposals yet</h3>
          <p className="text-gray-400 font-medium text-sm max-w-xs">
            When a Pro sends you a project proposal, it will appear here for your review.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {proposals.map(p => {
            const sc = statusConfig[p.status] || statusConfig.draft;
            return (
              <motion.div key={p.id} layout
                className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all relative overflow-hidden group">
                {/* Status bar */}
                <div className={`absolute top-0 left-0 w-full h-1.5 ${p.status === 'sent' ? 'bg-blue-400' : p.status === 'accepted' ? 'bg-emerald-400' : 'bg-gray-200'}`} />
                
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 group-hover:scale-110 transition-transform">
                    <FileText className="h-6 w-6 text-gray-400" />
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${sc.color}`}>
                    {sc.icon}{sc.label}
                  </span>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-black text-gray-900 mb-1 truncate">{p.title}</h3>
                  <p className="text-sm text-gray-500 font-bold flex items-center gap-1.5">
                    From {p.pro.name}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider mb-1">Value</p>
                    <p className="text-lg font-black text-gray-900">{p.currency} {p.price.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider mb-1">Timeline</p>
                    <p className="text-lg font-black text-gray-900">{p.timeline}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => setPreview(p)}
                    className="flex-1 h-11 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-all cursor-pointer flex items-center justify-center gap-2">
                    <Eye className="h-4 w-4" /> View Details
                  </button>
                  {p.status === "sent" && (
                    <button onClick={() => handleAction(p.id, "accepted")} disabled={actioning === p.id}
                      className="h-11 px-5 rounded-xl bg-gray-900 text-white font-bold text-sm hover:bg-black transition-all cursor-pointer disabled:opacity-50">
                      Accept
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Preview Modal */}
      <AnimatePresence>
        {preview && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {(() => {
              const p = preview;
              return (
                <motion.div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
                  initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}>
                  
                  {/* Modal Header */}
                  <div className="p-8 border-b border-gray-100 flex items-center justify-between shrink-0">
                    <div>
                      <h2 className="text-2xl font-black text-gray-900 tracking-tight">{p.title}</h2>
                      <p className="text-sm text-[#0a9396] font-bold mt-1">Proposal from {p.pro.name}</p>
                    </div>
                    <button onClick={() => setPreview(null)}
                      className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900 cursor-pointer">
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Modal Body */}
                  <div className="p-8 overflow-y-auto space-y-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-6">
                      <div className="bg-gray-50/50 rounded-2xl p-5 border border-gray-100/50">
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2 flex items-center gap-1.5"><DollarSign className="w-3 h-3" /> Value</p>
                        <p className="text-2xl font-black text-gray-900">{p.currency} {p.price.toLocaleString()}</p>
                      </div>
                      <div className="bg-gray-50/50 rounded-2xl p-5 border border-gray-100/50">
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2 flex items-center gap-1.5"><Clock className="w-3 h-3" /> Timeline</p>
                        <p className="text-2xl font-black text-gray-900">{p.timeline}</p>
                      </div>
                      <div className="bg-gray-50/50 rounded-2xl p-5 border border-gray-100/50">
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2 flex items-center gap-1.5"><Calendar className="w-3 h-3" /> Status</p>
                        <p className={`text-sm font-black uppercase tracking-widest ${statusConfig[p.status]?.color.split(' ')[1]}`}>{p.status}</p>
                      </div>
                    </div>

                    {/* Content Sections */}
                    <div className="space-y-6 text-gray-700 leading-relaxed">
                      <div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#0a9396]" /> Summary
                        </h3>
                        <p className="font-medium bg-gray-50/30 p-4 rounded-2xl border border-gray-100/50 italic text-[15px]">&quot;{p.summary}&quot;</p>
                      </div>

                      <div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#0a9396]" /> Scope of Work
                        </h3>
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[inset_0_2px_10px_rgb(0,0,0,0.02)] whitespace-pre-wrap font-medium">
                          {p.scope}
                        </div>
                      </div>

                      {p.deliverables.length > 0 && (
                        <div>
                          <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#0a9396]" /> Key Deliverables
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {p.deliverables.map((d, i) => (
                              <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm group hover:border-[#0a9396]/30 transition-all">
                                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                                <span className="text-sm font-bold text-gray-700">{d}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex gap-4 shrink-0">
                    {p.status === "sent" ? (
                      <>
                        <button onClick={() => handleAction(p.id, "rejected")} disabled={actioning !== null}
                          className="flex-1 h-14 rounded-2xl border border-gray-200 bg-white text-red-500 font-black text-[15px] uppercase tracking-widest hover:bg-red-50 hover:border-red-100 transition-all cursor-pointer disabled:opacity-50">
                          Reject Proposal
                        </button>
                        <button onClick={() => handleAction(p.id, "accepted")} disabled={actioning !== null}
                          className="flex-[2] h-14 rounded-2xl bg-gray-900 text-white font-black text-[15px] uppercase tracking-widest hover:bg-black transition-all cursor-pointer disabled:opacity-50 shadow-xl shadow-gray-900/20 flex items-center justify-center gap-3">
                          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                          Accept & Proceed
                        </button>
                      </>
                    ) : (
                      <button onClick={() => setPreview(null)}
                        className="w-full h-14 rounded-2xl border border-gray-200 bg-white text-gray-700 font-black text-[15px] uppercase tracking-widest hover:bg-gray-50 transition-all cursor-pointer">
                        Close Preview
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
