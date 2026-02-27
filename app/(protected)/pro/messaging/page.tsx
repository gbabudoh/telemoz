"use client";

import { Button } from "@/components/ui/Button";
import {
  Send,
  Search,
  Video,
  Phone,
  Calendar,
  X,
  MessageSquare,
  CheckCircle2,
  Clock
} from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function MessagingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isCallMode, setIsCallMode] = useState(false);
  const [isSchedulingCall, setIsSchedulingCall] = useState(false);
  const [callScheduleData, setCallScheduleData] = useState({
    date: "",
    time: "",
    duration: "30",
    type: "video" as "video" | "audio",
    topic: "",
  });

  // Check if we're in call scheduling mode
  useEffect(() => {
    const action = searchParams.get("action");
    const clientId = searchParams.get("clientId");
    const proId = searchParams.get("proId");

    const timer = setTimeout(() => {
      if (action === "schedule-call" && (clientId || proId)) {
        setIsSchedulingCall(true);
        setIsCallMode(true);
        // Set selected conversation based on who we're contacting
        if (clientId) {
          setSelectedConversation(clientId);
        } else if (proId) {
          setSelectedConversation(proId);
        }
      } else if (clientId || proId) {
        setSelectedConversation(clientId || proId || null);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [searchParams]);

  // Mock conversations
  const conversations = [
    { id: "1", name: "John Client", lastMessage: "Thanks for the update!", time: "2h ago", unread: 2, status: "online" },
    { id: "2", name: "Sarah Marketing", lastMessage: "Can we schedule a call?", time: "1d ago", unread: 0, status: "offline" },
    { id: "3", name: "Mike Agency", lastMessage: "The report looks great!", time: "3d ago", unread: 1, status: "online" },
    { id: "client-123", name: "Local Business Hub", lastMessage: "Social Media Strategy project", time: "1d ago", unread: 0, status: "offline" },
  ];

  const handleScheduleCall = () => {
    if (!callScheduleData.date || !callScheduleData.time) {
      alert("Please select date and time");
      return;
    }
    // TODO: Implement API call to schedule call
    console.log("Scheduling call:", callScheduleData);
    alert("Call scheduled successfully!");
    setIsSchedulingCall(false);
    setIsCallMode(false);
  };

  const currentConversation = conversations.find((c) => c.id === selectedConversation);

  return (
    <div className="relative h-[calc(100vh-8rem)] min-h-[600px] flex flex-col gap-6 w-full -m-6 p-6">
      
      {/* Ambient Animated Orbs */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-teal-400/20 blur-[120px] pointer-events-none mix-blend-multiply animate-pulse" />
      <div className="absolute top-[30%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-400/10 blur-[130px] pointer-events-none mix-blend-multiply animate-pulse-slow" />
      <div className="absolute bottom-[-10%] left-[20%] w-[45%] h-[45%] rounded-full bg-[#0a9396]/10 blur-[120px] pointer-events-none mix-blend-multiply opacity-70 animate-pulse" />

      {/* Popover Call Handlers */}
      <AnimatePresence>
        {isSchedulingCall && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg"
          >
            <div className="bg-white/80 backdrop-blur-3xl border border-white rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.12),inset_0_2px_15px_rgba(255,255,255,0.8)] overflow-hidden">
               
               <div className="p-6 border-b border-gray-100/50 bg-gradient-to-br from-white/40 to-transparent flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="p-2.5 bg-gradient-to-br from-[#0a9396] to-teal-400 rounded-xl shadow-md shadow-teal-500/20">
                     <Calendar className="h-5 w-5 text-white" />
                   </div>
                   <h3 className="text-xl font-black text-gray-900 tracking-tight">Schedule Briefing</h3>
                 </div>
                 <button
                   onClick={() => {
                     setIsSchedulingCall(false);
                     setIsCallMode(false);
                     router.push("/pro/messaging");
                   }}
                   className="p-2 rounded-full hover:bg-white/60 bg-white/40 border border-gray-100 transition-all text-gray-500 hover:text-gray-900 cursor-pointer"
                 >
                   <X className="h-4 w-4" />
                 </button>
               </div>

               <div className="p-8 space-y-6 bg-white/20">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                   <div>
                     <label className="block text-[13px] font-black uppercase tracking-wider text-gray-500 mb-2">Target Date</label>
                     <input
                       type="date"
                       className="w-full bg-white/60 backdrop-blur-md border border-gray-200/60 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 outline-none transition-all shadow-inner"
                       value={callScheduleData.date}
                       onChange={(e) => setCallScheduleData({ ...callScheduleData, date: e.target.value })}
                       min={new Date().toISOString().split("T")[0]}
                     />
                   </div>
                   <div>
                     <label className="block text-[13px] font-black uppercase tracking-wider text-gray-500 mb-2">Time (Local)</label>
                     <input
                       type="time"
                       className="w-full bg-white/60 backdrop-blur-md border border-gray-200/60 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 outline-none transition-all shadow-inner"
                       value={callScheduleData.time}
                       onChange={(e) => setCallScheduleData({ ...callScheduleData, time: e.target.value })}
                     />
                   </div>
                   <div>
                     <label className="block text-[13px] font-black uppercase tracking-wider text-gray-500 mb-2">Duration (Min)</label>
                     <select
                       value={callScheduleData.duration}
                       onChange={(e) => setCallScheduleData({ ...callScheduleData, duration: e.target.value })}
                       className="w-full bg-white/60 backdrop-blur-md border border-gray-200/60 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 outline-none transition-all shadow-inner"
                     >
                       <option value="15">15 minutes</option>
                       <option value="30">30 minutes</option>
                       <option value="45">45 minutes</option>
                       <option value="60">60 minutes</option>
                     </select>
                   </div>
                   <div>
                     <label className="block text-[13px] font-black uppercase tracking-wider text-gray-500 mb-2">Protocol</label>
                     <div className="flex gap-2">
                       <button
                         onClick={() => setCallScheduleData({ ...callScheduleData, type: "video" })}
                         className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-xl border transition-all cursor-pointer ${
                           callScheduleData.type === "video"
                             ? "border-[#0a9396] bg-[#0a9396]/10 text-[#0a9396] shadow-sm shadow-teal-500/10"
                             : "border-gray-200/60 bg-white/60 text-gray-500 hover:bg-gray-50"
                         }`}
                       >
                         <Video className="h-5 w-5 mb-1" />
                         <span className="text-[11px] font-bold uppercase tracking-wide">Video</span>
                       </button>
                       <button
                         onClick={() => setCallScheduleData({ ...callScheduleData, type: "audio" })}
                         className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-xl border transition-all cursor-pointer ${
                           callScheduleData.type === "audio"
                             ? "border-[#0a9396] bg-[#0a9396]/10 text-[#0a9396] shadow-sm shadow-teal-500/10"
                             : "border-gray-200/60 bg-white/60 text-gray-500 hover:bg-gray-50"
                         }`}
                       >
                         <Phone className="h-5 w-5 mb-1" />
                         <span className="text-[11px] font-bold uppercase tracking-wide">Audio</span>
                       </button>
                     </div>
                   </div>
                 </div>

                 <div>
                   <label className="block text-[13px] font-black uppercase tracking-wider text-gray-500 mb-2">Agenda / Topic</label>
                   <input
                     type="text"
                     placeholder="e.g. Discuss Q3 Campaign Metrics..."
                     className="w-full bg-white/60 backdrop-blur-md border border-gray-200/60 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 placeholder-gray-400 focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 outline-none transition-all shadow-inner"
                     value={callScheduleData.topic}
                     onChange={(e) => setCallScheduleData({ ...callScheduleData, topic: e.target.value })}
                   />
                 </div>

                 <div className="flex gap-3 pt-6 border-t border-gray-100/50">
                    <Button
                      onClick={handleScheduleCall}
                      className="flex-1 h-12 rounded-xl bg-gradient-to-r from-[#0a9396] to-teal-500 hover:from-teal-500 hover:to-[#0a9396] text-white font-bold tracking-wide text-[15px] shadow-lg shadow-teal-500/20 border-none transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="mr-2 h-5 w-5" /> Confirm Schedule
                    </Button>
                 </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCallMode && !isSchedulingCall && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm"
          >
             <div className="bg-gray-900/80 backdrop-blur-3xl border border-gray-800 rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.5),inset_0_2px_15px_rgba(255,255,255,0.1)] p-8 text-center relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-b from-[#0a9396]/20 to-transparent opacity-50" />
               
               {/* Pulsing Avatar */}
               <div className="relative mx-auto w-32 h-32 mb-6">
                 <div className="absolute inset-0 bg-[#0a9396] rounded-full blur-xl animate-pulse opacity-50" />
                 <div className="absolute inset-0 bg-gradient-to-br from-[#0a9396] to-emerald-400 rounded-full flex items-center justify-center text-5xl font-black text-white outline outline-4 outline-white/10 z-10 shadow-2xl shadow-[#0a9396]/50">
                   {currentConversation?.name.charAt(0) || "U"}
                 </div>
               </div>

               <div className="relative z-10">
                 <h3 className="text-2xl font-black text-white tracking-tight mb-1">{currentConversation?.name || "Target Client"}</h3>
                 <p className="text-teal-400 font-bold tracking-wide text-sm flex justify-center items-center gap-2 mb-8 animate-pulse">
                   <Clock className="h-4 w-4" /> Secure Call in Progress...
                 </p>

                 <div className="flex items-center justify-center gap-6">
                    <button className="h-14 w-14 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-md">
                      <Video className="h-6 w-6" />
                    </button>
                    <button onClick={() => setIsCallMode(false)} className="h-16 w-16 rounded-full bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30 text-white flex items-center justify-center transition-all cursor-pointer">
                      <Phone className="h-7 w-7 rotate-[135deg]" />
                    </button>
                    <button className="h-14 w-14 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-md">
                       <MessageSquare className="h-6 w-6" />
                    </button>
                 </div>
               </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`flex-1 flex gap-6 min-h-0 relative z-10 transition-all duration-300 ${isSchedulingCall || isCallMode ? "opacity-30 pointer-events-none blur-sm" : ""}`}>
        
        {/* Conversations Sidebar */}
        <div className="w-80 lg:w-[360px] flex-shrink-0 flex flex-col bg-white/40 backdrop-blur-3xl border border-white rounded-[2.5rem] shadow-[inset_0_2px_15px_rgb(255,255,255,0.7),0_10px_30px_rgb(0,0,0,0.03)] overflow-hidden">
           
           <div className="p-6 border-b border-gray-100/50 bg-gradient-to-br from-white/40 to-transparent">
             <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-5">Open Channels</h2>
             
             <div className="relative flex items-center bg-white/60 backdrop-blur-md border border-white shadow-inner rounded-xl px-4 py-3">
               <Search className="h-5 w-5 text-gray-400 absolute left-4" />
               <input
                 type="text"
                 placeholder="Search vectors..."
                 className="w-full bg-transparent border-none pl-8 outline-none text-[14px] font-bold text-gray-900 placeholder-gray-400 tracking-wide"
               />
             </div>
           </div>

           <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-1">
             {conversations.map((conv) => {
               const isActive = selectedConversation === conv.id;

               return (
                 <button
                   key={conv.id}
                   onClick={() => {
                     setSelectedConversation(conv.id);
                     setIsCallMode(false);
                     setIsSchedulingCall(false);
                   }}
                   className={`w-full text-left p-3 rounded-2xl transition-all cursor-pointer relative group ${
                     isActive 
                       ? "bg-white shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-gray-100/80 scale-[1.02] z-10" 
                       : "hover:bg-white/60 border border-transparent"
                   }`}
                 >
                   {isActive && (
                     <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1/2 bg-gradient-to-b from-[#0a9396] to-teal-400 rounded-r-full" />
                   )}
                   
                   <div className="flex items-center gap-4">
                     <div className="relative shrink-0">
                       <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white font-black text-lg shadow-sm ${isActive ? "from-[#0a9396] to-emerald-400" : "from-gray-300 to-gray-400"}`}>
                         {conv.name.charAt(0)}
                       </div>
                       <div className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white ${conv.status === "online" ? "bg-emerald-500" : "bg-gray-300"}`} />
                     </div>
                     
                     <div className="flex-1 min-w-0 pr-1">
                       <div className="flex items-center justify-between mb-1">
                         <p className={`font-black tracking-tight truncate ${isActive ? "text-gray-900" : "text-gray-700 group-hover:text-gray-900"}`}>
                           {conv.name}
                         </p>
                         <span className={`text-[11px] font-bold tracking-wide ${isActive ? "text-[#0a9396]" : "text-gray-400"}`}>
                           {conv.time}
                         </span>
                       </div>
                       
                       <div className="flex items-center justify-between">
                         <p className={`text-[13px] font-medium truncate pr-2 ${isActive ? "text-gray-600" : "text-gray-400"}`}>
                           {conv.lastMessage}
                         </p>
                         {conv.unread > 0 && (
                           <div className="bg-[#0a9396] text-white text-[10px] font-black h-5 min-w-[20px] px-1.5 rounded-full flex items-center justify-center shadow-sm shrink-0">
                             {conv.unread}
                           </div>
                         )}
                       </div>
                     </div>
                   </div>
                 </button>
               )
             })}
           </div>
        </div>

        {/* Cinematic Chat Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-white/40 backdrop-blur-3xl border border-white rounded-[2.5rem] shadow-[inset_0_2px_15px_rgb(255,255,255,0.7),0_10px_30px_rgb(0,0,0,0.03)] overflow-hidden">
          {selectedConversation ? (
            <>
              {/* Header */}
              <div className="p-5 lg:p-6 border-b border-gray-100/80 bg-gradient-to-br from-white/60 to-white/20 backdrop-blur-xl flex items-center justify-between z-10 sticky top-0">
                 <div className="flex items-center gap-4">
                   <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#0a9396] to-emerald-400 flex items-center justify-center text-white font-black text-xl shadow-sm shrink-0">
                     {currentConversation?.name.charAt(0) || "U"}
                   </div>
                   <div>
                     <h3 className="text-xl font-black text-gray-900 tracking-tight leading-tight">
                       {currentConversation?.name || "Active Channel"}
                     </h3>
                     <p className="text-[13px] font-bold text-emerald-500 tracking-wide flex items-center gap-1.5 mt-0.5">
                       <span className="relative flex h-2 w-2">
                         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                         <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                       </span>
                       Secure Connection Established
                     </p>
                   </div>
                 </div>
                 
                 <div className="flex items-center gap-3">
                   <button
                     onClick={() => {
                       setIsSchedulingCall(true);
                       setIsCallMode(true);
                     }}
                     className="px-4 py-2.5 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-[#0a9396]/20 transition-all font-bold tracking-wide text-[13px] text-gray-700 hover:text-[#0a9396] flex items-center gap-2 cursor-pointer"
                   >
                     <Calendar className="h-4 w-4" /> Schedule Briefing
                   </button>
                   <div className="flex items-center bg-white border border-gray-100 shadow-sm rounded-xl p-1">
                      <button
                        onClick={() => {
                          setCallScheduleData({ ...callScheduleData, type: "video" });
                          setIsCallMode(true);
                        }}
                        className="p-2 rounded-lg hover:bg-[#0a9396]/10 text-gray-500 hover:text-[#0a9396] transition-colors cursor-pointer"
                      >
                        <Video className="h-4 w-4" />
                      </button>
                      <div className="w-px h-4 bg-gray-200 mx-1" />
                      <button
                        onClick={() => {
                          setCallScheduleData({ ...callScheduleData, type: "audio" });
                          setIsCallMode(true);
                        }}
                        className="p-2 rounded-lg hover:bg-[#0a9396]/10 text-gray-500 hover:text-[#0a9396] transition-colors cursor-pointer"
                      >
                        <Phone className="h-4 w-4" />
                      </button>
                   </div>
                 </div>
              </div>

              {/* Chat Canvas */}
              <div className="flex-1 overflow-y-auto p-6 bg-white/20 relative">
                 <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none">
                   <MessageSquare className="h-96 w-96 text-[#0a9396]" />
                 </div>
                 
                 {/* Empty State */}
                 <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto">
                    <div className="h-24 w-24 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center mb-6 shadow-sm">
                      <MessageSquare className="h-10 w-10 text-[#0a9396]" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-2">Initialize Protocol</h3>
                    <p className="text-gray-500 font-bold tracking-wide text-sm leading-relaxed">
                      End-to-End encrypted telemetry system. Send your first communication framework below.
                    </p>
                 </div>
              </div>

              {/* Input Core */}
              <div className="p-5 lg:p-6 bg-white/60 backdrop-blur-xl border-t border-gray-100/80">
                 <div className="flex items-center bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 rounded-2xl p-1.5 pr-2 focus-within:ring-4 focus-within:ring-[#0a9396]/10 focus-within:border-[#0a9396]/30 transition-all">
                    <input
                      placeholder="Type a transmission..."
                      className="flex-1 bg-transparent border-none px-4 py-3 outline-none text-[15px] font-bold text-gray-900 placeholder-gray-400"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && message.trim()) {
                          // TODO: Send message
                          setMessage("");
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        if (message.trim()) {
                          // TODO: Send message
                          setMessage("");
                        }
                      }}
                      className="h-11 w-11 shrink-0 rounded-xl bg-gradient-to-br from-[#0a9396] to-teal-500 hover:from-teal-500 hover:to-[#0a9396] shadow-md shadow-teal-500/30 flex items-center justify-center cursor-pointer transition-all"
                    >
                       <Send className="h-5 w-5 text-white ml-0.5" />
                    </button>
                 </div>
              </div>
            </>
          ) : (
             <div className="flex-1 flex items-center justify-center bg-white/20 relative">
               <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                   <MessageSquare className="h-[500px] w-[500px]" />
               </div>
               <div className="text-center relative z-10 max-w-sm">
                 <div className="h-24 w-24 rounded-full bg-white/60 backdrop-blur-sm border border-white flex items-center justify-center mx-auto mb-6 shadow-sm">
                   <MessageSquare className="h-10 w-10 text-gray-300" />
                 </div>
                 <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-2">No Active Target</h3>
                 <p className="text-gray-500 font-bold tracking-wide text-sm">Select a channel from the matrix on the left to begin transmission.</p>
               </div>
             </div>
          )}
        </div>

      </div>
    </div>
  );
}
