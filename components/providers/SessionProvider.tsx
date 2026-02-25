"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  // Disabling refetchOnWindowFocus prevents Next.js compiler HTML overlays from
  // crashing NextAuth JSON parsing in development mode when tabbing back to the browser.
  return <NextAuthSessionProvider refetchOnWindowFocus={false}>{children}</NextAuthSessionProvider>;
}

