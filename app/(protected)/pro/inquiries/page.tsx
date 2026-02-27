"use client";


import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";

const initialInquiries = [
  {
    id: 1,
    client: "TechStart Inc.",
    company: "TechStart Inc.",
    email: "contact@techstart.com",
    phone: "+44 20 1234 5678",
    project: "SEO Optimization Campaign",
    budget: 2500,
    status: "new",
    time: "2 hours ago",
    receivedDate: "2024-01-20",
    description: "Looking for an SEO specialist to optimize our website and improve search rankings. We need someone with experience in technical SEO and content strategy.",
    requirements: ["Technical SEO", "Content Strategy", "Analytics"],
  },
  {
    id: 2,
    client: "E-Commerce Pro",
    company: "E-Commerce Pro Ltd",
    email: "hello@ecommercepro.co.uk",
    phone: "+44 20 2345 6789",
    project: "PPC Management",
    budget: 1800,
    status: "reviewed",
    time: "5 hours ago",
    receivedDate: "2024-01-20",
    description: "Need a PPC expert to manage our Google Ads and Facebook Ads campaigns. Looking for someone who can optimize ROAS and reduce cost per acquisition.",
    requirements: ["Google Ads", "Facebook Ads", "Conversion Optimization"],
  },
  {
    id: 3,
    client: "Local Business Hub",
    company: "Local Business Hub",
    email: "info@localbusinesshub.com",
    phone: "+44 20 3456 7890",
    project: "Social Media Strategy",
    budget: 1200,
    status: "new",
    time: "1 day ago",
    receivedDate: "2024-01-19",
    description: "Seeking a social media strategist to develop and execute a comprehensive social media strategy across multiple platforms.",
    requirements: ["Social Media Management", "Content Creation", "Community Management"],
  },
  {
    id: 4,
    client: "Digital Solutions",
    company: "Digital Solutions Ltd",
    email: "contact@digitalsolutions.uk",
    phone: "+44 20 4567 8901",
    project: "Content Marketing Campaign",
    budget: 2200,
    status: "responded",
    time: "2 days ago",
    receivedDate: "2024-01-18",
    description: "Looking for a content marketing expert to create and distribute high-quality content that drives engagement and leads.",
    requirements: ["Content Creation", "Content Strategy", "SEO"],
  },
  {
    id: 5,
    client: "Startup Ventures",
    company: "Startup Ventures",
    email: "hello@startupventures.com",
    phone: "+44 20 5678 9012",
    project: "Email Marketing Automation",
    budget: 1500,
    status: "accepted",
    time: "3 days ago",
    receivedDate: "2024-01-17",
    description: "Need help setting up email marketing automation sequences and optimizing our email campaigns for better conversion rates.",
    requirements: ["Email Marketing", "Marketing Automation", "A/B Testing"],
  },
];

