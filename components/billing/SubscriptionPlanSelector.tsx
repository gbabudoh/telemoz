"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, 
  Zap, 
  Globe, 
  ShieldCheck, 
  CreditCard, 
  AlertCircle,
  Loader2,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { countriesByRegion } from "@/lib/countries";

interface SubscriptionPlanSelectorProps {
  userCountry: string;
  currentTier: string;
}

export const SubscriptionPlanSelector = ({ userCountry, currentTier }: SubscriptionPlanSelectorProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAfrican = countriesByRegion["Africa"].some(
    (c) => c.name.toLowerCase() === userCountry.toLowerCase()
  );

  const planName = isAfrican ? "African Markets Tier" : "International Markets Tier";
  const planPrice = isAfrican ? "9.99" : "19.99";
  const planDescription = isAfrican 
    ? "Localized pricing for professionals across Africa." 
    : "Standard international pricing for global reach.";
  const paymentMethod = isAfrican ? "Flutterwave (Mobile Money, Local Cards, EFT)" : "Stripe (Global Credit/Debit Cards)";

  const handleSubscribe = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const endpoint = isAfrican ? "/api/pro/subscription/africa" : "/api/stripe/checkout"; // Assuming international uses existing stripe checkout
      const response = await fetch(endpoint, { method: "POST" });
      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Failed to initiate checkout");
      }
    } catch (err: unknown) {
      console.error("Subscription error:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    "Unlimited Project Applications",
    "Priority Search Results",
    "Full Escrow Protection (0% Commission)",
    "DigitalBOX Marketing Suite Access",
    "Verified Pro Badge",
    "Client Dispute Resolution Services"
  ];

  return (
    <div className="space-y-6">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-[#0a9396] rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
        <div className="relative bg-white/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/60 shadow-[inset_0_2px_15px_rgb(255,255,255,0.7),0_10px_30px_rgb(0,0,0,0.03)] overflow-hidden">
          
          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Left Side: Plan Info */}
            <div className="p-8 md:p-12 space-y-8 border-b md:border-b-0 md:border-r border-gray-100/50">
              <div>
                <Badge className="bg-[#0a9396]/10 text-[#0a9396] border-none font-black text-[10px] uppercase tracking-widest px-4 py-1.5 mb-6">
                  Recommended for your region
                </Badge>
                <h3 className="text-4xl font-black text-gray-900 tracking-tight leading-none mb-2">
                  {planName}
                </h3>
                <p className="text-[15px] font-bold text-gray-500">
                  {planDescription}
                </p>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-gray-900">$</span>
                <span className="text-6xl font-black text-gray-900 tracking-tighter">{planPrice}</span>
                <span className="text-xl font-bold text-gray-400">/ month</span>
              </div>

              <div className="space-y-4">
                <Button 
                  onClick={handleSubscribe}
                  disabled={isLoading || currentTier === (isAfrican ? "africa" : "international")}
                  className="w-full h-16 rounded-2xl bg-gray-900 hover:bg-black text-white text-lg font-black tracking-wide shadow-2xl shadow-black/20 hover:-translate-y-1 transition-all group"
                >
                  {isLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : currentTier === (isAfrican ? "africa" : "international") ? (
                    <>
                      <ShieldCheck className="mr-2 h-6 w-6 text-emerald-400" />
                      Active Plan
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-5 w-5 text-teal-400 fill-teal-400" />
                      Activate Professional Access
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
                
                <p className="text-center text-xs font-bold text-gray-400 flex items-center justify-center gap-2">
                  <CreditCard className="h-3 w-3" />
                  Secure checkout via {paymentMethod}
                </p>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3"
                  >
                    <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-sm font-bold text-red-900 leading-tight">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Side: Features */}
            <div className="p-8 md:p-12 bg-gray-50/30 backdrop-blur-sm">
              <h4 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-500" />
                What&apos;s Included
              </h4>
              <ul className="space-y-5">
                {features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-4 group/item">
                    <div className="mt-1 h-5 w-5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 group-hover/item:bg-emerald-500 group-hover/item:border-emerald-500 transition-colors">
                      <Check className="h-3 w-3 text-emerald-600 group-hover/item:text-white transition-colors" />
                    </div>
                    <span className="text-[15px] font-bold text-gray-700 leading-snug">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-12 p-6 rounded-2xl bg-white/60 border border-white shadow-sm flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Market Context</p>
                  <p className="text-[13px] font-bold text-gray-700">
                    Detected Region: <span className="text-indigo-600">{userCountry || "Global"}</span>
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
