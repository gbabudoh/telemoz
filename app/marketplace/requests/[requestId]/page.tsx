"use client";

import { Button } from "@/components/ui/Button";
import {
  Mail,
  Calendar,
  CheckCircle2,
  Shield,
  DollarSign,
  Clock,
  Building2,
  MapPin,
  ArrowLeft,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

// Mock data - replace with real data from API
const requestData = {
  id: "1",
  client: "Local Business Hub",
  company: "Local Business Hub",
  clientId: "client-123",
  project: "Social Media Strategy",
  budget: 1200,
  currency: "£",
  category: "Social Media",
  location: "Birmingham, UK",
  country: "United Kingdom",
  city: "Birmingham",
  timezone: "Europe/London",
  posted: "1 day ago",
  description:
    "Seeking a social media strategist to help grow our online presence. We need someone with experience in content creation, community management, and social media advertising. Looking for a professional who can help us build brand awareness and engage with our target audience effectively.",
  requirements: ["Social Media", "Content Creation", "Community Management", "Social Media Advertising"],
  status: "open",
  timeline: "3–6 months",
  deliverables: [
    "Social media content calendar",
    "Monthly performance reports",
    "Community engagement strategy",
    "Paid advertising campaigns",
  ],
};

const panelClass =
  "bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl shadow-sm overflow-hidden";

export default function RequestDetailPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleExpressInterest = () => {
    router.push(`/messaging?clientId=${requestData.clientId}&requestId=${requestData.id}&action=express-interest`);
  };

  const handleScheduleCall = () => {
    router.push(`/messaging?clientId=${requestData.clientId}&requestId=${requestData.id}&action=schedule-call`);
  };

  return (
    <div className="relative min-h-screen bg-gray-50 overflow-hidden py-12">
      {/* Ambient orbs */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-[#0a9396]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[45%] h-[45%] rounded-full bg-[#6ece39]/8 blur-[120px] pointer-events-none" />

      <div className="container mx-auto max-w-5xl px-6 relative z-10">

        {/* Back nav */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
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
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24 space-y-4">

              {/* Client identity card */}
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

                {/* Meta */}
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

                {/* Budget + timeline */}
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
                    <Button
                      onClick={handleExpressInterest}
                      className="w-full h-12 rounded-xl bg-[#0a9396] hover:bg-[#087579] text-white font-semibold shadow-sm shadow-[#0a9396]/20 transition-all"
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Express Interest
                    </Button>
                    <Button
                      onClick={handleScheduleCall}
                      variant="outline"
                      className="w-full h-12 rounded-xl border-2 border-gray-200 text-gray-700 hover:border-[#0a9396] hover:text-[#0a9396] hover:bg-transparent font-semibold transition-all"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule a Call
                    </Button>
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

            {/* Security banner */}
            <div className={`${panelClass} p-6 flex flex-col sm:flex-row items-start gap-5`}>
              <div className="h-12 w-12 rounded-xl bg-[#0a9396]/10 flex items-center justify-center shrink-0">
                <Shield className="h-6 w-6 text-[#0a9396]" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Secure & Free for Clients</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  The Telemoz marketplace is <strong>completely free to use</strong>. All payments are
                  held securely in escrow to protect both parties. Once work is approved, payment is
                  released to the professional. Telemoz charges a{" "}
                  <strong className="text-[#0a9396]">10% commission</strong> from the professional&apos;s
                  payout only.
                </p>
                <div className="inline-flex items-center gap-1.5 mt-3 bg-[#6ece39]/10 border border-[#6ece39]/25 px-3 py-1.5 rounded-lg text-xs font-semibold text-green-800">
                  <DollarSign className="h-3.5 w-3.5 text-[#6ece39]" />
                  No fees for clients
                </div>
              </div>
            </div>

            {/* Project overview */}
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

            {/* Requirements */}
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

            {/* Deliverables */}
            <div className={panelClass}>
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900">Expected Deliverables</h3>
              </div>
              <div className="p-6">
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {requestData.deliverables.map((deliverable, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 bg-gray-50 border border-gray-100 rounded-xl p-4"
                    >
                      <CheckCircle2 className="h-4 w-4 text-[#6ece39] shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm leading-relaxed">{deliverable}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* About the client */}
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
                    <p className="text-sm text-gray-500">{requestData.city}, {requestData.country}</p>
                  </div>
                </div>
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}
