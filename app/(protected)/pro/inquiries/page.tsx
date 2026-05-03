"use client";

import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { useSearchParams } from "next/navigation";
import {
  MessageSquare,
  Search,
  Building2,
  DollarSign,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Mail,
  Calendar,
  Eye,
  MoreVertical,
  ChevronRight,
  Send,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { formatCurrency } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";

const statusConfig = {
  new: { label: "New", color: "danger", icon: AlertCircle, theme: "bg-rose-50 text-rose-600 border-rose-200" },
  reviewed: { label: "Reviewed", color: "info", icon: Clock, theme: "bg-blue-50 text-blue-600 border-blue-200" },
  responded: { label: "Responded", color: "default", icon: Mail, theme: "bg-gray-100 text-gray-600 border-gray-300" },
  accepted: { label: "Accepted", color: "success", icon: CheckCircle2, theme: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  declined: { label: "Declined", color: "default", icon: XCircle, theme: "bg-gray-50 text-gray-400 border-gray-200" },
};

const statsConfig = [
  { label: "New Inquiries", icon: AlertCircle, color: "from-[#FF4D4D] to-[#FF0000]", glow: "shadow-[#FF4D4D]/40 text-[#FF4D4D]" },
  { label: "Total Inquiries", icon: MessageSquare, color: "from-[#00F0FF] to-[#0080FF]", glow: "shadow-[#00F0FF]/40 text-[#00F0FF]" },
  { label: "Responded", icon: CheckCircle2, color: "from-[#00FF87] to-[#60EFFF]", glow: "shadow-[#00FF87]/40 text-[#00FF87]" },
  { label: "Accepted", icon: Clock, color: "from-[#F59E0B] to-[#D97706]", glow: "shadow-[#F59E0B]/40 text-[#F59E0B]" },
];

interface Inquiry {
  id: string;
  client: string;
  company: string;
  project: string;
  budget: number;
  status: string;
  time: string;
  receivedDate: string;
  description: string;
  objective: string;
  targetAudience: string;
  platforms: string[];
  deliverables: string[];
  requirements: string[];
  projectId: string;
  clientId: string;
  message: string;
}

interface Message {
  id: string;
  text: string;
  senderId: string;
  createdAt: string;
}

export default function MarketplaceInquiriesPage() {
  const [data, setData] = useState<Inquiry[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [proposalAmount, setProposalAmount] = useState("");
  const [proposalTimeline, setProposalTimeline] = useState("");
  const [proposalMessage, setProposalMessage] = useState("");
  const [isSubmittingProposal, setIsSubmittingProposal] = useState(false);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const fetchInquiries = useCallback(async () => {
    try {
      const res = await fetch("/api/pro/inquiries");
      if (res.ok) {
        const json = await res.json();
        setData(json.inquiries);
      }
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  const searchParams = useSearchParams();

  useEffect(() => { fetchInquiries(); }, [fetchInquiries]);

  // Handle deep linking to a specific inquiry
  useEffect(() => {
    const inquiryId = searchParams.get("inquiryId");
    if (inquiryId && data.length > 0) {
      const inquiry = data.find((i) => i.id === inquiryId);
      if (inquiry) {
        handleOpenChat(inquiry);
      }
    }
  }, [searchParams, data]);

  const updateStatus = async (id: string, status: string) => {
    setProcessingId(id);
    try {
      const res = await fetch(`/api/pro/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setData((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
      }
    } finally {
      setProcessingId(null);
    }
  };

  const handleOpenDetailModal = (inquiry: Inquiry) => { setSelectedInquiry(inquiry); setIsDetailModalOpen(true); };
  const handleOpenReviewModal = (inquiry: Inquiry) => { setSelectedInquiry(inquiry); setIsReviewModalOpen(true); };
  const handleOpenProposalModal = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setProposalAmount("");
    setProposalTimeline("");
    setProposalMessage("");
    setIsProposalModalOpen(true);
  };

  const fetchMessages = async (inquiryId: string) => {
    try {
      const res = await fetch(`/api/messaging/messages?inquiryId=${inquiryId}`);
      if (res.ok) {
        const json = await res.json();
        setMessages(json.messages);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleOpenChat = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setIsChatOpen(true);
    fetchMessages(inquiry.id);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiry || !newMessage.trim()) return;
    setIsSendingMessage(true);
    try {
      const res = await fetch("/api/messaging/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: newMessage,
          inquiryId: selectedInquiry.id,
          receiverId: selectedInquiry.clientId,
          projectId: selectedInquiry.projectId,
        }),
      });
      if (res.ok) {
        const { message } = await res.json();
        setMessages([...messages, message]);
        setNewMessage("");
        await updateStatus(selectedInquiry.id, "responded");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleSendProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiry) return;
    setIsSubmittingProposal(true);
    try {
      const res = await fetch("/api/pro/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: selectedInquiry.clientId,
          projectId: selectedInquiry.projectId,
          title: `Proposal for ${selectedInquiry.project}`,
          summary: proposalMessage,
          scope: proposalMessage,
          price: parseFloat(proposalAmount),
          timeline: proposalTimeline,
          status: "sent",
        }),
      });
      if (res.ok) {
        await updateStatus(selectedInquiry.id, "responded");
        setIsProposalModalOpen(false);
        setSelectedInquiry(null);
      }
    } finally {
      setIsSubmittingProposal(false);
    }
  };

  const handleDecline = (id: string) => updateStatus(id, "declined");

  const filteredInquiries = data.filter((inquiry) => {
    const matchesSearch =
      inquiry.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || inquiry.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 30, scale: 0.98 }, show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 100, damping: 15 } } };

  return (
    <div className="relative min-h-screen max-w-7xl mx-auto pb-12 space-y-8 overflow-hidden">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <motion.div
          animate={{ x: ["-10%", "100%", "-10%"], y: ["-20%", "50%", "-20%"], scale: [1, 1.2, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-r from-teal-200/40 to-cyan-300/40 blur-[120px] mix-blend-multiply"
        />
        <motion.div
          animate={{ x: ["100%", "-20%", "100%"], y: ["80%", "-10%", "80%"], scale: [1, 1.3, 1] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-l from-indigo-200/30 to-purple-300/30 blur-[120px] mix-blend-multiply"
        />
      </div>

      <div className="relative z-10 space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/40 p-6 lg:p-8 rounded-[2rem] border border-white/60 shadow-[0_8px_32px_rgb(0,0,0,0.04)] backdrop-blur-xl">
          <div>
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-white to-gray-50/50 rounded-2xl shadow-[inset_0_2px_10px_rgb(255,255,255,0.8),0_4px_15px_rgb(0,0,0,0.05)] border border-white/80">
                <MessageSquare className="h-7 w-7 text-[#0a9396]" />
              </div>
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 flex items-center gap-3">
                  Inquiries Pipeline
                  <Badge variant="primary" size="sm" className="hidden sm:inline-flex bg-[#0a9396]/10 text-[#0a9396] border-[#0a9396]/20 py-1.5 px-3 rounded-xl shadow-inner font-bold tracking-wider text-[11px] uppercase">
                    Live Feed
                  </Badge>
                </h1>
                <p className="text-gray-500 mt-2 font-medium text-lg">
                  Manage incoming client project requests and convert active leads.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsConfig.map((stat, i) => {
            const Icon = stat.icon;
            const vals = [
              String(data.filter((d) => d.status === "new").length),
              String(data.length),
              String(data.filter((d) => d.status === "responded" || d.status === "accepted").length),
              String(data.filter((d) => d.status === "accepted").length),
            ];
            return (
              <motion.div key={stat.label} variants={itemVariants}>
                <div className="relative group p-1 rounded-[2rem] bg-gradient-to-b from-white/60 to-white/20 hover:from-white/80 hover:to-white/40 transition-all duration-500 shadow-[0_8px_32px_rgb(0,0,0,0.04)] backdrop-blur-xl border border-white/50 hover:-translate-y-2">
                  <div className="bg-white/40 h-full rounded-[1.75rem] p-6 lg:p-8 shadow-[inset_0_2px_15px_rgb(255,255,255,0.5)] flex flex-col justify-between overflow-hidden relative">
                    <div className={`absolute -right-12 -bottom-12 w-40 h-40 rounded-full blur-[50px] opacity-15 bg-gradient-to-br ${stat.color}`} />
                    <div className="flex items-start justify-between relative z-10 w-full mb-6">
                      <div className={`p-3 rounded-2xl bg-white shadow-lg ${stat.glow} border border-white/60`}>
                        <Icon className={`h-6 w-6 ${stat.glow.split(" ")[1]}`} />
                      </div>
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tighter mb-2">
                        {isLoadingData ? "—" : vals[i]}
                      </h3>
                      <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/50 p-4 rounded-3xl border border-white/80 shadow-[0_8px_32px_rgb(0,0,0,0.04)] backdrop-blur-xl relative z-20">
          <div className="relative flex-1 w-full md:max-w-xl group">
            <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Search by client, project, or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-14 border-white shadow-[inset_0_2px_8px_rgb(0,0,0,0.02)] bg-white/80 h-14 rounded-2xl text-[15px] font-medium focus-visible:ring-[#0a9396]/30 focus-visible:border-[#0a9396]/50 placeholder:text-gray-400"
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-14 px-6 lg:min-w-[240px] rounded-2xl border-white shadow-[inset_0_2px_8px_rgb(0,0,0,0.02)] bg-white/80 text-[15px] text-gray-700 font-bold focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 transition-all cursor-pointer w-full md:w-auto outline-none appearance-none"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="reviewed">Reviewed</option>
              <option value="responded">Responded</option>
              <option value="accepted">Accepted</option>
              <option value="declined">Declined</option>
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
              <ChevronRight className="h-5 w-5 text-gray-400 rotate-90" />
            </div>
          </div>
        </div>

        {/* Inquiry cards */}
        {isLoadingData ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 text-[#0a9396] animate-spin" />
          </div>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 gap-8">
            <AnimatePresence>
              {filteredInquiries.map((inquiry) => {
                const statusInfo = statusConfig[inquiry.status as keyof typeof statusConfig] || statusConfig.new;
                const StatusIcon = statusInfo.icon;
                const isNew = inquiry.status === "new";
                const isProcessing = processingId === inquiry.id;

                return (
                  <motion.div 
                    layout 
                    key={inquiry.id} 
                    variants={itemVariants} 
                    className="group relative cursor-pointer"
                    onClick={() => handleOpenChat(inquiry)}
                  >
                    {isNew && (
                      <div className="absolute -inset-1 bg-gradient-to-r from-[#0a9396]/20 via-teal-400/20 to-indigo-500/20 rounded-[2.5rem] blur-xl animate-pulse -z-10" />
                    )}
                    <div className={`${isNew ? "border-[#0a9396]/30 bg-white/90 shadow-[0_8px_32px_rgb(10,147,150,0.08)]" : "border-white/80 bg-white/60 shadow-[0_8px_32px_rgb(0,0,0,0.04)]"} rounded-[2.5rem] border backdrop-blur-xl relative overflow-hidden transition-all duration-500 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1`}>
                      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />

                      <div className="flex flex-col xl:flex-row h-full">
                        {/* Left */}
                        <div className="p-8 lg:p-10 flex-1 relative z-10">
                          <div className="flex items-start justify-between mb-8">
                            <div>
                              <div className="flex items-center gap-4 mb-3">
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight group-hover:text-[#0a9396] transition-colors">{inquiry.client}</h3>
                                <Badge
                                  variant={statusInfo.color as "default" | "success" | "danger" | "info" | "primary"}
                                  size="md"
                                  className={`flex items-center gap-1.5 uppercase font-black tracking-widest text-[11px] px-3 py-1 shadow-sm ${statusInfo.theme}`}
                                >
                                  <StatusIcon className={`w-3.5 h-3.5 ${isNew ? "animate-pulse" : ""}`} />
                                  {statusInfo.label}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-6">
                                <span className="text-sm font-bold text-gray-500 flex items-center gap-2 bg-white/80 px-3 py-1.5 rounded-xl border border-gray-100 shadow-sm">
                                  <Building2 className="h-4 w-4 text-[#0a9396]" />
                                  {inquiry.company}
                                </span>
                                <span className="text-sm font-bold text-gray-400 flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  {new Date(inquiry.receivedDate).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                                </span>
                              </div>
                            </div>
                            <button className="text-gray-400 hover:text-gray-900 transition-colors bg-white/50 hover:bg-white shadow-sm border border-gray-200/50 rounded-xl p-2.5 shrink-0 hidden xl:block">
                              <MoreVertical className="h-5 w-5" />
                            </button>
                          </div>

                          <div className="bg-gradient-to-b from-transparent to-gray-50/30 -mx-8 -my-2 px-8 py-6 border-y border-gray-100/50">
                            <h4 className="text-[19px] font-extrabold text-gray-900 mb-3 leading-tight uppercase tracking-tight">{inquiry.project}</h4>
                            <div className="space-y-4">
                              <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-[#0a9396] mb-1">Brief Overview</p>
                                <p className="text-[15px] text-gray-600 leading-relaxed font-medium max-w-4xl">{inquiry.description}</p>
                              </div>
                              {inquiry.objective && inquiry.objective !== inquiry.description && (
                                <div>
                                  <p className="text-[10px] font-black uppercase tracking-widest text-[#0a9396] mb-1">Campaign Objective</p>
                                  <p className="text-[15px] text-gray-600 leading-relaxed font-medium max-w-4xl">{inquiry.objective}</p>
                                </div>
                              )}
                              {inquiry.targetAudience && (
                                <div>
                                  <p className="text-[10px] font-black uppercase tracking-widest text-[#0a9396] mb-1">Target Audience</p>
                                  <p className="text-[14px] text-gray-500 font-medium">{inquiry.targetAudience}</p>
                                </div>
                              )}
                              {inquiry.platforms.length > 0 && (
                                <div className="flex gap-2 items-center">
                                  <p className="text-[10px] font-black uppercase tracking-widest text-[#0a9396]">Platforms:</p>
                                  <div className="flex gap-2">
                                    {inquiry.platforms.map(p => (
                                      <span key={p} className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter bg-gray-100 px-2 py-0.5 rounded-md">{p}</span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {inquiry.requirements.length > 0 && (
                            <div className="flex flex-wrap gap-2.5 mt-8">
                              {inquiry.requirements.map((req, idx) => (
                                <span key={idx} className="bg-white/80 border border-gray-200/60 text-gray-700 px-4 py-1.5 rounded-xl font-bold text-[11px] uppercase tracking-wider">
                                  {req}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Right */}
                        <div className="p-6 xl:p-8 flex flex-col justify-between xl:w-[380px] bg-gray-50/40 backdrop-blur-3xl border-t xl:border-t-0 xl:border-l border-white/50 relative z-20">
                          <div className="space-y-3 mb-8">
                            <div className="p-5 rounded-[1.5rem] bg-white/80 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-white relative overflow-hidden group/budget">
                              <div className="flex items-center gap-4 relative z-10">
                                <div className="p-3 bg-gradient-to-br from-emerald-100/50 to-emerald-50/30 text-emerald-600 rounded-xl border border-emerald-200/50">
                                  <DollarSign className="w-6 h-6" />
                                </div>
                                <div>
                                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600/70 mb-0.5">Budget Allocation</p>
                                  <p className="text-2xl font-black text-gray-900 tracking-tighter">
                                    {formatCurrency(inquiry.budget)}<span className="text-sm text-gray-400 font-bold ml-1">/TERM</span>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col gap-3 mt-auto">
                            {isNew && (
                              <>
                                <button
                                  disabled={isProcessing}
                                  onClick={() => handleOpenReviewModal(inquiry)}
                                  className="w-full relative group h-14 rounded-2xl overflow-hidden font-black uppercase tracking-[0.1em] text-[13px] shadow-xl shadow-[#0a9396]/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:grayscale"
                                >
                                  <div className="absolute inset-0 bg-gradient-to-r from-[#0a9396] via-[#14b8a6] to-[#0a9396] bg-[length:200%_auto] group-hover:animate-gradient" />
                                  <div className="absolute inset-[1px] rounded-[15px] bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                                  <span className="relative z-10 flex items-center justify-center text-white">
                                    {isProcessing ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                                    Review & Accept Brief
                                  </span>
                                </button>
                                <div className="flex gap-3 w-full">
                                  <button
                                    disabled={isProcessing}
                                    onClick={(e) => { e.stopPropagation(); handleOpenChat(inquiry); }}
                                    className="flex-1 flex items-center justify-center bg-white/80 hover:bg-white shadow-sm rounded-xl border border-gray-100 text-gray-700 h-11 text-[12px] font-black uppercase tracking-wider transition-all disabled:opacity-50"
                                  >
                                    <Mail className="mr-2 h-3.5 w-3.5 text-gray-400" />
                                    Reply & Chat
                                  </button>
                                  <button
                                    disabled={isProcessing}
                                    onClick={() => handleDecline(inquiry.id)}
                                    className="flex-1 flex items-center justify-center text-red-600 bg-red-50/50 hover:bg-red-50 shadow-sm rounded-xl border border-red-100/50 h-11 text-[12px] font-black uppercase tracking-wider transition-all disabled:opacity-50"
                                  >
                                    {isProcessing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <XCircle className="mr-2 h-3.5 w-3.5" />}
                                    Decline
                                  </button>
                                </div>
                              </>
                            )}

                            {inquiry.status === "reviewed" && (
                              <>
                                <button
                                  disabled={isProcessing}
                                  onClick={() => handleOpenProposalModal(inquiry)}
                                  className="w-full relative group h-14 rounded-2xl overflow-hidden font-black uppercase tracking-[0.1em] text-[13px] shadow-xl shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                                >
                                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600 bg-[length:200%_auto] group-hover:animate-gradient" />
                                  <div className="absolute inset-[1px] rounded-[15px] bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                                  <span className="relative z-10 flex items-center justify-center text-white">
                                    {isProcessing ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Mail className="mr-2 h-4 w-4" />}
                                    Send Proposal
                                  </span>
                                </button>
                                <button
                                  onClick={() => handleOpenDetailModal(inquiry)}
                                  className="w-full flex items-center justify-center bg-white shadow-sm rounded-xl border border-gray-100 text-gray-700 h-11 text-[12px] font-black uppercase tracking-wider transition-all"
                                >
                                  <Eye className="mr-2 h-3.5 w-3.5" />
                                  Open Detail View
                                </button>
                              </>
                            )}

                            {inquiry.status === "accepted" && (
                              <button className="w-full relative group h-14 rounded-2xl overflow-hidden font-black uppercase tracking-[0.1em] text-[13px] shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 bg-[length:200%_auto] group-hover:animate-gradient" />
                                <div className="absolute inset-[1px] rounded-[15px] bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                                <span className="relative z-10 flex items-center justify-center text-white">
                                  <Building2 className="mr-2 h-4 w-4" />
                                  Begin Onboarding
                                </span>
                              </button>
                            )}

                            {!["new", "reviewed", "accepted"].includes(inquiry.status) && (
                              <button
                                onClick={() => handleOpenDetailModal(inquiry)}
                                className="w-full flex items-center justify-center bg-white shadow-sm hover:shadow-md rounded-xl border border-gray-100 text-gray-700 h-12 text-[12px] font-black uppercase tracking-wider transition-all"
                              >
                                Review Record
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
        )}

        {!isLoadingData && filteredInquiries.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="border border-white/60 bg-white/40 backdrop-blur-md rounded-[3rem] p-16 text-center">
              <div className="mx-auto w-24 h-24 bg-white/80 shadow-[0_8px_32px_rgb(0,0,0,0.06)] rounded-full flex items-center justify-center mb-6 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full animate-ping" />
                <MessageSquare className="h-10 w-10 text-gray-400 relative z-10" />
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Inbox Empty</h3>
              <p className="text-gray-500 text-lg max-w-md mx-auto font-medium leading-relaxed mb-8">
                {searchQuery || statusFilter !== "all"
                  ? "Try resetting your search filters."
                  : "No client inquiries yet. When clients express interest in projects you applied to, they'll appear here."}
              </p>
              <button onClick={fetchInquiries} className="bg-white px-8 py-3.5 rounded-xl shadow-md border border-gray-100 font-bold text-gray-900 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                Refresh Feed
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedInquiry && isDetailModalOpen && (
        <Modal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} size="xl" variant="light" className="bg-white/95 backdrop-blur-3xl border-white overflow-hidden shadow-[0_20px_60px_rgb(0,0,0,0.15)] rounded-[2rem]">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
          <div className="p-2">
            <div className="flex items-start justify-between mb-8 pb-6 border-b border-gray-100">
              <div className="flex items-center gap-5">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm">
                  <Building2 className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-1">{selectedInquiry.client}</h2>
                  <p className="text-sm font-bold text-gray-400">{selectedInquiry.company}</p>
                </div>
              </div>
            </div>
            <div className="space-y-6 mb-8">
              <div>
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Project Overview</h3>
                <h4 className="text-xl font-bold text-gray-900 mb-2">{selectedInquiry.project}</h4>
                <p className="text-gray-600 leading-relaxed font-medium">{selectedInquiry.description}</p>
              </div>
              {selectedInquiry.requirements.length > 0 && (
                <div>
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Requirements</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedInquiry.requirements.map((req, idx) => (
                      <span key={idx} className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-1.5 rounded-xl font-bold text-[11px] uppercase tracking-wider">{req}</span>
                    ))}
                  </div>
                </div>
              )}
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Budget</p>
                <p className="text-xl font-black text-gray-900">{formatCurrency(selectedInquiry.budget)}</p>
              </div>
            </div>
            <div className="pt-6 flex justify-end gap-3 border-t border-gray-100">
              <button onClick={() => setIsDetailModalOpen(false)} className="px-6 py-3.5 rounded-xl font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all">Close</button>
              {selectedInquiry.status === "reviewed" && (
                <button onClick={() => { setIsDetailModalOpen(false); setTimeout(() => handleOpenProposalModal(selectedInquiry), 150); }} className="px-8 py-3.5 rounded-xl relative group overflow-hidden shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600" />
                  <span className="relative z-10 font-black text-[13px] uppercase tracking-wider text-white flex items-center"><Send className="mr-2 h-4 w-4" />Draft Proposal</span>
                </button>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Review Modal */}
      {selectedInquiry && isReviewModalOpen && (
        <Modal isOpen={isReviewModalOpen} onClose={() => processingId !== selectedInquiry.id && setIsReviewModalOpen(false)} size="xl" variant="light" className="bg-white/95 backdrop-blur-3xl border-white overflow-hidden shadow-[0_20px_60px_rgb(0,0,0,0.15)] rounded-[2rem]">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#0a9396] via-teal-400 to-[#0a9396] animate-gradient" />
          <div className="p-2">
            <div className="flex items-center gap-5 mb-8 pb-6 border-b border-gray-100">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <Building2 className="w-8 h-8 text-[#0a9396]" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">{selectedInquiry.client}</h2>
                <p className="text-sm text-gray-400 font-bold mt-1">{formatCurrency(selectedInquiry.budget)}/mo budget</p>
              </div>
            </div>
            <div className="space-y-6 mb-10">
              <div>
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#0a9396] mb-3">Project</h3>
                <h4 className="text-2xl font-black text-gray-900 mb-3">{selectedInquiry.project}</h4>
                <p className="text-gray-600 leading-relaxed font-medium text-[15px] p-5 bg-gray-50/80 rounded-2xl border border-gray-100">{selectedInquiry.description}</p>
              </div>
            </div>
            <div className="pt-6 flex justify-between items-center gap-3 border-t border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Clock className="w-4 h-4" /> Received {selectedInquiry.time}
              </p>
              <div className="flex items-center gap-3">
                <button onClick={() => setIsReviewModalOpen(false)} className="px-6 py-3.5 rounded-xl font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all">Dismiss</button>
                <button
                  disabled={processingId === selectedInquiry.id}
                  onClick={async () => { await updateStatus(selectedInquiry.id, "reviewed"); setIsReviewModalOpen(false); }}
                  className="px-8 py-3.5 rounded-xl relative group overflow-hidden shadow-lg shadow-[#0a9396]/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:grayscale transition-all"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0a9396] via-[#14b8a6] to-[#0a9396] bg-[length:200%_auto] group-hover:animate-gradient" />
                  <span className="relative z-10 font-black text-[13px] uppercase tracking-wider text-white flex items-center justify-center">
                    {processingId === selectedInquiry.id ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                    Accept Brief & Move to Review
                  </span>
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Proposal Modal */}
      <Modal isOpen={isProposalModalOpen} onClose={() => !isSubmittingProposal && setIsProposalModalOpen(false)} size="lg" variant="light" className="bg-white/90 backdrop-blur-2xl border-white overflow-hidden shadow-[0_20px_60px_rgb(0,0,0,0.1)] rounded-[2rem]">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#0a9396] via-teal-400 to-[#0a9396] bg-[length:200%_auto] animate-gradient" />
        <div className="p-2">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3.5 bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 rounded-2xl border border-blue-100/50">
              <Send className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Draft Proposal</h2>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">{selectedInquiry?.client}</p>
            </div>
          </div>
          <form onSubmit={handleSendProposal} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-[0.15em] text-gray-500">Proposed Budget</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input type="number" required value={proposalAmount} onChange={(e) => setProposalAmount(e.target.value)} className="pl-12 h-14 bg-gray-50/50 border-gray-200 focus:border-[#0a9396] font-bold text-gray-900 rounded-xl" placeholder={selectedInquiry?.budget?.toString() ?? "0"} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-[0.15em] text-gray-500">Timeline</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input required value={proposalTimeline} onChange={(e) => setProposalTimeline(e.target.value)} className="pl-12 h-14 bg-gray-50/50 border-gray-200 focus:border-[#0a9396] font-bold text-gray-900 rounded-xl" placeholder="e.g. 3 Months, Ongoing" />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-[0.15em] text-gray-500">Strategy & Message</label>
              <textarea required value={proposalMessage} onChange={(e) => setProposalMessage(e.target.value)} rows={5} className="w-full resize-none bg-gray-50/50 border border-gray-200 focus:bg-white focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 font-medium text-gray-700 rounded-2xl p-5 outline-none" placeholder="Detail your approach, deliverables, and why you're the best fit..." />
            </div>
            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
              <button type="button" onClick={() => setIsProposalModalOpen(false)} disabled={isSubmittingProposal} className="px-6 py-3.5 rounded-xl font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-50 transition-all">Cancel</button>
              <button type="submit" disabled={isSubmittingProposal} className="px-8 py-3.5 rounded-xl relative group overflow-hidden shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:grayscale transition-all">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600 bg-[length:200%_auto] group-hover:animate-gradient" />
                <span className="relative z-10 font-black text-[13px] uppercase tracking-wider text-white flex items-center">
                  {isSubmittingProposal ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Sending...</> : <><Send className="mr-2 h-4 w-4" />Dispatch Proposal</>}
                </span>
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Chat & Acceptance Modal */}
      <AnimatePresence>
        {isChatOpen && selectedInquiry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-6xl h-[85vh] flex overflow-hidden border border-white"
            >
              {/* Left: Chat Area */}
              <div className="flex-1 flex flex-col bg-gray-50/50">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
                  <div>
                    <h3 className="text-xl font-black text-gray-900 tracking-tight">{selectedInquiry.project}</h3>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Conversation with {selectedInquiry.client}</p>
                  </div>
                  <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors lg:hidden">
                    <XCircle className="h-5 w-5 text-gray-400" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map((m) => (
                    <div key={m.id} className={`flex ${m.senderId === selectedInquiry.clientId ? "justify-start" : "justify-end"}`}>
                      <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-medium ${
                        m.senderId === selectedInquiry.clientId 
                          ? "bg-white border border-gray-100 text-gray-800 rounded-bl-none shadow-sm" 
                          : "bg-[#0a9396] text-white rounded-br-none shadow-md"
                      }`}>
                        {m.text}
                        <p className={`text-[10px] mt-1 opacity-60 ${m.senderId === selectedInquiry.clientId ? "text-gray-400" : "text-white"}`}>
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="p-6 bg-white border-t border-gray-100">
                  <div className="flex gap-3 bg-gray-50 p-2 rounded-2xl border border-gray-100 focus-within:border-[#0a9396] focus-within:bg-white transition-all">
                    <input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 bg-transparent border-none px-4 outline-none text-sm font-medium"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim() || isSendingMessage}
                      className="h-10 w-10 bg-[#0a9396] text-white rounded-xl flex items-center justify-center hover:bg-[#087579] transition-all disabled:opacity-40"
                    >
                      {isSendingMessage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </button>
                  </div>
                </form>
              </div>

              {/* Right: Info & Actions */}
              <div className="w-80 lg:w-96 border-l border-gray-100 flex flex-col bg-white">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <h4 className="font-black text-gray-900 uppercase tracking-widest text-xs">Project Overview</h4>
                  <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden lg:block">
                    <XCircle className="h-5 w-5 text-gray-400" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Client</h5>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-lg font-black text-[#0a9396]">
                        {selectedInquiry.client.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-900">{selectedInquiry.client}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">{selectedInquiry.company}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Description</h5>
                      <p className="text-xs text-gray-600 leading-relaxed font-medium">
                        {selectedInquiry.description}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Budget</span>
                        <span className="text-sm font-black text-gray-900">{formatCurrency(selectedInquiry.budget)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gray-50/50 border-t border-gray-100 space-y-3">
                  {selectedInquiry.status === "new" && (
                    <button
                      onClick={async () => { await updateStatus(selectedInquiry.id, "reviewed"); setIsChatOpen(false); }}
                      className="w-full h-14 rounded-2xl bg-[#0a9396] text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-[#0a9396]/20 transition-all hover:scale-[1.02]"
                    >
                      Accept Brief
                    </button>
                  )}
                  {selectedInquiry.status === "reviewed" && (
                    <button
                      onClick={() => { setIsChatOpen(false); handleOpenProposalModal(selectedInquiry); }}
                      className="w-full h-14 rounded-2xl bg-blue-600 text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-600/20 transition-all hover:scale-[1.02]"
                    >
                      Send Proposal
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
