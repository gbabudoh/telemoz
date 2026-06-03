"use client";

import {
  FileCheck2, CreditCard, Download, ShieldCheck, ArrowRight,
  CheckCircle2, Clock, AlertCircle, ChevronDown, ChevronUp, X,
} from "lucide-react";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency } from "@/lib/utils";
import { format, isPast } from "date-fns";

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
  paidAt?: string | null;
  isEscrow: boolean;
  escrowStatus?: string;
  milestoneTitle?: string;
}

// ─── Status helpers ────────────────────────────────────────────────────────────

function statusBadge(inv: Invoice) {
  const overdue = inv.status === "sent" && isPast(new Date(inv.dueDate));
  if (overdue) return { label: "Overdue", cls: "bg-red-50 text-red-600" };
  const map: Record<string, { label: string; cls: string }> = {
    paid:      { label: "Paid",      cls: "bg-emerald-50 text-emerald-700" },
    sent:      { label: "Outstanding", cls: "bg-amber-50 text-amber-700" },
    overdue:   { label: "Overdue",   cls: "bg-red-50 text-red-600" },
    cancelled: { label: "Cancelled", cls: "bg-gray-100 text-gray-500" },
    draft:     { label: "Draft",     cls: "bg-gray-100 text-gray-500" },
  };
  return map[inv.status] ?? { label: inv.status, cls: "bg-gray-100 text-gray-500" };
}

function escrowBadge(status: string) {
  const map: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
    awaiting_deposit: { label: "Awaiting Payment",   cls: "bg-amber-50 text-amber-700 border-amber-200",      icon: <Clock className="h-3 w-3" /> },
    held_in_escrow:   { label: "Held in Escrow",     cls: "bg-[#0a9396]/10 text-[#0a9396] border-[#0a9396]/20", icon: <ShieldCheck className="h-3 w-3" /> },
    released:         { label: "Released to Pro",    cls: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: <CheckCircle2 className="h-3 w-3" /> },
    disputed:         { label: "Disputed",           cls: "bg-red-50 text-red-600 border-red-200",             icon: <AlertCircle className="h-3 w-3" /> },
    refunded:         { label: "Refunded",           cls: "bg-gray-100 text-gray-600 border-gray-200",         icon: <X className="h-3 w-3" /> },
  };
  return map[status] ?? { label: status.replace(/_/g, " "), cls: "bg-gray-100 text-gray-500 border-gray-200", icon: null };
}

// ─── Inner page (uses useSearchParams) ────────────────────────────────────────

