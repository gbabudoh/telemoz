"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/Card";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email address...");

  useEffect(() => {
    if (!token || !email) {
      setStatus("error");
      setMessage("Missing verification token or email. Please check your link.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, email }),
        });

        const data = await res.json();

        if (res.ok) {
          setStatus("success");
          setMessage(data.message || "Your email has been verified!");
        } else {
          setStatus("error");
          setMessage(data.error || "Email verification failed.");
        }
      } catch (err) {
        console.error("Verification fetch error:", err);
        setStatus("error");
        setMessage("A connection error occurred. Please try again.");
      }
    };

    verifyEmail();
  }, [token, email]);

  return (
    <Card className="p-8 w-full max-w-md bg-white/70 backdrop-blur-xl border border-white/60 shadow-xl rounded-3xl text-center">
      <div className="mb-6 flex justify-center">
        {status === "loading" && (
          <div className="h-16 w-16 rounded-full bg-[#0a9396]/10 flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-[#0a9396] animate-spin" />
          </div>
        )}
        {status === "success" && (
          <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
          </div>
        )}
        {status === "error" && (
          <div className="h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center">
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
        )}
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-3">
        {status === "loading" && "Verifying Email"}
        {status === "success" && "Verification Complete"}
        {status === "error" && "Verification Failed"}
      </h1>

      <p className="text-gray-600 mb-8 text-sm leading-relaxed">
        {message}
      </p>

      {status !== "loading" && (
        <Link
          href="/login"
          className="inline-block px-6 py-2.5 rounded-xl bg-[#0a9396] text-white text-sm font-semibold hover:bg-[#0a9396]/95 transition-all shadow-md"
        >
          Go to Sign In
        </Link>
      )}
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 relative overflow-hidden py-12 px-6">
      {/* Ambient orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#0a9396]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#6ece39]/8 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full flex justify-center z-10"
      >
        <Suspense
          fallback={
            <Card className="p-8 w-full max-w-md bg-white/70 backdrop-blur-xl border border-white/60 shadow-xl rounded-3xl text-center">
              <Loader2 className="h-8 w-8 text-[#0a9396] animate-spin mx-auto mb-4" />
              <p className="text-gray-500 text-sm">Loading page...</p>
            </Card>
          }
        >
          <VerifyEmailContent />
        </Suspense>
      </motion.div>
    </div>
  );
}
