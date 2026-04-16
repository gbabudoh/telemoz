"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import {
  CreditCard,
  Search,
  Download,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  AlertCircle,
  CalendarDays,
  FolderKanban,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { formatCurrency } from "@/lib/utils";

interface Transaction {
  _id: string;
  invoiceNumber: string;
  proId: { _id: string; name: string; email: string };
  clientId: { _id: string; name: string; email: string };
  projectId: { _id: string; name: string };
  total: number;
  commission: number;
  status: string;
  createdAt: string;
  paidAt?: string;
}

const STATUS_CONFIG: Record<
  string,
  {
    label: string;
    variant: "success" | "warning" | "danger" | "default";
    icon: React.ComponentType<{ className?: string }>;
    dot: string;
    text: string;
  }
> = {
  paid: {
    label: "Paid",
    variant: "success",
    icon: CheckCircle2,
    dot: "bg-emerald-500",
    text: "text-emerald-700",
  },
  pending: {
    label: "Pending",
    variant: "warning",
    icon: Clock,
    dot: "bg-amber-500",
    text: "text-amber-700",
  },
  failed: {
    label: "Failed",
    variant: "danger",
    icon: XCircle,
    dot: "bg-red-500",
    text: "text-red-700",
  },
};

const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.35, ease: "easeOut" },
  }),
};

