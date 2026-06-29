"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { DashboardMockup } from "@/components/ui/DashboardMockup";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, FormEvent } from "react";
import {
  CheckCircle2,
  X,
  Loader2,
  Mail,
  Lock,
  BarChart3,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { signIn, getSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const benefits = [
  {
    icon: BarChart3,
    label: "Campaign analytics at a glance",
  },
  {
    icon: FileText,
    label: "AI-powered white-label reports ready",
  },
  {
    icon: ShieldCheck,
    label: "Client payments tracked and protected",
  },
];

export default function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [isSuccessDismissed, setIsSuccessDismissed] = useState(false);
  const showSuccess =
    searchParams.get("registered") === "true" && !isSuccessDismissed;

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setIsSuccessDismissed(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        if (result.error === "CredentialsSignin" || result.error.includes("Cannot read properties")) {
          setError("Invalid email or password. Please try again.");
        } else {
          setError(result.error);
        }
        setIsLoading(false);
        return;
      }

      if (result?.ok) {
        const session = await getSession();
        const userType = session?.user?.userType;

        if (userType === "pro") {
          router.push("/pro");
        } else if (userType === "client") {
          router.push("/client");
        } else if (userType === "admin") {
          router.push("/admin");
        } else {
          router.push("/pro");
        }
        router.refresh();
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 100 },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#0a9396]/5 via-white to-[#6ece39]/5 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#0a9396]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#6ece39]/8 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-6xl p-4 sm:p-6 lg:p-12 relative z-10">
        <div className="bg-white/75 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.07)] border border-white/60 overflow-hidden flex flex-col lg:flex-row min-h-[680px]">

          {/* ── Left panel: form ──────────────────────────────────── */}
          <div className="w-full lg:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center relative">
            <Link
              href="/"
              className="absolute top-8 left-8 md:top-10 md:left-12 lg:top-12 lg:left-16"
            >
              <Image
                src="/logos/logo.png"
                alt="Telemoz"
                width={120}
                height={40}
                quality={100}
                className="h-8 w-auto object-contain hover:opacity-80 transition-opacity"
              />
            </Link>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="w-full max-w-sm mx-auto mt-14 lg:mt-0"
            >
              {/* Heading */}
              <motion.div variants={itemVariants} className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
                  Welcome Back
                </h1>
                <p className="text-gray-500 font-medium">
                  Sign in to pick up where you left off.
                </p>
              </motion.div>

              {/* Success toast */}
              <AnimatePresence>
                {showSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -16, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -16, scale: 0.96 }}
                    className="mb-6 p-4 rounded-2xl bg-[#0a9396]/10 border border-[#0a9396]/20 flex items-start gap-3 shadow-sm"
                  >
                    <div className="mt-0.5 bg-white rounded-full p-1 shadow-sm shrink-0">
                      <CheckCircle2 className="h-4 w-4 text-[#0a9396]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 font-bold">Account created!</p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Sign in with your new credentials.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsSuccessDismissed(true)}
                      className="text-gray-400 hover:text-gray-600 transition-colors p-1 shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mb-5 p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3"
                  >
                    <X className="h-4 w-4 text-red-500 shrink-0" />
                    <p className="text-sm text-red-600 font-medium">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <motion.div variants={itemVariants} className="space-y-4">
                  {/* Email field */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-gray-900">
                      Email Address
                    </label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-[#0a9396] transition-colors z-10 pointer-events-none" />
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                        className="pl-11 h-12 bg-white/60 border-gray-200 focus:border-[#0a9396] focus:ring-[#0a9396]/20 text-base transition-all"
                      />
                    </div>
                  </div>

                  {/* Password field */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-gray-900">
                      Password
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-[#0a9396] transition-colors z-10 pointer-events-none" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        required
                        className="pl-11 h-12 bg-white/60 border-gray-200 focus:border-[#0a9396] focus:ring-[#0a9396]/20 text-base transition-all"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Remember me + forgot password */}
                <motion.div
                  variants={itemVariants}
                  className="flex items-center justify-between text-sm"
                >
                  <label className="flex items-center gap-2.5 text-gray-600 font-medium cursor-pointer select-none">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-md checked:bg-[#0a9396] checked:border-[#0a9396] transition-all cursor-pointer"
                      />
                      <svg
                        className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
                        viewBox="0 0 14 14"
                        fill="none"
                      >
                        <path
                          d="M3 8L6 11L11 3.5"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          stroke="currentColor"
                        />
                      </svg>
                    </div>
                    Remember me
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-[#0a9396] hover:text-[#005f73] font-semibold transition-colors"
                  >
                    Forgot password?
                  </Link>
                </motion.div>

                {/* Submit button */}
                <motion.div variants={itemVariants} className="pt-2">
                  <Button
                    type="submit"
                    className="w-full bg-[#0a9396] hover:bg-[#005f73] text-white shadow-lg shadow-[#0a9396]/20 hover:shadow-[#0a9396]/40 hover:-translate-y-0.5 transition-all duration-300 h-14 rounded-full text-base font-bold disabled:opacity-70 disabled:hover:translate-y-0"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-3">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Signing in...
                      </span>
                    ) : (
                      "Sign In to Telemoz"
                    )}
                  </Button>
                </motion.div>
              </form>

              {/* Divider */}
              <motion.div variants={itemVariants} className="relative flex items-center my-5">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink mx-4 text-gray-400 text-xs font-semibold uppercase tracking-wider">or</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </motion.div>

              {/* Google Sign In */}
              <motion.div variants={itemVariants}>
                <button
                  type="button"
                  onClick={() => signIn("google")}
                  className="w-full flex items-center justify-center gap-3 px-4 h-14 border border-gray-200 rounded-full text-gray-700 bg-white hover:bg-gray-50 active:bg-gray-100 transition-all font-semibold shadow-sm hover:shadow-md cursor-pointer duration-300"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.61 14.98 1 12 1 7.24 1 3.2 3.73 1.24 7.7l3.96 3.07C6.15 7.7 8.84 5.04 12 5.04z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.42 3.58l3.77 2.92c2.2-2.03 3.68-5.02 3.68-8.65z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.2 14.3C4.94 13.52 4.8 12.7 4.8 11.85c0-.85.14-1.67.4-2.45L1.24 7.7C.45 9.29 0 11.07 0 12.95c0 1.88.45 3.66 1.24 5.25l3.96-3.9z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c3.24 0 5.97-1.08 7.96-2.92l-3.77-2.92c-1.04.7-2.38 1.12-4.19 1.12-3.16 0-5.85-2.66-6.8-5.73L1.24 16.5C3.2 20.47 7.24 23 12 23z"
                    />
                  </svg>
                  Continue with Google
                </button>
              </motion.div>

              {/* Sign up link */}
              <motion.div
                variants={itemVariants}
                className="mt-8 text-center text-sm text-gray-500 font-medium"
              >
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="text-[#0a9396] hover:text-[#005f73] font-bold transition-colors"
                >
                  Sign up free
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* ── Right panel: returning-user context ───────────────── */}
          <div className="hidden lg:flex w-1/2 flex-col justify-between bg-linear-to-br from-[#0a9396] to-[#005f73] p-12 relative overflow-hidden">
            {/* Decorative blobs */}
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#6ece39]/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col h-full justify-between">
              {/* Top: heading + benefits */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.15, type: "spring" }}
              >
                <h2 className="text-3xl font-bold text-white mb-3 leading-tight">
                  Everything&apos;s Where You Left It
                </h2>
                <p className="text-white/75 text-base font-light mb-8 leading-relaxed">
                  Your campaigns, clients, and reports are ready and waiting.
                </p>

                <ul className="space-y-3 mb-10">
                  {benefits.map((b, i) => {
                    const Icon = b.icon;
                    return (
                      <motion.li
                        key={b.label}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.35 + i * 0.1, duration: 0.5 }}
                        className="flex items-center gap-3"
                      >
                        <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-white/90 text-sm font-medium">{b.label}</span>
                      </motion.li>
                    );
                  })}
                </ul>
              </motion.div>

              {/* Middle: floating dashboard mockup */}
              <motion.div
                animate={{ y: [-6, 6, -6] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                className="relative rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.25)] border border-white/20 bg-white/10 backdrop-blur-md p-2"
              >
                <div className="rounded-xl overflow-hidden">
                  <DashboardMockup />
                </div>
                {/* Subtle tint overlay to blend into the panel */}
                <div className="absolute inset-0 bg-linear-to-t from-[#005f73]/30 to-transparent rounded-2xl pointer-events-none" />
              </motion.div>

              {/* Bottom: platform stat strip */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-8 pt-6 border-t border-white/15 flex items-center justify-between text-white/60 text-xs font-medium"
              >
                <span>4+ Enterprise Tools</span>
                <span className="w-1 h-1 rounded-full bg-white/30" />
                <span>Free Marketplace</span>
                <span className="w-1 h-1 rounded-full bg-white/30" />
                <span>Secure Escrow</span>
              </motion.div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