const statusConfig = {
  new: { label: "New", color: "danger", icon: AlertCircle, theme: "bg-rose-50 text-rose-600 border-rose-200" },
  reviewed: { label: "Reviewed", color: "info", icon: Clock, theme: "bg-blue-50 text-blue-600 border-blue-200" },
  responded: { label: "Responded", color: "default", icon: Mail, theme: "bg-gray-100 text-gray-600 border-gray-300" },
  accepted: { label: "Accepted", color: "success", icon: CheckCircle2, theme: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  declined: { label: "Declined", color: "default", icon: XCircle, theme: "bg-gray-50 text-gray-400 border-gray-200" },
};

const stats = [
  { label: "New Inquiries", value: "2", icon: AlertCircle, color: "from-[#FF4D4D] to-[#FF0000]", glow:"shadow-[#FF4D4D]/40 text-[#FF4D4D]" },
  { label: "Total Inquiries", value: "5", icon: MessageSquare, color: "from-[#00F0FF] to-[#0080FF]", glow:"shadow-[#00F0FF]/40 text-[#00F0FF]" },
  { label: "Response Rate", value: "60%", icon: CheckCircle2, color: "from-[#00FF87] to-[#60EFFF]", glow:"shadow-[#00FF87]/40 text-[#00FF87]" },
  { label: "Avg. Response Time", value: "4.2h", icon: Clock, color: "from-[#F59E0B] to-[#D97706]", glow:"shadow-[#F59E0B]/40 text-[#F59E0B]" },
];

export default function MarketplaceInquiriesPage() {
  const [data, setData] = useState(initialInquiries);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [processingId, setProcessingId] = useState<number | null>(null);

  // Proposal Modal State
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [selectedInquiryId, setSelectedInquiryId] = useState<number | null>(null);
  const [proposalAmount, setProposalAmount] = useState("");
  const [proposalTimeline, setProposalTimeline] = useState("");
  const [proposalMessage, setProposalMessage] = useState("");
  const [isSubmittingProposal, setIsSubmittingProposal] = useState(false);

  // Detail Modal State
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDetailId, setSelectedDetailId] = useState<number | null>(null);

  // Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);

  // Reply Modal State
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [selectedReplyId, setSelectedReplyId] = useState<number | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  const handleOpenDetailModal = (id: number) => {
    setSelectedDetailId(id);
    setIsDetailModalOpen(true);
  };

  const handleOpenReviewModal = (id: number) => {
    setSelectedReviewId(id);
    setIsReviewModalOpen(true);
  };

  const handleOpenProposalModal = (id: number) => {
    setSelectedInquiryId(id);
    setIsProposalModalOpen(true);
    // Reset form
    setProposalAmount("");
    setProposalTimeline("");
    setProposalMessage("");
  };

  const handleOpenReplyModal = (id: number) => {
    setSelectedReplyId(id);
    setIsReplyModalOpen(true);
    setReplyMessage("");
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReplyId) return;

    setIsSubmittingReply(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    setData(prev => prev.map(item => 
      item.id === selectedReplyId ? { ...item, status: "responded" } : item
    ));
    
    setIsSubmittingReply(false);
    setIsReplyModalOpen(false);
    setSelectedReplyId(null);
  };

  const handleSendProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiryId) return;

    setIsSubmittingProposal(true);
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setData(prev => prev.map(item => 
      item.id === selectedInquiryId ? { ...item, status: "responded" } : item
    ));
    
    setIsSubmittingProposal(false);
    setIsProposalModalOpen(false);
    setSelectedInquiryId(null);
  };

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    setProcessingId(id);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setData(prev => prev.map(item => 
      item.id === id ? { ...item, status: newStatus } : item
    ));
    setProcessingId(null);
  };

  const handleDecline = async (id: number) => {
    setProcessingId(id);
    await new Promise(resolve => setTimeout(resolve, 600));
    setData(prev => prev.map(item => 
      item.id === id ? { ...item, status: "declined" } : item
    ));
    setProcessingId(null);
  };

  const filteredInquiries = data.filter((inquiry) => {
    const matchesSearch =
      inquiry.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || inquiry.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Framer Motion Animation Variants
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
      {/* Dynamic Ambient Background Orbs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
         <motion.div 
            animate={{ 
              x: ["-10%", "100%", "-10%"],
              y: ["-20%", "50%", "-20%"],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-r from-teal-200/40 to-cyan-300/40 blur-[120px] mix-blend-multiply" 
          />
         <motion.div 
            animate={{ 
              x: ["100%", "-20%", "100%"],
              y: ["80%", "-10%", "80%"],
              scale: [1, 1.3, 1],
            }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-l from-indigo-200/30 to-purple-300/30 blur-[120px] mix-blend-multiply" 
          />
      </div>

      <div className="relative z-10 space-y-8">
        
        {/* Ultra-Premium Hero Header */}
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

        {/* Deep Glass Stats Module */}
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
                     <div className={`absolute -right-12 -bottom-12 w-40 h-40 rounded-full blur-[50px] opacity-15 bg-gradient-to-br ${stat.color} group-hover:scale-150 group-hover:opacity-25 transition-all duration-700`} />
                     
                     <div className="flex items-start justify-between relative z-10 w-full mb-6">
                        <div className={`p-3 rounded-2xl bg-white shadow-lg ${stat.glow} border border-white/60 group-hover:-translate-y-1 transition-transform duration-500`}>
                          <Icon className={`h-6 w-6 ${stat.glow.split(' ')[1]}`} />
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
            <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0a9396] transition-colors" />
            <Input
              type="search"
              placeholder="Search incoming client briefs, leads, or companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-14 border-white shadow-[inset_0_2px_8px_rgb(0,0,0,0.02)] bg-white/80 h-14 rounded-2xl text-[15px] font-medium focus-visible:ring-[#0a9396]/30 focus-visible:border-[#0a9396]/50 transition-all placeholder:text-gray-400"
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-14 px-6 lg:min-w-[240px] rounded-2xl border-white shadow-[inset_0_2px_8px_rgb(0,0,0,0.02)] bg-white/80 text-[15px] text-gray-700 font-bold focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 transition-all cursor-pointer w-full md:w-auto outline-none appearance-none"
            >
              <option value="all">Every Notification State</option>
              <option value="new">Action Required (New)</option>
              <option value="reviewed">Under Review</option>
              <option value="responded">Responded</option>
              <option value="accepted">Accepted Projects</option>
              <option value="declined">Turned Down</option>
            </select>
            {/* Custom Select Arrow given we disabled appearance */}
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
              <ChevronRight className="h-5 w-5 text-gray-400 rotate-90" />
            </div>
          </div>
        </div>

        {/* Ultra-Premium Glass Tickets ListView */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-8"
        >
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
                  className="group relative"
                >
                  {/* Neon Pulse Effect behind "New" Cards */}
                  {isNew && (
                     <div className="absolute -inset-1 bg-gradient-to-r from-[#0a9396]/20 via-teal-400/20 to-indigo-500/20 rounded-[2.5rem] blur-xl animate-pulse -z-10" />
                  )}

                  <div className={`
                     ${isNew ? 'border-[#0a9396]/30 bg-white/90 shadow-[0_8px_32px_rgb(10,147,150,0.08)]' : 'border-white/80 bg-white/60 shadow-[0_8px_32px_rgb(0,0,0,0.04)]'} 
                     rounded-[2.5rem] border backdrop-blur-xl relative overflow-hidden transition-all duration-500 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1
                  `}>
                    
                    {/* Glossy top edge highlight */}
                    <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />

                    <div className="flex flex-col xl:flex-row h-full">
                      {/* Left: Main Client Briefing Area */}
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
                                  <StatusIcon className={`w-3.5 h-3.5 ${isNew ? 'animate-pulse' : ''}`} />
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
                                 {new Date(inquiry.receivedDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year:'numeric' })}
                               </span>
                             </div>
                           </div>
                           
                           {/* Context Menu Icon */}
                           <button className="text-gray-400 hover:text-gray-900 transition-colors bg-white/50 hover:bg-white shadow-sm border border-gray-200/50 rounded-xl p-2.5 shrink-0 hidden xl:block">
                             <MoreVertical className="h-5 w-5" />
                           </button>
                        </div>
                        
                        <div className="bg-gradient-to-b from-transparent to-gray-50/30 -mx-8 -my-2 px-8 py-6 border-y border-gray-100/50">
                           <h4 className="text-[19px] font-extrabold text-gray-900 mb-3 leading-tight uppercase tracking-tight">{inquiry.project}</h4>
                           <p className="text-[15px] text-gray-600 leading-relaxed font-medium max-w-4xl">{inquiry.description}</p>
                        </div>
                        
                        {/* Requirement Pills */}
                        <div className="flex flex-wrap gap-2.5 mt-8">
                           {inquiry.requirements.map((req, idx) => (
                             <span key={idx} className="bg-white/80 border border-gray-200/60 shadow-[inset_0_1px_4px_rgb(0,0,0,0.02)] text-gray-700 px-4 py-1.5 rounded-xl font-bold text-[11px] uppercase tracking-wider">
                               {req}
                             </span>
                           ))}
                        </div>
                      </div>

                      {/* Right: Floating Meta & Actions Detached Panel */}
                      <div className="p-6 xl:p-8 flex flex-col justify-between xl:w-[380px] bg-gray-50/40 backdrop-blur-3xl border-t xl:border-t-0 xl:border-l border-white/50 shadow-[inset_1px_0_0_rgb(255,255,255,0.4)] relative z-20">
                         <div className="space-y-3 mb-8">
                           
                           {/* High Fidelity Budget Display */}
                           <div className="p-5 rounded-[1.5rem] bg-white/80 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-white relative overflow-hidden group/budget">
                              <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-400/10 blur-[30px] rounded-full translate-x-1/2 -translate-y-1/2 group-hover/budget:scale-150 transition-transform duration-700" />
                              <div className="flex items-center gap-4 relative z-10">
                                 <div className="p-3 bg-gradient-to-br from-emerald-100/50 to-emerald-50/30 text-emerald-600 rounded-xl shadow-[inset_0_2px_10px_rgb(255,255,255,1)] border border-emerald-200/50">
                                    <DollarSign className="w-6 h-6" />
                                 </div>
                                 <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600/70 mb-0.5">Budget Allocation</p>
                                    <p className="text-2xl font-black text-gray-900 tracking-tighter">{formatCurrency(inquiry.budget)}<span className="text-sm text-gray-400 font-bold tracking-normal ml-1">/TERM</span></p>
                                 </div>
                              </div>
                           </div>

                           {/* Contact Links Block removed for internal communication adherence */}
                         </div>

                         {/* Fully Animated Actions */}
                         <div className="flex flex-col gap-3 mt-auto">
                            {isNew && (
                              <>
                                <button 
                                  disabled={isProcessing}
                                  onClick={() => handleOpenReviewModal(inquiry.id)}
                                  className="w-full relative group h-14 rounded-2xl overflow-hidden font-black uppercase tracking-[0.1em] text-[13px] shadow-xl shadow-[#0a9396]/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:grayscale"
                                >
                                  <div className="absolute inset-0 bg-gradient-to-r from-[#0a9396] via-[#14b8a6] to-[#0a9396] bg-[length:200%_auto] group-hover:animate-gradient" />
                                  <div className="absolute inset-[1px] rounded-[15px] bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                                  <span className="relative z-10 flex items-center justify-center text-white">
                                    {isProcessing ? (
                                      <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                    ) : (
                                      <CheckCircle2 className="mr-2 h-4 w-4" />
                                    )}
                                    Review & Accept Brief
                                  </span>
                                </button>
                                <div className="flex gap-3 w-full">
                                  <button 
                                    disabled={isProcessing}
                                    onClick={() => handleOpenReplyModal(inquiry.id)}
                                    className="flex-1 flex items-center justify-center bg-white/80 hover:bg-white shadow-sm rounded-xl border border-gray-100 text-gray-700 h-11 text-[12px] font-black uppercase tracking-wider transition-all disabled:opacity-50"
                                  >
                                    <Mail className="mr-2 h-3.5 w-3.5 text-gray-400" />
                                    Reply
                                  </button>
                                  <button 
                                    disabled={isProcessing}
                                    onClick={() => handleDecline(inquiry.id)}
                                    className="flex-1 flex items-center justify-center text-red-600 bg-red-50/50 hover:bg-red-50 shadow-sm rounded-xl border border-red-100/50 h-11 text-[12px] font-black uppercase tracking-wider transition-all disabled:opacity-50"
                                  >
                                    {isProcessing ? (
                                      <div className="h-4 w-4 border-2 border-red-600/30 border-t-red-600 rounded-full animate-spin mr-2" />
                                    ) : (
                                      <XCircle className="mr-2 h-3.5 w-3.5" />
                                    )}
                                    Decline
                                  </button>
                                </div>
                              </>
                            )}
                            
                            {inquiry.status === "reviewed" && (
                              <>
                                <button 
                                  disabled={isProcessing}
                                  onClick={() => handleOpenProposalModal(inquiry.id)}
                                  className="w-full relative group h-14 rounded-2xl overflow-hidden font-black uppercase tracking-[0.1em] text-[13px] shadow-xl shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                                >
                                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600 bg-[length:200%_auto] group-hover:animate-gradient" />
                                  <div className="absolute inset-[1px] rounded-[15px] bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                                  <span className="relative z-10 flex items-center justify-center text-white">
                                    {isProcessing ? (
                                      <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                    ) : (
                                      <Mail className="mr-2 h-4 w-4" />
                                    )}
                                    Send Proposal
                                  </span>
                                </button>
                                <button 
                                  onClick={() => handleOpenDetailModal(inquiry.id)}
                                  className="w-full flex items-center justify-center bg-white shadow-sm rounded-xl border border-gray-100 text-gray-700 h-11 text-[12px] font-black uppercase tracking-wider transition-all"
                                >
                                  <Eye className="mr-2 h-3.5 w-3.5" />
                                  Open Detail View
                                </button>
                              </>
                            )}
                            
                            {inquiry.status === "accepted" && (
                              <>
                                <button className="w-full relative group h-14 rounded-2xl overflow-hidden font-black uppercase tracking-[0.1em] text-[13px] shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 bg-[length:200%_auto] group-hover:animate-gradient" />
                                  <div className="absolute inset-[1px] rounded-[15px] bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                                  <span className="relative z-10 flex items-center justify-center text-white">
                                    <Building2 className="mr-2 h-4 w-4" />
                                    Begin Onboarding
                                  </span>
                                </button>
                                <button className="w-full flex items-center justify-center bg-white shadow-sm rounded-xl border border-gray-100 text-gray-700 h-11 text-[12px] font-black uppercase tracking-wider transition-all">
                                  <Eye className="mr-2 h-3.5 w-3.5" />
                                  View Accepted Terms
                                </button>
                              </>
                            )}

                            {/* Default Fallback actions for other states */}
                            {inquiry.status !== "new" && inquiry.status !== "reviewed" && inquiry.status !== "accepted" && (
                               <button className="w-full flex items-center justify-center bg-white shadow-sm hover:shadow-md rounded-xl border border-gray-100 text-gray-700 h-12 text-[12px] font-black uppercase tracking-wider transition-all">
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

        {/* Empty Fallback View */}
        {filteredInquiries.length === 0 && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}}>
            <div className="border border-white/60 bg-white/40 backdrop-blur-md rounded-[3rem] shadow-[inset_0_2px_15px_rgb(255,255,255,0.7)] p-16 text-center">
                <div className="mx-auto w-24 h-24 bg-white/80 shadow-[0_8px_32px_rgb(0,0,0,0.06)] rounded-full flex items-center justify-center mb-6 relative">
                   <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full animate-ping" />
                   <MessageSquare className="h-10 w-10 text-gray-400 relative z-10" />
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Inbox Empty</h3>
                <p className="text-gray-500 text-lg max-w-md mx-auto font-medium leading-relaxed mb-8">
                  {searchQuery || statusFilter !== "all"
                    ? "Try resetting your search filters—no active inquiries match this string."
                    : "No inbound leads currently. Ensure your marketplace profile demonstrates your core competencies."}
                </p>
                <button className="bg-white px-8 py-3.5 rounded-xl shadow-md border border-gray-100 font-bold text-gray-900 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                   Refresh Feed
                </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Inquiry Detail Modal */}
      {selectedDetailId && (
         <Modal
            isOpen={isDetailModalOpen}
            onClose={() => setIsDetailModalOpen(false)}
            size="xl"
            variant="light"
            className="bg-white/95 backdrop-blur-3xl border-white overflow-hidden shadow-[0_20px_60px_rgb(0,0,0,0.15)] rounded-[2rem]"
         >
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
            
            {data.filter(i => i.id === selectedDetailId).map(inquiry => {
               const statusInfo = statusConfig[inquiry.status as keyof typeof statusConfig] || statusConfig.new;
               const StatusIcon = statusInfo.icon;
               
               return (
                  <div key={inquiry.id} className="p-2">
                     <div className="flex items-start justify-between mb-8 pb-6 border-b border-gray-100">
                        <div className="flex items-center gap-5">
                           <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm">
                              <Building2 className="w-8 h-8 text-gray-400" />
                           </div>
                           <div>
                              <div className="flex items-center gap-3 mb-1">
                                 <h2 className="text-3xl font-black text-gray-900 tracking-tight">{inquiry.client}</h2>
                                 <Badge 
                                    variant={statusInfo.color as "default" | "success" | "danger" | "info" | "primary"} 
                                    className={`uppercase font-black tracking-widest text-[10px] px-2.5 py-0.5 ${statusInfo.theme}`}
                                 >
                                    <StatusIcon className="w-3 h-3 mr-1.5" />
                                    {statusInfo.label}
                                 </Badge>
                              </div>
                              <p className="text-sm font-bold text-gray-400 flex items-center gap-4">
                                 <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4"/>{inquiry.company}</span>
                                 <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4"/>{new Date(inquiry.receivedDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year:'numeric' })}</span>
                                 <span className="flex items-center gap-1.5 text-emerald-600"><DollarSign className="w-4 h-4"/>{formatCurrency(inquiry.budget)}/mo</span>
                              </p>
                           </div>
                        </div>
                     </div>

                     <div className="grid grid-cols-3 gap-8 mb-8">
                        <div className="col-span-2 space-y-8">
                           <div>
                              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Project Overview</h3>
                              <h4 className="text-xl font-bold text-gray-900 mb-2">{inquiry.project}</h4>
                              <p className="text-gray-600 leading-relaxed font-medium">{inquiry.description}</p>
                           </div>
                           
                           <div>
                              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Required Capabilities</h3>
                              <div className="flex flex-wrap gap-2">
                                 {inquiry.requirements.map((req, idx) => (
                                    <span key={idx} className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-1.5 rounded-xl font-bold text-[11px] uppercase tracking-wider">
                                       {req}
                                    </span>
                                 ))}
                              </div>
                           </div>
                        </div>

                        <div className="col-span-1 border-l border-gray-100 pl-8 space-y-6">
                           <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1">Time Elapsed</h3>
                              <p className="text-lg font-black text-gray-900">{inquiry.time}</p>
                           </div>
                        </div>
                     </div>

                     <div className="pt-6 flex justify-end gap-3 border-t border-gray-100">
                        <button 
                           onClick={() => setIsDetailModalOpen(false)}
                           className="px-6 py-3.5 rounded-xl font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all"
                        >
                           Close Window
                        </button>
                        {inquiry.status === "reviewed" && (
                           <button 
                              onClick={() => {
                                 setIsDetailModalOpen(false);
                                 setTimeout(() => handleOpenProposalModal(inquiry.id), 150);
                              }}
                              className="px-8 py-3.5 rounded-xl relative group overflow-hidden shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                           >
                              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600 bg-[length:200%_auto] group-hover:animate-gradient" />
                              <span className="relative z-10 font-black text-[13px] uppercase tracking-wider text-white flex items-center justify-center">
                                 <Send className="mr-2 h-4 w-4" />
                                 Draft Proposal
                              </span>
                           </button>
                        )}
                     </div>
                  </div>
               );
            })}
         </Modal>
      )}

      {/* Review Brief Modal */}
      {selectedReviewId && (
         <Modal
            isOpen={isReviewModalOpen}
            onClose={() => processingId !== selectedReviewId && setIsReviewModalOpen(false)}
            size="xl"
            variant="light"
            className="bg-white/95 backdrop-blur-3xl border-white overflow-hidden shadow-[0_20px_60px_rgb(0,0,0,0.15)] rounded-[2rem]"
         >
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#0a9396] via-teal-400 to-[#0a9396] animate-gradient" />
            
            {data.filter(i => i.id === selectedReviewId).map(inquiry => {
               const statusInfo = statusConfig[inquiry.status as keyof typeof statusConfig] || statusConfig.new;
               const StatusIcon = statusInfo.icon;
               const isCurrentlyProcessing = processingId === inquiry.id;
               
               return (
                  <div key={inquiry.id} className="p-2">
                     <div className="flex items-start justify-between mb-8 pb-6 border-b border-gray-100">
                        <div className="flex items-center gap-5">
                           <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                              <div className="absolute inset-0 bg-[#0a9396]/5 mix-blend-multiply" />
                              <Building2 className="w-8 h-8 text-[#0a9396]" />
                           </div>
                           <div>
                              <div className="flex items-center gap-3 mb-1">
                                 <h2 className="text-3xl font-black text-gray-900 tracking-tight">{inquiry.client}</h2>
                                 <Badge 
                                    variant={statusInfo.color as "default" | "success" | "danger" | "info" | "primary"} 
                                    className={`uppercase font-black tracking-widest text-[10px] px-2.5 py-0.5 ${statusInfo.theme}`}
                                 >
                                    <StatusIcon className={`w-3 h-3 mr-1.5 ${inquiry.status === "new" ? "animate-pulse" : ""}`} />
                                    {statusInfo.label}
                                 </Badge>
                              </div>
                              <p className="text-sm font-bold text-gray-400 flex items-center gap-4">
                                 <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4"/>{inquiry.company}</span>
                                 <span className="flex items-center gap-1.5 text-emerald-600"><DollarSign className="w-4 h-4"/>{formatCurrency(inquiry.budget)}/mo</span>
                              </p>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-8 mb-10 pl-2">
                        <div>
                           <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#0a9396] mb-3">Project Overview</h3>
                           <h4 className="text-2xl font-black text-gray-900 mb-3">{inquiry.project}</h4>
                           <p className="text-gray-600 leading-relaxed font-medium text-[15px] p-5 bg-gray-50/80 rounded-2xl border border-gray-100 shadow-sm">{inquiry.description}</p>
                        </div>
                        
                        <div>
                           <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Required Capabilities</h3>
                           <div className="flex flex-wrap gap-2">
                              {inquiry.requirements.map((req, idx) => (
                                 <span key={idx} className="bg-white border border-gray-200 shadow-sm text-gray-700 px-4 py-2 rounded-xl font-bold text-[11px] uppercase tracking-wider">
                                    {req}
                                 </span>
                              ))}
                           </div>
                        </div>
                     </div>

                     <div className="pt-6 flex justify-between items-center gap-3 border-t border-gray-100">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                           <Clock className="w-4 h-4" /> Received {inquiry.time}
                        </p>
                        <div className="flex items-center gap-3">
                           <button 
                              onClick={() => setIsReviewModalOpen(false)}
                              disabled={isCurrentlyProcessing}
                              className="px-6 py-3.5 rounded-xl font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all disabled:opacity-50"
                           >
                              Dismiss
                           </button>
                           <button 
                              onClick={async () => {
                                 await handleUpdateStatus(inquiry.id, "reviewed");
                                 setIsReviewModalOpen(false);
                              }}
                              disabled={isCurrentlyProcessing}
                              className="px-8 py-3.5 rounded-xl relative group overflow-hidden shadow-lg shadow-[#0a9396]/20 hover:shadow-xl hover:shadow-[#0a9396]/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:grayscale"
                           >
                              <div className="absolute inset-0 bg-gradient-to-r from-[#0a9396] via-[#14b8a6] to-[#0a9396] bg-[length:200%_auto] group-hover:animate-gradient" />
                              <span className="relative z-10 font-black text-[13px] uppercase tracking-wider text-white flex items-center justify-center">
                                 {isCurrentlyProcessing ? (
                                    <>
                                       <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                       Processing...
                                    </>
                                 ) : (
                                    <>
                                       <CheckCircle2 className="mr-2 h-4 w-4" />
                                       Accept Brief & Move to Review
                                    </>
                                 )}
                              </span>
                           </button>
                        </div>
                     </div>
                  </div>
               );
            })}
         </Modal>
      )}

      {/* Proposal Output Modal */}
      <Modal
         isOpen={isProposalModalOpen}
         onClose={() => !isSubmittingProposal && setIsProposalModalOpen(false)}
         size="lg"
         variant="light"
         className="bg-white/90 backdrop-blur-2xl border-white overflow-hidden shadow-[0_20px_60px_rgb(0,0,0,0.1)] rounded-[2rem]"
      >
         <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#0a9396] via-teal-400 to-[#0a9396] bg-[length:200%_auto] animate-gradient" />
         
         <div className="p-2">
            <div className="flex items-center gap-4 mb-8">
               <div className="p-3.5 bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 rounded-2xl shadow-[inset_0_2px_10px_rgb(255,255,255,1)] border border-blue-100/50">
                  <Send className="w-6 h-6" />
               </div>
               <div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">Draft Proposal</h2>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">
                     {data.find(i => i.id === selectedInquiryId)?.client}
                  </p>
               </div>
            </div>

            <form onSubmit={handleSendProposal} className="space-y-6">
               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2 group">
                     <label className="text-[11px] font-black uppercase tracking-[0.15em] text-gray-500 group-focus-within:text-[#0a9396] transition-colors">
                        Proposed Budget (Monthly)
                     </label>
                     <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input 
                           type="number"
                           required
                           value={proposalAmount}
                           onChange={(e) => setProposalAmount(e.target.value)}
                           className="pl-12 h-14 bg-gray-50/50 border-gray-200 focus:bg-white focus:border-[#0a9396] focus:ring-[#0a9396]/20 transition-all font-bold text-gray-900 rounded-xl shadow-sm hover:border-gray-300" 
                           placeholder={data.find(i => i.id === selectedInquiryId)?.budget?.toString() || "0"} 
                        />
                     </div>
                  </div>
                  
                  <div className="space-y-2 group">
                     <label className="text-[11px] font-black uppercase tracking-[0.15em] text-gray-500 group-focus-within:text-[#0a9396] transition-colors">
                        Estimated Timeline
                     </label>
                     <div className="relative">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input 
                           required
                           value={proposalTimeline}
                           onChange={(e) => setProposalTimeline(e.target.value)}
                           className="pl-12 h-14 bg-gray-50/50 border-gray-200 focus:bg-white focus:border-[#0a9396] focus:ring-[#0a9396]/20 transition-all font-bold text-gray-900 rounded-xl shadow-sm hover:border-gray-300" 
                           placeholder="e.g. 3 Months, Ongoing" 
                        />
                     </div>
                  </div>
               </div>

               <div className="space-y-2 group">
                  <label className="text-[11px] font-black uppercase tracking-[0.15em] text-gray-500 group-focus-within:text-[#0a9396] transition-colors">
                     Execution Strategy & Message
                  </label>
                  <textarea 
                     required
                     value={proposalMessage}
                     onChange={(e) => setProposalMessage(e.target.value)}
                     rows={5}
                     className="w-full resize-none bg-gray-50/50 border border-gray-200 focus:bg-white focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 transition-all font-medium text-gray-700 rounded-2xl shadow-sm hover:border-gray-300 p-5 outline-none" 
                     placeholder="Detail your approach, deliverables, and why you are the best fit for this project..."
                  />
               </div>

               <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                  <button 
                     type="button" 
                     onClick={() => setIsProposalModalOpen(false)}
                     disabled={isSubmittingProposal}
                     className="px-6 py-3.5 rounded-xl font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all disabled:opacity-50"
                  >
                     Cancel
                  </button>
                  <button 
                     type="submit" 
                     disabled={isSubmittingProposal}
                     className="px-8 py-3.5 rounded-xl relative group overflow-hidden shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:grayscale"
                  >
                     <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600 bg-[length:200%_auto] group-hover:animate-gradient" />
                     <span className="relative z-10 font-black text-[13px] uppercase tracking-wider text-white flex items-center justify-center">
                        {isSubmittingProposal ? (
                           <>
                              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                              Transmitting...
                           </>
                        ) : (
                           <>
                              <Send className="mr-2 h-4 w-4" />
                              Dispatch Proposal
                           </>
                        )}
                     </span>
                  </button>
               </div>
            </form>
         </div>
      </Modal>

      {/* Quick Reply Modal */}
      <Modal
         isOpen={isReplyModalOpen}
         onClose={() => !isSubmittingReply && setIsReplyModalOpen(false)}
         size="md"
         variant="light"
         className="bg-white/95 backdrop-blur-2xl border-white overflow-hidden shadow-[0_20px_60px_rgb(0,0,0,0.12)] rounded-[2rem]"
      >
         <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#0a9396] via-teal-400 to-[#0a9396] animate-gradient" />
         
         <div className="p-2">
            <div className="flex items-center gap-4 mb-8">
               <div className="p-3.5 bg-gray-50 text-gray-600 rounded-2xl shadow-[inset_0_2px_10px_rgb(255,255,255,1)] border border-gray-200/50">
                  <MessageSquare className="w-6 h-6" />
               </div>
               <div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">Quick Message</h2>
                  <p className="text-sm font-bold text-gray-400 flex items-center gap-2 mt-1">
                     <span className="uppercase tracking-widest">{data.find(i => i.id === selectedReplyId)?.client}</span>
                  </p>
               </div>
            </div>

            <form onSubmit={handleSendReply} className="space-y-6">
               <div className="space-y-2 group">
                  <label className="text-[11px] font-black uppercase tracking-[0.15em] text-gray-500 group-focus-within:text-[#0a9396] transition-colors flex items-center gap-2">
                     <Mail className="w-3.5 h-3.5" /> Internal Communication
                  </label>
                  <textarea 
                     required
                     value={replyMessage}
                     onChange={(e) => setReplyMessage(e.target.value)}
                     rows={6}
                     className="w-full resize-none bg-gray-50/50 border border-gray-200 focus:bg-white focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 transition-all font-medium text-gray-700 rounded-2xl shadow-sm hover:border-gray-300 p-5 outline-none leading-relaxed" 
                     placeholder="Type your message to the client here. Contact information sharing is not permitted prior to contract formation..."
                  />
               </div>

               <div className="pt-2 flex flex-col sm:flex-row justify-end gap-3 border-t border-gray-100">
                  <button 
                     type="button" 
                     onClick={() => setIsReplyModalOpen(false)}
                     disabled={isSubmittingReply}
                     className="px-6 py-3.5 rounded-xl font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all disabled:opacity-50 w-full sm:w-auto text-center order-2 sm:order-1"
                  >
                     Cancel
                  </button>
                  <button 
                     type="submit" 
                     disabled={isSubmittingReply || !replyMessage.trim()}
                     className="px-8 py-3.5 rounded-xl relative group overflow-hidden shadow-lg shadow-[#0a9396]/20 hover:shadow-xl hover:shadow-[#0a9396]/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:grayscale w-full sm:w-auto order-1 sm:order-2"
                  >
                     <div className="absolute inset-0 bg-gradient-to-r from-[#0a9396] via-[#14b8a6] to-[#0a9396] bg-[length:200%_auto] group-hover:animate-gradient" />
                     <span className="relative z-10 font-black text-[13px] uppercase tracking-wider text-white flex items-center justify-center">
                        {isSubmittingReply ? (
                           <>
                              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                              Sending...
                           </>
                        ) : (
                           <>
                              <Send className="mr-2 h-4 w-4" />
                              Transmit
                           </>
                        )}
                     </span>
                  </button>
               </div>
            </form>
         </div>
      </Modal>

    </div>
  );
}
