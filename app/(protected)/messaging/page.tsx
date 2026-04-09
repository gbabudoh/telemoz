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
  AlertCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

// Dynamically import LiveKitCall to avoid SSR issues
const LiveKitCall = dynamic(() => import("@/components/LiveKitCall"), { ssr: false });

export default function MessagingPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [activeCall, setActiveCall] = useState<{ roomName: string; callType: "video" | "audio" } | null>(null);
  const [isSchedulingCall, setIsSchedulingCall] = useState(false);
  const [scheduleError, setScheduleError] = useState("");
  const [scheduleSuccess, setScheduleSuccess] = useState(false);
  const [callScheduleData, setCallScheduleData] = useState({
    date: "",
    time: "",
    duration: "30",
    type: "video" as "video" | "audio",
    topic: "",
  });

  const conversations = [
    { id: "1", name: "John Client", lastMessage: "Thanks for the update!", time: "2h ago", unread: 2, status: "online" },
    { id: "2", name: "Sarah Marketing", lastMessage: "Can we schedule a call?", time: "1d ago", unread: 0, status: "offline" },
    { id: "3", name: "Mike Agency", lastMessage: "The report looks great!", time: "3d ago", unread: 1, status: "online" },
    { id: "client-123", name: "Local Business Hub", lastMessage: "Social Media Strategy project", time: "1d ago", unread: 0, status: "offline" },
  ];

  useEffect(() => {
    const action = searchParams.get("action");
    const clientId = searchParams.get("clientId");
    const proId = searchParams.get("proId");

    const timer = setTimeout(() => {
      if (action === "schedule-call" && (clientId || proId)) {
        setIsSchedulingCall(true);
        setSelectedConversation(clientId || proId || null);
      } else if (clientId || proId) {
        setSelectedConversation(clientId || proId || null);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [searchParams]);

  const currentConversation = conversations.find((c) => c.id === selectedConversation);

  // Generate a stable room name for a conversation
  const getRoomName = (conversationId: string) => `telemoz-${conversationId}`;

  // Get current user's display name for LiveKit identity
  const participantName = session?.user?.name ?? session?.user?.email ?? "user";

  const startCall = (type: "video" | "audio") => {
    if (!selectedConversation) return;
    setActiveCall({ roomName: getRoomName(selectedConversation), callType: type });
  };

  const handleEndCall = () => {
    setActiveCall(null);
  };

  const handleScheduleCall = () => {
    setScheduleError("");
    if (!callScheduleData.date || !callScheduleData.time) {
      setScheduleError("Please select a date and time.");
      return;
    }
    setScheduleSuccess(true);
    setTimeout(() => {
      setScheduleSuccess(false);
      setIsSchedulingCall(false);
    }, 1500);
  };

  const panelClass = "bg-white/60 backdrop-blur-xl border border-white/80 shadow-sm overflow-hidden";

  return (
    <div className="relative h-[calc(100vh-8rem)] min-h-[600px] flex flex-col gap-5 w-full -m-6 p-6">

      {/* Ambient orbs */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-[#0a9396]/10 blur-[120px] pointer-events-none mix-blend-multiply animate-pulse" />
      <div className="absolute top-[30%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#6ece39]/8 blur-[130px] pointer-events-none mix-blend-multiply" />
      <div className="absolute bottom-[-10%] left-[20%] w-[45%] h-[45%] rounded-full bg-[#0a9396]/8 blur-[120px] pointer-events-none mix-blend-multiply opacity-70 animate-pulse" />

      {/* LiveKit call overlay */}
      <AnimatePresence>
        {activeCall && (
          <LiveKitCall
            roomName={activeCall.roomName}
            participantName={participantName}
            callType={activeCall.callType}
            contactName={currentConversation?.name ?? "Contact"}
            onEnd={handleEndCall}
          />
        )}
      </AnimatePresence>

      {/* Schedule a Call modal */}
      <AnimatePresence>
        {isSchedulingCall && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="absolute z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg"
          >
            <div className={`${panelClass} rounded-2xl`}>
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#0a9396] rounded-xl">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Schedule a Call</h3>
                </div>
                <button
                  onClick={() => {
                    setIsSchedulingCall(false);
                    setScheduleError("");
                    setScheduleSuccess(false);
                    router.push("/messaging");
                  }}
                  className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-all cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                <AnimatePresence>
                  {scheduleError && (
                    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4 shrink-0" />{scheduleError}
                    </motion.div>
                  )}
                  {scheduleSuccess && (
                    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-[#6ece39]/10 border border-[#6ece39]/20 text-[#5ab830] text-sm">
                      <CheckCircle2 className="h-4 w-4 shrink-0" />Call scheduled successfully!
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-gray-600">Date <span className="text-red-400">*</span></label>
                    <input type="date"
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:border-[#0a9396] focus:ring-2 focus:ring-[#0a9396]/20 outline-none transition-all"
                      value={callScheduleData.date}
                      onChange={(e) => setCallScheduleData({ ...callScheduleData, date: e.target.value })}
                      min={new Date().toISOString().split("T")[0]} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-gray-600">Time <span className="text-red-400">*</span></label>
                    <input type="time"
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:border-[#0a9396] focus:ring-2 focus:ring-[#0a9396]/20 outline-none transition-all"
                      value={callScheduleData.time}
                      onChange={(e) => setCallScheduleData({ ...callScheduleData, time: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-gray-600">Duration</label>
                    <select value={callScheduleData.duration}
                      onChange={(e) => setCallScheduleData({ ...callScheduleData, duration: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:border-[#0a9396] focus:ring-2 focus:ring-[#0a9396]/20 outline-none transition-all">
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="45">45 minutes</option>
                      <option value="60">60 minutes</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-gray-600">Call Type</label>
                    <div className="flex gap-2">
                      {(["video", "audio"] as const).map((t) => (
                        <button key={t}
                          onClick={() => setCallScheduleData({ ...callScheduleData, type: t })}
                          className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-xl border transition-all cursor-pointer ${callScheduleData.type === t ? "border-[#0a9396] bg-[#0a9396]/10 text-[#0a9396]" : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"}`}>
                          {t === "video" ? <Video className="h-4 w-4 mb-1" /> : <Phone className="h-4 w-4 mb-1" />}
                          <span className="text-[11px] font-medium capitalize">{t}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-gray-600">Topic <span className="text-gray-400">(optional)</span></label>
                  <input type="text" placeholder="e.g. Q3 campaign review..."
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:border-[#0a9396] focus:ring-2 focus:ring-[#0a9396]/20 outline-none transition-all"
                    value={callScheduleData.topic}
                    onChange={(e) => setCallScheduleData({ ...callScheduleData, topic: e.target.value })} />
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <Button onClick={handleScheduleCall}
                    className="w-full h-11 rounded-xl bg-[#0a9396] hover:bg-[#087579] text-white font-semibold text-sm shadow-sm border-none transition-all cursor-pointer">
                    <CheckCircle2 className="mr-2 h-4 w-4" />Confirm Schedule
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`flex-1 flex gap-5 min-h-0 relative z-10 transition-all duration-300 ${isSchedulingCall ? "opacity-30 pointer-events-none blur-sm" : ""}`}>

        {/* Conversations sidebar */}
        <div className={`w-72 lg:w-80 flex-shrink-0 flex flex-col ${panelClass} rounded-2xl`}>
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Messages</h2>
            <div className="relative flex items-center bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5">
              <Search className="h-4 w-4 text-gray-300 absolute left-3 shrink-0" />
              <input type="text" placeholder="Search conversations..."
                className="w-full bg-transparent border-none pl-6 outline-none text-sm text-gray-900 placeholder-gray-300" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-0.5">
            {conversations.map((conv) => {
              const isActive = selectedConversation === conv.id;
              return (
                <button key={conv.id}
                  onClick={() => setSelectedConversation(conv.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer relative ${isActive ? "bg-white shadow-sm border border-gray-100" : "hover:bg-white/60 border border-transparent"}`}>
                  {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-linear-to-b from-[#0a9396] to-[#6ece39] rounded-r-full" />}
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                      <div className={`h-10 w-10 rounded-xl bg-linear-to-br flex items-center justify-center text-white font-semibold text-base shadow-sm ${isActive ? "from-[#0a9396] to-[#6ece39]" : "from-gray-300 to-gray-400"}`}>
                        {conv.name.charAt(0)}
                      </div>
                      <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white ${conv.status === "online" ? "bg-[#6ece39]" : "bg-gray-300"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className={`text-sm font-medium truncate ${isActive ? "text-gray-900" : "text-gray-700"}`}>{conv.name}</p>
                        <span className={`text-[11px] shrink-0 ml-1 ${isActive ? "text-[#0a9396]" : "text-gray-400"}`}>{conv.time}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-400 truncate pr-2">{conv.lastMessage}</p>
                        {conv.unread > 0 && (
                          <div className="bg-[#0a9396] text-white text-[10px] font-medium h-[18px] min-w-[18px] px-1 rounded-full flex items-center justify-center shrink-0">
                            {conv.unread}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat area */}
        <div className={`flex-1 flex flex-col min-w-0 ${panelClass} rounded-2xl`}>
          {selectedConversation ? (
            <>
              {/* Chat header */}
              <div className="p-4 lg:p-5 border-b border-gray-100 flex items-center justify-between bg-white/40 sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-linear-to-br from-[#0a9396] to-[#6ece39] flex items-center justify-center text-white font-semibold text-base shadow-sm shrink-0">
                    {currentConversation?.name.charAt(0) ?? "?"}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">{currentConversation?.name ?? "Conversation"}</h3>
                    <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6ece39] opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#6ece39]" />
                      </span>
                      Online
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsSchedulingCall(true)}
                    className="px-3.5 py-2 rounded-xl bg-white border border-gray-200 hover:border-[#0a9396]/30 transition-all text-sm text-gray-600 hover:text-[#0a9396] flex items-center gap-1.5 cursor-pointer">
                    <Calendar className="h-3.5 w-3.5" />Schedule Call
                  </button>
                  <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1">
                    <button
                      onClick={() => startCall("video")}
                      className="p-2 rounded-lg hover:bg-[#0a9396]/10 text-gray-400 hover:text-[#0a9396] transition-colors cursor-pointer"
                      title="Start video call">
                      <Video className="h-4 w-4" />
                    </button>
                    <div className="w-px h-4 bg-gray-100 mx-0.5" />
                    <button
                      onClick={() => startCall("audio")}
                      className="p-2 rounded-lg hover:bg-[#0a9396]/10 text-gray-400 hover:text-[#0a9396] transition-colors cursor-pointer"
                      title="Start audio call">
                      <Phone className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages area */}
              <div className="flex-1 overflow-y-auto p-6 bg-white/10">
                <div className="h-full flex flex-col items-center justify-center text-center max-w-xs mx-auto">
                  <div className="h-16 w-16 rounded-2xl bg-[#0a9396]/10 border border-[#0a9396]/20 flex items-center justify-center mb-4">
                    <MessageSquare className="h-8 w-8 text-[#0a9396]" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1.5">Start the conversation</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">Send a message below to get started.</p>
                </div>
              </div>

              {/* Message input */}
              <div className="p-4 lg:p-5 bg-white/60 border-t border-gray-100">
                <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1 focus-within:ring-2 focus-within:ring-[#0a9396]/20 focus-within:border-[#0a9396]/40 transition-all">
                  <input
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent border-none px-3 py-2.5 outline-none text-sm text-gray-900 placeholder-gray-300"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && message.trim()) setMessage(""); }}
                  />
                  <button
                    onClick={() => { if (message.trim()) setMessage(""); }}
                    className="h-9 w-9 shrink-0 rounded-lg bg-[#0a9396] hover:bg-[#087579] flex items-center justify-center cursor-pointer transition-all">
                    <Send className="h-4 w-4 text-white ml-0.5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-xs">
                <div className="h-16 w-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-8 w-8 text-gray-300" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-1.5">No conversation selected</h3>
                <p className="text-gray-400 text-sm">Choose a conversation from the list to start messaging.</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
