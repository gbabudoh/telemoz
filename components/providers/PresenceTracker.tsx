"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

export function PresenceTracker() {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.user?.id) return;

    // Send heartbeat immediately on load/auth
    const sendHeartbeat = () => {
      fetch("/api/user/heartbeat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }).catch((err) => {
        console.error("Failed to send heartbeat:", err);
      });
    };

    sendHeartbeat();

    // Send heartbeat every 60 seconds
    const interval = setInterval(sendHeartbeat, 60000);

    return () => {
      clearInterval(interval);
    };
  }, [session?.user?.id]);

  return null;
}
