"use client";

import { Badge } from "@/components/ui/Badge";
import {
  MessageSquare,
  Star,
  Search,
  MapPin,
  Clock,
  Briefcase,
  Users,
  Filter,
  Award,
  Wallet,
  Zap,
  ShieldCheck,
  LayoutGrid,
  List,
  ArrowUpRight,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

const pros = [
  {
    id: 1,
    name: "Digital Marketing Pro",
    company: "Digital Solutions Ltd",
    type: "Agency",
    rating: 4.8,
    reviews: 127,
    status: "active",
    projects: 2,
    verified: true,
    specialties: ["SEO", "PPC", "Social Media"],
    location: "London, UK",
    availability: "Available",
    responseTime: "2 hours",
    totalSpent: 12500,
    completedProjects: 5,
    certifications: ["Google Ads", "Meta Certified"],
  },
  {
    id: 2,
    name: "SEO Experts Ltd",
    company: "SEO Experts Ltd",
    type: "Company",
    rating: 4.9,
    reviews: 89,
    status: "active",
    projects: 1,
    verified: true,
    specialties: ["SEO", "Content Marketing"],
    location: "Manchester, UK",
    availability: "Available",
    responseTime: "4 hours",
    totalSpent: 8500,
    completedProjects: 3,
    certifications: ["Google Analytics", "HubSpot"],
  },
];

export default function MyProsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  const filteredPros = pros.filter(
    (pro) =>
      pro.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pro.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pro.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalProjects = pros.reduce((sum, pro) => sum + pro.projects, 0);
  const totalSpent = pros.reduce((sum, pro) => sum + pro.totalSpent, 0);
  const avgRating = pros.reduce((sum, pro) => sum + pro.rating, 0) / pros.length;

  return (
    <div className="relative min-h-screen bg-transparent">
      {/* Ambient Animated Orbs */}
      <div className="fixed top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-[#0a9396]/10 blur-[130px] pointer-events-none mix-blend-multiply animate-pulse z-0" />
      <div className="fixed top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-400/10 blur-[140px] pointer-events-none mix-blend-multiply animate-pulse-slow z-0" />
      <div className="fixed bottom-[-10%] left-[20%] w-[45%] h-[45%] rounded-full bg-emerald-400/10 blur-[130px] pointer-events-none mix-blend-multiply opacity-70 animate-pulse z-0" />

      <div className="space-y-10 relative z-10 max-w-[1600px] mx-auto pb-12">
        {/* Cinematic Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/40 backdrop-blur-2xl border border-white rounded-[2.5rem] p-8 lg:p-10 shadow-[inset_0_2px_15px_rgb(255,255,255,0.7),0_10px_30px_rgb(0,0,0,0.03)] overflow-hidden relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
            <div className="flex items-center gap-6">
              <div className="p-4 rounded-3xl bg-[#0a9396]/10 border border-[#0a9396]/20">
                <Users className="h-10 w-10 text-[#0a9396]" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight leading-tight mb-1">
                  My <span className="bg-gradient-to-r from-[#0a9396] to-teal-500 bg-clip-text text-transparent">Marketing Pros</span>
                </h1>
                <p className="text-gray-600 font-bold tracking-wide flex items-center gap-2 text-[15px]">
                  Managing {pros.length} Elite Specialists in your cluster.
                </p>
              </div>
            </div>
            
            <Link href="/marketplace">
              <button className="px-8 py-4 rounded-2xl bg-gray-900 hover:bg-black text-white font-bold tracking-wide text-[15px] shadow-xl shadow-gray-900/20 border-none transition-all cursor-pointer flex items-center justify-center gap-2 group/btn">
                Browse Marketplace
                <ArrowUpRight className="h-4 w-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Holographic Stats Ribbon */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Connected Pool", value: pros.length, icon: Users, gradient: "from-indigo-500 to-purple-500" },
            { title: "Active Deployments", value: totalProjects, icon: Briefcase, gradient: "from-emerald-500 to-[#0a9396]" },
            { title: "Unit Satisfaction", value: avgRating.toFixed(1), suffix: "/5.0", icon: Star, gradient: "from-amber-500 to-orange-500" },
            { title: "Total Capital Spent", value: formatCurrency(totalSpent), icon: Wallet, gradient: "from-blue-600 to-cyan-500" },
          ].map((stat, idx) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
              className="bg-white/40 backdrop-blur-xl border border-white rounded-[2rem] p-6 shadow-[inset_0_2px_15px_rgb(255,255,255,0.7),0_10px_30px_rgb(0,0,0,0.03)] group hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden"
            >
              <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${stat.gradient} rounded-full blur-[40px] opacity-10 group-hover:opacity-25 transition-opacity`} />
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-lg shadow-gray-900/5`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="relative z-10">
                <div className="flex items-baseline gap-1">
                  <h3 className="text-2xl lg:text-3xl font-black text-gray-900 tracking-tight">{stat.value}</h3>
                  {stat.suffix && <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">{stat.suffix}</span>}
                </div>
                <p className="text-[12px] font-bold text-gray-500 tracking-widest uppercase mt-1">{stat.title}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Intelligence Filters Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white/40 backdrop-blur-3xl border border-white rounded-3xl p-4 shadow-[inset_0_2px_15px_rgb(255,255,255,0.7),0_5px_20px_rgb(0,0,0,0.02)]"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 group-focus-within:text-[#0a9396] transition-colors" />
              <input
                type="text"
                placeholder="Synchronize by specialist name, agency cluster, or vector..."
                className="w-full pl-14 pr-6 py-4 bg-white/60 focus:bg-white backdrop-blur-md border border-gray-100 rounded-2xl text-gray-900 font-bold placeholder:text-gray-300 outline-none focus:ring-4 focus:ring-[#0a9396]/5 transition-all shadow-inner"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3">
              <button className="h-14 px-6 rounded-2xl bg-white border border-gray-100 hover:border-[#0a9396]/30 text-gray-500 font-black uppercase tracking-widest text-[11px] flex items-center gap-2 transition-all shadow-sm cursor-pointer group hover:bg-white/80">
                <Filter className="h-4 w-4 text-[#0a9396] group-hover:rotate-180 transition-transform duration-500" />
                Parameters
              </button>
              <div className="h-14 bg-white/80 border border-gray-100 rounded-2xl p-1.5 flex items-center shadow-sm">
                 <button
                   onClick={() => setViewMode("grid")}
                   className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                     viewMode === "grid" 
                       ? "bg-[#0a9396]/10 text-[#0a9396] shadow-inner" 
                       : "text-gray-300 hover:text-gray-600"
                   }`}
                 >
                   <LayoutGrid className="h-4 w-4" />
                 </button>
                 <div className="w-px h-5 bg-gray-100 mx-1.5" />
                 <button
                   onClick={() => setViewMode("list")}
                   className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                     viewMode === "list" 
                       ? "bg-[#0a9396]/10 text-[#0a9396] shadow-inner" 
                       : "text-gray-300 hover:text-gray-600"
                   }`}
                 >
                   <List className="h-4 w-4" />
                 </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Intelligence Grid/List Matrix */}
        <AnimatePresence mode="popLayout">
          {filteredPros.length === 0 ? (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-white/40 backdrop-blur-3xl border border-white rounded-[2.5rem] p-20 text-center shadow-xl flex flex-col items-center justify-center"
            >
              <div className="h-20 w-20 rounded-3xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-6 shadow-sm">
                <Users className="h-10 w-10 text-gray-300" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-2">Matrix Empty.</h3>
              <p className="text-gray-500 font-bold max-w-sm mx-auto leading-relaxed mb-8">No marketing specialists match the current search vector. Expand your synchronization parameters.</p>
              <button onClick={() => setSearchQuery("")} className="px-8 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 font-bold text-gray-900 transition-all cursor-pointer">
                Reset Scan
              </button>
            </motion.div>
          ) : (
            <motion.div 
              layout
              className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8" : "flex flex-col gap-6"}
            >
              {filteredPros.map((pro, idx) => (
                <motion.div
                  key={pro.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`group bg-white/50 backdrop-blur-3xl border border-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgb(10,147,150,0.1)] hover:border-[#0a9396]/20 transition-all duration-500 overflow-hidden relative flex flex-col ${viewMode === "list" ? "lg:flex-row" : ""}`}
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-teal-400/5 to-transparent blur-3xl pointer-events-none" />
                  
                  {/* Left: Intelligence Pane (Profile) */}
                  <div className={`p-8 lg:p-10 border-gray-100/50 flex flex-col items-center text-center shrink-0 relative ${viewMode === "list" ? "lg:w-[350px] lg:border-r" : "border-b"}`}>
                    <div className="relative mb-8">
                       <div className="absolute -inset-2 bg-gradient-to-br from-[#0a9396] to-teal-400 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 animate-pulse-slow pointer-events-none transition-opacity" />
                       <div className="h-32 w-32 rounded-[2rem] bg-gradient-to-br from-[#0a9396] to-teal-300 p-[2px] shadow-2xl relative z-10 transform group-hover:-rotate-3 transition-transform duration-700">
                          <div className="h-full w-full rounded-[1.8rem] bg-white border border-white/40 flex items-center justify-center text-4xl font-black text-[#0a9396] select-none">
                            {pro.name.charAt(0)}
                          </div>
                       </div>
                       {pro.verified && (
                         <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg border-2 border-white z-20">
                            <ShieldCheck className="h-6 w-6" />
                         </div>
                       )}
                    </div>

                    <div className="space-y-2 mb-6">
                      <h3 className="text-2xl font-black text-gray-900 tracking-tight group-hover:text-blue-900 transition-colors uppercase">{pro.name}</h3>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                        <Users className="h-3 w-3" />
                        {pro.type} Cluster
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-white/80 p-3 rounded-2xl border border-gray-100 shadow-sm">
                       <div className="flex items-center gap-1">
                         <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                         <span className="text-lg font-black text-gray-900 tracking-tighter">{pro.rating}</span>
                       </div>
                       <div className="w-px h-4 bg-gray-200" />
                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{pro.reviews} ANALYTICS</span>
                    </div>
                  </div>

                  {/* Right: Operational Pane (Stats) */}
                  <div className="flex-1 p-8 lg:p-10 flex flex-col bg-white/20">
                    <div className="flex flex-wrap items-center justify-between gap-6 mb-10">
                      <div className="flex items-center gap-8">
                         <div className="space-y-1">
                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Agency Root</p>
                           <p className="text-sm font-bold text-gray-700 group-hover:text-black transition-colors">{pro.company}</p>
                         </div>
                         <div className="h-8 w-px bg-gray-100 hidden sm:block" />
                         <div className="space-y-1">
                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Geography</p>
                           <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                             <MapPin className="h-3.5 w-3.5 text-[#0a9396]" />
                             {pro.location}
                           </div>
                         </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="px-4 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-2 text-[11px] font-black text-emerald-600 uppercase tracking-wide">
                          <Zap className="h-3.5 w-3.5 fill-current" />
                          {pro.availability}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 flex-1">
                      <div className="space-y-5">
                         <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Project Logistics</p>
                            <div className="grid grid-cols-2 gap-4">
                               <div className="p-4 rounded-2xl bg-white/40 border border-white shadow-sm group/stat">
                                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Active</p>
                                  <p className="text-xl font-black text-gray-900 group-hover/stat:text-[#0a9396] transition-colors">{pro.projects}</p>
                               </div>
                               <div className="p-4 rounded-2xl bg-white/40 border border-white shadow-sm group/stat">
                                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Lifetime</p>
                                  <p className="text-xl font-black text-gray-900 group-hover/stat:text-emerald-500 transition-colors">{pro.completedProjects}</p>
                               </div>
                            </div>
                         </div>
                         <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Capital Allocation</p>
                            <div className="p-4 rounded-2xl bg-white shadow-sm border border-gray-50 flex items-center justify-between">
                               <div className="flex items-center gap-3 font-black text-lg text-emerald-600 tracking-tight">
                                 <Wallet className="h-5 w-5 opacity-70" />
                                 {formatCurrency(pro.totalSpent)}
                               </div>
                               <ArrowUpRight className="h-4 w-4 text-gray-200" />
                            </div>
                         </div>
                      </div>

                      <div className="space-y-5">
                         <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Specialization Vectors</p>
                            <div className="flex flex-wrap gap-2">
                               {pro.specialties.map(s => (
                                 <Badge key={s} variant="outline" className="border-gray-200 bg-white/40 text-[10px] font-black uppercase tracking-widest text-gray-600 px-3 py-1.5 rounded-lg group-hover:border-[#0a9396]/30 group-hover:text-[#0a9396] transition-all">
                                   {s}
                                 </Badge>
                               ))}
                            </div>
                         </div>
                         <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Accreditations</p>
                            <div className="flex flex-wrap gap-2">
                               {pro.certifications.map(c => (
                                 <div key={c} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50/50 border border-blue-100/50 text-[10px] font-black text-blue-600 uppercase">
                                   <Award className="h-3.5 w-3.5" />
                                   {c}
                                 </div>
                               ))}
                            </div>
                         </div>
                      </div>
                    </div>

                    {/* Operational Actions */}
                    <div className="mt-10 pt-8 border-t border-gray-100/50 flex flex-col sm:flex-row items-center gap-4">
                      <div className="flex items-center gap-2.5 text-[11px] font-black text-gray-400 uppercase mr-auto">
                        <Clock className="h-4 w-4 text-[#0a9396]/60" />
                        Synchronized: {pro.responseTime} Respond
                      </div>
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <Link href={`/marketplace/${pro.id}`} className="flex-1 sm:flex-none">
                          <button className="h-12 w-full sm:px-8 rounded-2xl bg-white border border-gray-200 hover:border-[#0a9396]/30 hover:bg-white text-gray-600 hover:text-gray-900 font-bold uppercase tracking-[0.15em] text-[10px] shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2">
                            Review Matrix
                          </button>
                        </Link>
                        <Link href={`/messaging?proId=${pro.id}`} className="flex-1 sm:flex-none">
                          <button className="h-12 w-full sm:px-10 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-indigo-600/20 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2">
                            <MessageSquare className="h-3.5 w-3.5 fill-current" />
                            Uplink
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
