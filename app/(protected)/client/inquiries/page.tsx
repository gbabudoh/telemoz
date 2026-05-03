"use client";

import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { useSearchParams } from "next/navigation";
import {
  MessageSquare,
  Search,
  CheckCircle2,
  XCircle,
  Mail,
  Eye,
  Send,
  Loader2,
  User,
  Star,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { formatCurrency } from "@/lib/utils";

const statusConfig = {
  new: { label: "Sent", color: "info", icon: Send, theme: "bg-blue-50 text-blue-600 border-blue-200" },
  reviewed: { label: "Under Review", color: "warning", icon: Eye, theme: "bg-amber-50 text-amber-600 border-amber-200" },
  responded: { label: "Responded", color: "primary", icon: Mail, theme: "bg-teal-50 text-[#0a9396] border-[#0a9396]/20" },
  accepted: { label: "Accepted", color: "success", icon: CheckCircle2, theme: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  declined: { label: "Declined", color: "danger", icon: XCircle, theme: "bg-rose-50 text-rose-600 border-rose-200" },
};

interface Inquiry {
  id: string;
  proName: string;
  project: string;
  budget: number;
  status: string;
  time: string;
  receivedDate: string;
  description: string;
  requirements: string[];
  projectId: string;
  proId: string;
  message: string;
  proProfile?: {
    bio: string;
    specialties: string[];
    rating: number;
    reviewCount: number;
  };
}

interface Message {
  id: string;
  text: string;
  senderId: string;
  createdAt: string;
}

export default function ClientInquiriesPage() {
  const [data, setData] = useState<Inquiry[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);

  const fetchInquiries = useCallback(async () => {
    try {
      const res = await fetch("/api/client/inquiries");
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
    setIsSending(true);
    try {
      const res = await fetch("/api/messaging/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: newMessage,
          inquiryId: selectedInquiry.id,
          receiverId: selectedInquiry.proId,
          projectId: selectedInquiry.projectId,
        }),
      });
      if (res.ok) {
        const { message } = await res.json();
        setMessages([...messages, message]);
        setNewMessage("");
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleAcceptPro = async () => {
    if (!selectedInquiry) return;
    setIsAccepting(true);
    try {
      const res = await fetch(`/api/messaging/inquiries/${selectedInquiry.id}/accept`, {
        method: "POST",
      });
      if (res.ok) {
        setData(prev => prev.map(i => i.id === selectedInquiry.id ? { ...i, status: "accepted" } : i));
        setSelectedInquiry({ ...selectedInquiry, status: "accepted" });
        fetchMessages(selectedInquiry.id);
      }
    } finally {
      setIsAccepting(false);
    }
  };

  const filteredInquiries = data.filter((inquiry) => {
    const matchesSearch =
      inquiry.proName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.project.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || inquiry.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="max-w-7xl mx-auto pb-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            My Inquiries
            <Badge variant="outline" className="bg-[#0a9396]/5 text-[#0a9396] border-[#0a9396]/20">
              {data.length} Total
            </Badge>
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Track requests you&apos;ve sent to professionals and manage their responses.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-white shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by project or professional..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/50 border-gray-100 rounded-xl"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-4 rounded-xl border border-gray-100 bg-white/50 text-sm font-bold text-gray-600 outline-none focus:ring-2 focus:ring-[#0a9396]/20 transition-all cursor-pointer"
        >
          <option value="all">All Statuses</option>
          <option value="new">Sent</option>
          <option value="reviewed">Under Review</option>
          <option value="responded">Responded</option>
          <option value="accepted">Accepted</option>
          <option value="declined">Declined</option>
        </select>
      </div>

      {/* Grid */}
      {isLoadingData ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="h-8 w-8 text-[#0a9396] animate-spin" />
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Loading your inquiries...</p>
        </div>
      ) : filteredInquiries.length > 0 ? (
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInquiries.map((inquiry) => {
            const statusInfo = statusConfig[inquiry.status as keyof typeof statusConfig] || statusConfig.new;
            const StatusIcon = statusInfo.icon;

            return (
              <motion.div 
                key={inquiry.id} 
                variants={itemVariants} 
                className="group cursor-pointer"
                onClick={() => handleOpenChat(inquiry)}
              >
                <div className="h-full bg-white/60 backdrop-blur-md border border-white rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4">
                    <Badge className={`uppercase font-black text-[9px] tracking-widest px-2 py-1 ${statusInfo.theme}`}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {statusInfo.label}
                    </Badge>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-xl font-black text-gray-900 tracking-tight mb-1 line-clamp-1">{inquiry.project}</h3>
                    <div className="flex items-center gap-2 text-gray-400 text-xs font-bold">
                      <User className="w-3 h-3" />
                      {inquiry.proName}
                    </div>
                  </div>

                  <p className="text-gray-500 text-sm font-medium line-clamp-2 mb-6">
                    {inquiry.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Budget</span>
                      <span className="text-sm font-black text-gray-900">{formatCurrency(inquiry.budget)}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Activity</span>
                      <span className="text-xs font-bold text-gray-600">{inquiry.time}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <div className="bg-white/40 backdrop-blur-md border border-white rounded-[2rem] p-16 text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <MessageSquare className="h-10 w-10 text-gray-200" />
          </div>
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">No inquiries found</h3>
          <p className="text-gray-500 font-medium mt-2 max-w-sm mx-auto">
            {searchQuery || statusFilter !== "all" 
              ? "Try adjusting your search or filters to find what you&apos;re looking for." 
              : "You haven&apos;t sent any project requests yet. Start by browsing the marketplace!"}
          </p>
        </div>
      )}

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
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Conversation with {selectedInquiry.proName}</p>
                  </div>
                  <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors lg:hidden">
                    <XCircle className="h-5 w-5 text-gray-400" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map((m) => (
                    <div key={m.id} className={`flex ${m.senderId === selectedInquiry.proId ? "justify-start" : "justify-end"}`}>
                      <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-medium ${
                        m.senderId === selectedInquiry.proId 
                          ? "bg-white border border-gray-100 text-gray-800 rounded-bl-none shadow-sm" 
                          : "bg-[#0a9396] text-white rounded-br-none shadow-md"
                      }`}>
                        {m.text}
                        <p className={`text-[10px] mt-1 opacity-60 ${m.senderId === selectedInquiry.proId ? "text-gray-400" : "text-white"}`}>
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
                      disabled={!newMessage.trim() || isSending}
                      className="h-10 w-10 bg-[#0a9396] text-white rounded-xl flex items-center justify-center hover:bg-[#087579] transition-all disabled:opacity-40"
                    >
                      {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </button>
                  </div>
                </form>
              </div>

              {/* Right: Pro Profile & Acceptance */}
              <div className="w-80 lg:w-96 border-l border-gray-100 flex flex-col bg-white">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <h4 className="font-black text-gray-900 uppercase tracking-widest text-xs">Professional Details</h4>
                  <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden lg:block">
                    <XCircle className="h-5 w-5 text-gray-400" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="h-20 w-20 rounded-3xl bg-linear-to-br from-[#0a9396] to-[#6ece39] flex items-center justify-center text-2xl font-black text-white shadow-xl mb-4">
                      {selectedInquiry.proName.charAt(0)}
                    </div>
                    <h4 className="text-xl font-black text-gray-900">{selectedInquiry.proName}</h4>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                      <span className="text-sm font-bold text-gray-900">{selectedInquiry.proProfile?.rating || "N/A"}</span>
                      <span className="text-xs text-gray-400 font-bold">({selectedInquiry.proProfile?.reviewCount || 0} reviews)</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">About</h5>
                      <p className="text-sm text-gray-600 leading-relaxed font-medium">
                        {selectedInquiry.proProfile?.bio || "No biography provided."}
                      </p>
                    </div>

                    <div>
                      <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Expertise</h5>
                      <div className="flex flex-wrap gap-2">
                        {selectedInquiry.proProfile?.specialties?.map(s => (
                          <span key={s} className="px-3 py-1 bg-[#0a9396]/5 border border-[#0a9396]/10 rounded-lg text-[10px] font-black text-[#0a9396] uppercase tracking-wider">
                            {s}
                          </span>
                        )) || <span className="text-xs text-gray-400 italic">No specialties listed.</span>}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Budget</span>
                      <span className="text-sm font-black text-gray-900">{formatCurrency(selectedInquiry.budget)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Status</span>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${selectedInquiry.status === 'accepted' ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {selectedInquiry.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gray-50/50 border-t border-gray-100">
                  {selectedInquiry.status === "accepted" ? (
                    <div className="w-full h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center gap-2 text-emerald-700 font-black uppercase tracking-widest text-xs">
                      <ShieldCheck className="h-5 w-5" />
                      Professional Accepted
                    </div>
                  ) : (
                    <button
                      onClick={handleAcceptPro}
                      disabled={isAccepting}
                      className="w-full h-14 rounded-2xl bg-[#0a9396] hover:bg-[#087579] text-white font-black uppercase tracking-[0.15em] text-xs shadow-xl shadow-[#0a9396]/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isAccepting ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle2 className="h-5 w-5" />}
                      Accept Professional
                    </button>
                  )}
                  <p className="text-[10px] text-gray-400 font-bold text-center mt-4 leading-relaxed">
                    By accepting, you assign this professional to your project. Payments will be handled via escrow.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
