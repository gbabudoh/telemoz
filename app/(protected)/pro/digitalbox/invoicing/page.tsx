"use client";

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
  Building2,
  X,
  CreditCard,
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
  draft: { label: "Draft", color: "default", icon: FileText, dot: 'bg-gray-400' },
  sent: { label: "Sent", color: "info", icon: Send, dot: 'bg-blue-400' },
  paid: { label: "Paid", color: "success", icon: CheckCircle2, dot: 'bg-emerald-500' },
  overdue: { label: "Overdue", color: "danger", icon: XCircle, dot: 'bg-red-500' },
  cancelled: { label: "Cancelled", color: "default", icon: XCircle, dot: 'bg-gray-500' },
};

const stats = [
  { label: "Total Revenue", value: "£9,200", icon: DollarSign, color: "from-emerald-400 to-teal-600", glow:"shadow-emerald-500/40 text-emerald-50" },
  { label: "Outstanding", value: "£5,500", icon: Clock, color: "from-[#F59E0B] to-[#D97706]", glow:"shadow-[#F59E0B]/40 text-amber-50" },
  { label: "Overdue", value: "£1,200", icon: XCircle, color: "from-[#EF4444] to-[#B91C1C]", glow:"shadow-[#EF4444]/40 text-red-50" },
  { label: "This Month", value: "£4,300", icon: Calendar, color: "from-[#3B82F6] to-[#1D4ED8]", glow:"shadow-[#3B82F6]/40 text-blue-50" },
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
    showNotification("Invoice Sent out", "The billing instance has been routed to the client via email.", "success");
  };

  const handleSendReminder = (id: number) => {
    showNotification("Reminder Deployed", `A payment reminder ping has been initiated for ID: ${id}.`, "success");
  };



  const handleCreateInvoice = () => {
    showNotification("Create Record", "Opening universal invoice builder...", "info");
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

  // Flow State Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  return (
    <div className="relative min-h-screen max-w-7xl mx-auto pb-12 space-y-8 overflow-hidden">
      {/* Deep Financial Ambient Light Orbs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
         <motion.div 
            animate={{ 
              x: ["-10%", "100%", "-10%"],
              y: ["-20%", "50%", "-20%"],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-r from-emerald-200/40 to-teal-300/40 blur-[120px] mix-blend-multiply" 
          />
         <motion.div 
            animate={{ 
              x: ["100%", "-20%", "100%"],
              y: ["80%", "-10%", "80%"],
              scale: [1, 1.3, 1],
            }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-l from-blue-200/30 to-indigo-300/30 blur-[120px] mix-blend-multiply" 
          />
      </div>

      <div className="relative z-10 space-y-8">
        {/* Ultra-Premium Hero Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/40 p-6 lg:p-8 rounded-[2rem] border border-white/60 shadow-[0_8px_32px_rgb(0,0,0,0.04)] backdrop-blur-xl">
          <div>
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-white to-gray-50/50 rounded-2xl shadow-[inset_0_2px_10px_rgb(255,255,255,0.8),0_4px_15px_rgb(0,0,0,0.05)] border border-white/80">
                  <CreditCard className="h-7 w-7 text-emerald-600" />
              </div>
              <div>
                  <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 flex items-center gap-3">
                    Billing Terminal
                    <Badge variant="success" size="sm" className="hidden sm:inline-flex bg-emerald-500/10 text-emerald-600 border-emerald-500/20 py-1.5 px-3 rounded-xl shadow-inner font-bold tracking-wider text-[11px] uppercase">
                      Secure Ledger
                    </Badge>
                  </h1>
                  <p className="text-gray-500 mt-2 font-medium text-lg">
                    Build, deploy, and clear client financial obligations.
                  </p>
              </div>
            </div>
          </div>
          
          <button
             onClick={handleCreateInvoice}
             className="relative group h-14 px-8 rounded-2xl overflow-hidden font-bold tracking-wide shadow-xl shadow-emerald-600/20 transition-all hover:scale-[1.03] active:scale-[0.98] w-full sm:w-auto mt-2 sm:mt-0"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 bg-[length:200%_auto] group-hover:animate-gradient" />
            <div className="absolute inset-[1px] rounded-[15px] bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
            <span className="relative z-10 flex items-center justify-center text-white text-[16px]">
              <Plus className="mr-2 h-5 w-5" />
              Draw New Invoice
            </span>
          </button>
        </div>

         {/* Deep Glass Financial Block Stats Module */}
         <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div key={stat.label} variants={itemVariants}>
                <div className="relative group p-1 rounded-[2rem] bg-gradient-to-b from-white/60 to-white/20 hover:from-white/80 hover:to-white/40 transition-all duration-500 shadow-[0_8px_32px_rgb(0,0,0,0.04)] backdrop-blur-xl border border-white/50 hover:-translate-y-2">
                  <div className="absolute inset-x-4 -top-0.5 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-50" />
                  
                  <div className="bg-white/40 h-full rounded-[1.75rem] p-6 lg:p-8 shadow-[inset_0_2px_15px_rgb(255,255,255,0.5)] flex flex-col justify-between overflow-hidden relative">
                     {/* Heavy Glow Background Effect */}
                     <div className={`absolute -right-12 -bottom-12 w-48 h-48 rounded-full blur-[50px] opacity-[0.12] bg-gradient-to-br ${stat.color} group-hover:scale-150 group-hover:opacity-20 transition-all duration-700`} />
                     
                     <div className="flex items-start justify-between relative z-10 w-full mb-6">
                        <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg ${stat.glow} border border-white/20 group-hover:-translate-y-1 transition-transform duration-500`}>
                          <Icon className={`h-6 w-6`} />
                        </div>
                     </div>
                     <div className="relative z-10">
                        <motion.h3 
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ duration: 0.8, delay: 0.2 + (i * 0.1) }}
                           className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tighter mb-2"
                        >
                           {stat.value}
                        </motion.h3>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
                     </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* High-Contrast Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/50 p-4 rounded-3xl border border-white/80 shadow-[0_8px_32px_rgb(0,0,0,0.04)] backdrop-blur-xl relative z-20">
          <div className="relative flex-1 w-full md:max-w-xl group">
            <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
            <Input
              type="search"
              placeholder="Search specific target nodes or identities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-14 border-white shadow-[inset_0_2px_8px_rgb(0,0,0,0.02)] bg-white/80 h-14 rounded-2xl text-[15px] font-medium focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500/50 transition-all placeholder:text-gray-400"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-14 px-5 lg:min-w-[200px] rounded-2xl border-white shadow-[inset_0_2px_8px_rgb(0,0,0,0.02)] bg-white/80 text-[15px] text-gray-700 font-bold focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 transition-all cursor-pointer w-full md:w-auto appearance-none"
            >
              <option value="all">Universal Status</option>
              <option value="draft">Draft Protocol</option>
              <option value="sent">Awaiting Funds</option>
              <option value="paid">100% Cleared</option>
              <option value="overdue">Escalated Due</option>
            </select>
          </div>
        </div>

        {/* Ultra-Premium Glass Tickets Grid (similar to CRM but mapped to Invoicing data) */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 xl:grid-cols-2 gap-8"
        >
          <AnimatePresence>
            {filteredInvoices.map((invoice) => {
              const statusInfo = statusConfig[invoice.status as keyof typeof statusConfig];
              const daysUntilDue = getDaysUntilDue(invoice.dueDate);
              const isOverdue = daysUntilDue < 0 && invoice.status !== "paid";
              const isPaid = invoice.status === "paid";
              
              return (
                <motion.div
                  layout
                  key={invoice.id}
                  variants={itemVariants}
                  className="group relative h-full flex"
                >
                  <div className={`w-full flex flex-col overflow-hidden relative transition-all duration-500 rounded-[2.5rem] border backdrop-blur-xl hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 ${
                    isPaid ? 'bg-emerald-50/40 border-emerald-100/50 shadow-[0_8px_32px_rgb(16,185,129,0.04)]' : 
                    isOverdue ? 'bg-red-50/40 border-red-100/50 shadow-[0_8px_32px_rgb(239,68,68,0.04)]' : 
                    'bg-white/60 border-white/80 shadow-[0_8px_32px_rgb(0,0,0,0.04)]'
                  }`}>
                    
                    {/* Glossy top edge highlight */}
                    <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />
                    
                    {/* Status Top border indicator */}
                    <div className={`absolute top-0 left-0 w-full h-1.5 ${
                        isPaid ? "bg-gradient-to-r from-emerald-400 to-emerald-500" : 
                        isOverdue ? "bg-gradient-to-r from-red-400 to-red-500 animate-pulse" :
                        invoice.status === 'sent' ? "bg-gradient-to-r from-blue-400 to-blue-500" :
                        "bg-gradient-to-r from-gray-300 to-gray-400"
                    }`} />
                    
                    <div className="flex flex-col lg:flex-row xl:flex-col 2xl:flex-row h-full">
                       {/* Left Core Data Container */}
                       <div className="p-6 sm:p-8 lg:p-10 xl:p-8 2xl:p-10 flex-1 flex flex-col relative z-10 w-full border-b lg:border-b-0 xl:border-b 2xl:border-b-0 lg:border-r xl:border-r-0 2xl:border-r border-white/60">
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-4">
                               <div>
                                  <div className="flex items-center gap-3 mb-2">
                                     <h3 className="text-2xl font-black text-gray-900 tracking-tight group-hover:text-[#0a9396] transition-colors flex items-center gap-3">
                                        {invoice.invoiceNumber}
                                     </h3>
                                     <Badge 
                                        variant={statusInfo.color as "default" | "info" | "success" | "danger"} 
                                        size="md" 
                                        className="flex items-center gap-1.5 uppercase font-black tracking-widest text-[10px] px-3 py-1 shadow-sm"
                                     >
                                        <div className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot} animate-pulse`} />
                                        {statusInfo.label}
                                     </Badge>
                                  </div>
                                  <div className="flex items-center gap-2 mb-1">
                                     <p className="text-[14px] font-bold text-gray-500 flex items-center gap-2 bg-white/60 px-3 py-1.5 rounded-lg border border-white shadow-sm w-max">
                                        <Building2 className="w-4 h-4 text-emerald-600" />
                                        {invoice.client}
                                     </p>
                                  </div>
                               </div>
                               
                               <div className="text-right shrink-0">
                                  <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1">Obligation</p>
                                  <p className="text-3xl font-black text-gray-900 tracking-tighter">{formatCurrency(invoice.total)}</p>
                               </div>
                            </div>
  
                            {/* Condensed Items Preview inside frosted cell */}
                            <div className="bg-white/40 border border-white/60 rounded-2xl p-5 mb-5 shadow-[inset_0_2px_10px_rgb(255,255,255,0.5)]">
                              <div className="space-y-4 text-sm">
                                {invoice.items.slice(0, 2).map((item, idx) => (
                                  <div key={idx} className="flex justify-between items-center group/item hover:bg-white/50 p-2 -my-2 rounded-lg transition-colors cursor-default">
                                    <span className="text-gray-700 font-bold truncate pr-4 text-[15px]">
                                      {item.description} 
                                      <span className="text-gray-400 font-bold ml-2 tracking-widest text-xs uppercase opacity-80 group-hover/item:opacity-100 transition-opacity">
                                        [{item.quantity} Unit{item.quantity>1?'s':''}]
                                      </span>
                                    </span>
                                    <span className="font-black text-gray-900 shrink-0 tabular-nums">{formatCurrency(item.total)}</span>
                                  </div>
                                ))}
                                {invoice.items.length > 2 && (
                                   <div className="pt-2 border-t border-white text-center">
                                     <span className="inline-flex items-center gap-1.5 text-[11px] text-gray-500 font-bold uppercase tracking-widest bg-white/60 px-3 py-1 rounded-full border border-white shadow-sm">
                                       <Plus className="w-3 h-3" />
                                       {invoice.items.length - 2} Additional Parameter{invoice.items.length - 2 !== 1 ? "s" : ""}
                                     </span>
                                   </div>
                                )}
                              </div>
                            </div>
  
                            {/* Timelines Tracker Cell */}
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                               <div>
                                 <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Created Target</p>
                                 <p className="text-[14px] font-bold text-gray-800 flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    {new Date(invoice.createdAt).toLocaleDateString()}
                                 </p>
                               </div>
                               
                               <div className="h-6 w-px bg-white border-l border-gray-200/50" />
                               
                               <div>
                                 <p className="text-[11px] text-emerald-500 font-bold uppercase tracking-widest mb-0.5 relative flex items-center gap-1.5">
                                    Hard Boundary
                                    {isOverdue && <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-red-500 animate-ping" />}
                                 </p>
                                 <p className={`text-[14px] font-black flex items-center gap-1.5 ${isOverdue ? 'text-red-600' : 'text-gray-800'}`}>
                                    <Clock className={`w-4 h-4 ${isOverdue ? 'text-red-500' : 'text-emerald-500'}`} />
                                    {new Date(invoice.dueDate).toLocaleDateString()}
                                    
                                    {!isPaid && invoice.status !== "draft" && !isOverdue && (
                                      <span className="ml-2 font-bold text-[12px] text-gray-400 tracking-wider">({daysUntilDue}D)</span>
                                    )}
                                 </p>
                               </div>
                            </div>
                          </div>
                       </div>
  
                       {/* Right Action / Receipt Sidepanel */}
                       <div className="p-6 lg:p-8 flex flex-col justify-center gap-4 w-full lg:w-[280px] xl:w-full 2xl:w-[280px] shrink-0 bg-gray-50/60 backdrop-blur-md relative z-20 shadow-[inset_1px_0_0_rgb(0,0,0,0.02)] border-l-0 lg:border-l xl:border-l-0 2xl:border-l border-white">
                          {isPaid ? (
                             <div className="text-center mb-6 opacity-80 mix-blend-multiply">
                                <div className="mx-auto w-16 h-16 border-4 border-emerald-500 text-emerald-600 flex items-center justify-center rounded-full mb-3 shadow-[0_0_30px_rgb(16,185,129,0.2)]">
                                   <CheckCircle2 className="w-8 h-8" />
                                </div>
                                <p className="font-black text-emerald-700 tracking-widest uppercase text-sm">Balanced</p>
                                <p className="font-bold text-emerald-600/60 tracking-wider uppercase text-[10px] mt-1">{new Date(invoice.paidAt!).toLocaleDateString()}</p>
                             </div>
                          ) : isOverdue ? (
                             <div className="text-center mb-6 opacity-80 mix-blend-multiply">
                                <div className="mx-auto w-16 h-16 border-4 border-red-500 text-red-600 flex items-center justify-center rounded-full mb-3 shadow-[0_0_30px_rgb(239,68,68,0.2)]">
                                   <XCircle className="w-8 h-8" />
                                </div>
                                <p className="font-black text-red-700 tracking-widest uppercase text-sm">Delinquent</p>
                                <p className="font-bold text-red-600/60 tracking-wider uppercase text-[10px] mt-1">{Math.abs(daysUntilDue)} Days Past</p>
                             </div>
                          ) : (
                             <div className="text-center mb-6 opacity-80 mix-blend-multiply">
                                <div className="mx-auto w-16 h-16 border-4 border-blue-400 text-blue-500 flex items-center justify-center rounded-full mb-3 shadow-[0_0_30px_rgb(96,165,250,0.2)]">
                                   <Send className="w-7 h-7 ml-1" />
                                </div>
                                <p className="font-black text-blue-600 tracking-widest uppercase text-[12px] whitespace-nowrap overflow-hidden text-ellipsis">{invoice.status === 'draft' ? 'Local Draft' : 'Transmission Active'}</p>
                             </div>
                          )}
  
                            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row 2xl:flex-col flex-wrap gap-3 w-full">
                              {/* Action Matrix */}
                              <button
                                onClick={() => handleView(invoice)}
                                className="flex-1 relative group min-h-[3rem] h-auto py-3 px-4 rounded-xl overflow-hidden font-bold tracking-wide shadow-md shadow-gray-900/5 transition-all hover:scale-[1.03] active:scale-[0.98] w-full"
                              >
                               <div className="absolute inset-0 bg-white/80 backdrop-blur border border-white/60 group-hover:bg-gray-50 transition-colors" />
                               <span className="relative z-10 flex items-center justify-center text-gray-700 text-[14px]">
                                 <Eye className="mr-2 h-4 w-4" />
                                 Review Matrix
                               </span>
                            </button>
  
                              {invoice.status === "draft" && (
                                <button
                                  onClick={() => handleSendInvoice(invoice.id)}
                                  className="flex-1 relative group min-h-[3rem] h-auto py-3 px-4 rounded-xl overflow-hidden font-bold tracking-wide shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.03] active:scale-[0.98] w-full"
                                >
                                 <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 bg-[length:200%_auto] group-hover:animate-gradient" />
                                 <div className="absolute inset-[1px] rounded-[11px] bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                                 <span className="relative z-10 flex items-center justify-center text-white text-[14px]">
                                   <Send className="mr-2 h-4 w-4 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                                   Dispatch Target
                                 </span>
                              </button>
                            )}
                            
                              {(invoice.status === "sent" || invoice.status === "paid") && (
                                <button
                                  onClick={() => handleDownloadPDF(invoice)}
                                  className="flex-1 relative group min-h-[3rem] h-auto py-3 px-4 rounded-xl overflow-hidden font-bold tracking-wide shadow-lg shadow-gray-900/10 transition-all hover:scale-[1.03] active:scale-[0.98] w-full whitespace-nowrap"
                                >
                                 <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-[length:200%_auto] group-hover:animate-gradient" />
                                 <div className="absolute inset-[1px] rounded-[11px] bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                                 <span className="relative z-10 flex items-center justify-center text-white text-[14px]">
                                   <Download className="mr-2 h-4 w-4" />
                                   Download Copy
                                 </span>
                              </button>
                            )}
  
                              {invoice.status === "overdue" && (
                                 <button
                                  onClick={() => handleSendReminder(invoice.id)}
                                  className="flex-1 relative group min-h-[3rem] h-auto py-3 px-4 rounded-xl overflow-hidden font-bold tracking-wide shadow-lg shadow-red-600/30 transition-all hover:scale-[1.03] active:scale-[0.98] w-full whitespace-nowrap"
                                >
                                 <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-rose-500 to-red-500 bg-[length:200%_auto] group-hover:animate-gradient" />
                                 <div className="absolute inset-[1px] rounded-[11px] bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                                 <span className="relative z-10 flex items-center justify-center text-white text-[14px]">
                                   <Send className="mr-2 h-4 w-4 group-hover:scale-125 transition-transform" />
                                   Force Reminder
                                 </span>
                              </button>
                            )}
                          </div>
                       </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>

      {filteredInvoices.length === 0 && (
         <motion.div initial={{opacity:0}} animate={{opacity:1}}>
           <div className="border border-white/60 bg-white/40 backdrop-blur-md rounded-[3rem] shadow-[inset_0_2px_15px_rgb(255,255,255,0.7)] p-16 text-center mt-12 relative z-10">
               <div className="mx-auto w-24 h-24 bg-white/80 shadow-[0_8px_32px_rgb(0,0,0,0.06)] rounded-full flex items-center justify-center mb-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full animate-ping" />
                  <FileText className="h-10 w-10 text-gray-400 relative z-10" />
               </div>
               <h3 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Empty Database</h3>
               <p className="text-gray-500 text-lg max-w-md mx-auto font-medium leading-relaxed mb-8">
                 {searchQuery || statusFilter !== "all"
                   ? "We couldn't ping any ledger targets with that query constraint."
                   : "Deploy your first financial request onto the dashboard to begin tracking yield."}
               </p>
               <button 
                  onClick={handleCreateInvoice}
                  className="relative inline-flex group h-14 px-8 rounded-2xl overflow-hidden font-bold tracking-wide shadow-xl shadow-emerald-500/20 transition-all hover:-translate-y-1 active:scale-[0.98]"
               >
                 <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 bg-[length:200%_auto] group-hover:animate-gradient" />
                 <div className="absolute inset-[1px] rounded-[15px] bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                 <span className="relative z-10 flex items-center justify-center text-white text-[16px]">
                   <Plus className="mr-2 h-5 w-5" />
                   Initiate Ledger Entry
                 </span>
               </button>
           </div>
         </motion.div>
      )}

      {/* Cinematic A4 Paper Print Modal */}
      <AnimatePresence>
        {isViewModalOpen && selectedInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             {/* Massive Depth Blur overlay */}
             <motion.div
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="absolute inset-0 bg-black/40 backdrop-blur-3xl transition-opacity print:hidden"
                 onClick={() => setIsViewModalOpen(false)}
              />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="bg-white rounded-none sm:rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] border border-gray-200 w-full max-w-4xl max-h-[100vh] sm:max-h-[90vh] overflow-y-auto relative z-10 print:shadow-none print:border-none print:max-w-none print:max-h-none print:overflow-visible print:rounded-none"
            >
              {/* Floating Tool Header */}
              <div className="sticky top-0 bg-gray-900 p-6 border-b border-gray-800 flex justify-between items-center print:hidden z-20">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-white/10 rounded-xl hidden sm:block border border-white/5">
                       <FileText className="h-5 w-5 text-white" />
                   </div>
                   <div>
                      <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-3">
                        {selectedInvoice.invoiceNumber}
                        <span className="px-2 py-0.5 rounded-md bg-white/10 text-gray-300 text-[10px] uppercase font-black tracking-widest leading-none border border-white/5">Local Copy</span>
                      </h2>
                      <p className="text-[13px] font-medium text-gray-400 mt-0.5">Physical Render Preview Mode</p>
                   </div>
                </div>
                <div className="flex gap-4 items-center">
                   <button onClick={() => window.print()} className="relative group h-12 px-6 rounded-xl overflow-hidden font-bold tracking-wide shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.03] active:scale-[0.98] hidden sm:block">
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 bg-[length:200%_auto] group-hover:animate-gradient" />
                      <div className="absolute inset-[1px] rounded-[11px] bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                      <span className="relative z-10 flex items-center justify-center text-white text-[14px]">
                        <Download className="mr-2 h-4 w-4" />
                        Execute Print Command
                      </span>
                   </button>
                   <button onClick={() => setIsViewModalOpen(false)} className="p-3 bg-white/10 hover:bg-white/20 transition-all rounded-xl text-white border border-white/5 hover:scale-110 active:scale-95">
                     <X className="h-5 w-5" />
                   </button>
                </div>
              </div>

              {/* True A4 Scale Invoice Canvas */}
              <div className="p-8 sm:p-16 print:p-0 bg-white min-h-[11in] text-gray-900 relative" id="printable-invoice">
                {/* Visual Letterhead */}
                <div className="absolute top-0 left-0 w-full h-4 bg-gray-900 border-b-4 border-emerald-500" />
                
                <div className="flex flex-col sm:flex-row justify-between items-start mb-16 pt-4 gap-8">
                   <div>
                     <h1 className="text-5xl sm:text-[4rem] font-black text-gray-900 tracking-tighter leading-none mb-4">INVOICE.</h1>
                     <p className="text-gray-500 font-bold tracking-widest uppercase border-2 border-gray-200 inline-block px-4 py-2 rounded-lg text-sm">{selectedInvoice.invoiceNumber}</p>
                   </div>
                   <div className="sm:text-right text-left text-sm font-bold bg-gray-50 px-6 py-5 rounded-2xl border border-gray-100">
                     <h3 className="font-black text-gray-900 text-2xl tracking-tight mb-3">DigitalBOX</h3>
                     <p className="text-gray-500">123 Technology Hub, Metro Area</p>
                     <p className="text-gray-500">financials@digitalbox-app.co.uk</p>
                     <p className="text-gray-500 mt-2 text-xs uppercase tracking-widest text-gray-400">VAT Reg: GB123456789</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-16 relative">
                   {/* Divider line spanning the grid */}
                   <div className="absolute top-1/2 left-0 w-full h-px bg-gray-200 hidden sm:block -z-10" />
                   <div className="absolute top-0 left-1/2 w-px h-full bg-gray-200 hidden sm:block -z-10" />
                   
                   <div className="bg-white pr-8 pb-8 z-0 inline-block">
                     <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                       <Building2 className="w-3 h-3" />
                       Recipient Corporation
                     </p>
                     <p className="font-black text-gray-900 text-2xl tracking-tight mb-2">{selectedInvoice.client}</p>
                     <p className="text-gray-600 font-semibold mb-1">{selectedInvoice.clientEmail}</p>
                     <p className="text-gray-600 font-semibold">{selectedInvoice.project}</p>
                   </div>
                   
                   <div className="bg-white pl-8 pb-8 z-0 inline-block flex flex-col gap-6">
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                          <Calendar className="w-3 h-3" />
                          Generated Target
                        </p>
                        <p className="font-black text-gray-900 text-xl">{new Date(selectedInvoice.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          Settlement Boundary
                        </p>
                        <p className="font-black text-gray-900 text-xl">{new Date(selectedInvoice.dueDate).toLocaleDateString()}</p>
                      </div>
                   </div>
                </div>
                
                {/* High Contrast Ledger List */}
                <div className="rounded-2xl border-2 border-gray-900 overflow-hidden mb-16 shadow-[2px_4px_0px_#111827]">
                  <table className="w-full">
                    <thead className="bg-gray-900 text-white">
                      <tr className="text-left">
                        <th className="py-5 px-6 font-black tracking-widest uppercase text-[10px]">Description Logic</th>
                        <th className="py-5 px-6 font-black tracking-widest uppercase text-[10px] text-center">Unit Volume</th>
                        <th className="py-5 px-6 font-black tracking-widest uppercase text-[10px] text-right hidden sm:table-cell">Base Point</th>
                        <th className="py-5 px-6 font-black tracking-widest uppercase text-[10px] text-right">Row Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-gray-100 bg-white">
                      {selectedInvoice.items.map((item: InvoiceType["items"][0], i: number) => (
                        <tr key={i}>
                          <td className="py-6 px-6 font-bold text-gray-900 text-[15px]">{item.description}</td>
                          <td className="py-6 px-6 font-bold text-gray-500 text-center">{item.quantity}</td>
                          <td className="py-6 px-6 font-bold text-gray-500 text-right hidden sm:table-cell">{formatCurrency(item.unitPrice)}</td>
                          <td className="py-6 px-6 font-black text-gray-900 text-right text-lg">{formatCurrency(item.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start gap-12">
                  <div className="w-full sm:w-[50%]">
                     <p className="text-[11px] font-black text-gray-900 uppercase tracking-widest mb-3 border-b-2 border-gray-900 pb-2 inline-block">Direct Routing Instructions</p>
                     <p className="text-gray-600 font-semibold text-sm leading-relaxed mb-4">
                       Automated clearance requires funds delivered exactly on or before the stated <span className="font-bold text-gray-900">{new Date(selectedInvoice.dueDate).toLocaleDateString()}</span> boundary. References must include string: <span className="font-bold text-gray-900 tracking-wider bg-gray-100 px-2 py-0.5 rounded">{selectedInvoice.invoiceNumber}</span>.
                     </p>
                     <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs font-bold text-gray-500 font-mono">
                        {/* Bank Sort Code: 20-45-77 */}
                        <br />
                        {/* Target Account: 80921234 */}
                     </div>
                  </div>
                  
                  <div className="w-full sm:w-[400px] bg-gray-900 text-white rounded-3xl p-8 shadow-[4px_8px_0px_#10b981]">
                      <div className="flex justify-between py-2 text-gray-400 font-bold mb-2">
                        <span className="uppercase tracking-widest text-[11px]">Subtotal Node</span>
                        <span className="text-white text-[15px]">{formatCurrency(selectedInvoice.subtotal)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-700 pb-6 mb-6">
                        <span className="text-gray-400 font-bold uppercase tracking-widest text-[11px]">Tax Weighting (0%)</span>
                        <span className="text-white font-bold text-[15px]">{formatCurrency(selectedInvoice.tax)}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-emerald-400 font-black text-[10px] uppercase tracking-widest mb-1">Total Requested Amount</span>
                        <span className="font-black text-5xl tracking-tighter text-white">{formatCurrency(selectedInvoice.total)}</span>
                      </div>
                  </div>
                </div>
                
                {selectedInvoice.status === "paid" && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none rotate-[-15deg] mix-blend-multiply">
                    <h1 className="text-[180px] font-black text-emerald-600 uppercase border-[12px] border-emerald-600 px-12 py-6 tracking-widest whitespace-nowrap rounded-[4rem]">CLEARED</h1>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modern Notification Toast Component */}
       <AnimatePresence>
        {notificationModal.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none">
            {/* Backdrop overlay */}
            <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-gray-900/30 backdrop-blur-sm pointer-events-auto"
               onClick={() => setNotificationModal(prev => ({ ...prev, isOpen: false }))}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden z-10 border border-gray-100 pointer-events-auto"
            >
              <div className="p-8 text-center bg-white relative overflow-hidden">
                {/* Background glow behind icon */}
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full blur-[40px] opacity-30 ${
                  notificationModal.type === 'success' ? 'bg-emerald-500' :
                  notificationModal.type === 'error' ? 'bg-red-500' : 'bg-[#0a9396]'
                }`} />

                <div className="relative">
                  <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-2xl mb-6 shadow-sm border ${
                    notificationModal.type === 'success' ? 'bg-emerald-50 border-emerald-100' :
                    notificationModal.type === 'error' ? 'bg-red-50 border-red-100' : 'bg-[#0a9396]/5 border-[#0a9396]/10'
                  }`}>
                    {notificationModal.type === 'success' && <CheckCircle2 className="h-10 w-10 text-emerald-600" />}
                    {notificationModal.type === 'error' && <XCircle className="h-10 w-10 text-red-600" />}
                    {notificationModal.type === 'info' && <FileText className="h-10 w-10 text-[#0a9396]" />}
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">{notificationModal.title}</h3>
                  <p className="text-gray-500 mb-8 font-medium leading-relaxed">{notificationModal.message}</p>
                  <button 
                    onClick={() => setNotificationModal(prev => ({ ...prev, isOpen: false }))} 
                    className={`w-full text-white font-bold tracking-wide shadow-md h-12 rounded-xl text-[15px] transition-all hover:scale-[1.03] active:scale-[0.98] ${
                      notificationModal.type === 'success' ? 'bg-emerald-600 hover:bg-emerald-700' :
                      notificationModal.type === 'error' ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-900 hover:bg-black'
                    }`}
                  >
                    Acknowledged
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
            background: transparent !important;
          }
           @page {
             margin: 0;
           }
          #printable-invoice, #printable-invoice * {
            visibility: visible;
          }
          #printable-invoice {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            padding: 40px !important;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}
