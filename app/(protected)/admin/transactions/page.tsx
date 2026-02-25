"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  CreditCard,
  Search,
  Download,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  Clock,
  XCircle,
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

export default function AdminTransactionsPage() {
  const { data: session } = useSession();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

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

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (typeof transaction.proId === "object" &&
        transaction.proId?.name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (typeof transaction.clientId === "object" &&
        transaction.clientId?.name?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalRevenue: transactions.reduce((sum, t) => sum + (t.total || 0), 0),
    totalCommission: transactions.reduce((sum, t) => sum + (t.commission || 0), 0),
    paid: transactions.filter((t) => t.status === "paid").length,
    pending: transactions.filter((t) => t.status === "pending").length,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Paid
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="warning" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="danger" className="flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Failed
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a9396] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transaction Management</h1>
          <p className="text-gray-600 mt-1">View and manage all platform transactions and payments</p>
        </div>
        <Button className="bg-[#0a9396] hover:bg-[#087579] text-white">
          <Download className="mr-2 h-4 w-4" />
          Export All
        </Button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
              </div>
              <div className="rounded-lg bg-emerald-500/10 p-3">
                <DollarSign className="h-6 w-6 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Platform Commission</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalCommission)}</p>
              </div>
              <div className="rounded-lg bg-[#0a9396]/10 p-3">
                <TrendingUp className="h-6 w-6 text-[#0a9396]" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Paid</p>
                <p className="text-2xl font-bold text-gray-900">{stats.paid}</p>
              </div>
              <div className="rounded-lg bg-blue-500/10 p-3">
                <CheckCircle2 className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
              <div className="rounded-lg bg-amber-500/10 p-3">
                <Clock className="h-6 w-6 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by invoice number, pro, or client..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {["all", "paid", "pending", "failed"].map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                  className={statusFilter === status ? "bg-[#0a9396] hover:bg-[#087579] text-white" : ""}
                >
                  {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Transactions ({filteredTransactions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No transactions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Invoice</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Professional</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Client</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Commission</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction, index) => (
                    <motion.tr
                      key={transaction._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-4 px-4">
                        <p className="font-medium text-gray-900">{transaction.invoiceNumber || `INV-${transaction._id.slice(-6)}`}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-gray-900">
                          {typeof transaction.proId === "object" ? transaction.proId?.name || "N/A" : "N/A"}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-gray-900">
                          {typeof transaction.clientId === "object" ? transaction.clientId?.name || "N/A" : "N/A"}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm font-semibold text-gray-900">{formatCurrency(transaction.total || 0)}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-[#0a9396] font-semibold">
                          {formatCurrency(transaction.commission || 0)}
                        </p>
                      </td>
                      <td className="py-4 px-4">{getStatusBadge(transaction.status)}</td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-gray-600">
                          {transaction.paidAt
                            ? new Date(transaction.paidAt).toLocaleDateString()
                            : new Date(transaction.createdAt).toLocaleDateString()}
                        </p>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

