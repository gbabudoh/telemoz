"use client";

import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { useRouter } from "next/navigation";
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
  Calendar,
  ThumbsUp,
  AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { formatCurrency } from "@/lib/utils";
import CallScheduler from "@/components/communication/CallScheduler";
import { Modal } from "@/components/ui/Modal";

const statusConfig = {
  new: { label: "Sent", icon: Send, theme: "bg-blue-50 text-blue-600 border-blue-200" },
  reviewed: { label: "Under Review", icon: Eye, theme: "bg-amber-50 text-amber-600 border-amber-200" },
  responded: { label: "Responded", icon: Mail, theme: "bg-teal-50 text-[#0a9396] border-[#0a9396]/20" },
  accepted: { label: "Accepted", icon: CheckCircle2, theme: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  declined: { label: "Declined", icon: XCircle, theme: "bg-rose-50 text-rose-600 border-rose-200" },
};

interface Inquiry {
  id: string;
  proName: string;
  proId: string;
  project: string;
  budget: number;
  status: string;
  time: string;
  receivedDate: string;
  description: string;
  requirements: string[];
  projectId: string;
  message: string;
  unreadCount?: number;
  lastMessage?: { text: string; senderId: string; createdAt: string } | null;
  proProfile?: {
    bio: string;
    specialties: string[];
    rating: number;
    reviewCount: number;
  };
}

export default function ClientInquiriesPage() {
  const router = useRouter();
  const [data, setData] = useState<Inquiry[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [acceptError, setAcceptError] = useState<{ id: string; message: string } | null>(null);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);

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

  useEffect(() => { fetchInquiries(); }, [fetchInquiries]);

  const handleOpenChat = useCallback((inquiry: Inquiry) => {
    router.push(`/client/messaging`);
  }, [router]);

  const handleAccept = async (inquiry: Inquiry) => {
    setAcceptingId(inquiry.id);
    setAcceptError(null);
    try {
      const res = await fetch(`/api/messaging/inquiries/${inquiry.id}/accept`, {
        method: "POST",
      });
      if (res.ok) {
        setData((prev) =>
          prev.map((i) => (i.id === inquiry.id ? { ...i, status: "accepted" } : i))
        );
      } else {
        const body = await res.json().catch(() => ({}));
        setAcceptError({
          id: inquiry.id,
          message: body.error || "Could not accept at this time. Please try again.",
        });
      }
    } catch {
      setAcceptError({ id: inquiry.id, message: "Network error. Please check your connection." });
    } finally {
      setAcceptingId(null);
    }
  };

  const filteredInquiries = data.filter((inquiry) => {
    const matchesSearch =
      inquiry.proName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.project.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || inquiry.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
  const itemVariants = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="max-w-7xl mx-auto pb-12 space-y-8">
      {/* Header */}
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

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 items-center bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-white shadow-sm">
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
          className="h-10 px-4 rounded-xl border border-gray-100 bg-white/50 text-sm font-semibold text-gray-600 outline-none focus:ring-2 focus:ring-[#0a9396]/20 transition-all cursor-pointer"
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
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Loading your inquiries...</p>
        </div>
      ) : filteredInquiries.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {filteredInquiries.map((inquiry) => {
            const statusInfo = statusConfig[inquiry.status as keyof typeof statusConfig] || statusConfig.new;
            const StatusIcon = statusInfo.icon;
            const isResponded = inquiry.status === "responded";
            const isAccepted = inquiry.status === "accepted";
            const isDeclined = inquiry.status === "declined";
            const isAccepting = acceptingId === inquiry.id;

            return (
              <motion.div key={inquiry.id} variants={itemVariants} className="relative">
                {/* Highlight glow for responded — action needed */}
                {isResponded && (
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#0a9396]/20 to-teal-400/20 rounded-[2rem] blur-lg -z-10 animate-pulse" />
                )}

                <div className="h-full bg-white/70 backdrop-blur-md border border-white rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
                  {/* Status + unread */}
                  <div className="flex items-center justify-between mb-4">
                    <Badge className={`uppercase font-bold text-[9px] tracking-widest px-2 py-1 flex items-center gap-1 ${statusInfo.theme}`}>
                      <StatusIcon className="w-3 h-3" />
                      {statusInfo.label}
                    </Badge>
                    {(inquiry.unreadCount ?? 0) > 0 && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-[#0a9396] bg-[#0a9396]/10 px-2 py-0.5 rounded-full">
                        <MessageSquare className="h-2.5 w-2.5" />
                        {inquiry.unreadCount} unread
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-lg font-black text-gray-900 tracking-tight mb-1 line-clamp-1">{inquiry.project}</h3>
                    <div className="flex items-center gap-2 text-gray-400 text-xs font-semibold mb-3">
                      <User className="w-3 h-3" />
                      {inquiry.proName}
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{inquiry.description}</p>
                  </div>

                  {/* Responded call-to-action banner */}
                  {isResponded && (
                    <div className="mt-4 p-3 bg-teal-50 border border-teal-200 rounded-2xl flex items-center gap-2">
                      <Mail className="h-4 w-4 text-[#0a9396] shrink-0" />
                      <p className="text-xs font-semibold text-[#0a9396]">
                        {inquiry.proName} has responded — review their proposal and accept to start the project.
                      </p>
                    </div>
                  )}

                  {/* Declined notice */}
                  {isDeclined && (
                    <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0" />
                      <p className="text-xs font-semibold text-rose-600">
                        This inquiry was declined. You can search the marketplace to find another professional.
                      </p>
                    </div>
                  )}

                  {/* Budget + time */}
                  <div className="flex items-center justify-between py-4 border-y border-gray-100 mt-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Budget</p>
                      <p className="text-sm font-black text-gray-900">{formatCurrency(inquiry.budget)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Activity</p>
                      <p className="text-xs font-semibold text-gray-600">{inquiry.time}</p>
                    </div>
                  </div>

                  {/* Accept error */}
                  {acceptError?.id === inquiry.id && (
                    <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2">
                      <AlertTriangle className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                      <p className="text-xs font-semibold text-rose-600">{acceptError.message}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-4 space-y-2">
                    {/* Accept button — only when responded */}
                    {isResponded && (
                      <button
                        onClick={() => handleAccept(inquiry)}
                        disabled={isAccepting}
                        className="w-full flex items-center justify-center gap-2 h-11 bg-[#0a9396] hover:bg-[#087a7c] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#0a9396]/20 transition-all hover:scale-[1.01] disabled:opacity-60"
                      >
                        {isAccepting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <ThumbsUp className="h-4 w-4" />
                        )}
                        Accept & Start Project
                      </button>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleOpenChat(inquiry)}
                        className="flex items-center justify-center gap-1.5 bg-white border border-gray-100 hover:border-[#0a9396]/30 hover:bg-[#0a9396]/5 rounded-xl h-10 text-xs font-bold text-gray-700 transition-all"
                      >
                        <MessageSquare className="h-3.5 w-3.5 text-[#0a9396]" />
                        Message
                      </button>
                      {!isDeclined && !isAccepted && (
                        <button
                          onClick={() => { setSelectedInquiry(inquiry); setIsSchedulerOpen(true); }}
                          className="flex items-center justify-center gap-1.5 bg-white border border-gray-100 hover:border-[#0a9396]/30 hover:bg-[#0a9396]/5 rounded-xl h-10 text-xs font-bold text-gray-700 transition-all"
                        >
                          <Calendar className="h-3.5 w-3.5 text-[#0a9396]" />
                          Schedule
                        </button>
                      )}
                      {(isDeclined || isAccepted) && (
                        <button
                          onClick={() => router.push("/client/project-listings")}
                          className="flex items-center justify-center gap-1.5 bg-white border border-gray-100 hover:border-[#0a9396]/30 hover:bg-[#0a9396]/5 rounded-xl h-10 text-xs font-bold text-gray-700 transition-all"
                        >
                          <Search className="h-3.5 w-3.5 text-[#0a9396]" />
                          {isAccepted ? "My Projects" : "Find Another Pro"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <div className="bg-white/40 backdrop-blur-md border border-white rounded-[2rem] p-16 text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm">
            <MessageSquare className="h-8 w-8 text-gray-200" />
          </div>
          <h3 className="text-xl font-black text-gray-900 tracking-tight">No inquiries found</h3>
          <p className="text-gray-500 font-medium mt-2 max-w-sm mx-auto text-sm">
            {searchQuery || statusFilter !== "all"
              ? "Try adjusting your search or filters."
              : "You haven't sent any project requests yet. Start by browsing professionals in the marketplace."}
          </p>
        </div>
      )}

      {/* Call Scheduler Modal */}
      {selectedInquiry && (
        <Modal
          isOpen={isSchedulerOpen}
          onClose={() => setIsSchedulerOpen(false)}
          size="xl"
          variant="light"
          className="bg-white/80 backdrop-blur-2xl rounded-[3rem] border border-white shadow-2xl p-6"
        >
          <div className="p-2">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Schedule Consultation</h2>
                <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mt-1">
                  With {selectedInquiry.proName}
                </p>
              </div>
              <button
                onClick={() => setIsSchedulerOpen(false)}
                className="p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all"
              >
                <XCircle className="h-6 w-6 text-gray-400" />
              </button>
            </div>
            <CallScheduler proId={selectedInquiry.proId} onScheduled={() => setIsSchedulerOpen(false)} />
          </div>
        </Modal>
      )}
    </div>
  );
}
