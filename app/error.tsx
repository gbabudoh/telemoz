"use client";

import { motion } from "framer-motion";
import { AlertTriangle, RefreshCcw, Home, LifeBuoy } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 relative overflow-hidden px-6">
      {/* Ambient orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-red-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-orange-500/5 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-2xl relative z-10"
      >
        <div className="mb-8 inline-flex items-center justify-center h-24 w-24 rounded-3xl bg-white/40 backdrop-blur-xl border border-white/60 shadow-xl">
          <AlertTriangle className="h-10 w-10 text-red-500" />
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Something went wrong</h1>
        <p className="text-gray-500 text-lg mb-10 max-w-sm mx-auto leading-relaxed">
          We encountered an unexpected error while rendering this page. Our team has been notified.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-gray-900/20 transition-all hover:-translate-y-1"
          >
            <RefreshCcw className="h-5 w-5" />
            Try Again
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 px-8 py-4 rounded-2xl font-bold shadow-sm hover:shadow-md hover:bg-gray-50 transition-all"
          >
            <Home className="h-5 w-5" />
            Go to Home
          </Link>
        </div>

        <div className="mt-12 flex items-center justify-center gap-6">
          <Link href="/support" className="text-sm font-medium text-gray-400 hover:text-[#0a9396] inline-flex items-center gap-2 transition-colors">
            <LifeBuoy className="h-4 w-4" />
            Support Center
          </Link>
          <div className="h-4 w-px bg-gray-200" />
          <span className="text-sm font-medium text-gray-300 font-mono">
            ID: {error.digest || 'unknown-error'}
          </span>
        </div>
      </motion.div>
    </div>
  );
}
