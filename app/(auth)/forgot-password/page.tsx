"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "A password reset link has been sent to your email.");
      } else {
        setError(data.error || "Failed to submit request.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 px-6 py-20 relative overflow-hidden">
      {/* Ambient orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#0a9396]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#6ece39]/8 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <Card className="p-8 bg-white/5 backdrop-blur-xl border-white/5 shadow-2xl rounded-3xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Reset Password</h1>
            <p className="text-gray-400 text-sm leading-relaxed">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {message ? (
            <div className="text-center py-6">
              <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              </div>
              <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                {message}
              </p>
              <Link
                href="/login"
                className="inline-block px-6 py-2.5 rounded-xl bg-[#0a9396] text-white text-sm font-semibold hover:bg-[#0a9396]/95 transition-all shadow-md"
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

              <Input
                type="email"
                label="Email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/5 border-white/5 text-white placeholder-gray-500 rounded-xl"
              />

              <Button type="submit" className="w-full bg-[#0a9396] hover:bg-[#0a9396]/90 rounded-xl font-bold" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending link...
                  </span>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-gray-400 border-t border-white/5 pt-4">
            Remember your password?{" "}
            <Link href="/login" className="text-[#0a9396] hover:text-[#0a9396]/80 font-bold">
              Sign in
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
