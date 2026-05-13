"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { 
  MessageSquare, 
  Search, 
  Video, 
  Phone, 
  User,
  Shield,
  Zap,
  Loader2,
  ChevronRight,
  Monitor
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LiveKitChat from "@/components/communication/LiveKitChat";
import { Input } from "@/components/ui/Input";

interface Conversation {
  id: string;
  roomName: string;
  participantName: string;
  lastActive: string;
  status: string;
  projectName: string;
}

interface RawInquiry {
  id: string;
  client: string;
  proName?: string;
  project: string;
  updatedAt: string;
  createdAt: string;
  status: string;
}

export default function ProMessagingPage() {
  const { data: session } = useSession();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedInquiry, setSelectedInquiry] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchConversations = useCallback(async () => {
    if (!session?.user || session.user.userType !== "pro") return;
    try {
      const endpoint = "/api/pro/inquiries";
      const res = await fetch(endpoint);
      const data = await res.json();
      
      if (data.inquiries) {
        const mapped: Conversation[] = data.inquiries.map((item: RawInquiry) => ({
          id: item.id,
          roomName: item.id,
          participantName: item.client,
          projectName: item.project,
          lastActive: item.updatedAt || item.createdAt,
          status: item.status,
        }));
        setConversations(mapped);
      }
    } catch (error) {
      console.error("Failed to fetch conversations", error);
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const filteredConversations = conversations.filter(c => 
    c.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.projectName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectConversation = (conv: Conversation) => {
    setSelectedRoom(conv.roomName);
    setSelectedInquiry(conv);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-[#0A0A0B]">
      {/* Sidebar - Engine Controller */}
      <div className="w-80 border-r border-white/5 bg-[#121214] flex flex-col shrink-0 shadow-2xl">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-[#0a9396]/20 rounded-xl flex items-center justify-center border border-[#0a9396]/30">
                <Zap className="h-5 w-5 text-[#0a9396]" />
              </div>
              <div>
                <h1 className="text-sm font-black text-white uppercase tracking-widest">Communication Hub</h1>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Pro Dashboard</p>
              </div>
            </div>
            <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input 
              placeholder="Filter streams..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 bg-white/5 border-white/10 rounded-xl text-white text-xs font-medium focus:border-[#0a9396]/50 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-40 gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-[#0a9396]" />
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Initializing Core...</p>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="text-center p-10 bg-white/5 rounded-3xl border border-white/5">
              <MessageSquare className="h-10 w-10 text-white/10 mx-auto mb-4" />
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">No Active Channels</p>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => handleSelectConversation(conv)}
                className={`w-full group p-4 rounded-2xl flex items-center gap-4 transition-all text-left border relative overflow-hidden ${
                  selectedRoom === conv.roomName 
                    ? "bg-[#0a9396] border-[#0a9396] shadow-xl shadow-[#0a9396]/20" 
                    : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"
                }`}
              >
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${
                  selectedRoom === conv.roomName ? "bg-white/20" : "bg-white/5"
                }`}>
                  <User className={`h-6 w-6 ${selectedRoom === conv.roomName ? "text-white" : "text-gray-500"}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-black truncate ${selectedRoom === conv.roomName ? "text-white" : "text-gray-200"}`}>
                      {conv.participantName}
                    </span>
                    <ChevronRight className={`h-3 w-3 transition-transform ${selectedRoom === conv.roomName ? "text-white rotate-90" : "text-gray-600 group-hover:translate-x-1"}`} />
                  </div>
                  <p className={`text-[10px] font-bold truncate uppercase tracking-tighter ${selectedRoom === conv.roomName ? "text-white/70" : "text-gray-500"}`}>
                    {conv.projectName}
                  </p>
                </div>

                {selectedRoom === conv.roomName && (
                   <motion.div 
                     layoutId="active-indicator"
                     className="absolute left-0 top-0 bottom-0 w-1 bg-white"
                   />
                )}
              </button>
            ))
          )}
        </div>
        
        <div className="p-6 border-t border-white/5 bg-black/20">
           <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                 <Shield className="h-4 w-4 text-emerald-500" />
              </div>
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">End-to-End Encrypted</span>
           </div>
        </div>
      </div>

      {/* Main Engine Console */}
      <div className="flex-1 flex flex-col relative">
        <AnimatePresence mode="wait">
          {selectedRoom ? (
            <motion.div 
              key={selectedRoom}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col h-full"
            >
              <div className="h-16 border-b border-white/5 bg-[#121214] flex items-center justify-between px-8 shrink-0">
                 <div className="flex items-center gap-4">
                    <div className="h-2 w-2 bg-emerald-500 rounded-full" />
                    <div>
                      <h2 className="text-sm font-black text-white uppercase tracking-widest">{selectedInquiry?.participantName}</h2>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">{selectedInquiry?.projectName}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                       <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Active Stream</span>
                    </div>
                 </div>
              </div>
              <div className="flex-1">
                <LiveKitChat room={selectedRoom} mode="video" />
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-[#0A0A0B]">
              <div className="relative mb-12">
                <div className="h-48 w-48 bg-[#0a9396]/5 rounded-full flex items-center justify-center">
                   <div className="h-32 w-32 bg-[#0a9396]/10 rounded-full flex items-center justify-center animate-pulse">
                      <Monitor className="h-16 w-16 text-[#0a9396]" />
                   </div>
                </div>
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-2 border-dashed border-[#0a9396]/20 rounded-full" 
                />
              </div>
              
              <h2 className="text-4xl font-black text-white mb-6 tracking-tighter uppercase">Hub Standby</h2>
              <p className="text-gray-500 max-w-lg font-medium leading-relaxed mb-10 text-sm">
                The communication infrastructure is ready for initialization. Select a participant from the control panel to establish a secure real-time channel.
              </p>
              
              <div className="grid grid-cols-3 gap-6 w-full max-w-2xl">
                 {[
                   { label: "Neural Audio", icon: Phone, desc: "Ultra-low latency" },
                   { label: "4K Video Hub", icon: Video, desc: "Lossless stream" },
                   { label: "Data Channel", icon: MessageSquare, desc: "Real-time sync" }
                 ].map((feat) => (
                   <div key={feat.label} className="p-6 bg-white/5 border border-white/5 rounded-[2rem] hover:bg-white/10 transition-all group">
                      <div className="h-12 w-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <feat.icon className="h-6 w-6 text-[#0a9396]" />
                      </div>
                      <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1">{feat.label}</p>
                      <p className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">{feat.desc}</p>
                   </div>
                 ))}
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
}
