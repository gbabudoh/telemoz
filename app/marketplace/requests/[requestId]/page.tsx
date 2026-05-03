"use client";

import { Button } from "@/components/ui/Button";
import {
  Mail,
  CheckCircle2,
  Shield,
  DollarSign,
  Clock,
  Building2,
  MapPin,
  ArrowLeft,
  Tag,
  Loader2,
  X,
  Send,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface RequestDetail {
  id: string;
  client: string;
  company: string;
  clientId: string;
  project: string;
  budget: number;
  currency: string;
  category: string;
  location: string;
  country: string | null;
  city: string | null;
  posted: string;
  description: string;
  timeline: string;
  requirements: string[];
  deliverables: string[];
  status: string;
}

const panelClass =
  "bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl shadow-sm overflow-hidden";

export default function RequestDetailPage() {
  const router = useRouter();
  const params = useParams();
  const requestId = params.requestId as string;
  const { data: session } = useSession();

  const [requestData, setRequestData] = useState<RequestDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [interestState, setInterestState] = useState<
    "idle" | "loading" | "done" | "already"
  >("idle");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pitchMessage, setPitchMessage] = useState("");

  useEffect(() => {
    fetch(`/api/marketplace/requests/${requestId}`)
      .then((r) => {
        if (!r.ok) throw new Error("Request not found");
        return r.json();
      })
      .then(setRequestData)
      .catch((e) => setError(e.message))
      .finally(() => setIsLoading(false));
  }, [requestId]);

  const handleExpressInterest = async () => {
    if (!session?.user) {
      router.push("/login");
      return;
    }
    if (!pitchMessage.trim()) return;

    setInterestState("loading");
    try {
      const res = await fetch(
        `/api/marketplace/requests/${requestId}/interest`,
        { 
          method: "POST", 
          headers: { "Content-Type": "application/json" }, 
          body: JSON.stringify({ message: pitchMessage.trim() }) 
        }
      );
      if (res.status === 409) {
        setInterestState("already");
        setIsModalOpen(false);
        return;
      }
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to submit interest");
      }
      setInterestState("done");
      setIsModalOpen(false);
    } catch (err: unknown) {
      console.error("Interest submission error:", err);
      const msg = err instanceof Error ? err.message : "An unexpected error occurred. Please try again.";
      alert(msg);
      setInterestState("idle");
    }
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#0a9396]/20 border-t-[#0a9396] rounded-full animate-spin" />
          <p className="text-gray-400 font-medium animate-pulse">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error || !requestData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 text-center">
        <div className="h-20 w-20 rounded-3xl bg-white border border-gray-100 shadow-sm flex items-center justify-center mb-6">
          <Shield className="h-10 w-10 text-gray-300" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Project Not Found</h1>
        <p className="text-gray-500 mb-8">
          This project may have been filled or removed.
        </p>
        <Link href="/marketplace">
          <Button className="bg-[#0a9396] hover:bg-[#087579] text-white rounded-xl h-12 px-8 font-bold">
            Back to Marketplace
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-50 overflow-hidden py-12">
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-[#0a9396]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[45%] h-[45%] rounded-full bg-[#6ece39]/8 blur-[120px] pointer-events-none" />

      <div className="container mx-auto max-w-5xl px-6 relative z-10">

        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-xl border border-white/80 rounded-xl px-4 py-2.5 shadow-sm hover:shadow-md hover:bg-white/80 transition-all group text-sm font-medium text-gray-700"
          >
            <ArrowLeft className="h-4 w-4 text-gray-400 group-hover:text-[#0a9396] group-hover:-translate-x-0.5 transition-all" />
            Back to Marketplace
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Sidebar */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">

              <div className={`${panelClass} p-6 flex flex-col items-center text-center`}>
                <div className="h-20 w-20 rounded-full bg-linear-to-br from-[#0a9396] to-[#6ece39] flex items-center justify-center text-2xl font-bold text-white mb-4 shadow-md">
                  {requestData.company.charAt(0)}
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-0.5">{requestData.company}</h2>
                <p className="text-gray-500 text-sm mb-3">{requestData.client}</p>

                <div className="inline-flex items-center gap-1.5 bg-[#6ece39]/10 border border-[#6ece39]/30 px-3 py-1 rounded-full mb-5">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#6ece39] animate-pulse" />
                  <span className="text-xs font-semibold text-green-800 capitalize">{requestData.status}</span>
                </div>

                <div className="w-full space-y-2 text-sm text-left">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
                    <span>
                      {requestData.city && requestData.country
                        ? `${requestData.city}, ${requestData.country}`
                        : requestData.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-4 w-4 text-gray-400 shrink-0" />
                    <span>Posted {requestData.posted}</span>
                  </div>
                </div>

                <div className="w-full mt-5 pt-5 border-t border-gray-100 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Budget</span>
                    <span className="text-xl font-black text-[#0a9396]">
                      {requestData.currency}{requestData.budget.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Timeline</span>
                    <span className="font-semibold text-gray-900">{requestData.timeline}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-3">
                {session?.user ? (
                  <>
                    {interestState === "done" ? (
                      <div className="w-full h-12 rounded-xl bg-[#6ece39]/10 border border-[#6ece39]/30 flex items-center justify-center gap-2 text-green-800 font-semibold text-sm">
                        <CheckCircle2 className="h-4 w-4 text-[#6ece39]" />
                        Interest Sent
                      </div>
                    ) : interestState === "already" ? (
                      <div className="w-full h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center gap-2 text-amber-700 font-semibold text-sm">
                        <CheckCircle2 className="h-4 w-4 text-amber-500" />
                        Already Applied
                      </div>
                    ) : (session.user as { userType?: string }).userType !== "pro" ? (
                      <div className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-500 text-[11px] font-bold text-center leading-relaxed">
                        Interested in this project? You must be logged in with a <span className="text-[#0a9396]">Professional</span> account to express interest.
                      </div>
                    ) : (
                      <Button
                        onClick={() => setIsModalOpen(true)}
                        disabled={interestState === "loading"}
                        className="w-full h-12 rounded-xl bg-[#0a9396] hover:bg-[#087579] text-white font-semibold shadow-sm shadow-[#0a9396]/20 transition-all disabled:opacity-70"
                      >
                        {interestState === "loading" ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Mail className="mr-2 h-4 w-4" />
                        )}
                        Express Interest
                      </Button>
                    )}
                  </>
                ) : (
                  <Link href="/login" className="block">
                    <Button className="w-full h-12 rounded-xl bg-[#0a9396] hover:bg-[#087579] text-white font-semibold shadow-sm transition-all">
                      Sign In to Apply
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>

          {/* Main content */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-5"
          >
            <div className={`${panelClass} p-6 flex flex-col sm:flex-row items-start gap-5`}>
              <div className="h-12 w-12 rounded-xl bg-[#0a9396]/10 flex items-center justify-center shrink-0">
                <Shield className="h-6 w-6 text-[#0a9396]" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Secure & Free for Clients</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  The Telemoz marketplace is <strong>completely free to use</strong>. All payments are
                  held securely in escrow to protect both parties. Telemoz charges a{" "}
                  <strong className="text-[#0a9396]">10% commission</strong> from the professional&apos;s
                  payout only.
                </p>
                <div className="inline-flex items-center gap-1.5 mt-3 bg-[#6ece39]/10 border border-[#6ece39]/25 px-3 py-1.5 rounded-lg text-xs font-semibold text-green-800">
                  <DollarSign className="h-3.5 w-3.5 text-[#6ece39]" />
                  No fees for clients
                </div>
              </div>
            </div>

            <div className={panelClass}>
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900">Project Overview</h3>
              </div>
              <div className="p-6 space-y-5">
                <p className="text-gray-600 leading-relaxed text-sm">{requestData.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
                      <Tag className="h-3.5 w-3.5" />
                      Category
                    </div>
                    <span className="px-3 py-1 bg-[#0a9396]/8 border border-[#0a9396]/15 rounded-lg text-sm font-medium text-[#0a9396]">
                      {requestData.category}
                    </span>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
                      <Clock className="h-3.5 w-3.5" />
                      Timeline
                    </div>
                    <p className="font-semibold text-gray-900 text-sm">{requestData.timeline}</p>
                  </div>
                </div>
              </div>
            </div>

            {requestData.requirements.length > 0 && (
              <div className={panelClass}>
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="font-bold text-gray-900">Requirements</h3>
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2">
                    {requestData.requirements.map((req) => (
                      <span
                        key={req}
                        className="px-4 py-2 bg-[#0a9396]/8 border border-[#0a9396]/15 rounded-xl text-sm font-medium text-[#0a9396]"
                      >
                        {req}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {requestData.deliverables.length > 0 && (
              <div className={panelClass}>
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="font-bold text-gray-900">Expected Deliverables</h3>
                </div>
                <div className="p-6">
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {requestData.deliverables.map((d, i) => (
                      <li key={i} className="flex items-start gap-3 bg-gray-50 border border-gray-100 rounded-xl p-4">
                        <CheckCircle2 className="h-4 w-4 text-[#6ece39] shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm leading-relaxed">{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div className={panelClass}>
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900">About the Client</h3>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[#0a9396]/10 flex items-center justify-center shrink-0">
                    <Building2 className="h-5 w-5 text-[#0a9396]" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{requestData.company}</p>
                    {requestData.city && requestData.country && (
                      <p className="text-sm text-gray-500">{requestData.city}, {requestData.country}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      {/* Pitch Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-white"
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Why are you a good fit?</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="h-4 w-4 text-gray-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-500">
                Write a short pitch to the client. This will be the first message in your conversation thread.
              </p>
              <textarea
                value={pitchMessage}
                onChange={(e) => setPitchMessage(e.target.value)}
                placeholder="Hi, I saw your project and I'd love to help..."
                className="w-full h-40 bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-[#0a9396]/20 focus:border-[#0a9396] transition-all resize-none"
              />
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 h-12 rounded-xl font-bold border-gray-100"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleExpressInterest}
                  disabled={!pitchMessage.trim() || interestState === "loading"}
                  className="flex-1 h-12 rounded-xl bg-[#0a9396] hover:bg-[#087579] text-white font-bold"
                >
                  {interestState === "loading" ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Send Interest
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
