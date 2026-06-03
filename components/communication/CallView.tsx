"use client";

import { useState, useEffect } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";
import { Loader2, PhoneOff } from "lucide-react";

interface CallViewProps {
  room: string;
  callType: "video" | "audio";
  callRequestId: string;
  onEnd: () => void;
}

export default function CallView({ room, callType, callRequestId, onEnd }: CallViewProps) {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/messaging/livekit/token?room=${room}`);
        const data = await res.json();
        if (data.token) {
          setToken(data.token);
        } else {
          setError(data.error || "Failed to get token");
        }
      } catch {
        setError("Connection failed");
      }
    })();
  }, [room]);

  const handleEnd = async () => {
    try {
      await fetch(`/api/messaging/call-request/${callRequestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ended" }),
      });
    } catch {
      // silent
    }
    onEnd();
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 bg-[#0A0A0B]">
        <p className="text-red-400 text-sm font-semibold">{error}</p>
        <button onClick={onEnd} className="px-4 py-2 bg-white/5 text-white rounded-xl text-sm font-bold hover:bg-white/10 transition-all">
          Close
        </button>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 bg-[#0A0A0B]">
        <Loader2 className="h-8 w-8 animate-spin text-[#0a9396]" />
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Connecting...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-black relative">
      <LiveKitRoom
        video={callType === "video"}
        audio={true}
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        data-lk-theme="default"
        style={{ height: "100%" }}
        onDisconnected={handleEnd}
      >
        <VideoConference />
      </LiveKitRoom>

      {/* End call overlay button */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50">
        <button
          onClick={handleEnd}
          className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold text-sm transition-all shadow-xl shadow-red-500/20"
        >
          <PhoneOff className="h-4 w-4" />
          End Call
        </button>
      </div>
    </div>
  );
}
