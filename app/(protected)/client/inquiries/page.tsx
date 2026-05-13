"use client";

import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { useSearchParams, useRouter } from "next/navigation";
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
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { formatCurrency } from "@/lib/utils";
import CallScheduler from "@/components/communication/CallScheduler";
import { Modal } from "@/components/ui/Modal";

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


export default function ClientInquiriesPage() {
  const [data, setData] = useState<Inquiry[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

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

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => { fetchInquiries(); }, [fetchInquiries]);

  const handleOpenChat = useCallback((inquiry: Inquiry) => {
    router.push(`/messaging?inquiryId=${inquiry.id}`);
  }, [router]);

  // Handle deep linking to a specific inquiry
  useEffect(() => {
    const inquiryId = searchParams.get("inquiryId");
    if (inquiryId && data.length > 0) {
      const inquiry = data.find((i) => i.id === inquiryId);
      if (inquiry) {
        handleOpenChat(inquiry);
      }
    }
  }, [searchParams, data, handleOpenChat]);


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

                  <div className="flex items-center justify-between py-4 border-y border-gray-50 mt-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Budget</span>
                      <span className="text-sm font-black text-gray-900">{formatCurrency(inquiry.budget)}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Activity</span>
                      <span className="text-xs font-bold text-gray-600">{inquiry.time}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleOpenChat(inquiry); }}
                      className="flex items-center justify-center bg-white border border-gray-100 hover:border-[#0a9396]/30 hover:bg-[#0a9396]/5 rounded-xl h-11 text-[11px] font-black uppercase tracking-wider text-gray-700 transition-all"
                    >
                      <MessageSquare className="mr-2 h-4 w-4 text-[#0a9396]" />
                      Hub
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setIsSchedulerOpen(true); setSelectedInquiry(inquiry); }}
                      className="flex items-center justify-center bg-white border border-gray-100 hover:border-[#0a9396]/30 hover:bg-[#0a9396]/5 rounded-xl h-11 text-[11px] font-black uppercase tracking-wider text-gray-700 transition-all"
                    >
                      <Calendar className="mr-2 h-4 w-4 text-[#0a9396]" />
                      Schedule
                    </button>
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
      {/* Communication Modal Removed - Engine is Separate */}
      {/* Call Scheduler Modal */}
      {/* Communication Modal Removed - Engine is Separate */}
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
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">With {selectedInquiry.proName}</p>
              </div>
              <button onClick={() => setIsSchedulerOpen(false)} className="p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all">
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
