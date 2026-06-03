"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Video, PhoneOff, User } from "lucide-react";

interface IncomingCallRequest {
  id: string;
  callType: "video" | "audio";
  roomName: string;
  from: {
    id: string;
    name: string;
    image: string | null;
  };
}

interface IncomingCallModalProps {
  onAccept: (callRequest: IncomingCallRequest) => void;
  onDecline: (callRequestId: string) => void;
}

export default function IncomingCallModal({ onAccept, onDecline }: IncomingCallModalProps) {
  const [incoming, setIncoming] = useState<IncomingCallRequest | null>(null);
  const [ringing, setRinging] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const poll = async () => {
      try {
        const res = await fetch("/api/messaging/call-request");
        const data = await res.json();
        if (data.callRequest) {
          setIncoming(data.callRequest);
          setRinging(true);
          // Auto-miss after 30s
          timeout = setTimeout(() => {
            setIncoming(null);
            setRinging(false);
          }, 30_000);
        } else {
          setIncoming(null);
          setRinging(false);
        }
      } catch {
        // silent
      }
    };

    poll();
    const interval = setInterval(poll, 2500);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const handleAccept = async () => {
    if (!incoming) return;
    await fetch(`/api/messaging/call-request/${incoming.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "accepted" }),
    });
    const accepted = incoming;
    setIncoming(null);
    setRinging(false);
    onAccept(accepted);
  };

  const handleDecline = async () => {
    if (!incoming) return;
    const id = incoming.id;
    await fetch(`/api/messaging/call-request/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "declined" }),
    });
    setIncoming(null);
    setRinging(false);
    onDecline(id);
  };

  return (
    <AnimatePresence>
      {ringing && incoming && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-6 right-6 z-50 w-80 bg-[#1a1a1c] border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Pulsing ring animation */}
          <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
            <motion.div
              animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className={`absolute inset-0 ${
                incoming.callType === "video" ? "bg-[#0a9396]" : "bg-emerald-500"
              }`}
            />
          </div>

          <div className="relative p-5">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
              <div
                className={`h-2 w-2 rounded-full animate-pulse ${
                  incoming.callType === "video" ? "bg-[#0a9396]" : "bg-emerald-500"
                }`}
              />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Incoming {incoming.callType === "video" ? "Video" : "Voice"} Call
              </span>
            </div>

            {/* Caller info */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center overflow-hidden border border-white/10">
                  {incoming.from.image ? (
                    <img
                      src={incoming.from.image}
                      alt={incoming.from.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-7 w-7 text-gray-500" />
                  )}
                </div>
                <motion.div
                  animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className={`absolute -inset-1 rounded-2xl border-2 ${
                    incoming.callType === "video" ? "border-[#0a9396]" : "border-emerald-500"
                  }`}
                />
              </div>
              <div>
                <p className="text-base font-black text-white">{incoming.from.name}</p>
                <p className="text-xs text-gray-500">
                  {incoming.callType === "video" ? "Video calling..." : "Voice calling..."}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleDecline}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-sm transition-all border border-red-500/20"
              >
                <PhoneOff className="h-4 w-4" />
                Decline
              </button>
              <button
                onClick={handleAccept}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm text-white transition-all shadow-lg ${
                  incoming.callType === "video"
                    ? "bg-[#0a9396] hover:bg-[#087579] shadow-[#0a9396]/20"
                    : "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20"
                }`}
              >
                {incoming.callType === "video" ? (
                  <Video className="h-4 w-4" />
                ) : (
                  <Phone className="h-4 w-4" />
                )}
                Accept
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
