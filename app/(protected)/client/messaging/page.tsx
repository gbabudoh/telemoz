"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import {
  MessageSquare,
  Search,
  Video,
  Phone,
  Shield,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MessageThread from "@/components/communication/MessageThread";
import IncomingCallModal from "@/components/communication/IncomingCallModal";
import CallView from "@/components/communication/CallView";
import { Input } from "@/components/ui/Input";
import { format, isToday, isYesterday } from "date-fns";

interface Conversation {
  id: string;
  proId: string;
  proName: string;
  projectName: string;
  lastMessage: { text: string; senderId: string; createdAt: string } | null;
  unreadCount: number;
  time: string;
  isOnline?: boolean;
}

interface ActiveCall {
  callRequestId: string;
  roomName: string;
  callType: "video" | "audio";
}

function lastMessagePreview(conv: Conversation, myId: string) {
  if (!conv.lastMessage) return "No messages yet";
  const isMine = conv.lastMessage.senderId === myId;
  const prefix = isMine ? "You: " : "";
  const text = conv.lastMessage.text;
  return prefix + (text.length > 40 ? text.slice(0, 40) + "…" : text);
}

function lastMessageTime(conv: Conversation) {
  if (!conv.lastMessage) return conv.time;
  const d = new Date(conv.lastMessage.createdAt);
  if (isToday(d)) return format(d, "h:mm a");
  if (isYesterday(d)) return "Yesterday";
  return format(d, "MMM d");
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function ClientMessagingPage() {
  const { data: session } = useSession();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCall, setActiveCall] = useState<ActiveCall | null>(null);
  const [callingState, setCallingState] = useState<"idle" | "calling">("idle");

  const myId = session?.user?.id ?? "";

  const fetchConversations = useCallback(async () => {
    if (!session?.user || session.user.userType !== "client") return;
    try {
      const res = await fetch("/api/client/inquiries");
      const data = await res.json();
      if (data.inquiries) {
        const mapped: Conversation[] = data.inquiries.map(
          (item: {
            id: string;
            proId: string;
            proName: string;
            project: string;
            lastMessage: Conversation["lastMessage"];
            unreadCount: number;
            time: string;
            isOnline?: boolean;
          }) => ({
            id: item.id,
            proId: item.proId,
            proName: item.proName || "Professional",
            projectName: item.project,
            lastMessage: item.lastMessage ?? null,
            unreadCount: item.unreadCount ?? 0,
            time: item.time,
            isOnline: item.isOnline,
          })
        );
        setConversations(mapped);
        if (selected) {
          const fresh = mapped.find((c) => c.id === selected.id);
          if (fresh) setSelected(fresh);
        }
      }
    } catch (error) {
      console.error("Failed to fetch conversations", error);
    } finally {
      setIsLoading(false);
    }
  }, [session, selected]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    const interval = setInterval(fetchConversations, 5000);
    return () => clearInterval(interval);
  }, [fetchConversations]);

  const filteredConversations = conversations.filter(
    (c) =>
      c.proName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.projectName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const initiateCall = async (type: "video" | "audio") => {
    if (!selected) return;
    setCallingState("calling");
    try {
      const res = await fetch("/api/messaging/call-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toId: selected.proId,
          inquiryId: selected.id,
          callType: type,
        }),
      });
      const data = await res.json();
      if (data.callRequest) {
        const callRequestId = data.callRequest.id;
        const roomName = data.callRequest.roomName;
        let elapsed = 0;
        const poll = setInterval(async () => {
          elapsed += 2000;
          const check = await fetch(`/api/messaging/call-request/${callRequestId}`);
          const result = await check.json();
          const status = result.callRequest?.status;
          if (status === "accepted") {
            clearInterval(poll);
            setCallingState("idle");
            setActiveCall({ callRequestId, roomName, callType: type });
          } else if (["declined", "missed", "ended"].includes(status) || elapsed >= 32000) {
            clearInterval(poll);
            setCallingState("idle");
          }
        }, 2000);
      } else {
        setCallingState("idle");
      }
    } catch {
      setCallingState("idle");
    }
  };

  const handleIncomingAccept = (callRequest: { id: string; roomName: string; callType: "video" | "audio" }) => {
    setActiveCall({
      callRequestId: callRequest.id,
      roomName: callRequest.roomName,
      callType: callRequest.callType,
    });
  };

  const handleCallEnd = () => {
    setActiveCall(null);
  };

  return (
    <div className="flex h-full overflow-hidden bg-[#0A0A0B]">
      {/* Incoming call modal */}
      <IncomingCallModal onAccept={handleIncomingAccept} onDecline={() => {}} />

      {/* Sidebar */}
      <div className="w-[300px] border-r border-white/5 bg-[#111113] flex flex-col shrink-0">
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-base font-bold text-white">Messages</h1>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-semibold text-gray-500">Online</span>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 bg-white/5 border-white/5 rounded-lg text-white text-xs focus:border-[#0a9396]/40 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-32 gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-[#0a9396]" />
              <p className="text-xs text-gray-600">Loading...</p>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 gap-3 p-6 text-center">
              <MessageSquare className="h-8 w-8 text-white/10" />
              <p className="text-xs font-semibold text-gray-600">No conversations</p>
              <p className="text-[10px] text-gray-700">Your conversations with professionals appear here</p>
            </div>
          ) : (
            <div className="p-2 space-y-0.5">
              {filteredConversations.map((conv) => {
                const isActive = selected?.id === conv.id;
                return (
                  <button
                    key={conv.id}
                    onClick={() => setSelected(conv)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all border ${
                      isActive
                        ? "bg-[#0a9396]/10 border-[#0a9396]/20"
                        : "hover:bg-white/5 border-transparent"
                    }`}
                  >
                    <div className="relative shrink-0">
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center text-xs font-black ${
                          isActive ? "bg-[#0a9396] text-white" : "bg-white/8 text-gray-400"
                        }`}
                      >
                        {getInitials(conv.proName)}
                      </div>
                      {conv.isOnline && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-[#111113]" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span
                          className={`text-sm font-semibold truncate ${
                            isActive ? "text-white" : "text-gray-200"
                          }`}
                        >
                          {conv.proName}
                        </span>
                        <span className="text-[10px] text-gray-600 shrink-0 ml-2">
                          {lastMessageTime(conv)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs text-gray-600 truncate flex-1">
                          {lastMessagePreview(conv, myId)}
                        </p>
                        {conv.unreadCount > 0 && (
                          <span className="shrink-0 h-4 min-w-4 px-1 rounded-full bg-[#0a9396] text-white text-[9px] font-black flex items-center justify-center">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-700 truncate mt-0.5">{conv.projectName}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-3 border-t border-white/5">
          <div className="flex items-center gap-2">
            <Shield className="h-3.5 w-3.5 text-emerald-500" />
            <span className="text-[10px] font-semibold text-gray-600">End-to-end encrypted</span>
          </div>
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AnimatePresence mode="wait">
          {activeCall ? (
            <motion.div
              key="call"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col h-full"
            >
              <CallView
                room={activeCall.roomName}
                callType={activeCall.callType}
                callRequestId={activeCall.callRequestId}
                onEnd={handleCallEnd}
              />
            </motion.div>
          ) : selected ? (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col h-full min-h-0"
            >
              {/* Chat header */}
              <div className="h-14 border-b border-white/5 bg-[#111113] flex items-center justify-between px-5 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="h-8 w-8 rounded-full bg-[#0a9396]/20 flex items-center justify-center">
                      <span className="text-[10px] font-black text-[#0a9396]">
                        {getInitials(selected.proName)}
                      </span>
                    </div>
                    {selected.isOnline && (
                      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border border-[#111113]" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white flex items-center gap-1.5">
                      {selected.proName}
                      <span className={`h-1.5 w-1.5 rounded-full ${selected.isOnline ? "bg-emerald-500 animate-pulse" : "bg-gray-600"}`} />
                    </p>
                    <p className="text-[10px] text-gray-500">{selected.projectName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {callingState === "calling" ? (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0a9396]/10 border border-[#0a9396]/20">
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-[#0a9396]" />
                      <span className="text-xs font-semibold text-[#0a9396]">Calling...</span>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => initiateCall("audio")}
                        title="Voice Call"
                        className="h-8 w-8 rounded-lg bg-white/5 hover:bg-emerald-500/10 hover:text-emerald-400 text-gray-400 flex items-center justify-center transition-all border border-white/5 hover:border-emerald-500/20"
                      >
                        <Phone className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => initiateCall("video")}
                        title="Video Call"
                        className="h-8 w-8 rounded-lg bg-white/5 hover:bg-[#0a9396]/10 hover:text-[#0a9396] text-gray-400 flex items-center justify-center transition-all border border-white/5 hover:border-[#0a9396]/20"
                      >
                        <Video className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="flex-1 min-h-0 overflow-hidden">
                <MessageThread
                  inquiryId={selected.id}
                  otherUserId={selected.proId}
                  onVideoCall={() => initiateCall("video")}
                  onVoiceCall={() => initiateCall("audio")}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center text-center p-12"
            >
              <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
                <MessageSquare className="h-8 w-8 text-gray-600" />
              </div>
              <h2 className="text-lg font-bold text-white mb-2">Your messages</h2>
              <p className="text-sm text-gray-500 max-w-xs">
                Select a conversation to view messages or connect with your professional via voice or video
              </p>
              <div className="mt-10 grid grid-cols-3 gap-4 max-w-sm w-full">
                {[
                  { icon: MessageSquare, label: "Text Chat" },
                  { icon: Phone, label: "Voice Call" },
                  { icon: Video, label: "Video Call" },
                ].map((f) => (
                  <div
                    key={f.label}
                    className="p-4 bg-white/3 border border-white/5 rounded-2xl flex flex-col items-center gap-2"
                  >
                    <f.icon className="h-5 w-5 text-[#0a9396]" />
                    <p className="text-[10px] font-semibold text-gray-500">{f.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .bg-white\/8 { background-color: rgba(255,255,255,0.08); }
        .bg-white\/3 { background-color: rgba(255,255,255,0.03); }
      `}</style>
    </div>
  );
}