function InvoicingInner() {
  const searchParams = useSearchParams();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [paying, setPaying] = useState<string | null>(null);
  const [releasing, setReleasing] = useState<string | null>(null);
  const [releaseError, setReleaseError] = useState<{ id: string; message: string } | null>(null);
  const [paidSuccess, setPaidSuccess] = useState(false);

  const loadInvoices = useCallback(() =>
    fetch("/api/client/invoices")
      .then(r => r.json())
      .then(d => setInvoices(d.invoices ?? []))
      .catch(console.error)
      .finally(() => setLoading(false))
  , []);

  useEffect(() => {
    loadInvoices();
    if (searchParams.get("paid") === "true") {
      setPaidSuccess(true);
      setTimeout(() => setPaidSuccess(false), 6000);
    }
  }, [loadInvoices, searchParams]);

  const handlePay = async (id: string) => {
    setPaying(id);
    try {
      const res = await fetch(`/api/client/invoices/${id}/pay`, { method: "POST" });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error ?? "Failed to start payment. Please try again.");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setPaying(null);
    }
  };

  const handleRelease = async (id: string, total: number, currency: string) => {
    const proAmount = (total * 0.9).toFixed(2);
    if (!confirm(`Release funds to the professional?\n\nPro receives: ${currency} ${proAmount}\nTelemoz fee (10%): ${currency} ${(total * 0.1).toFixed(2)}\n\nThis cannot be undone.`)) return;
    setReleaseError(null);
    setReleasing(id);
    try {
      const res = await fetch(`/api/client/invoices/${id}/escrow`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "release" }),
      });
      const data = await res.json();
      if (res.ok) {
        setInvoices(prev =>
          prev.map(inv => inv.id === id ? { ...inv, escrowStatus: "released", status: "paid" } : inv)
        );
      } else {
        setReleaseError({ id, message: data.error ?? "Failed to release funds." });
      }
    } catch {
      setReleaseError({ id, message: "Network error. Please try again." });
    } finally {
      setReleasing(null);
    }
  };

  // Stats
  const outstanding = invoices.filter(i => i.status === "sent");
  const paid = invoices.filter(i => i.status === "paid");
  const heldInEscrow = invoices.filter(i => i.isEscrow && i.escrowStatus === "held_in_escrow");
  const totalOutstanding = outstanding.reduce((s, i) => s + i.total, 0);
  const totalPaid = paid.reduce((s, i) => s + i.total, 0);
  const totalEscrow = heldInEscrow.reduce((s, i) => s + i.total, 0);

  const filtered = filter === "all" ? invoices
    : filter === "outstanding" ? invoices.filter(i => i.status === "sent")
    : filter === "paid" ? invoices.filter(i => i.status === "paid")
    : filter === "escrow" ? invoices.filter(i => i.isEscrow)
    : invoices;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Billing & Invoices</h1>
        <p className="text-gray-500 font-medium mt-1">Manage your payments and escrow milestones</p>
      </div>

      {/* Stripe success banner */}
      <AnimatePresence>
        {paidSuccess && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-sm font-bold text-emerald-800">Payment successful!</p>
              <p className="text-xs text-emerald-600">Your funds are now held securely in escrow. Release them once you approve the work.</p>
            </div>
            <button onClick={() => setPaidSuccess(false)} className="ml-auto p-1 hover:bg-emerald-100 rounded-lg">
              <X className="h-4 w-4 text-emerald-500" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary stats */}
      {!loading && invoices.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Outstanding", value: formatCurrency(totalOutstanding, "GBP"), count: outstanding.length, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "Held in Escrow", value: formatCurrency(totalEscrow, "GBP"), count: heldInEscrow.length, icon: ShieldCheck, color: "text-[#0a9396]", bg: "bg-[#0a9396]/10" },
            { label: "Total Paid", value: formatCurrency(totalPaid, "GBP"), count: paid.length, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
              <div className={`p-3 rounded-xl ${s.bg} shrink-0`}>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-xl font-black text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label} · {s.count} invoice{s.count !== 1 ? "s" : ""}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filter tabs */}
      {!loading && invoices.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto">
          {[
            { id: "all", label: "All" },
            { id: "outstanding", label: `Outstanding (${outstanding.length})` },
            { id: "escrow", label: `Escrow (${heldInEscrow.length})` },
            { id: "paid", label: `Paid (${paid.length})` },
          ].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                filter === f.id ? "bg-[#0a9396] text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
              }`}>
              {f.label}
            </button>
          ))}
        </div>
      )}

      {/* Invoice list */}
      {loading ? (
        <div className="text-center py-16 text-gray-400 font-medium">Loading invoices...</div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="h-16 w-16 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
            <FileCheck2 className="h-7 w-7 text-gray-300" />
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-1">
            {filter === "all" ? "No invoices yet" : `No ${filter} invoices`}
          </h3>
          <p className="text-sm text-gray-400 max-w-xs">
            {filter === "all"
              ? "Your billing history and milestone payments will appear here once your professional sends an invoice."
              : "Try a different filter to see other invoices."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(inv => {
            const sb = statusBadge(inv);
            const isOverdue = inv.status === "sent" && isPast(new Date(inv.dueDate));
            const expanded = expandedId === inv.id;

            return (
              <motion.div key={inv.id} layout className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${
                isOverdue ? "border-red-200" : "border-gray-100 hover:border-gray-200"
              }`}>
                {/* Main row */}
                <div className="p-5 flex flex-col md:flex-row md:items-center gap-4">
                  {/* Icon */}
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${inv.isEscrow ? "bg-[#0a9396]/10" : "bg-gray-50"}`}>
                    {inv.isEscrow
                      ? <ShieldCheck className="h-6 w-6 text-[#0a9396]" />
                      : <CreditCard className="h-6 w-6 text-gray-400" />}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-bold text-gray-900">{inv.invoiceNumber}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${sb.cls}`}>
                        {sb.label}
                      </span>
                      {inv.isEscrow && inv.escrowStatus && (() => {
                        const eb = escrowBadge(inv.escrowStatus!);
                        return (
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center gap-1 ${eb.cls}`}>
                            {eb.icon} {eb.label}
                          </span>
                        );
                      })()}
                    </div>
                    <p className="text-sm text-gray-500">
                      <span className="font-semibold text-gray-700">{inv.pro}</span> · {inv.project}
                    </p>
                    {inv.milestoneTitle && (
                      <p className="text-xs text-[#0a9396] font-semibold mt-0.5">Milestone: {inv.milestoneTitle}</p>
                    )}
                  </div>

                  {/* Amount + due */}
                  <div className="text-right shrink-0">
                    <p className="text-xl font-black text-gray-900">{formatCurrency(inv.total, inv.currency)}</p>
                    <p className={`text-xs font-medium mt-0.5 ${isOverdue ? "text-red-500" : "text-gray-400"}`}>
                      {inv.paidAt ? `Paid ${format(new Date(inv.paidAt), "d MMM yyyy")}` : `Due ${format(new Date(inv.dueDate), "d MMM yyyy")}`}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {inv.status !== "paid" && inv.status !== "cancelled" && (
                      <button onClick={() => handlePay(inv.id)} disabled={paying === inv.id}
                        className="h-10 px-4 rounded-xl bg-[#0a9396] hover:bg-[#087579] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm disabled:opacity-50 transition-all">
                        <CreditCard className="h-3.5 w-3.5" />
                        {paying === inv.id ? "…" : inv.isEscrow ? "Fund Escrow" : "Pay Now"}
                      </button>
                    )}

                    {inv.isEscrow && inv.escrowStatus === "held_in_escrow" && (
                      <button onClick={() => handleRelease(inv.id, inv.total, inv.currency)} disabled={releasing === inv.id}
                        className="h-10 px-4 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm disabled:opacity-50 transition-all">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                        {releasing === inv.id ? "…" : "Release"}
                      </button>
                    )}

                    <button
                      onClick={() => setExpandedId(expanded ? null : inv.id)}
                      className="h-10 w-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:border-gray-300 transition-all"
                      title="View line items"
                    >
                      {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>

                    <button className="h-10 w-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all" title="Download">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Release error */}
                {releaseError?.id === inv.id && (
                  <div className="px-5 pb-4">
                    <p className="text-xs text-red-500 font-semibold">{releaseError.message}</p>
                  </div>
                )}

                {/* Escrow commission breakdown */}
                {inv.isEscrow && inv.escrowStatus === "held_in_escrow" && (
                  <div className="px-5 pb-3 flex items-center gap-2 text-xs text-gray-400">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#0a9396]" />
                    On release: Pro receives {formatCurrency(inv.total * 0.9, inv.currency)} · Telemoz fee {formatCurrency(inv.total * 0.1, inv.currency)} (10%)
                  </div>
                )}

                {/* Expanded line items */}
                <AnimatePresence>
                  {expanded && (
                    <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                      <div className="border-t border-gray-100 px-5 py-4 bg-gray-50/50">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Line Items</p>
                        {inv.items.length === 0 ? (
                          <p className="text-sm text-gray-400">No line items available.</p>
                        ) : (
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="text-[10px] text-gray-400 uppercase tracking-widest">
                                <th className="text-left pb-2 font-semibold">Description</th>
                                <th className="text-right pb-2 font-semibold">Qty</th>
                                <th className="text-right pb-2 font-semibold">Unit Price</th>
                                <th className="text-right pb-2 font-semibold">Total</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {inv.items.map((item, i) => (
                                <tr key={i}>
                                  <td className="py-2 text-gray-700 font-medium">{item.description}</td>
                                  <td className="py-2 text-right text-gray-600">{item.quantity}</td>
                                  <td className="py-2 text-right text-gray-600">{formatCurrency(item.unitPrice, inv.currency)}</td>
                                  <td className="py-2 text-right font-semibold text-gray-900">{formatCurrency(item.total, inv.currency)}</td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot className="border-t border-gray-200">
                              <tr>
                                <td colSpan={3} className="pt-3 text-right text-xs text-gray-400 font-semibold pr-4">Subtotal</td>
                                <td className="pt-3 text-right font-semibold text-gray-700">{formatCurrency(inv.subtotal, inv.currency)}</td>
                              </tr>
                              {inv.tax > 0 && (
                                <tr>
                                  <td colSpan={3} className="text-right text-xs text-gray-400 font-semibold pr-4">Tax</td>
                                  <td className="text-right font-semibold text-gray-700">{formatCurrency(inv.tax, inv.currency)}</td>
                                </tr>
                              )}
                              <tr>
                                <td colSpan={3} className="pt-1 text-right text-sm font-black text-gray-900 pr-4">Total</td>
                                <td className="pt-1 text-right font-black text-gray-900">{formatCurrency(inv.total, inv.currency)}</td>
                              </tr>
                            </tfoot>
                          </table>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Escrow education card */}
      <div className="bg-linear-to-br from-[#0a9396] to-[#005f73] rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-teal-900/20">
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/20 rounded-lg"><ShieldCheck className="h-6 w-6 text-white" /></div>
            <h2 className="text-lg font-black uppercase tracking-widest">Telemoz Escrow Protection</h2>
          </div>
          <p className="text-teal-100 font-medium leading-relaxed mb-5 text-sm">
            Funds are held securely until you approve the work. The professional can see the payment is secured,
            motivating timely delivery. A 10% Telemoz commission is deducted only upon release.
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 bg-white/15 rounded-xl px-3 py-2 text-xs font-semibold">
              <CheckCircle2 className="h-3.5 w-3.5" /> 100% secure deposit
            </div>
            <div className="flex items-center gap-2 bg-white/15 rounded-xl px-3 py-2 text-xs font-semibold">
              <ShieldCheck className="h-3.5 w-3.5" /> You control the release
            </div>
            <div className="flex items-center gap-2 bg-white/15 rounded-xl px-3 py-2 text-xs font-semibold">
              <ArrowRight className="h-3.5 w-3.5" /> 10% fee on payout only
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page wrapper (Suspense for useSearchParams) ───────────────────────────────

export default function ClientInvoicingPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-gray-400">Loading...</div>}>
      <InvoicingInner />
    </Suspense>
  );
}
