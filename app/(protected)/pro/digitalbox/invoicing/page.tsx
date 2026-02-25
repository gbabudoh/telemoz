"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  FileText,
  Plus,
  Search,
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  Send,
  Download,
  Eye,
  MoreVertical,
  Building2,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { formatCurrency } from "@/lib/utils";

const invoices = [
  {
    id: 1,
    invoiceNumber: "INV-000001",
    client: "TechStart Inc.",
    clientEmail: "contact@techstart.com",
    project: "SEO Optimization Campaign",
    items: [
      { description: "SEO Audit & Strategy", quantity: 1, unitPrice: 1500, total: 1500 },
      { description: "Technical SEO Implementation", quantity: 1, unitPrice: 1000, total: 1000 },
    ],
    subtotal: 2500,
    tax: 0,
    total: 2500,
    currency: "GBP",
    status: "paid",
    dueDate: "2024-01-15",
    paidAt: "2024-01-14",
    createdAt: "2024-01-01",
  },
  {
    id: 2,
    invoiceNumber: "INV-000002",
    client: "E-Commerce Pro",
    clientEmail: "hello@ecommercepro.co.uk",
    project: "PPC Management",
    items: [
      { description: "PPC Campaign Setup", quantity: 1, unitPrice: 800, total: 800 },
      { description: "Monthly Management Fee", quantity: 1, unitPrice: 1000, total: 1000 },
    ],
    subtotal: 1800,
    tax: 0,
    total: 1800,
    currency: "GBP",
    status: "sent",
    dueDate: "2024-01-25",
    createdAt: "2024-01-10",
  },
  {
    id: 3,
    invoiceNumber: "INV-000003",
    client: "Local Business Hub",
    clientEmail: "info@localbusinesshub.com",
    project: "Social Media Strategy",
    items: [
      { description: "Social Media Strategy Development", quantity: 1, unitPrice: 1200, total: 1200 },
    ],
    subtotal: 1200,
    tax: 0,
    total: 1200,
    currency: "GBP",
    status: "overdue",
    dueDate: "2024-01-10",
    createdAt: "2024-01-01",
  },
  {
    id: 4,
    invoiceNumber: "INV-000004",
    client: "Digital Solutions",
    clientEmail: "contact@digitalsolutions.uk",
    project: "Content Marketing Campaign",
    items: [
      { description: "Content Strategy & Planning", quantity: 1, unitPrice: 1000, total: 1000 },
      { description: "Content Creation (10 articles)", quantity: 10, unitPrice: 120, total: 1200 },
    ],
    subtotal: 2200,
    tax: 0,
    total: 2200,
    currency: "GBP",
    status: "draft",
    dueDate: "2024-02-01",
    createdAt: "2024-01-18",
  },
  {
    id: 5,
    invoiceNumber: "INV-000005",
    client: "Startup Ventures",
    clientEmail: "hello@startupventures.com",
    project: "Email Marketing Automation",
    items: [
      { description: "Email Automation Setup", quantity: 1, unitPrice: 800, total: 800 },
      { description: "Email Template Design (5 templates)", quantity: 5, unitPrice: 140, total: 700 },
    ],
    subtotal: 1500,
    tax: 0,
    total: 1500,
    currency: "GBP",
    status: "sent",
    dueDate: "2024-01-30",
    createdAt: "2024-01-15",
  },
];

const statusConfig = {
  draft: { label: "Draft", color: "default", icon: FileText },
  sent: { label: "Sent", color: "info", icon: Send },
  paid: { label: "Paid", color: "success", icon: CheckCircle2 },
  overdue: { label: "Overdue", color: "default", icon: XCircle },
  cancelled: { label: "Cancelled", color: "default", icon: XCircle },
};

const stats = [
  { label: "Total Revenue", value: "£9,200", color: "from-emerald-500 to-teal-500" },
  { label: "Outstanding", value: "£5,500", color: "from-amber-500 to-orange-500" },
  { label: "Overdue", value: "£1,200", color: "from-red-500 to-pink-500" },
  { label: "This Month", value: "£4,300", color: "from-blue-500 to-cyan-500" },
];

