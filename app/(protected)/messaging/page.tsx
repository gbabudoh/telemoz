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
  Check,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

const LiveKitCall = dynamic(() => import("@/components/LiveKitCall"), { ssr: false });

interface Message {
  id: string;
  text: string;
  sender: "me" | "them";
  time: string;
  read?: boolean;
}

type MessageStore = Record<string, Message[]>;

export default function MessagingPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<MessageStore>({});
  const [conversations, setConversations] = useState<Array<{
    id: string;
    name: string;
    projectId: string;
    lastMessage: string;
    updatedAt: string;
  }>>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);

  const [activeCall, setActiveCall] = useState<{ roomName: string; callType: "video" | "audio" } | null>(null);
  const [isSchedulingCall, setIsSchedulingCall] = useState(false);
  const [scheduleError, setScheduleError] = useState("");
  const [scheduleSuccess, setScheduleSuccess] = useState(false);
  const [isSubmittingCall, setIsSubmittingCall] = useState(false);
  const [callScheduleData, setCallScheduleData] = useState({
    date: "",
    time: "",
    duration: "30",
    type: "video" as "video" | "audio",
    topic: "",
  });

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedConversation]);

  useEffect(() => {
    if (selectedConversation) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [selectedConversation]);

  useEffect(() => {
    fetch("/api/messaging/conversations")
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setConversations(d); })
      .catch(console.error)
      .finally(() => setIsLoadingConversations(false));
  }, []);

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
  const currentMessages = selectedConversation ? (messages[selectedConversation] ?? []) : [];

  const sendMessage = useCallback(() => {
    const text = message.trim();
    if (!text || !selectedConversation) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

    const newMsg: Message = {
      id: `${selectedConversation}-${Date.now()}`,
      sender: "me",
      text,
      time: timeStr,
      read: false,
    };

    setMessages((prev) => ({
      ...prev,
      [selectedConversation]: [...(prev[selectedConversation] ?? []), newMsg],
    }));

    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedConversation
          ? { ...c, lastMessage: text }
          : c
      )
    );

    setMessage("");
  }, [message, selectedConversation]);

  const getRoomName = (conversationId: string) => `telemoz-${conversationId}`;
  const participantName = session?.user?.name ?? session?.user?.email ?? "user";

  const startCall = (type: "video" | "audio") => {
    if (!selectedConversation) return;
    setActiveCall({ roomName: getRoomName(selectedConversation), callType: type });
  };

  const handleEndCall = () => setActiveCall(null);

  const handleScheduleCall = async () => {
    setScheduleError("");
    if (!callScheduleData.date || !callScheduleData.time) {
      setScheduleError("Please select a date and time.");
      return;
    }
    if (!selectedConversation) {
      setScheduleError("No conversation selected.");
      return;
    }

    setIsSubmittingCall(true);
    try {
      const res = await fetch("/api/messaging/schedule-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactId: selectedConversation,
          date: callScheduleData.date,
          time: callScheduleData.time,
          duration: callScheduleData.duration,
          type: callScheduleData.type,
          topic: callScheduleData.topic,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setScheduleError(data.error ?? "Failed to schedule call. Please try again.");
        return;
      }

      setScheduleSuccess(true);
      setTimeout(() => {
        setScheduleSuccess(false);
        setIsSchedulingCall(false);
        setCallScheduleData({ date: "", time: "", duration: "30", type: "video", topic: "" });
      }, 1500);
    } catch {
      setScheduleError("Network error. Please try again.");
    } finally {
      setIsSubmittingCall(false);
    }
  };

  return (
    <div className="relative h-[calc(100vh-8rem)] min-h-[600px] flex flex-col gap-6 w-full -m-6 p-6">

      {/* Ambient orbs */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-teal-400/20 blur-[120px] pointer-events-none mix-blend-multiply animate-pulse" />
      <div className="absolute top-[30%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-400/10 blur-[130px] pointer-events-none mix-blend-multiply" />
      <div className="absolute bottom-[-10%] left-[20%] w-[45%] h-[45%] rounded-full bg-[#0a9396]/10 blur-[120px] pointer-events-none mix-blend-multiply opacity-70 animate-pulse" />

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
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg"
          >
            <div className="bg-white/80 backdrop-blur-3xl border border-white rounded-4xl shadow-[0_30px_60px_rgba(0,0,0,0.12),inset_0_2px_15px_rgba(255,255,255,0.8)] overflow-hidden">
              <div className="p-6 border-b border-gray-100/50 bg-linear-to-br from-white/40 to-transparent flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-linear-to-br from-[#0a9396] to-teal-400 rounded-xl shadow-md shadow-teal-500/20">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 tracking-tight">Schedule a Call</h3>
                </div>
                <button
                  onClick={() => { setIsSchedulingCall(false); setScheduleError(""); setScheduleSuccess(false); router.push("/messaging"); }}
                  className="p-2 rounded-full hover:bg-white/60 bg-white/40 border border-gray-100 transition-all text-gray-500 hover:text-gray-900 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-8 space-y-6 bg-white/20">
                <AnimatePresence>
                  {scheduleError && (
                    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
                      <AlertCircle className="h-4 w-4 shrink-0" />{scheduleError}
                    </motion.div>
                  )}
                  {scheduleSuccess && (
                    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm font-medium">
                      <CheckCircle2 className="h-4 w-4 shrink-0" />Call scheduled successfully!
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="block text-[13px] font-black uppercase tracking-wider text-gray-500">Date <span className="text-red-400">*</span></label>
                    <input type="date"
                      className="w-full bg-white/60 backdrop-blur-md border border-gray-200/60 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 outline-none transition-all shadow-inner"
                      value={callScheduleData.date}
                      onChange={(e) => setCallScheduleData({ ...callScheduleData, date: e.target.value })}
                      min={new Date().toISOString().split("T")[0]} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[13px] font-black uppercase tracking-wider text-gray-500">Time <span className="text-red-400">*</span></label>
                    <input type="time"
                      className="w-full bg-white/60 backdrop-blur-md border border-gray-200/60 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 outline-none transition-all shadow-inner"
                      value={callScheduleData.time}
                      onChange={(e) => setCallScheduleData({ ...callScheduleData, time: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[13px] font-black uppercase tracking-wider text-gray-500">Duration</label>
                    <select value={callScheduleData.duration}
                      onChange={(e) => setCallScheduleData({ ...callScheduleData, duration: e.target.value })}
                      className="w-full bg-white/60 backdrop-blur-md border border-gray-200/60 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 outline-none transition-all shadow-inner">
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="45">45 minutes</option>
                      <option value="60">60 minutes</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[13px] font-black uppercase tracking-wider text-gray-500">Call Type</label>
                    <div className="flex gap-2">
                      {(["video", "audio"] as const).map((t) => (
                        <button key={t}
                          onClick={() => setCallScheduleData({ ...callScheduleData, type: t })}
                          className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-xl border transition-all cursor-pointer ${callScheduleData.type === t ? "border-[#0a9396] bg-[#0a9396]/10 text-[#0a9396] shadow-sm" : "border-gray-200/60 bg-white/60 text-gray-500 hover:bg-gray-50"}`}>
                          {t === "video" ? <Video className="h-5 w-5 mb-1" /> : <Phone className="h-5 w-5 mb-1" />}
                          <span className="text-[11px] font-bold uppercase tracking-wide capitalize">{t}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[13px] font-black uppercase tracking-wider text-gray-500">
                    Topic <span className="text-gray-400 normal-case font-medium">(optional)</span>
                  </label>
                  <input type="text" placeholder="e.g. Q3 campaign review..."
                    className="w-full bg-white/60 backdrop-blur-md border border-gray-200/60 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 placeholder-gray-400 focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 outline-none transition-all shadow-inner"
                    value={callScheduleData.topic}
                    onChange={(e) => setCallScheduleData({ ...callScheduleData, topic: e.target.value })} />
                </div>

                <div className="flex gap-3 pt-6 border-t border-gray-100/50">
                  <Button onClick={handleScheduleCall} disabled={isSubmittingCall}
                    className="flex-1 h-12 rounded-xl bg-linear-to-r from-[#0a9396] to-teal-500 hover:from-teal-500 hover:to-[#0a9396] text-white font-bold tracking-wide text-[15px] shadow-lg shadow-teal-500/20 border-none transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
                    {isSubmittingCall ? (
                      <svg className="animate-spin mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                    ) : (
                      <CheckCircle2 className="mr-2 h-5 w-5" />
                    )}
                    {isSubmittingCall ? "Scheduling..." : "Confirm Schedule"}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`flex-1 flex gap-6 min-h-0 relative z-10 transition-all duration-300 ${isSchedulingCall ? "opacity-30 pointer-events-none blur-sm" : ""}`}>

        {/* Conversations Sidebar */}
        <div className="w-80 lg:w-[360px] shrink-0 flex flex-col bg-white/40 backdrop-blur-3xl border border-white rounded-[2.5rem] shadow-[inset_0_2px_15px_rgb(255,255,255,0.7),0_10px_30px_rgb(0,0,0,0.03)] overflow-hidden">
          <div className="p-6 border-b border-gray-100/50 bg-linear-to-br from-white/40 to-transparent">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-5">Messages</h2>
            <div className="relative flex items-center bg-white/60 backdrop-blur-md border border-white shadow-inner rounded-xl px-4 py-3">
              <Search className="h-5 w-5 text-gray-400 absolute left-4" />
              <input type="text" placeholder="Search conversations..."
                className="w-full bg-transparent border-none pl-8 outline-none text-[14px] font-bold text-gray-900 placeholder-gray-400 tracking-wide" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-1">
            {isLoadingConversations ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-7 w-7 rounded-full border-2 border-[#0a9396]/20 border-t-[#0a9396] animate-spin" />
              </div>
            ) : conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                <div className="h-14 w-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-gray-300" />
                </div>
                <p className="text-sm font-black text-gray-500 mb-1">No conversations yet</p>
                <p className="text-xs text-gray-400 leading-relaxed">Conversations appear once a project has an assigned pro.</p>
              </div>
            ) : (
              conversations.map((conv) => {
                const isActive = selectedConversation === conv.id;
                return (
                  <button key={conv.id}
                    onClick={() => setSelectedConversation(conv.id)}
                    className={`w-full text-left p-3 rounded-2xl transition-all cursor-pointer relative group ${isActive ? "bg-white shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-gray-100/80 scale-[1.02] z-10" : "hover:bg-white/60 border border-transparent"}`}>
                    {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1/2 bg-linear-to-b from-[#0a9396] to-teal-400 rounded-r-full" />}
                    <div className="flex items-center gap-4">
                      <div className="shrink-0">
                        <div className={`h-12 w-12 rounded-2xl bg-linear-to-br flex items-center justify-center text-white font-black text-lg shadow-sm ${isActive ? "from-[#0a9396] to-emerald-400" : "from-gray-300 to-gray-400"}`}>
                          {conv.name.charAt(0)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 pr-1">
                        <p className={`font-black tracking-tight truncate ${isActive ? "text-gray-900" : "text-gray-700 group-hover:text-gray-900"}`}>{conv.name}</p>
                        <p className={`text-[13px] font-medium truncate ${isActive ? "text-gray-600" : "text-gray-400"}`}>{conv.lastMessage}</p>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-white/40 backdrop-blur-3xl border border-white rounded-[2.5rem] shadow-[inset_0_2px_15px_rgb(255,255,255,0.7),0_10px_30px_rgb(0,0,0,0.03)] overflow-hidden">

          {/* Header — always visible */}
          <div className="p-5 lg:p-6 border-b border-gray-100/80 bg-linear-to-br from-white/60 to-white/20 backdrop-blur-xl flex items-center justify-between z-10 sticky top-0">
            <div className="flex items-center gap-4">
              {selectedConversation ? (
                <>
                  <div className="h-12 w-12 rounded-2xl bg-linear-to-br from-[#0a9396] to-emerald-400 flex items-center justify-center text-white font-black text-xl shadow-sm shrink-0">
                    {currentConversation?.name.charAt(0) ?? "?"}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900 tracking-tight leading-tight">
                      {currentConversation?.name ?? "Conversation"}
                    </h3>
                    <p className="text-[13px] font-bold text-gray-400 mt-0.5">{currentConversation?.lastMessage}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="h-12 w-12 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                    <MessageSquare className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-400 tracking-tight leading-tight">Select a conversation</h3>
                    <p className="text-[13px] font-bold text-gray-300 mt-0.5">Choose from the list to start messaging</p>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSchedulingCall(true)}
                disabled={!selectedConversation}
                className="px-4 py-2.5 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-[#0a9396]/20 transition-all font-bold tracking-wide text-[13px] text-gray-700 hover:text-[#0a9396] flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-sm disabled:hover:border-gray-100 disabled:hover:text-gray-700"
              >
                <Calendar className="h-4 w-4" /> Schedule Call
              </button>
              <div className="flex items-center bg-white border border-gray-100 shadow-sm rounded-xl p-1">
                <button
                  onClick={() => startCall("video")}
                  disabled={!selectedConversation}
                  className="p-2 rounded-lg hover:bg-[#0a9396]/10 text-gray-500 hover:text-[#0a9396] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-500"
                  title="Start video call"
                >
                  <Video className="h-4 w-4" />
                </button>
                <div className="w-px h-4 bg-gray-200 mx-1" />
                <button
                  onClick={() => startCall("audio")}
                  disabled={!selectedConversation}
                  className="p-2 rounded-lg hover:bg-[#0a9396]/10 text-gray-500 hover:text-[#0a9396] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-500"
                  title="Start audio call"
                >
                  <Phone className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {selectedConversation ? (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3 bg-white/20">
                {currentMessages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto">
                    <div className="h-20 w-20 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center mb-5 shadow-sm">
                      <MessageSquare className="h-9 w-9 text-[#0a9396]" />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 tracking-tight mb-2">Start the conversation</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">Send a message below or start a call using the buttons above.</p>
                  </div>
                ) : (
                  <>
                    {currentMessages.map((msg, i) => {
                      const isMe = msg.sender === "me";
                      const showAvatar = !isMe && (i === 0 || currentMessages[i - 1].sender !== "them");
                      return (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.18 }}
                          className={`flex items-end gap-2.5 ${isMe ? "justify-end" : "justify-start"}`}
                        >
                          {!isMe && (
                            <div className={`h-8 w-8 rounded-xl bg-linear-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white font-black text-sm shadow-sm shrink-0 ${showAvatar ? "opacity-100" : "opacity-0"}`}>
                              {currentConversation?.name.charAt(0)}
                            </div>
                          )}
                          <div className={`max-w-[68%] flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                            <div className={`px-4 py-2.5 rounded-2xl text-[15px] leading-relaxed ${
                              isMe
                                ? "bg-linear-to-br from-[#0a9396] to-teal-500 text-white rounded-br-md shadow-md shadow-teal-500/20"
                                : "bg-white text-gray-900 rounded-bl-md shadow-sm border border-gray-100/80"
                            }`}>
                              {msg.text}
                            </div>
                            <div className={`flex items-center gap-1 mt-1 px-1 ${isMe ? "flex-row-reverse" : ""}`}>
                              <span className="text-[11px] text-gray-400 font-medium">{msg.time}</span>
                              {isMe && (
                                <span className="text-gray-400">
                                  {msg.read
                                    ? <span className="flex"><Check className="h-3 w-3 text-[#0a9396]" /><Check className="h-3 w-3 text-[#0a9396] -ml-1.5" /></span>
                                    : <Check className="h-3 w-3" />
                                  }
                                </span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                    <div ref={chatEndRef} />
                  </>
                )}
              </div>

              {/* Input */}
              <div className="p-5 lg:p-6 bg-white/60 backdrop-blur-xl border-t border-gray-100/80">
                <div className="flex items-center bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 rounded-2xl p-1.5 pr-2 focus-within:ring-4 focus-within:ring-[#0a9396]/10 focus-within:border-[#0a9396]/30 transition-all">
                  <input
                    ref={inputRef}
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent border-none px-4 py-3 outline-none text-[15px] text-gray-900 placeholder-gray-400"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!message.trim()}
                    className="h-11 w-11 shrink-0 rounded-xl bg-linear-to-br from-[#0a9396] to-teal-500 hover:from-teal-500 hover:to-[#0a9396] shadow-md shadow-teal-500/30 flex items-center justify-center cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:from-[#0a9396] disabled:hover:to-teal-500"
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
              <div className="text-center relative z-10 max-w-sm px-4">
                <div className="h-20 w-20 rounded-full bg-white/60 backdrop-blur-sm border border-white flex items-center justify-center mx-auto mb-5 shadow-sm">
                  <MessageSquare className="h-9 w-9 text-gray-300" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-2">No conversation selected</h3>
                <p className="text-gray-500 font-bold tracking-wide text-sm">Choose a conversation from the list to start messaging, or use the call buttons above to schedule or start a call.</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
