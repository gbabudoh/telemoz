"use client";

import { useState, useEffect } from "react";
import {
  LiveKitRoom,
  VideoConference,
  Chat,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Loader2, Video, Phone, MessageSquare, X } from "lucide-react";

interface LiveKitChatProps {
  room: string;
  onClose?: () => void;
  mode?: "video" | "audio" | "chat";
}

export default function LiveKitChat({ room, onClose, mode = "chat" }: LiveKitChatProps) {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentMode, setCurrentMode] = useState(mode);

  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch(`/api/messaging/livekit/token?room=${room}`);
        const data = await resp.json();
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

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-gray-50/50 backdrop-blur-md rounded-3xl border border-white/40">
        <div className="p-4 bg-red-50 text-red-500 rounded-full mb-4">
          <X className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-black text-gray-900 mb-2">Communication Error</h3>
        <p className="text-gray-500 font-medium mb-6">{error}</p>
        <button onClick={() => window.location.reload()} className="px-6 py-2 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all">Retry</button>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-50/50 backdrop-blur-md rounded-3xl">
        <Loader2 className="h-10 w-10 animate-spin text-[#0a9396] mb-4" />
        <p className="text-xs font-black uppercase tracking-widest text-gray-400">Securing Communication Room...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-900 overflow-hidden relative">
      <LiveKitRoom
        video={currentMode === "video"}
        audio={currentMode !== "chat"}
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        data-lk-theme="default"
        style={{ height: "100%" }}
        onDisconnected={() => onClose?.()}
      >
        <div className="flex flex-col h-full relative">
          {/* Header Controls */}
          <div className="absolute top-4 left-4 right-4 z-50 flex items-center justify-between pointer-events-none">
            <div className="flex gap-2 pointer-events-auto">
               <button 
                onClick={() => setCurrentMode("chat")}
                className={`p-3 rounded-2xl transition-all ${currentMode === "chat" ? "bg-[#0a9396] text-white shadow-lg" : "bg-black/40 text-gray-400 hover:text-white backdrop-blur-md"}`}
               >
                 <MessageSquare className="h-5 w-5" />
               </button>
               <button 
                onClick={() => setCurrentMode("audio")}
                className={`p-3 rounded-2xl transition-all ${currentMode === "audio" ? "bg-[#0a9396] text-white shadow-lg" : "bg-black/40 text-gray-400 hover:text-white backdrop-blur-md"}`}
               >
                 <Phone className="h-5 w-5" />
               </button>
               <button 
                onClick={() => setCurrentMode("video")}
                className={`p-3 rounded-2xl transition-all ${currentMode === "video" ? "bg-[#0a9396] text-white shadow-lg" : "bg-black/40 text-gray-400 hover:text-white backdrop-blur-md"}`}
               >
                 <Video className="h-5 w-5" />
               </button>
            </div>
            {onClose && (
              <button onClick={onClose} className="p-3 bg-red-500/80 hover:bg-red-500 text-white rounded-2xl transition-all backdrop-blur-md pointer-events-auto shadow-lg">
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          <div className="flex-1 flex min-h-0">
            {currentMode !== "chat" ? (
               <div className="flex-1 relative">
                  <VideoConference />
               </div>
            ) : (
              <div className="flex-1 flex flex-col bg-white">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                   <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Encrypted Chat</h3>
                </div>
                <div className="flex-1 overflow-hidden">
                   <Chat />
                </div>
              </div>
            )}
          </div>
        </div>
      </LiveKitRoom>
    </div>
  );
}