type InvoiceType = typeof invoices[0];

export default function InvoicingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [invoicesList, setInvoicesList] = useState(invoices);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceType | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [notificationModal, setNotificationModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "success" | "info" | "error";
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "success",
  });

  const showNotification = (title: string, message: string, type: "success" | "info" | "error" = "success") => {
    setNotificationModal({ isOpen: true, title, message, type });
  };

  const handleView = (invoice: InvoiceType) => {
    setSelectedInvoice(invoice);
    setIsViewModalOpen(true);
  };

  const handleDownloadPDF = (invoice: InvoiceType) => {
    setSelectedInvoice(invoice);
    setIsViewModalOpen(true);
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const handleSendInvoice = (id: number) => {
    setInvoicesList(prev => prev.map(inv => inv.id === id ? { ...inv, status: 'sent' } : inv));
    showNotification("Invoice Sent", "Invoice sent successfully!", "success");
  };

  const handleSendReminder = (id: number) => {
    showNotification("Reminder Sent", `Payment reminder sent to the client for invoice ID: ${id}.`, "success");
  };

  const handleEdit = (id: number) => {
    showNotification("Edit Invoice", `Opening edit invoice form for invoice ID: ${id}...`, "info");
  };

  const handleCreateInvoice = () => {
    showNotification("Create Invoice", "Opening create invoice form...", "info");
  };

  const filteredInvoices = invoicesList.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.project.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <FileText className="h-6 w-6 text-[#0a9396]" />
          <h1 className="text-3xl font-bold text-gray-900">Invoicing</h1>
          <Badge variant="primary" size="sm">DigitalBOX</Badge>
        </div>
        <p className="text-gray-600">
          Create, send, and track invoices for your clients
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = index === 0 ? DollarSign : index === 1 ? Clock : index === 2 ? XCircle : Calendar;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`rounded-lg bg-gradient-to-br ${stat.color} p-3`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Search invoices by number, client, or project..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:border-[#0a9396] focus:outline-none focus:ring-2 focus:ring-[#0a9396]/20 cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <Button size="sm" onClick={handleCreateInvoice} className="bg-[#0a9396] hover:bg-[#087579] text-white cursor-pointer">
            <Plus className="mr-2 h-4 w-4 cursor-pointer" />
            Create Invoice
          </Button>
        </div>
      </div>

      {/* Invoices List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredInvoices.map((invoice, index) => {
          const statusInfo = statusConfig[invoice.status as keyof typeof statusConfig];
          const daysUntilDue = getDaysUntilDue(invoice.dueDate);
          const isOverdue = daysUntilDue < 0 && invoice.status !== "paid";

          return (
            <motion.div
              key={invoice.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:border-[#0a9396]/50 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {invoice.invoiceNumber}
                            </h3>
                            <Badge variant={statusInfo.color as "default" | "info" | "success"} size="sm">
                              {statusInfo.label}
                            </Badge>
                            {isOverdue && (
                              <Badge variant="default" size="sm" className="bg-red-100 text-red-700">
                                {Math.abs(daysUntilDue)} days overdue
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 flex items-center gap-1 mb-2">
                            <Building2 className="h-3 w-3" />
                            {invoice.client}
                          </p>
                          <p className="text-sm text-gray-600 mb-1">{invoice.clientEmail}</p>
                          <p className="text-base font-medium text-gray-900">{invoice.project}</p>
                        </div>
                        <button onClick={() => alert("Options menu")} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                          <MoreVertical className="h-5 w-5 cursor-pointer" />
                        </button>
                      </div>

                      {/* Invoice Items Summary */}
                      <div className="mb-4">
                        <div className="space-y-1">
                          {invoice.items.slice(0, 2).map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm text-gray-600">
                              <span>
                                {item.description} {item.quantity > 1 && `(x${item.quantity})`}
                              </span>
                              <span>{formatCurrency(item.total)}</span>
                            </div>
                          ))}
                          {invoice.items.length > 2 && (
                            <p className="text-xs text-gray-500">
                              +{invoice.items.length - 2} more item{invoice.items.length - 2 !== 1 ? "s" : ""}
                            </p>
                          )}
                        </div>
                        <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-900">Total</span>
                          <span className="text-lg font-bold text-gray-900">
                            {formatCurrency(invoice.total)}
                          </span>
                        </div>
                      </div>

                      {/* Dates */}
                      <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Due: {new Date(invoice.dueDate).toLocaleDateString()}
                          {!isOverdue && invoice.status !== "paid" && (
                            <span className="text-gray-400">
                              ({daysUntilDue} day{daysUntilDue !== 1 ? "s" : ""} remaining)
                            </span>
                          )}
                        </span>
                        {invoice.paidAt && (
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                            Paid: {new Date(invoice.paidAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 lg:ml-4">
                      {invoice.status === "draft" && (
                        <>
                          <Button size="sm" onClick={() => handleSendInvoice(invoice.id)} className="bg-[#0a9396] hover:bg-[#087579] text-white cursor-pointer">
                            <Send className="mr-2 h-4 w-4 cursor-pointer" />
                            Send Invoice
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleView(invoice)} className="cursor-pointer">
                            <Eye className="mr-2 h-4 w-4 cursor-pointer" />
                            Preview
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(invoice.id)} className="cursor-pointer">Edit</Button>
                        </>
                      )}
                      {invoice.status === "sent" && (
                        <>
                          <Button variant="outline" size="sm" onClick={() => handleView(invoice)} className="cursor-pointer">
                            <Eye className="mr-2 h-4 w-4 cursor-pointer" />
                            View
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDownloadPDF(invoice)} className="cursor-pointer">
                            <Download className="mr-2 h-4 w-4 cursor-pointer" />
                            Download PDF
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleSendReminder(invoice.id)} className="cursor-pointer">Send Reminder</Button>
                        </>
                      )}
                      {invoice.status === "paid" && (
                        <>
                          <Button variant="outline" size="sm" onClick={() => handleView(invoice)} className="cursor-pointer">
                            <Eye className="mr-2 h-4 w-4 cursor-pointer" />
                            View
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDownloadPDF(invoice)} className="cursor-pointer">
                            <Download className="mr-2 h-4 w-4 cursor-pointer" />
                            Download PDF
                          </Button>
                        </>
                      )}
                      {invoice.status === "overdue" && (
                        <>
                          <Button size="sm" onClick={() => handleSendReminder(invoice.id)} className="bg-[#0a9396] hover:bg-[#087579] text-white cursor-pointer">
                            Send Reminder
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleView(invoice)} className="cursor-pointer">
                            <Eye className="mr-2 h-4 w-4 cursor-pointer" />
                            View
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDownloadPDF(invoice)} className="cursor-pointer">
                            <Download className="mr-2 h-4 w-4 cursor-pointer" />
                            Download PDF
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filteredInvoices.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No invoices found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Create your first invoice to start billing your clients"}
            </p>
            <Button onClick={handleCreateInvoice} className="bg-[#0a9396] hover:bg-[#087579] text-white cursor-pointer">
              <Plus className="mr-2 h-4 w-4 cursor-pointer" />
              Create Invoice
            </Button>
          </CardContent>
        </Card>
      )}

      {/* View Invoice Modal */}
      {isViewModalOpen && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200 flex justify-between items-center print:hidden">
              <h2 className="text-xl font-bold text-gray-900">Invoice {selectedInvoice.invoiceNumber}</h2>
              <div className="flex gap-2">
                 <Button onClick={() => window.print()} variant="outline" size="sm" className="cursor-pointer hidden sm:flex">
                   <Download className="h-4 w-4 mr-2 cursor-pointer" />
                   Download PDF
                 </Button>
                 <button onClick={() => setIsViewModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                   <X className="h-5 w-5 text-gray-500 cursor-pointer" />
                 </button>
              </div>
            </div>
            <div className="p-8 print:p-0 bg-white" id="printable-invoice">
              {/* Invoice Header */}
              <div className="flex justify-between items-start mb-8 border-b border-gray-200 pb-8">
                 <div>
                   <h1 className="text-3xl font-bold text-gray-900 mb-2">INVOICE</h1>
                   <p className="text-gray-500 font-medium">{selectedInvoice.invoiceNumber}</p>
                 </div>
                 <div className="text-right">
                   <h3 className="font-bold text-gray-900 text-xl">DigitalBOX</h3>
                   <p className="text-gray-500">123 Tech Street, London</p>
                 </div>
              </div>
              {/* Client & Dates */}
              <div className="flex justify-between mb-8">
                 <div>
                   <p className="text-sm text-gray-500 mb-1">Bill To:</p>
                   <p className="font-bold text-gray-900 text-lg">{selectedInvoice.client}</p>
                   <p className="text-gray-600">{selectedInvoice.clientEmail}</p>
                 </div>
                 <div className="text-right">
                   <div className="mb-2">
                     <p className="text-sm text-gray-500">Invoice Date:</p>
                     <p className="font-medium text-gray-900">{new Date(selectedInvoice.createdAt).toLocaleDateString()}</p>
                   </div>
                   <div>
                     <p className="text-sm text-gray-500">Due Date:</p>
                     <p className="font-medium text-gray-900">{new Date(selectedInvoice.dueDate).toLocaleDateString()}</p>
                   </div>
                 </div>
              </div>
              
              {/* Items Table */}
              <table className="w-full mb-8">
                <thead>
                  <tr className="border-b-2 border-gray-200 text-left">
                    <th className="py-3 font-semibold text-gray-900">Description</th>
                    <th className="py-3 font-semibold text-gray-900 text-center">Qty</th>
                    <th className="py-3 font-semibold text-gray-900 text-right">Price</th>
                    <th className="py-3 font-semibold text-gray-900 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoice.items.map((item: InvoiceType["items"][0], i: number) => (
                    <tr key={i} className="border-b border-gray-200">
                      <td className="py-4 text-gray-800">{item.description}</td>
                      <td className="py-4 text-gray-800 text-center">{item.quantity}</td>
                      <td className="py-4 text-gray-800 text-right">{formatCurrency(item.unitPrice)}</td>
                      <td className="py-4 text-gray-900 text-right font-medium">{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-64">
                  <div className="flex justify-between py-2 text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-900">{formatCurrency(selectedInvoice.subtotal)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200 text-gray-600">
                    <span>Tax (0%)</span>
                    <span className="font-medium text-gray-900">{formatCurrency(selectedInvoice.tax)}</span>
                  </div>
                  <div className="flex justify-between py-4">
                    <span className="font-bold text-gray-900 text-lg">Total</span>
                    <span className="font-bold text-2xl text-[#0a9396]">{formatCurrency(selectedInvoice.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-invoice, #printable-invoice * {
            visibility: visible;
          }
          #printable-invoice {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
            margin: 0;
          }
        }
      `}</style>

      {/* Notification Modal */}
      <AnimatePresence>
        {notificationModal.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden"
            >
              <div className="p-6 text-center">
                <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full mb-4 ${
                  notificationModal.type === 'success' ? 'bg-emerald-100' :
                  notificationModal.type === 'error' ? 'bg-red-100' : 'bg-[#0a9396]/10'
                }`}>
                  {notificationModal.type === 'success' && <CheckCircle2 className="h-8 w-8 text-emerald-600" />}
                  {notificationModal.type === 'error' && <XCircle className="h-8 w-8 text-red-600" />}
                  {notificationModal.type === 'info' && <FileText className="h-8 w-8 text-[#0a9396]" />}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{notificationModal.title}</h3>
                <p className="text-gray-600 mb-6">{notificationModal.message}</p>
                <Button 
                  onClick={() => setNotificationModal(prev => ({ ...prev, isOpen: false }))} 
                  className="w-full bg-[#0a9396] hover:bg-[#087579] text-white cursor-pointer"
                >
                  OK
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

