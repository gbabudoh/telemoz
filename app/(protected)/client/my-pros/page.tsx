"use client";

import {
  Star,
  Search,
  MapPin,
  Clock,
  Briefcase,
  Users,
  Filter,
  Award,
  Wallet,
  ShieldCheck,
  LayoutGrid,
  List,
  ArrowUpRight,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Pro {
  id: string;
  name: string;
  email: string;
  activeProjects: number;
  completedProjects: number;
  totalSpent: number;
  profile: {
    specialties: string[];
    location: string;
    rating: number;
    reviewCount: number;
    availability: string;
    verified: boolean;
    certifications: { name: string }[];
  } | null;
}

export default function MyProsPage() {
  const [pros, setPros] = useState<Pro[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  useEffect(() => {
    fetch("/api/client/my-pros")
      .then((r) => r.json())
      .then((d) => setPros(d.pros ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredPros = pros.filter(
    (pro) =>
      pro.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pro.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pro.profile?.specialties ?? []).some((s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const totalProjects = pros.reduce((sum, p) => sum + p.activeProjects, 0);
  const totalSpent = pros.reduce((sum, p) => sum + p.totalSpent, 0);
  const prosWithRating = pros.filter((p) => (p.profile?.rating ?? 0) > 0);
  const avgRating =
    prosWithRating.length > 0
      ? prosWithRating.reduce((sum, p) => sum + (p.profile?.rating ?? 0), 0) /
        prosWithRating.length
      : 0;

  const stats = [
    { title: "Total Pros", value: pros.length, icon: Users },
    { title: "Active Projects", value: totalProjects, icon: Briefcase },
    { title: "Avg. Rating", value: avgRating > 0 ? avgRating.toFixed(1) : "—", suffix: avgRating > 0 ? "/5.0" : undefined, icon: Star },
    { title: "Total Spent", value: formatCurrency(totalSpent), icon: Wallet },
  ];

  return (
    <div className="relative min-h-screen bg-transparent">
      {/* Ambient orbs */}
      <div className="fixed top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-[#0a9396]/10 blur-[130px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] left-[20%] w-[45%] h-[45%] rounded-full bg-[#6ece39]/8 blur-[130px] pointer-events-none z-0" />

      <div className="space-y-6 relative z-10 max-w-[1600px] mx-auto pb-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl p-6 shadow-sm"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-[#0a9396]/10 flex items-center justify-center shrink-0">
                <Users className="h-6 w-6 text-[#0a9396]" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  My <span className="text-[#0a9396]">Marketing Pros</span>
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  {loading ? "Loading..." : `${pros.length} professional${pros.length !== 1 ? "s" : ""} in your network`}
                </p>
              </div>
            </div>
            <Link href="/marketplace">
              <button className="h-11 px-6 rounded-xl bg-[#0a9396] hover:bg-[#087579] text-white font-semibold text-sm shadow-sm shadow-[#0a9396]/20 transition-all hover:-translate-y-0.5 flex items-center gap-2">
                Browse Marketplace
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * idx }}
              className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl p-5 shadow-sm hover:-translate-y-0.5 transition-transform duration-300"
            >
              <div className="h-10 w-10 rounded-xl bg-linear-to-br from-[#0a9396]/10 to-[#6ece39]/10 flex items-center justify-center mb-4">
                <stat.icon className="h-5 w-5 text-[#0a9396]" />
              </div>
              <div className="flex items-baseline gap-1">
                <p className="text-2xl font-black text-gray-900 tracking-tight">{stat.value}</p>
                {stat.suffix && <span className="text-xs font-semibold text-gray-400">{stat.suffix}</span>}
              </div>
              <p className="text-xs font-medium text-gray-500 mt-1">{stat.title}</p>
            </motion.div>
          ))}
        </div>

        {/* Search & filters */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl p-4 shadow-sm"
        >
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-[#0a9396] transition-colors" />
              <input
                type="text"
                placeholder="Search by name, email, or specialty..."
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-[#0a9396] focus:ring-2 focus:ring-[#0a9396]/10 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button className="h-11 px-4 rounded-xl bg-white border border-gray-200 hover:border-[#0a9396]/30 text-gray-500 text-sm font-medium flex items-center gap-2 transition-all">
                <Filter className="h-4 w-4 text-[#0a9396]" />
                Filter
              </button>
              <div className="h-11 bg-white border border-gray-200 rounded-xl p-1 flex items-center gap-0.5">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-[#0a9396]/10 text-[#0a9396]" : "text-gray-400 hover:text-gray-700"}`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-[#0a9396]/10 text-[#0a9396]" : "text-gray-400 hover:text-gray-700"}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Pro cards */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-10 w-10 rounded-full border-4 border-[#0a9396]/20 border-t-[#0a9396] animate-spin" />
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredPros.length === 0 ? (
              <motion.div
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl p-16 text-center shadow-sm flex flex-col items-center"
              >
                <div className="h-14 w-14 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center mb-4">
                  <Users className="h-7 w-7 text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {searchQuery ? "No pros found" : "No professionals yet"}
                </h3>
                <p className="text-gray-500 text-sm max-w-xs mx-auto mb-6">
                  {searchQuery
                    ? "No professionals match your search. Try a different name or specialty."
                    : "Start a project and get matched with a verified marketing professional."}
                </p>
                {searchQuery ? (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="px-5 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-sm font-medium text-gray-700 transition-all"
                  >
                    Clear Search
                  </button>
                ) : (
                  <Link href="/client">
                    <button className="px-5 py-2.5 rounded-xl bg-[#0a9396] hover:bg-[#087579] text-white font-semibold text-sm shadow-sm transition-all">
                      Post a Project
                    </button>
                  </Link>
                )}
              </motion.div>
            ) : (
              <motion.div
                layout
                className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-5" : "flex flex-col gap-4"}
              >
                {filteredPros.map((pro, idx) => (
                  <motion.div
                    key={pro.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className={`group bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl shadow-sm hover:shadow-md hover:border-[#0a9396]/20 transition-all duration-300 overflow-hidden flex flex-col ${viewMode === "list" ? "lg:flex-row" : ""}`}
                  >
                    {/* Profile pane */}
                    <div className={`p-6 flex flex-col items-center text-center shrink-0 ${viewMode === "list" ? "lg:w-72 lg:border-r border-gray-100" : "border-b border-gray-100"}`}>
                      <div className="relative mb-4">
                        <div className="h-20 w-20 rounded-2xl bg-linear-to-br from-[#0a9396] to-[#6ece39] flex items-center justify-center text-2xl font-bold text-white shadow-md">
                          {pro.name.charAt(0)}
                        </div>
                        {pro.profile?.verified && (
                          <div className="absolute -bottom-1.5 -right-1.5 h-7 w-7 rounded-xl bg-[#6ece39] text-white flex items-center justify-center shadow-sm border-2 border-white">
                            <ShieldCheck className="h-4 w-4" />
                          </div>
                        )}
                      </div>

                      <h3 className="font-bold text-gray-900 mb-1 group-hover:text-[#0a9396] transition-colors">{pro.name}</h3>

                      {pro.profile?.rating && pro.profile.rating > 0 ? (
                        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-gray-100 shadow-sm mt-2">
                          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                          <span className="font-bold text-gray-900 text-sm">{pro.profile.rating.toFixed(1)}</span>
                          <span className="text-xs text-gray-400">({pro.profile.reviewCount} reviews)</span>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400 mt-2">No reviews yet</p>
                      )}
                    </div>

                    {/* Stats pane */}
                    <div className="flex-1 p-6 flex flex-col">
                      <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                        <div className="flex items-center gap-5">
                          {pro.profile?.location && (
                            <div>
                              <p className="text-xs text-gray-400 mb-0.5">Location</p>
                              <div className="flex items-center gap-1 text-sm font-semibold text-gray-700">
                                <MapPin className="h-3.5 w-3.5 text-gray-400" />
                                {pro.profile.location}
                              </div>
                            </div>
                          )}
                        </div>
                        {pro.profile?.availability && (
                          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                            pro.profile.availability === "available"
                              ? "bg-[#6ece39]/10 border border-[#6ece39]/25 text-green-800"
                              : "bg-gray-100 border border-gray-200 text-gray-600"
                          }`}>
                            <span className={`h-1.5 w-1.5 rounded-full inline-block ${pro.profile.availability === "available" ? "bg-[#6ece39] animate-pulse" : "bg-gray-400"}`} />
                            {pro.profile.availability}
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 flex-1">
                        <div className="space-y-4">
                          <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Projects</p>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                                <p className="text-xs text-gray-400 mb-1">Active</p>
                                <p className="text-lg font-black text-gray-900">{pro.activeProjects}</p>
                              </div>
                              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                                <p className="text-xs text-gray-400 mb-1">Completed</p>
                                <p className="text-lg font-black text-[#0a9396]">{pro.completedProjects}</p>
                              </div>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Total Spent</p>
                            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-2">
                              <Wallet className="h-4 w-4 text-[#0a9396]" />
                              <span className="font-bold text-gray-900 text-sm">{formatCurrency(pro.totalSpent)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {pro.profile?.specialties && pro.profile.specialties.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Specialties</p>
                              <div className="flex flex-wrap gap-1.5">
                                {pro.profile.specialties.map((s) => (
                                  <span
                                    key={s}
                                    className="px-2.5 py-1 bg-[#0a9396]/8 border border-[#0a9396]/15 rounded-lg text-xs font-medium text-[#0a9396]"
                                  >
                                    {s}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {pro.profile?.certifications && pro.profile.certifications.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Certifications</p>
                              <div className="flex flex-wrap gap-1.5">
                                {pro.profile.certifications.map((c) => (
                                  <div key={c.name} className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0a9396]/8 border border-[#0a9396]/15 text-xs font-medium text-[#0a9396]">
                                    <Award className="h-3 w-3" />
                                    {c.name}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-5 pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-3">
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 mr-auto">
                          <Clock className="h-3.5 w-3.5" />
                          {pro.email}
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <Link href={`/marketplace/${pro.id}`} className="flex-1 sm:flex-none">
                            <button className="h-10 w-full sm:px-5 rounded-xl bg-white border border-gray-200 hover:border-[#0a9396]/30 text-gray-600 hover:text-[#0a9396] text-sm font-medium shadow-sm transition-all flex items-center justify-center gap-2">
                              View Profile
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
        )}

      </div>
    </div>
  );
}
