"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Link from "next/link";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Loader2,
  Briefcase,
  Building2,
  User,
  Mail,
  Lock,
  MapPin,
  Clock,
} from "lucide-react";
import { countriesByRegion, regions } from "@/lib/countries";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const userTypes = [
  {
    id: "pro" as const,
    label: "Professional",
    icon: Briefcase,
    description: "I offer digital marketing services",
  },
  {
    id: "client" as const,
    label: "Client",
    icon: Building2,
    description: "I'm looking to hire talent",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } },
};

export default function RegisterPage() {
  const [userType, setUserType] = useState<"pro" | "client">("pro");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "",
    city: "",
    timezone: "Europe/London",
    agreeToTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      setIsLoading(false);
      return;
    }
    if (!formData.agreeToTerms) {
      setError("Please agree to the Terms of Service and Privacy Policy.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          userType,
          country: formData.country,
          city: formData.city,
          timezone: formData.timezone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Registration failed. Please try again.");
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/login?registered=true"), 2000);
    } catch (err) {
      console.error("Registration error:", err);
      setError("Registration failed. Please check your connection and try again.");
      setIsLoading(false);
    }
  };

  // Success screen
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#0a9396]/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#6ece39]/8 blur-[120px] pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white/70 backdrop-blur-xl border border-white/60 rounded-3xl p-12 shadow-xl max-w-md mx-6"
        >
          <div className="h-16 w-16 rounded-full bg-[#0a9396]/10 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="h-8 w-8 text-[#0a9396]" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Account Created!</h1>
          <p className="text-gray-500 mb-5">Redirecting you to sign in...</p>
          <Loader2 className="h-5 w-5 text-[#0a9396] animate-spin mx-auto" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 relative overflow-hidden py-8">
      {/* Ambient orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#0a9396]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#6ece39]/8 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-6xl px-6 relative z-10">
        <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white/60 overflow-hidden flex flex-col lg:flex-row min-h-[700px]">

          {/* Left panel: Form */}
          <div className="w-full lg:w-1/2 p-8 md:p-16 lg:p-20 flex flex-col justify-center relative">
            <Link href="/" className="absolute top-8 left-8 md:top-12 md:left-16 lg:top-12 lg:left-20">
              <Image
                src="/logos/telemoz.png"
                alt="Telemoz"
                width={120}
                height={40}
                className="h-8 w-auto object-contain hover:opacity-80 transition-opacity"
              />
            </Link>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="w-full max-w-sm mx-auto mt-12 md:mt-0"
            >
              <motion.div variants={itemVariants} className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Create Account</h1>
                <p className="text-gray-500">Join Telemoz and start your journey.</p>
              </motion.div>

              {/* Role selector */}
              <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 mb-7">
                {userTypes.map(({ id, label, icon: Icon, description }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setUserType(id)}
                    className={`flex flex-col items-start gap-1.5 p-4 rounded-2xl border-2 text-left transition-all ${
                      userType === id
                        ? "border-[#0a9396] bg-[#0a9396]/8"
                        : "border-gray-200 hover:border-[#0a9396]/40 hover:bg-gray-50"
                    }`}
                  >
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                      userType === id ? "bg-[#0a9396]/15" : "bg-gray-100"
                    }`}>
                      <Icon className={`h-4 w-4 ${userType === id ? "text-[#0a9396]" : "text-gray-500"}`} />
                    </div>
                    <span className={`font-semibold text-sm ${userType === id ? "text-[#0a9396]" : "text-gray-800"}`}>
                      {label}
                    </span>
                    <span className="text-xs text-gray-400 leading-snug">{description}</span>
                  </button>
                ))}
              </motion.div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="mb-5 p-4 rounded-xl bg-red-50 border border-red-100"
                  >
                    <p className="text-sm text-red-600">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Personal info */}
                <motion.div variants={itemVariants} className="space-y-3">
                  <div className="relative group">
                    <User className="absolute left-4 top-9 h-4 w-4 text-gray-400 group-focus-within:text-[#0a9396] transition-colors z-10" />
                    <Input
                      type="text"
                      label="Full Name"
                      placeholder="Jane Smith"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="bg-white/50 border-gray-200 focus:border-[#0a9396] focus:ring-[#0a9396]/20 h-12 pl-11"
                    />
                  </div>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-9 h-4 w-4 text-gray-400 group-focus-within:text-[#0a9396] transition-colors z-10" />
                    <Input
                      type="email"
                      label="Email Address"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="bg-white/50 border-gray-200 focus:border-[#0a9396] focus:ring-[#0a9396]/20 h-12 pl-11"
                    />
                  </div>
                </motion.div>

                {/* Password */}
                <motion.div variants={itemVariants} className="space-y-3">
                  <div className="relative group">
                    <Lock className="absolute left-4 top-9 h-4 w-4 text-gray-400 group-focus-within:text-[#0a9396] transition-colors z-10" />
                    <Input
                      type="password"
                      label="Password"
                      placeholder="Min. 8 characters"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      className="bg-white/50 border-gray-200 focus:border-[#0a9396] focus:ring-[#0a9396]/20 h-12 pl-11"
                    />
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-9 h-4 w-4 text-gray-400 group-focus-within:text-[#0a9396] transition-colors z-10" />
                    <Input
                      type="password"
                      label="Confirm Password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      required
                      className="bg-white/50 border-gray-200 focus:border-[#0a9396] focus:ring-[#0a9396]/20 h-12 pl-11"
                    />
                  </div>
                </motion.div>

                {/* Location */}
                <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-gray-400" />Country</span>
                    </label>
                    <select
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white/50 text-sm text-gray-900 focus:border-[#0a9396] focus:outline-none focus:ring-2 focus:ring-[#0a9396]/20 transition-all"
                      required
                    >
                      <option value="">Select...</option>
                      {regions.map((region) => (
                        <optgroup key={region} label={region}>
                          {countriesByRegion[region].map((country) => (
                            <option key={country.id} value={country.name}>{country.name}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                  <div className="relative group">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
                    <Input
                      type="text"
                      placeholder="London"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                      className="bg-white/50 border-gray-200 focus:border-[#0a9396] focus:ring-[#0a9396]/20 h-[42px]"
                    />
                  </div>
                </motion.div>

                {/* Timezone */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-gray-400" />Timezone</span>
                  </label>
                  <select
                    value={formData.timezone}
                    onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white/50 text-sm text-gray-900 focus:border-[#0a9396] focus:outline-none focus:ring-2 focus:ring-[#0a9396]/20 transition-all"
                    required
                  >
                    <option value="Europe/London">Europe/London (GMT)</option>
                    <option value="Europe/Paris">Europe/Paris (CET)</option>
                    <option value="Europe/Berlin">Europe/Berlin (CET)</option>
                    <option value="Europe/Madrid">Europe/Madrid (CET)</option>
                    <option value="Europe/Rome">Europe/Rome (CET)</option>
                    <option value="Europe/Amsterdam">Europe/Amsterdam (CET)</option>
                    <option value="Europe/Brussels">Europe/Brussels (CET)</option>
                    <option value="Europe/Stockholm">Europe/Stockholm (CET)</option>
                    <option value="Europe/Oslo">Europe/Oslo (CET)</option>
                    <option value="Europe/Copenhagen">Europe/Copenhagen (CET)</option>
                    <option value="Europe/Warsaw">Europe/Warsaw (CET)</option>
                    <option value="Europe/Dublin">Europe/Dublin (GMT)</option>
                    <option value="Europe/Lisbon">Europe/Lisbon (WET)</option>
                    <option value="Europe/Zurich">Europe/Zurich (CET)</option>
                    <option value="Europe/Vienna">Europe/Vienna (CET)</option>
                    <option value="America/New_York">America/New_York (EST)</option>
                    <option value="America/Chicago">America/Chicago (CST)</option>
                    <option value="America/Denver">America/Denver (MST)</option>
                    <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
                    <option value="America/Toronto">America/Toronto (EST)</option>
                    <option value="America/Vancouver">America/Vancouver (PST)</option>
                    <option value="Australia/Sydney">Australia/Sydney (AEDT)</option>
                    <option value="Australia/Melbourne">Australia/Melbourne (AEDT)</option>
                    <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                    <option value="Asia/Singapore">Asia/Singapore (SGT)</option>
                    <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                    <option value="Asia/Hong_Kong">Asia/Hong_Kong (HKT)</option>
                  </select>
                </motion.div>

                {/* Terms */}
                <motion.div variants={itemVariants}>
                  <label className="flex items-start gap-3 text-sm text-gray-600 cursor-pointer group">
                    <div className="relative flex items-center justify-center mt-0.5 shrink-0">
                      <input
                        type="checkbox"
                        checked={formData.agreeToTerms}
                        onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                        className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-md checked:bg-[#0a9396] checked:border-[#0a9396] transition-all cursor-pointer"
                        required
                      />
                      <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" viewBox="0 0 14 14" fill="none">
                        <path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" />
                      </svg>
                    </div>
                    <span>
                      I agree to the{" "}
                      <Link href="/terms" className="text-[#0a9396] hover:text-[#087579] font-medium">Terms of Service</Link>
                      {" "}and{" "}
                      <Link href="/privacy" className="text-[#0a9396] hover:text-[#087579] font-medium">Privacy Policy</Link>
                    </span>
                  </label>
                </motion.div>

                {/* Submit */}
                <motion.div variants={itemVariants} className="pt-2">
                  <Button
                    type="submit"
                    className="w-full bg-[#0a9396] hover:bg-[#005f73] text-white shadow-lg shadow-[#0a9396]/20 hover:shadow-[#0a9396]/40 hover:-translate-y-0.5 transition-all duration-300 h-13 rounded-xl text-base font-bold disabled:opacity-70 disabled:hover:translate-y-0"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating Account...
                      </span>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </motion.div>
              </form>

              <motion.div variants={itemVariants} className="mt-8 text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Link href="/login" className="text-[#0a9396] hover:text-[#005f73] font-bold transition-colors">
                  Sign in
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Right panel: Marketing */}
          <div className="hidden lg:block w-1/2 relative bg-linear-to-br from-[#005f73] to-[#0a9396] p-12 overflow-hidden">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#6ece39]/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 h-full flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
                className="w-full max-w-lg mx-auto"
              >
                <div className="mb-10">
                  <h2 className="text-4xl font-bold text-white mb-4 leading-snug">
                    Your next client is already here.
                  </h2>
                  <p className="text-lg font-light text-white/75 leading-relaxed">
                    Join thousands of digital marketing professionals and businesses on the platform built for real results.
                  </p>
                </div>

                {/* Feature bullets */}
                <div className="space-y-4">
                  {[
                    { icon: CheckCircle2, text: "Free to join — no subscription or sign-up fees" },
                    { icon: CheckCircle2, text: "Secure escrow payments protect both sides" },
                    { icon: CheckCircle2, text: "AI-powered tools included for Professionals" },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-3">
                      <div className="h-7 w-7 rounded-full bg-[#6ece39]/20 border border-[#6ece39]/40 flex items-center justify-center shrink-0">
                        <Icon className="h-4 w-4 text-[#6ece39]" />
                      </div>
                      <p className="text-white/85 text-sm font-medium">{text}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
