"use client";

import {
  FileCheck2, CreditCard, Clock, CheckCircle2, AlertCircle,
  Eye, Download, ShieldCheck, ArrowRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  pro: string;
  project: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  status: string;
  dueDate: string;
  createdAt: string;
  paidAt?: string;
  isEscrow: boolean;
  escrowStatus?: string;
  milestoneTitle?: string;
}

export default function ClientInvoicingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [releasing, setReleasing] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/client/invoices")
      .then(r => r.json())
      .then(d => setInvoices(d.invoices ?? []))
      .finally(() => setLoading(false));
  }, []);

  const handleRelease = async (id: string) => {
    if (!confirm("Are you sure you want to release these funds to the Pro? This action cannot be undone.")) return;
    setReleasing(id);
    try {
      const res = await fetch(`/api/client/invoices/${id}/escrow`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "release" }),
      });
      if (res.ok) {
        setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, escrowStatus: "released", status: "paid" } : inv));
      }
    } catch {
      alert("Failed to release funds.");
    } finally {
      setReleasing(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Billing & Invoices</h1>
        <p className="text-gray-500 font-medium mt-1">Manage your payments and escrow milestones</p>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400 font-medium italic">Loading invoices...</div>
      ) : invoices.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="h-20 w-20 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-5">
            <FileCheck2 className="h-9 w-9 text-gray-300" />
          </div>
          <h3 className="text-lg font-black text-gray-900 mb-1">No invoices found</h3>
          <p className="text-gray-400 font-medium text-sm max-w-xs">
            Your billing history and pending milestone payments will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {invoices.map(inv => (
            <motion.div key={inv.id} layout
              className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 hover:border-gray-200 transition-all flex flex-col md:flex-row items-center gap-6">
              
              <div className="h-14 w-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                <CreditCard className="h-6 w-6 text-gray-400" />
              </div>

              <div className="flex-1 min-w-0 text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-1">
                  <h3 className="font-black text-gray-900 truncate text-lg">{inv.invoiceNumber}</h3>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    inv.status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {inv.status}
                  </span>
                  {inv.isEscrow && (
                    <span className="px-3 py-1 rounded-full bg-[#0a9396]/10 text-[#0a9396] text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-[#0a9396]/20">
                      <ShieldCheck className="h-3 w-3" /> Escrow: {inv.escrowStatus?.replace('_', ' ')}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 font-bold">From {inv.pro} · {inv.project}</p>
                {inv.milestoneTitle && (
                  <p className="text-xs text-[#0a9396] font-black mt-1 uppercase tracking-tight">Milestone: {inv.milestoneTitle}</p>
                )}
              </div>

              <div className="text-center md:text-right shrink-0">
                <p className="text-2xl font-black text-gray-900 leading-none mb-1">{inv.currency} {inv.total.toLocaleString()}</p>
                <p className="text-xs text-gray-400 font-bold">Due: {inv.dueDate}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {inv.isEscrow && inv.escrowStatus === 'held_in_escrow' && (
                  <button onClick={() => handleRelease(inv.id)} disabled={releasing === inv.id}
                    className="h-11 px-5 rounded-xl bg-gray-900 text-white font-black text-xs uppercase tracking-widest hover:bg-black transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-gray-900/20">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    {releasing === inv.id ? "Releasing..." : "Release Funds"}
                  </button>
                )}
                <button className="h-11 w-11 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all cursor-pointer">
                  <Download className="h-5 w-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Escrow Education Card */}
      <div className="bg-linear-to-br from-[#0a9396] to-[#005f73] rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-teal-900/20">
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-black uppercase tracking-widest">Telemoz Escrow Protection</h2>
          </div>
          <p className="text-teal-50 font-medium leading-relaxed mb-6">
            Milestone-based escrow ensures your funds are only released when you are 100% satisfied with the work. 
            The Pro sees the funds are secured, and you retain control over the final release.
          </p>
          <button className="h-12 px-6 rounded-xl bg-white text-[#0a9396] font-black text-sm uppercase tracking-widest hover:bg-teal-50 transition-all flex items-center gap-2">
            Learn More <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
