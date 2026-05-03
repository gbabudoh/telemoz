"use client";

import {
  FilePenLine, CheckCircle2, XCircle, Send, Eye, Clock,
  PenLine, X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ContractPro { name: string; email: string; }
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
  pro: ContractPro;
}

const statusConfig: Record<Contract["status"], { label: string; color: string; icon: React.ReactNode }> = {
  draft:     { label: "Draft",     color: "bg-gray-100 text-gray-600",      icon: <FilePenLine className="h-3.5 w-3.5" /> },
  sent:      { label: "Received",  color: "bg-blue-50 text-blue-600",       icon: <Send className="h-3.5 w-3.5" /> },
  signed:    { label: "Signed",    color: "bg-emerald-50 text-emerald-600", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  expired:   { label: "Expired",   color: "bg-amber-50 text-amber-600",     icon: <Clock className="h-3.5 w-3.5" /> },
  cancelled: { label: "Cancelled", color: "bg-red-50 text-red-500",         icon: <XCircle className="h-3.5 w-3.5" /> },
};

export default function ClientContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<Contract | null>(null);
  const [signing, setSigning] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/client/contracts")
      .then(r => r.json())
      .then(d => setContracts(d.contracts ?? []))
      .finally(() => setLoading(false));
  }, []);

  const handleSign = async (id: string) => {
    setSigning(id);
    try {
      const res = await fetch(`/api/client/contracts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "sign" }),
      });
      if (res.ok) {
        const { contract } = await res.json();
        setContracts(prev => prev.map(c => c.id === id ? { ...c, ...contract } : c));
        if (preview?.id === id) setPreview(prev => prev ? { ...prev, ...contract } : null);
      }
    } catch {
      console.error("Failed to sign contract.");
    } finally {
      setSigning(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Legal Contracts</h1>
        <p className="text-gray-500 font-medium mt-1">Manage and sign your digital service agreements</p>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-center py-16 text-gray-400 font-medium italic">Loading contracts...</div>
      ) : contracts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-20 w-20 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-5">
            <FilePenLine className="h-9 w-9 text-gray-300" />
          </div>
          <h3 className="text-lg font-black text-gray-900 mb-1">No contracts yet</h3>
          <p className="text-gray-400 font-medium text-sm max-w-xs">
            Once a Pro generates a contract from an accepted proposal, it will appear here for your signature.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contracts.map(c => {
            const sc = statusConfig[c.status] || statusConfig.draft;
            return (
              <motion.div key={c.id} layout
                className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all relative overflow-hidden group">
                <div className={`absolute top-0 left-0 w-full h-1.5 ${c.status === 'signed' ? 'bg-emerald-400' : 'bg-blue-400'}`} />
                
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 group-hover:rotate-12 transition-transform">
                    <FilePenLine className="h-6 w-6 text-gray-400" />
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${sc.color}`}>
                    {sc.icon}{sc.label}
                  </span>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-black text-gray-900 mb-1 truncate">{c.title}</h3>
                  <p className="text-sm text-gray-500 font-bold">With {c.pro.name}</p>
                </div>

                <div className="flex flex-col gap-3 mb-6 bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400 font-bold uppercase">Pro Signed</span>
                    <span className={`font-black ${c.proSignedAt ? 'text-emerald-600' : 'text-gray-400'}`}>
                      {c.proSignedAt ? 'YES' : 'PENDING'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400 font-bold uppercase">Client Signed</span>
                    <span className={`font-black ${c.clientSignedAt ? 'text-emerald-600' : 'text-gray-400'}`}>
                      {c.clientSignedAt ? 'YES' : 'PENDING'}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => setPreview(c)}
                    className="flex-1 h-11 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-all cursor-pointer flex items-center justify-center gap-2">
                    <Eye className="h-4 w-4" /> View Agreement
                  </button>
                  {c.status === "sent" && !c.clientSignedAt && (
                    <button onClick={() => handleSign(c.id)} disabled={signing === c.id}
                      className="h-11 px-5 rounded-xl bg-gray-900 text-white font-bold text-sm hover:bg-black transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2">
                      <PenLine className="h-4 w-4" /> Sign
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
              const c = preview;
              return (
                <motion.div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
                  initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}>
                  
                  <div className="p-8 border-b border-gray-100 flex items-center justify-between shrink-0">
                    <div>
                      <h2 className="text-2xl font-black text-gray-900 tracking-tight">{c.title}</h2>
                      <p className="text-sm text-[#0a9396] font-bold mt-1">Agreement with {c.pro.name}</p>
                    </div>
                    <button onClick={() => setPreview(null)}
                      className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900 cursor-pointer">
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="p-8 overflow-y-auto">
                    {/* Signatures status box */}
                    <div className="grid grid-cols-2 gap-6 mb-8">
                      <div className="bg-gray-50/50 rounded-2xl p-5 border border-gray-100/50 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2">
                          {c.proSignedAt ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Clock className="w-5 h-5 text-gray-300" />}
                        </div>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Pro Signature</p>
                        <p className={`text-sm font-black ${c.proSignedAt ? 'text-gray-900' : 'text-gray-400'}`}>
                          {c.proSignedAt ? `Signed on ${new Date(c.proSignedAt).toLocaleDateString()}` : "Pending Signature"}
                        </p>
                      </div>
                      <div className="bg-gray-50/50 rounded-2xl p-5 border border-gray-100/50 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2">
                          {c.clientSignedAt ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Clock className="w-5 h-5 text-gray-300" />}
                        </div>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Your Signature</p>
                        <p className={`text-sm font-black ${c.clientSignedAt ? 'text-gray-900' : 'text-gray-400'}`}>
                          {c.clientSignedAt ? `Signed on ${new Date(c.clientSignedAt).toLocaleDateString()}` : "Pending Signature"}
                        </p>
                      </div>
                    </div>

                    <div className="prose prose-sm max-w-none">
                      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[inset_0_2px_15px_rgb(0,0,0,0.02)] whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
                        {c.content}
                      </div>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex gap-4 shrink-0">
                    {!c.clientSignedAt && c.status === "sent" ? (
                      <button onClick={() => handleSign(c.id)} disabled={signing !== null}
                        className="w-full h-14 rounded-2xl bg-gray-900 text-white font-black text-[15px] uppercase tracking-widest hover:bg-black transition-all cursor-pointer disabled:opacity-50 shadow-xl shadow-gray-900/20 flex items-center justify-center gap-3">
                        <PenLine className="h-5 w-5" />
                        Sign Agreement
                      </button>
                    ) : (
                      <button onClick={() => setPreview(null)}
                        className="w-full h-14 rounded-2xl border border-gray-200 bg-white text-gray-700 font-black text-[15px] uppercase tracking-widest hover:bg-gray-50 transition-all cursor-pointer">
                        Close Agreement
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
