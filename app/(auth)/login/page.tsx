"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, FormEvent } from "react";
import { CheckCircle2, X, Loader2, Mail, Lock } from "lucide-react";
import { signIn, getSession } from "next-auth/react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [isSuccessDismissed, setIsSuccessDismissed] = useState(false);
  const showSuccess = searchParams.get("registered") === "true" && !isSuccessDismissed;

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
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
        setError("Invalid email or password. Please try again.");
        setIsLoading(false);
        return;
      }

      if (result?.ok) {
        // Get the session to determine userType
        const session = await getSession();
        const userType = session?.user?.userType;

        // Redirect based on user type
        if (userType === "pro") {
          router.push("/pro");
        } else if (userType === "client") {
          router.push("/client");
        } else if (userType === "admin") {
          router.push("/admin");
        } else {
          router.push("/pro"); // Default fallback
        }
        router.refresh();
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 relative overflow-hidden">
      {/* Abstract Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#0a9396]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#94d2bd]/10 blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-6xl p-6 lg:p-12 relative z-10">
        <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white/60 overflow-hidden flex flex-col lg:flex-row min-h-[700px]">
          
          {/* Left Panel: Form */}
          <div className="w-full lg:w-1/2 p-8 md:p-16 lg:p-20 flex flex-col justify-center relative">
            <Link href="/" className="absolute top-8 left-8 md:top-12 md:left-16 lg:top-12 lg:left-20 cursor-pointer">
              <Image 
                src="/logos/telemoz.png" 
                alt="Telemoz" 
                width={120}
                height={40}
                className="h-8 w-auto object-contain hover:opacity-80 transition-opacity cursor-pointer"
              />
            </Link>

            <motion.div 
              variants={containerVariants} 
              initial="hidden" 
              animate="show"
              className="w-full max-w-sm mx-auto mt-12 md:mt-0"
            >
              <motion.div variants={itemVariants} className="text-left mb-10">
                <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">Welcome Back</h1>
                <p className="text-gray-500 font-medium">Please enter your details to sign in.</p>
              </motion.div>

              {/* Toast Notification */}
              {showSuccess && (
                <motion.div 
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  className="mb-8 p-4 rounded-2xl bg-[#0a9396]/10 border border-[#0a9396]/20 flex items-start gap-3 shadow-sm"
                >
                  <div className="mt-0.5 bg-white rounded-full p-1 shadow-sm">
                    <CheckCircle2 className="h-4 w-4 text-[#0a9396] cursor-pointer" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 font-bold">Account created!</p>
                    <p className="text-xs text-gray-600 mt-1">Please sign in with your credentials.</p>
                  </div>
                  <button
                    onClick={() => setIsSuccessDismissed(true)}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer"
                  >
                    <X className="h-4 w-4 cursor-pointer" />
                  </button>
                </motion.div>
              )}

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3"
                >
                  <p className="text-sm text-red-600 font-medium">{error}</p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <motion.div variants={itemVariants} className="space-y-4">
                  <div className="relative group">
                    <Mail className="absolute left-4 top-9 h-5 w-5 text-gray-400 group-focus-within:text-[#0a9396] transition-colors z-10 cursor-pointer" />
                    <Input
                      type="email"
                      label="Email Address"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="bg-white/50 border-gray-200 focus:border-[#0a9396] focus:ring-[#0a9396]/20 h-12 text-base transition-all pl-12"
                    />
                  </div>
                  
                  <div className="relative group">
                    <Lock className="absolute left-4 top-9 h-5 w-5 text-gray-400 group-focus-within:text-[#0a9396] transition-colors z-10 cursor-pointer" />
                    <Input
                      type="password"
                      label="Password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      className="bg-white/50 border-gray-200 focus:border-[#0a9396] focus:ring-[#0a9396]/20 h-12 text-base transition-all pl-12"
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="flex items-center justify-between text-sm py-2">
                  <label className="flex items-center gap-3 text-gray-600 font-medium cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input 
                        type="checkbox" 
                        className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-md checked:bg-[#0a9396] checked:border-[#0a9396] transition-all cursor-pointer" 
                      />
                      <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" viewBox="0 0 14 14" fill="none">
                        <path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
                      </svg>
                    </div>
                    Remember me
                  </label>
                  <Link href="/forgot-password" className="text-[#0a9396] hover:text-[#005f73] font-semibold transition-colors cursor-pointer">
                    Forgot password?
                  </Link>
                </motion.div>

                <motion.div variants={itemVariants} className="pt-4">
                  <Button
                    type="submit"
                    className="w-full bg-[#0a9396] hover:bg-[#005f73] text-white shadow-lg shadow-[#0a9396]/20 hover:shadow-[#0a9396]/40 hover:-translate-y-0.5 transition-all duration-300 h-14 rounded-xl text-base font-bold disabled:opacity-70 disabled:hover:translate-y-0 cursor-pointer"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-3">
                        <Loader2 className="h-5 w-5 animate-spin cursor-pointer" />
                        Signing in...
                      </span>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </motion.div>
              </form>

              <motion.div variants={itemVariants} className="mt-10 text-center text-sm text-gray-500 font-medium">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-[#0a9396] hover:text-[#005f73] font-bold transition-colors cursor-pointer">
                  Sign up
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Panel: Promotional Image/Marketing */}
          <div className="hidden lg:block w-1/2 relative bg-gradient-to-br from-[#0a9396] to-[#005f73] p-12 overflow-hidden">
            <div className="absolute inset-0 bg-[#000000]/10 mix-blend-overlay" />
            
            {/* Abstract Decorative Circles */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#94d2bd]/20 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 h-full flex flex-col justify-center">
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
                className="w-full max-w-lg mx-auto"
              >
                <div className="mb-10 text-white/90">
                  <h2 className="text-4xl font-bold text-white mb-4">Elevate Your Agency</h2>
                  <p className="text-lg font-light text-white/80">
                    Connect with top talent, manage projects seamlessly, and scale your digital marketing operations all from one unified hub.
                  </p>
                </div>
                
                {/* Dashboard Mockup Display */}
                <motion.div
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                  className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-white/10 backdrop-blur-md p-2 aspect-[4/3] w-full"
                >
                  <div className="relative w-full h-full rounded-xl overflow-hidden">
                    <Image 
                      src="/images/mockups/dashboard.png" 
                      alt="Platform Dashboard Preview" 
                      fill 
                      className="object-cover" 
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#0a9396]/20 to-transparent mix-blend-overlay" />
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

