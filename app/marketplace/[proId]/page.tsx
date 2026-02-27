"use client";

import { Button } from "@/components/ui/Button";
import { Star, MapPin, Mail, Calendar, CheckCircle2, Shield, DollarSign, Award, ArrowLeft } from "lucide-react";
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
  specialties: ["Google Ads", "Facebook Ads", "Conversion Optimization"],
  price: "£800-£3000/month",
  bio: "With over 6 years of dedicated experience in performance marketing, I specialize in architecting high-converting PPC funnels. My data-driven approach has consistently yielded extremely high ROAS for my clients across the e-commerce and B2B sectors. Let's scale your acquisition.",
  experience: "6+ years",
  clients: "35+",
  availability: "Available",
  certifications: [
    { name: "Google Ads Certification", issuer: "Google", issueDate: "2023-01-15", expiryDate: "2025-01-15", credentialId: "GADS-48291A" },
  ],
};

export default function ProProfilePage() {
  const { data: session } = useSession();

  return (
    <div className="relative min-h-screen bg-gray-50 overflow-hidden py-12">
      {/* Ambient Animated Orbs */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-indigo-400/10 blur-[120px] pointer-events-none mix-blend-multiply animate-pulse" />
      <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-teal-400/10 blur-[130px] pointer-events-none mix-blend-multiply animate-pulse-slow" />
      <div className="absolute bottom-[-10%] left-[20%] w-[45%] h-[45%] rounded-full bg-emerald-400/10 blur-[120px] pointer-events-none mix-blend-multiply opacity-70 animate-pulse" />

      <div className="container mx-auto max-w-7xl px-6 relative z-10">
        
        {/* Navigation */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8 relative inline-block">
           <Link href="/marketplace" className="group flex items-center gap-2">
             <div className="flex items-center justify-center bg-white/60 backdrop-blur-xl border border-white rounded-xl px-4 py-2.5 shadow-sm group-hover:shadow-md transition-all group-hover:bg-white/80">
               <ArrowLeft className="h-4 w-4 text-gray-500 group-hover:text-[#0a9396] group-hover:-translate-x-1 transition-all" />
               <span className="font-bold tracking-wide text-[14px] text-gray-700 group-hover:text-gray-900 transition-colors">Back to Marketplace</span>
             </div>
           </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar / Identity Column */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="lg:col-span-4 space-y-6"
          >
             <div className="sticky top-24">
               
               {/* Identity Card */}
               <div className="bg-white/40 backdrop-blur-2xl border border-white rounded-[2rem] p-1.5 shadow-[inset_0_2px_15px_rgb(255,255,255,0.7),0_10px_30px_rgb(0,0,0,0.03)] group overflow-hidden mb-6">
                 <div className="bg-white/60 rounded-[1.8rem] p-8 lg:p-10 border border-transparent h-full relative z-10 flex flex-col items-center">
                    
                    {/* Free-floating Avatar Matrix */}
                    <div className="relative mb-6">
                       <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-[#0a9396] rounded-full blur-md opacity-40 group-hover:opacity-60 transition-opacity animate-pulse-slow" />
                       <div className="h-28 w-28 rounded-full bg-gradient-to-br from-[#0a9396] to-emerald-400 p-1 shadow-lg relative z-10">
                          <div className="h-full w-full rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-5xl font-black text-white outline outline-4 outline-white mix-blend-overlay">
                            {proData.name.charAt(0)}
                          </div>
                       </div>
                       <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1.5 shadow-md border border-gray-100 z-20">
                          <CheckCircle2 className="h-6 w-6 text-emerald-500 drop-shadow-sm" />
                       </div>
                    </div>

                    <h1 className="text-3xl font-black text-gray-900 tracking-tight text-center mb-1">{proData.name}</h1>
                    <p className="text-[#0a9396] font-bold tracking-wide text-center mb-4">{proData.title}</p>

                    <div className="flex items-center gap-2 mb-6 bg-white/80 px-4 py-2 rounded-xl shadow-sm border border-gray-100/50">
                       <div className="flex items-center gap-1 border-r border-gray-200 pr-3">
                         <Star className="h-4 w-4 fill-yellow-400 text-yellow-500" />
                         <span className="text-gray-900 font-black tracking-tight">{proData.rating}</span>
                       </div>
                       <span className="text-gray-500 font-bold tracking-wide text-xs pl-1">({proData.reviews} reviews)</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-sm text-gray-600 font-medium mb-6">
                       <MapPin className="h-4 w-4 text-gray-400" />
                       <span>{proData.location}</span>
                    </div>

                    <div className="w-full flex justify-center mb-8">
                       <div className="px-5 py-2 rounded-full bg-emerald-50 border border-emerald-100 flex items-center gap-2">
                         <span className="relative flex h-2.5 w-2.5">
                           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                           <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                         </span>
                         <span className="text-emerald-700 font-bold tracking-wide uppercase text-xs">{proData.availability}</span>
                       </div>
                    </div>

                    <div className="w-full space-y-4 pt-6 border-t border-gray-200/50">
                       <div className="flex justify-between items-center text-sm">
                         <span className="text-gray-500 font-bold tracking-wide">Experience Time</span>
                         <span className="text-gray-900 font-black">{proData.experience}</span>
                       </div>
                       <div className="flex justify-between items-center text-sm">
                         <span className="text-gray-500 font-bold tracking-wide">Client Matrix</span>
                         <span className="text-gray-900 font-black">{proData.clients}</span>
                       </div>
                       <div className="flex justify-between items-center text-sm">
                         <span className="text-gray-500 font-bold tracking-wide">Base Capital</span>
                         <span className="text-[#0a9396] font-black">{proData.price}</span>
                       </div>
                    </div>

                 </div>
               </div>

               {/* Action Buttons */}
               <div className="space-y-3">
                  {session?.user ? (
                    <>
                      <Link href={`/messaging?proId=${proData.id}`} className="block">
                         <Button className="w-full h-14 rounded-2xl bg-gray-900 hover:bg-black text-white font-bold tracking-wide text-base shadow-lg shadow-gray-900/20 transition-all group overflow-hidden relative">
                           <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                           <Mail className="mr-2 h-5 w-5 text-gray-300 group-hover:text-white transition-colors" /> Init Secure Comms
                         </Button>
                      </Link>
                      <Link href={`/messaging?proId=${proData.id}&action=schedule-call`} className="block">
                         <Button className="w-full h-14 rounded-2xl bg-white/60 hover:bg-white backdrop-blur-xl border border-white text-gray-900 font-bold tracking-wide text-base shadow-sm transition-all">
                           <Calendar className="mr-2 h-5 w-5 text-[#0a9396]" /> Schedule Briefing
                         </Button>
                      </Link>
                    </>
                  ) : (
                    <Link href="/login" className="block">
                       <Button className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#0a9396] to-teal-500 hover:from-teal-500 hover:to-[#0a9396] text-white font-bold tracking-wide text-base shadow-lg shadow-teal-500/20 border-none transition-all">
                         Sign In to Connect
                       </Button>
                    </Link>
                  )}
               </div>

             </div>
          </motion.div>

          {/* Main Content Column */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }}
            className="lg:col-span-8 space-y-6"
          >
             {/* Security Banner */}
             <div className="relative group/danger overflow-hidden rounded-[2.5rem]">
               <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400/30 to-teal-400/30 blur opacity-75 group-hover/danger:opacity-100 transition-opacity duration-1000" />
               <div className="relative bg-white/60 backdrop-blur-3xl border border-cyan-100 shadow-sm overflow-hidden h-full rounded-[2.5rem]">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-50/50 to-transparent" />
                  <div className="p-8 lg:p-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10 text-center sm:text-left">
                     <div className="h-16 w-16 bg-white rounded-2xl shadow-md border border-cyan-100 flex items-center justify-center shrink-0">
                        <Shield className="h-8 w-8 text-[#0a9396] drop-shadow-sm" />
                     </div>
                     <div>
                       <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-2">Secure & Commission-Free</h3>
                       <p className="text-gray-600 font-medium leading-relaxed mb-4 text-[15px]">
                          The Telemoz marketplace is <strong>completely free for clients</strong> to browse and hire. Funds are securely locked in escrow to protect all parties. Telemoz solely charges a <strong className="text-[#0a9396]">13% tax</strong> on the professional&apos;s final payout upon successful completion.
                       </p>
                       <div className="inline-flex items-center gap-2 bg-cyan-50 border border-cyan-100 px-4 py-2 rounded-xl text-sm font-bold tracking-wide text-cyan-900">
                          <DollarSign className="h-4 w-4 text-cyan-600" /> Client Liability: Zero
                       </div>
                     </div>
                  </div>
               </div>
             </div>

             {/* About Panel */}
             <div className="bg-white/40 backdrop-blur-2xl border border-white rounded-[2.5rem] shadow-[inset_0_2px_15px_rgb(255,255,255,0.7),0_10px_30px_rgb(0,0,0,0.03)] overflow-hidden">
                <div className="p-8 lg:p-10 border-b border-gray-100/50 bg-gradient-to-br from-white/40 to-transparent">
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight">Biography Matrix</h3>
                </div>
                <div className="p-8 lg:p-10 bg-white/20">
                  <p className="text-gray-600 font-medium leading-relaxed text-[17px]">
                    &quot;{proData.bio}&quot;
                  </p>
                </div>
             </div>

             {/* Specialties Target */}
             <div className="bg-white/40 backdrop-blur-2xl border border-white rounded-[2.5rem] shadow-[inset_0_2px_15px_rgb(255,255,255,0.7),0_10px_30px_rgb(0,0,0,0.03)] overflow-hidden">
                <div className="p-8 lg:p-10 border-b border-gray-100/50 bg-gradient-to-br from-white/40 to-transparent">
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight">Operational Specialties</h3>
                </div>
                <div className="p-8 lg:p-10 bg-white/20">
                  <div className="flex flex-wrap gap-3">
                    {proData.specialties.map((specialty) => (
                      <div key={specialty} className="px-5 py-2.5 bg-white border border-gray-200/60 shadow-sm rounded-xl text-[14px] font-bold text-gray-900 tracking-wide hover:border-[#0a9396] hover:shadow-md transition-all cursor-default relative overflow-hidden group/badge">
                        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-transparent opacity-0 group-hover/badge:opacity-100 transition-opacity" />
                        <span className="relative z-10">{specialty}</span>
                      </div>
                    ))}
                  </div>
                </div>
             </div>

             {/* Credentials Platform */}
             {proData.certifications && proData.certifications.length > 0 && (
               <div className="bg-white/40 backdrop-blur-2xl border border-white rounded-[2.5rem] shadow-[inset_0_2px_15px_rgb(255,255,255,0.7),0_10px_30px_rgb(0,0,0,0.03)] overflow-hidden">
                  <div className="p-8 lg:p-10 border-b border-gray-100/50 bg-gradient-to-br from-white/40 to-transparent flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-indigo-400 to-[#0a9396] rounded-xl shadow-lg shadow-teal-500/20 text-white shrink-0">
                       <Award className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">Verified Credentials</h3>
                  </div>
                  <div className="p-8 lg:p-10 bg-white/20 grid grid-cols-1 md:grid-cols-2 gap-5">
                    {proData.certifications.map((cert, index) => (
                       <div key={index} className="bg-white/80 border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-gray-200 transition-all flex items-start gap-4">
                          <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 shrink-0">
                            <Award className="h-6 w-6 text-gray-400" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 leading-tight mb-2 tracking-wide">{cert.name}</h4>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Issued: {cert.issuer}</p>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] font-semibold text-gray-600 mb-2">
                              <span>Verified: {new Date(cert.issueDate).toLocaleDateString()}</span>
                              {cert.expiryDate && <span className="text-amber-600">Exp: {new Date(cert.expiryDate).toLocaleDateString()}</span>}
                            </div>
                            {cert.credentialId && (
                               <div className="inline-flex mt-2 px-2.5 py-1 bg-gray-50 border border-gray-200 rounded-md text-[11px] font-mono font-bold text-gray-500">
                                 UID: {cert.credentialId}
                               </div>
                            )}
                          </div>
                       </div>
                    ))}
                  </div>
               </div>
             )}

             {/* Inclusions */}
             <div className="bg-white/40 backdrop-blur-2xl border border-white rounded-[2.5rem] shadow-[inset_0_2px_15px_rgb(255,255,255,0.7),0_10px_30px_rgb(0,0,0,0.03)] overflow-hidden">
                <div className="p-8 lg:p-10 border-b border-gray-100/50 bg-gradient-to-br from-white/40 to-transparent">
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight">Engagement Deliverables</h3>
                </div>
                <div className="p-8 lg:p-10 bg-white/20">
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                    {[
                      "Monthly SEO audit and reporting",
                      "Keyword research and optimization",
                      "On-page and technical SEO",
                      "Content strategy and optimization",
                      "Link building outreach",
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 bg-white/60 p-4 border border-white rounded-xl shadow-sm">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-gray-700 font-bold tracking-wide text-sm leading-relaxed">{item}</span>
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