export default function AdminTransactionsPage() {
  const { data: session } = useSession();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewTx, setViewTx] = useState<Transaction | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("/api/admin/transactions");
        if (response.ok) {
          const data = await response.json();
          setTransactions(data.transactions || []);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user?.userType === "admin") {
      fetchTransactions();
    }
  }, [session]);

  const counts = {
    all: transactions.length,
    paid: transactions.filter((t) => t.status === "paid").length,
    pending: transactions.filter((t) => t.status === "pending").length,
    failed: transactions.filter((t) => t.status === "failed").length,
  };

  const filteredTransactions = transactions.filter((t) => {
    const invoice = (t.invoiceNumber ?? "").toLowerCase();
    const proName =
      typeof t.proId === "object" ? (t.proId?.name ?? "").toLowerCase() : "";
    const clientName =
      typeof t.clientId === "object"
        ? (t.clientId?.name ?? "").toLowerCase()
        : "";
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      invoice.includes(q) || proName.includes(q) || clientName.includes(q);
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredRevenue = filteredTransactions.reduce(
    (sum, t) => sum + (t.total || 0),
    0
  );
  const filteredCommission = filteredTransactions.reduce(
    (sum, t) => sum + (t.commission || 0),
    0
  );
  const totalRevenue = transactions.reduce((sum, t) => sum + (t.total || 0), 0);
  const totalCommission = transactions.reduce(
    (sum, t) => sum + (t.commission || 0),
    0
  );

  const filterTabs = [
    { key: "all", label: "All", count: counts.all },
    { key: "paid", label: "Paid", count: counts.paid },
    { key: "pending", label: "Pending", count: counts.pending },
    { key: "failed", label: "Failed", count: counts.failed },
  ];

  const formatDate = (dateStr?: string) =>
    dateStr
      ? new Date(dateStr).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "—";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a9396] mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Transaction Detail Modal */}
      {viewTx && (() => {
        const t = viewTx;
        const cfg = STATUS_CONFIG[t.status] || STATUS_CONFIG.pending;
        const StatusIcon = cfg.icon;
        const proName = typeof t.proId === "object" ? t.proId?.name || "—" : "—";
        const proEmail = typeof t.proId === "object" ? t.proId?.email || "" : "";
        const clientName = typeof t.clientId === "object" ? t.clientId?.name || "—" : "—";
        const clientEmail = typeof t.clientId === "object" ? t.clientId?.email || "" : "";
        const projectName = typeof t.projectId === "object" ? t.projectId?.name || "—" : "—";
        const invoiceLabel = t.invoiceNumber || `INV-${t._id?.slice(-6).toUpperCase() || "??????"}`;

        return (
          <Modal
            isOpen
            onClose={() => setViewTx(null)}
            title={invoiceLabel}
            size="md"
            variant="light"
          >
            <div className="space-y-5">
              {/* Amount hero row */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  <span className={`inline-flex items-center gap-1.5 text-sm font-semibold ${cfg.text}`}>
                    <StatusIcon className="h-3.5 w-3.5" />
                    {cfg.label}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-1">Amount</p>
                  <p className="text-xl font-bold text-gray-900 tabular-nums">
                    {formatCurrency(t.total || 0)}
                  </p>
                  <p className="text-xs text-[#0a9396] font-semibold tabular-nums">
                    {formatCurrency(t.commission || 0)} commission
                  </p>
                </div>
              </div>

              {/* Project */}
              {projectName !== "—" && (
                <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 bg-white">
                  <div className="h-8 w-8 rounded-lg bg-[#0a9396]/10 flex items-center justify-center shrink-0">
                    <FolderKanban className="h-4 w-4 text-[#0a9396]" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Project</p>
                    <p className="text-sm font-semibold text-gray-900">{projectName}</p>
                  </div>
                </div>
              )}

              {/* People */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border border-gray-100 bg-white">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Professional</p>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-linear-to-br from-[#0a9396] to-cyan-400 flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {proName !== "—" ? proName.charAt(0).toUpperCase() : "?"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{proName}</p>
                      {proEmail && <p className="text-xs text-gray-400 truncate">{proEmail}</p>}
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-lg border border-gray-100 bg-white">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Client</p>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-linear-to-br from-emerald-500 to-green-400 flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {clientName !== "—" ? clientName.charAt(0).toUpperCase() : "?"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{clientName}</p>
                      {clientEmail && <p className="text-xs text-gray-400 truncate">{clientEmail}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border border-gray-100 bg-white">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Created</p>
                  <div className="flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5 text-gray-400" />
                    <p className="text-sm text-gray-700">{formatDate(t.createdAt)}</p>
                  </div>
                </div>
                <div className="p-3 rounded-lg border border-gray-100 bg-white">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Paid At</p>
                  <div className="flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5 text-gray-400" />
                    <p className="text-sm text-gray-700">{formatDate(t.paidAt)}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs text-gray-400 border-t border-gray-100">
                <span>Invoice: <span className="font-mono">{invoiceLabel}</span></span>
                <span className="font-mono">{t._id}</span>
              </div>
            </div>
          </Modal>
        );
      })()}

      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Transaction Management
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            View and manage all platform payments and commissions
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="self-start sm:self-auto shrink-0"
        >
          <Download className="h-3.5 w-3.5 mr-1.5" />
          Export CSV
        </Button>
      </motion.div>

      {/* Alert banners */}
      {counts.pending > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-3.5 bg-amber-50 border border-amber-200 rounded-lg"
        >
          <Clock className="h-4 w-4 text-amber-600 shrink-0" />
          <p className="text-sm text-amber-800">
            <span className="font-semibold">{counts.pending}</span>{" "}
            transaction{counts.pending === 1 ? " is" : "s are"} awaiting
            payment.
          </p>
          <button
            onClick={() => setStatusFilter("pending")}
            className="ml-auto text-xs font-semibold text-amber-700 hover:text-amber-900 hover:underline underline-offset-2 shrink-0"
          >
            View →
          </button>
        </motion.div>
      )}
      {counts.failed > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-3.5 bg-red-50 border border-red-200 rounded-lg"
        >
          <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
          <p className="text-sm text-red-800">
            <span className="font-semibold">{counts.failed}</span>{" "}
            transaction{counts.failed === 1 ? " has" : "s have"} failed and
            may need to be retried.
          </p>
          <button
            onClick={() => setStatusFilter("failed")}
            className="ml-auto text-xs font-semibold text-red-700 hover:text-red-900 hover:underline underline-offset-2 shrink-0"
          >
            View →
          </button>
        </motion.div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Revenue",
            value: formatCurrency(totalRevenue),
            sub: `${counts.paid} paid transactions`,
            icon: DollarSign,
            iconBg: "bg-emerald-100",
            iconColor: "text-emerald-600",
            accent: "border-l-emerald-500",
          },
          {
            label: "Platform Commission",
            value: formatCurrency(totalCommission),
            sub: "Earned across all txns",
            icon: TrendingUp,
            iconBg: "bg-[#0a9396]/10",
            iconColor: "text-[#0a9396]",
            accent: "border-l-[#0a9396]",
          },
          {
            label: "Paid",
            value: counts.paid,
            sub: formatCurrency(
              transactions
                .filter((t) => t.status === "paid")
                .reduce((s, t) => s + (t.total || 0), 0)
            ),
            icon: CheckCircle2,
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600",
            accent: "border-l-blue-500",
          },
          {
            label: "Pending",
            value: counts.pending,
            sub:
              counts.pending > 0
                ? `${counts.failed} failed`
                : "No pending transactions",
            icon: Clock,
            iconBg: "bg-amber-100",
            iconColor: "text-amber-600",
            accent: "border-l-amber-500",
          },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={CARD_VARIANTS}
            >
              <Card className={`border-l-4 ${stat.accent}`}>
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 tabular-nums">
                        {stat.value}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
                    </div>
                    <div className={`rounded-xl ${stat.iconBg} p-2.5`}>
                      <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Table Card — toolbar + table unified */}
      <Card>
        {/* Toolbar */}
        <CardHeader className="border-b border-gray-100 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Status filter tabs with counts */}
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1 shrink-0">
              {filterTabs.map((tab) => {
                const cfg = STATUS_CONFIG[tab.key];
                const isSelected = statusFilter === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setStatusFilter(tab.key)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all whitespace-nowrap ${
                      isSelected
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {cfg && (
                      <span
                        className={`h-1.5 w-1.5 rounded-full shrink-0 ${cfg.dot}`}
                      />
                    )}
                    {tab.label}
                    <span
                      className={`tabular-nums rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                        isSelected
                          ? "bg-[#0a9396]/10 text-[#0a9396]"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by invoice, professional, or client..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <p className="text-xs text-gray-400 whitespace-nowrap shrink-0">
              {filteredTransactions.length}{" "}
              {filteredTransactions.length === 1 ? "result" : "results"}
            </p>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-16">
              <div className="rounded-full bg-gray-100 p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                {searchQuery ? (
                  <Search className="h-7 w-7 text-gray-400" />
                ) : (
                  <CreditCard className="h-7 w-7 text-gray-400" />
                )}
              </div>
              <p className="text-gray-700 font-medium">No transactions found</p>
              <p className="text-gray-400 text-xs mt-1">
                {searchQuery
                  ? `No results for "${searchQuery}"`
                  : "Try selecting a different status filter"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wide text-left">
                      Invoice
                    </th>
                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide text-left hidden lg:table-cell">
                      Project
                    </th>
                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide text-left hidden md:table-cell">
                      Professional
                    </th>
                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide text-left hidden md:table-cell">
                      Client
                    </th>
                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">
                      Amount
                    </th>
                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right hidden sm:table-cell">
                      Commission
                    </th>
                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide text-left">
                      Status
                    </th>
                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide text-left hidden lg:table-cell">
                      Date
                    </th>
                    <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredTransactions.map((t, index) => {
                    const cfg = STATUS_CONFIG[t.status] || STATUS_CONFIG.pending;
                    const StatusIcon = cfg.icon;
                    const proName =
                      typeof t.proId === "object" ? t.proId?.name || "—" : "—";
                    const proInitial =
                      proName !== "—" ? proName.charAt(0).toUpperCase() : "?";
                    const clientName =
                      typeof t.clientId === "object"
                        ? t.clientId?.name || "—"
                        : "—";
                    const clientInitial =
                      clientName !== "—"
                        ? clientName.charAt(0).toUpperCase()
                        : "?";
                    const projectName =
                      typeof t.projectId === "object"
                        ? t.projectId?.name || "—"
                        : "—";
                    const invoiceLabel =
                      t.invoiceNumber ||
                      `INV-${t._id?.slice(-6).toUpperCase() || "??????"}`;

                    return (
                      <motion.tr
                        key={t._id ?? index}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.035 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        {/* Invoice */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-lg bg-[#0a9396]/10 flex items-center justify-center shrink-0">
                              <CreditCard className="h-3.5 w-3.5 text-[#0a9396]" />
                            </div>
                            <div>
                              <p className="font-mono text-sm font-semibold text-gray-900">
                                {invoiceLabel}
                              </p>
                              {/* Show pro → client on mobile */}
                              <p className="text-xs text-gray-400 md:hidden truncate">
                                {proName} → {clientName}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Project */}
                        <td className="py-4 px-4 hidden lg:table-cell">
                          <p className="text-sm text-gray-600 truncate max-w-[120px]">
                            {projectName}
                          </p>
                        </td>

                        {/* Professional */}
                        <td className="py-4 px-4 hidden md:table-cell">
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-linear-to-br from-[#0a9396] to-cyan-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
                              {proInitial}
                            </div>
                            <p className="text-sm text-gray-700 truncate max-w-[100px]">
                              {proName}
                            </p>
                          </div>
                        </td>

                        {/* Client */}
                        <td className="py-4 px-4 hidden md:table-cell">
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-linear-to-br from-emerald-500 to-green-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
                              {clientInitial}
                            </div>
                            <p className="text-sm text-gray-700 truncate max-w-[100px]">
                              {clientName}
                            </p>
                          </div>
                        </td>

                        {/* Amount — right-aligned */}
                        <td className="py-4 px-4 text-right">
                          <p className="text-sm font-bold text-gray-900 tabular-nums">
                            {formatCurrency(t.total || 0)}
                          </p>
                        </td>

                        {/* Commission — right-aligned */}
                        <td className="py-4 px-4 text-right hidden sm:table-cell">
                          <p className="text-sm font-semibold text-[#0a9396] tabular-nums">
                            {formatCurrency(t.commission || 0)}
                          </p>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-semibold ${cfg.text}`}
                          >
                            <StatusIcon className="h-3 w-3" />
                            {cfg.label}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="py-4 px-4 hidden lg:table-cell">
                          <p className="text-sm text-gray-400">
                            {formatDate(t.paidAt || t.createdAt)}
                          </p>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2.5 text-xs text-gray-500 hover:text-gray-900 hover:bg-gray-100 gap-1.5"
                              onClick={() => setViewTx(t)}
                            >
                              <Eye className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">View</span>
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>

        {/* Table footer with revenue subtotals */}
        {filteredTransactions.length > 0 && (
          <div className="border-t border-gray-100 px-6 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 bg-gray-50/50">
            <p className="text-xs text-gray-400">
              Showing{" "}
              <span className="font-semibold text-gray-700">
                {filteredTransactions.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-700">
                {transactions.length}
              </span>{" "}
              transactions
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>
                Revenue:{" "}
                <span className="font-semibold text-gray-700 tabular-nums">
                  {formatCurrency(filteredRevenue)}
                </span>
                {statusFilter !== "all" && (
                  <span className="text-gray-400">
                    {" "}
                    of {formatCurrency(totalRevenue)}
                  </span>
                )}
              </span>
              <span className="text-gray-300">·</span>
              <span>
                Commission:{" "}
                <span className="font-semibold text-[#0a9396] tabular-nums">
                  {formatCurrency(filteredCommission)}
                </span>
              </span>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
