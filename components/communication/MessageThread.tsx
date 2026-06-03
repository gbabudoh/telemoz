"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Send, Loader2, Phone, Video, PhoneMissed, PhoneCall } from "lucide-react";
import { format, isToday, isYesterday } from "date-fns";

interface Message {
  id: string;
  text: string;
  senderId: string;
  createdAt: string;
  read: boolean;
}

interface CallHistoryItem {
  id: string;
  callType: "video" | "audio";
  status: "accepted" | "declined" | "missed" | "ended" | "ringing";
  fromId: string;
  createdAt: string;
}

type ChatItem =
  | ({ kind: "message" } & Message)
  | ({ kind: "call" } & CallHistoryItem);

interface MessageThreadProps {
  inquiryId: string;
  otherUserId: string;
  onVideoCall: () => void;
  onVoiceCall: () => void;
  callerName?: string;
}

function formatMessageDate(dateStr: string) {
  const d = new Date(dateStr);
  if (isToday(d)) return format(d, "h:mm a");
  if (isYesterday(d)) return `Yesterday ${format(d, "h:mm a")}`;
  return format(d, "MMM d, h:mm a");
}

function dateSeparatorLabel(dateStr: string) {
  const d = new Date(dateStr);
  if (isToday(d)) return "Today";
  if (isYesterday(d)) return "Yesterday";
  return format(d, "MMMM d, yyyy");
}

function CallBubble({ item, myId }: { item: CallHistoryItem; myId: string }) {
  const isMine = item.fromId === myId;
  const Icon =
    item.status === "missed" || item.status === "declined"
      ? PhoneMissed
      : item.callType === "video"
      ? Video
      : PhoneCall;

  const label =
    item.status === "missed"
      ? isMine
        ? `Missed ${item.callType} call`
        : `Missed ${item.callType} call`
      : item.status === "declined"
      ? `${item.callType === "video" ? "Video" : "Voice"} call declined`
      : item.status === "ended" || item.status === "accepted"
      ? `${item.callType === "video" ? "Video" : "Voice"} call`
      : `${item.callType === "video" ? "Video" : "Voice"} call`;

  return (
    <div className="flex justify-center my-2">
      <div
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border ${
          item.status === "missed" || item.status === "declined"
            ? "bg-red-500/10 border-red-500/20 text-red-400"
            : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
        }`}
      >
        <Icon className="h-3.5 w-3.5" />
        <span>{label}</span>
        <span className="text-white/30">·</span>
        <span className="text-white/40">{formatMessageDate(item.createdAt)}</span>
      </div>
    </div>
  );
}

export default function MessageThread({
  inquiryId,
  otherUserId,
  onVideoCall,
  onVoiceCall,
}: MessageThreadProps) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [callHistory, setCallHistory] = useState<CallHistoryItem[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/messaging/messages?inquiryId=${inquiryId}`);
      const data = await res.json();
      if (data.messages) setMessages(data.messages);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [inquiryId]);

  const fetchCallHistory = useCallback(async () => {
    try {
      const res = await fetch(`/api/messaging/call-history?inquiryId=${inquiryId}`);
      const data = await res.json();
      if (data.calls) setCallHistory(data.calls);
    } catch {
      // silent
    }
  }, [inquiryId]);

  useEffect(() => {
    setLoading(true);
    fetchMessages();
    fetchCallHistory();
  }, [inquiryId, fetchMessages, fetchCallHistory]);

  // Poll every 3s for new messages
  useEffect(() => {
    const interval = setInterval(() => {
      fetchMessages();
      fetchCallHistory();
    }, 3000);
    return () => clearInterval(interval);
  }, [fetchMessages, fetchCallHistory]);

  // Scroll to bottom within the container only — never touch the outer frame
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, callHistory]);

  const handleSend = async () => {
    if (!text.trim() || sending || !session?.user?.id) return;
    const trimmed = text.trim();
    setText("");
    setSending(true);
    try {
      await fetch("/api/messaging/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed, inquiryId, receiverId: otherUserId }),
      });
      await fetchMessages();
    } catch {
      setText(trimmed);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const myId = session?.user?.id ?? "";

  // Merge messages and call history into chronological list
  const chatItems: ChatItem[] = [
    ...messages.map((m) => ({ kind: "message" as const, ...m })),
    ...callHistory.map((c) => ({ kind: "call" as const, ...c })),
  ].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  // Insert date separators
  const itemsWithSeparators: (ChatItem | { kind: "separator"; label: string; key: string })[] = [];
  let lastDate = "";
  for (const item of chatItems) {
    const dayLabel = dateSeparatorLabel(item.createdAt);
    if (dayLabel !== lastDate) {
      itemsWithSeparators.push({ kind: "separator", label: dayLabel, key: `sep-${item.createdAt}` });
      lastDate = dayLabel;
    }
    itemsWithSeparators.push(item);
  }

  return (
    <div className="flex flex-col h-full bg-[#0A0A0B]">
      {/* Action buttons bar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5 bg-[#121214] shrink-0">
        <button
          onClick={onVoiceCall}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-emerald-500/10 hover:text-emerald-400 text-gray-400 text-xs font-semibold transition-all border border-white/5 hover:border-emerald-500/20"
        >
          <Phone className="h-3.5 w-3.5" />
          Voice Call
        </button>
        <button
          onClick={onVideoCall}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#0a9396]/10 hover:text-[#0a9396] text-gray-400 text-xs font-semibold transition-all border border-white/5 hover:border-[#0a9396]/20"
        >
          <Video className="h-3.5 w-3.5" />
          Video Call
        </button>
      </div>

      {/* Messages — this div is the only thing that scrolls */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-6 w-6 animate-spin text-[#0a9396]" />
          </div>
        ) : chatItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
            <div className="h-14 w-14 rounded-full bg-white/5 flex items-center justify-center">
              <Send className="h-6 w-6 text-gray-600" />
            </div>
            <p className="text-sm font-semibold text-gray-500">No messages yet</p>
            <p className="text-xs text-gray-600">Send a message or start a call to connect</p>
          </div>
        ) : (
          itemsWithSeparators.map((item, idx) => {
            if (item.kind === "separator") {
              return (
                <div key={item.key} className="flex items-center gap-3 py-3">
                  <div className="flex-1 h-px bg-white/5" />
                  <span className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider">
                    {item.label}
                  </span>
                  <div className="flex-1 h-px bg-white/5" />
                </div>
              );
            }
            if (item.kind === "call") {
              return <CallBubble key={item.id} item={item} myId={myId} />;
            }
            const isMine = item.senderId === myId;
            return (
              <div key={item.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[72%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    isMine
                      ? "bg-[#0a9396] text-white rounded-br-sm"
                      : "bg-white/8 text-gray-100 rounded-bl-sm border border-white/5"
                  }`}
                >
                  <p>{item.text}</p>
                  <p className={`text-[10px] mt-1 ${isMine ? "text-white/50 text-right" : "text-gray-600"}`}>
                    {formatMessageDate(item.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input */}
      <div className="shrink-0 p-4 border-t border-white/5 bg-[#121214]">
        <div className="flex items-center gap-3">
          <input
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Type a message..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#0a9396]/50 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!text.trim() || sending}
            className="h-11 w-11 rounded-xl bg-[#0a9396] hover:bg-[#087579] text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
