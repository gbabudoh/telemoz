"use client";

import { Button } from "@/components/ui/Button";
import {
  Star,
  MapPin,
  Mail,
  Calendar,
  CheckCircle2,
  Shield,
  DollarSign,
  Award,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

// Mock data - replace with real data from API
const proData = {
  id: "2",
  name: "Michael Chen",
  title: "PPC Expert",
  location: "Manchester, UK",
  rating: 4.8,
  reviews: 89,
  specialties: ["Google Ads", "Facebook Ads", "Conversion Optimisation"],
  price: "£800–£3,000/mo",
  bio: "With over 6 years of dedicated experience in performance marketing, I specialise in building high-converting PPC campaigns. My data-driven approach has consistently delivered strong ROAS for clients across e-commerce and B2B sectors.",
  experience: "6+ years",
  clients: "35+",
  availability: "Available",
  certifications: [
    {
      name: "Google Ads Certification",
      issuer: "Google",
      issueDate: "2023-01-15",
      expiryDate: "2025-01-15",
      credentialId: "GADS-48291A",
    },
  ],
  deliverables: [
    "Monthly performance reporting",
    "Keyword research and optimisation",
    "Ad copy creation and testing",
    "Conversion rate optimisation",
    "Campaign budget management",
  ],
};

const panelClass =
  "bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl shadow-sm overflow-hidden";

export default function ProProfilePage() {
  const { data: session } = useSession();

  return (
    <div className="relative min-h-screen bg-gray-50 overflow-hidden py-12">
      {/* Ambient orbs */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-[#0a9396]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[45%] h-[45%] rounded-full bg-[#6ece39]/8 blur-[120px] pointer-events-none" />

      <div className="container mx-auto max-w-7xl px-6 relative z-10">

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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-4"
          >
            <div className="sticky top-24 space-y-4">

              {/* Identity card */}
              <div className={`${panelClass} p-8 flex flex-col items-center`}>

                {/* Avatar */}
                <div className="relative mb-5">
                  <div className="h-24 w-24 rounded-full bg-linear-to-br from-[#0a9396] to-[#6ece39] flex items-center justify-center text-4xl font-black text-white shadow-lg">
                    {proData.name.charAt(0)}
                  </div>
                  <div className="absolute -bottom-1.5 -right-1.5 bg-white rounded-full p-1 shadow-sm border border-gray-100">
                    <CheckCircle2 className="h-5 w-5 text-[#6ece39]" />
                  </div>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 text-center mb-1">{proData.name}</h1>
                <p className="text-[#0a9396] font-medium text-center mb-4">{proData.title}</p>

                {/* Rating */}
                <div className="flex items-center gap-3 mb-4 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-gray-900">{proData.rating}</span>
                  </div>
                  <span className="text-gray-400 text-xs">({proData.reviews} reviews)</span>
                </div>

                {/* Location */}
                <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-5">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  {proData.location}
                </div>

                {/* Availability */}
                <div className="px-4 py-1.5 rounded-full bg-[#6ece39]/10 border border-[#6ece39]/30 flex items-center gap-2 mb-6">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6ece39] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#6ece39]" />
                  </span>
                  <span className="text-green-800 font-semibold text-xs uppercase tracking-wide">{proData.availability}</span>
                </div>

                {/* Stats */}
                <div className="w-full space-y-3 pt-5 border-t border-gray-100">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Experience</span>
                    <span className="font-bold text-gray-900">{proData.experience}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Clients Served</span>
                    <span className="font-bold text-gray-900">{proData.clients}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Rate</span>
                    <span className="font-bold text-[#0a9396]">{proData.price}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-3">
                {session?.user ? (
                  <>
                    <Link href={`/messaging?proId=${proData.id}`} className="block">
                      <Button className="w-full h-12 rounded-xl bg-[#0a9396] hover:bg-[#087579] text-white font-semibold shadow-sm shadow-[#0a9396]/20 transition-all">
                        <Mail className="mr-2 h-4 w-4" />
                        Send a Message
                      </Button>
                    </Link>
                    <Link href={`/messaging?proId=${proData.id}&action=schedule-call`} className="block">
                      <Button
                        variant="outline"
                        className="w-full h-12 rounded-xl border-2 border-gray-200 text-gray-700 hover:border-[#0a9396] hover:text-[#0a9396] hover:bg-transparent font-semibold transition-all"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        Schedule a Call
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Link href="/login" className="block">
                    <Button className="w-full h-12 rounded-xl bg-[#0a9396] hover:bg-[#087579] text-white font-semibold shadow-sm transition-all">
                      Sign In to Connect
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
            className="lg:col-span-8 space-y-5"
          >

            {/* Security banner */}
            <div className={`${panelClass} p-6 flex flex-col sm:flex-row items-start gap-5`}>
              <div className="h-12 w-12 rounded-xl bg-[#0a9396]/10 flex items-center justify-center shrink-0">
                <Shield className="h-6 w-6 text-[#0a9396]" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Secure & Free for Clients</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Browsing and hiring on Telemoz is <strong>completely free for clients</strong>. All payments are
                  held securely in escrow until the work is completed and approved. Telemoz charges a{" "}
                  <strong className="text-[#0a9396]">10% commission</strong> only from the professional&apos;s
                  payout upon successful completion.
                </p>
                <div className="inline-flex items-center gap-1.5 mt-3 bg-[#6ece39]/10 border border-[#6ece39]/25 px-3 py-1.5 rounded-lg text-xs font-semibold text-green-800">
                  <DollarSign className="h-3.5 w-3.5 text-[#6ece39]" />
                  No fees for clients
                </div>
              </div>
            </div>

            {/* About */}
            <div className={panelClass}>
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900">About</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600 leading-relaxed">{proData.bio}</p>
              </div>
            </div>

            {/* Specialties */}
            <div className={panelClass}>
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900">Specialties</h3>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2">
                  {proData.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="px-4 py-2 bg-[#0a9396]/8 border border-[#0a9396]/15 rounded-xl text-sm font-medium text-[#0a9396] hover:bg-[#0a9396]/15 transition-colors cursor-default"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Certifications */}
            {proData.certifications && proData.certifications.length > 0 && (
              <div className={panelClass}>
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-linear-to-br from-[#0a9396] to-[#6ece39] flex items-center justify-center">
                    <Award className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900">Certifications</h3>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {proData.certifications.map((cert, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 border border-gray-100 rounded-xl p-5 hover:border-[#0a9396]/30 hover:shadow-sm transition-all flex items-start gap-4"
                    >
                      <div className="h-10 w-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0">
                        <Award className="h-5 w-5 text-[#0a9396]" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm leading-tight mb-1">{cert.name}</h4>
                        <p className="text-xs text-gray-500 mb-2">Issued by {cert.issuer}</p>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
                          <span>Issued: {new Date(cert.issueDate).toLocaleDateString()}</span>
                          {cert.expiryDate && (
                            <span className="text-amber-600">
                              Expires: {new Date(cert.expiryDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        {cert.credentialId && (
                          <div className="mt-2 inline-block px-2 py-0.5 bg-white border border-gray-200 rounded text-[11px] font-mono text-gray-400">
                            ID: {cert.credentialId}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* What's Included */}
            <div className={panelClass}>
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900">What&apos;s Included</h3>
              </div>
              <div className="p-6">
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {proData.deliverables.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 bg-gray-50 border border-gray-100 rounded-xl p-4">
                      <CheckCircle2 className="h-4 w-4 text-[#6ece39] shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}
