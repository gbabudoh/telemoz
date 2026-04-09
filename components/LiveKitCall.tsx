"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  Room,
  RoomEvent,
  Track,
  ConnectionState,
  type RemoteParticipant,
  type RemoteTrackPublication,
  type RemoteTrack,
} from "livekit-client";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  MonitorOff,
  Loader2,
  AlertCircle,
  Users,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LiveKitCallProps {
  roomName: string;
  participantName: string;
  callType: "video" | "audio";
  contactName: string;
  onEnd: () => void;
}

type CallStatus = "connecting" | "connected" | "error";

export default function LiveKitCall({
  roomName,
  participantName,
  callType,
  contactName,
  onEnd,
}: LiveKitCallProps) {
  const roomRef = useRef<Room | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const remoteAudioEls = useRef<HTMLAudioElement[]>([]);

  const [status, setStatus] = useState<CallStatus>("connecting");
  const [error, setError] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [remoteParticipants, setRemoteParticipants] = useState(0);
  const [duration, setDuration] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cleanup = useCallback(() => {
    // Stop timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    // Remove injected audio elements
    remoteAudioEls.current.forEach((el) => {
      el.srcObject = null;
      el.remove();
    });
    remoteAudioEls.current = [];
    // Disconnect room
    if (roomRef.current) {
      roomRef.current.disconnect();
      roomRef.current = null;
    }
  }, []);

  const attachRemoteTrack = useCallback((track: RemoteTrack) => {
    if (track.kind === Track.Kind.Video) {
      if (remoteVideoRef.current) {
        track.attach(remoteVideoRef.current);
      }
    } else if (track.kind === Track.Kind.Audio) {
      const audioEl = document.createElement("audio");
      audioEl.autoplay = true;
      document.body.appendChild(audioEl);
      track.attach(audioEl);
      remoteAudioEls.current.push(audioEl);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const connect = async () => {
      try {
        // Fetch token from our API
        const res = await fetch("/api/livekit/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roomName, participantName }),
        });

        if (!res.ok) throw new Error("Failed to get call token");
        const { token } = await res.json();
        if (cancelled) return;

        const livekitUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;
        if (!livekitUrl) throw new Error("LiveKit URL not configured");

        const room = new Room({
          adaptiveStream: true,
          dynacast: true,
        });
        roomRef.current = room;

        // Remote track subscribed
        room.on(
          RoomEvent.TrackSubscribed,
          (track: RemoteTrack, _pub: RemoteTrackPublication, _participant: RemoteParticipant) => {
            attachRemoteTrack(track);
          }
        );

        // Remote track unsubscribed
        room.on(RoomEvent.TrackUnsubscribed, (track: RemoteTrack) => {
          track.detach();
        });

        // Participant count changes
        room.on(RoomEvent.ParticipantConnected, () => {
          setRemoteParticipants(room.remoteParticipants.size);
        });
        room.on(RoomEvent.ParticipantDisconnected, () => {
          setRemoteParticipants(room.remoteParticipants.size);
        });

        // Connection state
        room.on(RoomEvent.ConnectionStateChanged, (state: ConnectionState) => {
          if (state === ConnectionState.Connected) {
            setStatus("connected");
            // Start timer
            timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
          } else if (state === ConnectionState.Disconnected) {
            cleanup();
            onEnd();
          }
        });

        // Connect
        await room.connect(livekitUrl, token);
        if (cancelled) { room.disconnect(); return; }

        // Enable local tracks
        if (callType === "video") {
          await room.localParticipant.enableCameraAndMicrophone();
          // Attach local camera to video element
          const camPub = room.localParticipant.getTrackPublication(Track.Source.Camera);
          if (camPub?.track && localVideoRef.current) {
            camPub.track.attach(localVideoRef.current);
          }
        } else {
          await room.localParticipant.setMicrophoneEnabled(true);
        }

        // Attach any already-subscribed remote tracks (in case we joined late)
        room.remoteParticipants.forEach((participant) => {
          participant.trackPublications.forEach((pub) => {
            if (pub.track && pub.isSubscribed) {
              attachRemoteTrack(pub.track as RemoteTrack);
            }
          });
        });
        setRemoteParticipants(room.remoteParticipants.size);

      } catch (err) {
        if (cancelled) return;
        const msg = err instanceof Error ? err.message : "Could not start call";
        setError(msg);
        setStatus("error");
      }
    };

    connect();

    return () => {
      cancelled = true;
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomName, participantName, callType]);

  const toggleMute = async () => {
    const room = roomRef.current;
    if (!room) return;
    const next = !isMuted;
    await room.localParticipant.setMicrophoneEnabled(!next);
    setIsMuted(next);
  };

  const toggleCamera = async () => {
    const room = roomRef.current;
    if (!room) return;
    const next = !isCameraOff;
    await room.localParticipant.setCameraEnabled(!next);
    // Re-attach local video if turning back on
    if (!next) {
      setTimeout(() => {
        const camPub = room.localParticipant.getTrackPublication(Track.Source.Camera);
        if (camPub?.track && localVideoRef.current) {
          camPub.track.attach(localVideoRef.current);
        }
      }, 200);
    }
    setIsCameraOff(next);
  };

  const handleEnd = useCallback(() => {
    cleanup();
    onEnd();
  }, [cleanup, onEnd]);

  const fmt = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 bg-gray-950/97 backdrop-blur-sm flex flex-col items-center justify-center"
    >
      {/* Error */}
      <AnimatePresence>
        {status === "error" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-6 left-1/2 -translate-x-1/2 flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-sm max-w-sm"
          >
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium mb-1">Call failed</p>
              <p className="text-red-400/80 text-xs">{error}</p>
            </div>
            <button onClick={handleEnd} className="ml-2 text-red-400 hover:text-red-200 cursor-pointer shrink-0">
              <PhoneOff className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timer + participant count */}
      {status === "connected" && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 flex items-center gap-4 text-white/50 text-sm font-mono">
          <span>{fmt(duration)}</span>
          {remoteParticipants > 0 && (
            <span className="flex items-center gap-1.5 text-[#6ece39]">
              <Users className="h-3.5 w-3.5" />
              {remoteParticipants} connected
            </span>
          )}
          {remoteParticipants === 0 && (
            <span className="text-amber-400/70 text-xs">Waiting for other participant...</span>
          )}
        </div>
      )}

      {/* Connecting indicator */}
      {status === "connecting" && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 flex items-center gap-2 text-white/50 text-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          Connecting...
        </div>
      )}

      {/* Video / Avatar area */}
      <div className="relative w-full max-w-3xl aspect-video rounded-2xl overflow-hidden bg-gray-900 mb-6 mx-4">

        {/* Remote video (full size) */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />

        {/* Remote placeholder when no one connected yet */}
        {remoteParticipants === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gray-900">
            <div className="relative">
              <div className="absolute inset-0 bg-[#0a9396]/30 rounded-full blur-xl animate-pulse" />
              <div className="relative h-24 w-24 rounded-full bg-linear-to-br from-[#0a9396] to-[#6ece39] flex items-center justify-center text-4xl font-bold text-white z-10">
                {contactName.charAt(0)}
              </div>
            </div>
            <p className="text-white/50 text-sm">{contactName}</p>
          </div>
        )}

        {/* Audio-only self indicator */}
        {callType === "audio" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gray-900">
            <div className="h-20 w-20 rounded-full bg-linear-to-br from-[#0a9396] to-[#6ece39] flex items-center justify-center text-3xl font-bold text-white">
              {participantName.charAt(0)}
            </div>
            <p className="text-white/60 text-sm">
              {isMuted ? "Muted" : "Speaking..."}
            </p>
          </div>
        )}

        {/* Local video PiP (video mode) */}
        {callType === "video" && (
          <div className="absolute bottom-3 right-3 w-32 aspect-video rounded-xl overflow-hidden border border-white/20 shadow-lg bg-gray-800">
            {isCameraOff ? (
              <div className="w-full h-full flex items-center justify-center">
                <MonitorOff className="h-5 w-5 text-white/30" />
              </div>
            ) : (
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover scale-x-[-1]"
              />
            )}
          </div>
        )}

        {/* Contact name tag */}
        <div className="absolute bottom-3 left-3 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-lg text-white text-xs font-medium">
          {contactName}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleMute}
          className={`h-14 w-14 rounded-full flex items-center justify-center transition-all cursor-pointer border ${
            isMuted
              ? "bg-red-500/20 border-red-500/40 text-red-400"
              : "bg-white/10 border-white/20 text-white hover:bg-white/20"
          }`}
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </button>

        {callType === "video" && (
          <button
            onClick={toggleCamera}
            className={`h-14 w-14 rounded-full flex items-center justify-center transition-all cursor-pointer border ${
              isCameraOff
                ? "bg-red-500/20 border-red-500/40 text-red-400"
                : "bg-white/10 border-white/20 text-white hover:bg-white/20"
            }`}
            title={isCameraOff ? "Turn camera on" : "Turn camera off"}
          >
            {isCameraOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
          </button>
        )}

        <button
          onClick={handleEnd}
          className="h-16 w-16 rounded-full bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30 text-white flex items-center justify-center transition-all cursor-pointer"
          title="End call"
        >
          <PhoneOff className="h-6 w-6" />
        </button>
      </div>

      <p className="mt-4 text-white/25 text-xs">
        {isMuted ? "Microphone off" : "Microphone on"}
        {callType === "video" && ` · ${isCameraOff ? "Camera off" : "Camera on"}`}
      </p>
    </motion.div>
  );
}
