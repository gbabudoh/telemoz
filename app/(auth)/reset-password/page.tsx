"use client";

import { useEffect, useState, FormEvent, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!token || !email) {
      setError("Missing reset token or email. Please request a new link.");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email, newPassword: password }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
      } else {
        setError(data.error || "Password reset failed.");
      }
    } catch (err) {
      console.error(err);
      setError("A connection error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-8 w-full max-w-md bg-white/5 backdrop-blur-xl border-white/5 shadow-2xl rounded-3xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">New Password</h1>
        <p className="text-gray-400 text-sm">
          Please enter and confirm your new password below.
        </p>
      </div>

      {success ? (
        <div className="text-center py-6">
          <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Password Updated</h2>
          <p className="text-gray-300 text-sm mb-6 leading-relaxed">
            Your password has been reset successfully. You can now log in with your new password.
          </p>
          <Link
            href="/login"
            className="inline-block px-6 py-2.5 rounded-xl bg-[#0a9396] text-white text-sm font-semibold hover:bg-[#0a9396]/95 transition-all shadow-md animate-pulse"
          >
            Go to Sign In
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-xs bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
              {error}
            </div>
          )}

          {!token || !email ? (
            <div className="p-3 text-xs bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-center">
              Invalid or missing parameters in link.
            </div>
          ) : (
            <>
              <Input
                type="password"
                label="New Password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white/5 border-white/5 text-white placeholder-gray-500 rounded-xl"
              />

              <Input
                type="password"
                label="Confirm New Password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-white/5 border-white/5 text-white placeholder-gray-500 rounded-xl"
              />

              <Button
                type="submit"
                className="w-full bg-[#0a9396] hover:bg-[#0a9396]/90 rounded-xl font-bold mt-2"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Resetting...
                  </span>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </>
          )}
        </form>
      )}

      <div className="mt-6 text-center text-sm text-gray-400 border-t border-white/5 pt-4">
        Back to{" "}
        <Link href="/login" className="text-[#0a9396] hover:text-[#0a9396]/80 font-bold">
          Sign In
        </Link>
      </div>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 px-6 py-20 relative overflow-hidden">
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
            <Card className="p-8 w-full max-w-md bg-white/5 backdrop-blur-xl border-white/5 shadow-2xl rounded-3xl text-center">
              <Loader2 className="h-8 w-8 text-[#0a9396] animate-spin mx-auto mb-4" />
              <p className="text-gray-400 text-sm">Loading page parameters...</p>
            </Card>
          }
        >
          <ResetPasswordContent />
        </Suspense>
      </motion.div>
    </div>
  );
}
