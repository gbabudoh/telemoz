"use client";

import { Button } from "@/components/ui/Button";
import {
  Search,
  Star,
  MapPin,
  Filter,
  Users,
  Briefcase,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  Clock,
  Mail,
  Award,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { regions, countriesByRegion } from "@/lib/countries";

const categories = [
  { id: "all", name: "All Categories", icon: Briefcase },
  { id: "seo", name: "SEO", icon: TrendingUp },
  { id: "ppc", name: "PPC & Ads", icon: DollarSign },
  { id: "social", name: "Social Media", icon: Users },
  { id: "content", name: "Content Marketing", icon: Mail },
  { id: "email", name: "Email Marketing", icon: Mail },
  { id: "analytics", name: "Analytics", icon: TrendingUp },
];

interface Certification {
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
}

interface Pro {
  id: string;
  name: string;
  title: string;
  location: string;
  country: string | null;
  city: string | null;
  timezone: string | null;
  rating: number;
  reviews: number;
  specialties: string[];
  price: string;
  category: string;
  verified: boolean;
  availability: string;
  certifications: Certification[];
}

interface ClientRequest {
  id: string;
  client: string;
  company: string;
  project: string;
  budget: number;
  currency: string;
  category: string;
  location: string;
  country: string | null;
  city: string | null;
  posted: string;
  description: string;
  requirements: string[];
  status: string;
}

export default function MarketplacePage() {
  const [activeTab, setActiveTab] = useState<"experts" | "requests">("experts");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [pros, setPros] = useState<Pro[]>([]);
  const [clientRequests, setClientRequests] = useState<ClientRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/marketplace");
        if (response.ok) {
          const data = await response.json();
          setPros(data.pros);
          setClientRequests(data.requests);
        }
      } catch (error) {
        console.error("Error fetching marketplace data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredPros = pros.filter((pro) => {
    const matchesCategory = selectedCategory === "all" || pro.category === selectedCategory;
    const matchesCountry = selectedCountry === "all" || pro.country === selectedCountry;
    const matchesSearch =
      searchQuery === "" ||
      pro.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pro.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pro.specialties.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      pro.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pro.country?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pro.city?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesCountry && matchesSearch;
  });

  const filteredRequests = clientRequests.filter((request) => {
    const matchesCategory = selectedCategory === "all" || request.category === selectedCategory;
    const matchesCountry = selectedCountry === "all" || request.country === selectedCountry;
    const matchesSearch =
      searchQuery === "" ||
      request.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.requirements.some((r: string) => r.toLowerCase().includes(searchQuery.toLowerCase())) ||
      request.country?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.city?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesCountry && matchesSearch;
  });

  return (
    <div className="relative min-h-screen bg-gray-50 overflow-hidden py-12">
      {/* Ambient background orbs */}
      <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-[#0a9396]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#6ece39]/8 blur-[130px] pointer-events-none" />

      <div className="container mx-auto max-w-7xl px-6 relative z-10">

        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, type: "spring" }}
          >
            <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tight">
              <span className="text-gray-900">Digital </span>
              <span className="text-transparent bg-clip-text bg-linear-to-r from-[#0a9396] to-[#6ece39]">
                Marketplace
              </span>
            </h1>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Find verified digital marketing professionals or post a project to attract top talent.
            </p>
          </motion.div>
        </div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, type: "spring" }}
          className="max-w-3xl mx-auto mb-10 relative group/search"
        >
          <div className="absolute -inset-1 bg-linear-to-r from-[#0a9396]/20 via-[#6ece39]/15 to-[#0a9396]/20 rounded-[2rem] blur opacity-60 group-hover/search:opacity-100 transition duration-500" />
          <div className="relative flex items-center bg-white/70 backdrop-blur-2xl border border-white rounded-[2rem] shadow-sm h-14 px-6">
            <Search className="h-5 w-5 text-[#0a9396] absolute left-6 shrink-0" />
            <input
              type="search"
              placeholder={
                activeTab === "experts"
                  ? "Search by name, specialty, or location..."
                  : "Search by project, client, or skill..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none pl-10 pr-4 h-full outline-none text-gray-900 placeholder-gray-400 text-[15px]"
            />
          </div>
        </motion.div>

        {/* Tab Switch */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-white/50 backdrop-blur-xl border border-white/80 p-1.5 rounded-2xl shadow-sm">
            <button
              onClick={() => setActiveTab("experts")}
              className={`relative flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-colors text-sm ${
                activeTab === "experts" ? "text-[#0a9396]" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <Users className="h-4 w-4" />
              Find Experts
              {activeTab === "experts" && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute inset-0 bg-white border border-white/80 shadow-sm rounded-xl -z-10"
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab("requests")}
              className={`relative flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-colors text-sm ${
                activeTab === "requests" ? "text-[#0a9396]" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <Briefcase className="h-4 w-4" />
              Client Requests
              {activeTab === "requests" && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute inset-0 bg-white border border-white/80 shadow-sm rounded-xl -z-10"
                />
              )}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-10">
          <div className="lg:col-span-3 bg-white/50 backdrop-blur-xl border border-white/80 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="h-4 w-4 text-[#0a9396]" />
              <span className="text-sm font-semibold text-gray-700">Category</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const Icon = category.icon;
                const isActive = selectedCategory === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-medium text-sm transition-all ${
                      isActive
                        ? "bg-[#0a9396] text-white shadow-sm shadow-[#0a9396]/20"
                        : "bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {category.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white/50 backdrop-blur-xl border border-white/80 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-4 w-4 text-[#0a9396]" />
              <span className="text-sm font-semibold text-gray-700">Location</span>
            </div>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 focus:border-[#0a9396] focus:outline-none focus:ring-2 focus:ring-[#0a9396]/10 transition-all"
            >
              <option value="all">All Countries</option>
              {regions.map((region) => (
                <optgroup key={region} label={region}>
                  {countriesByRegion[region].map((country, index) => (
                    <option key={`${region}-${country.id}-${index}`} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </div>

        {/* Results header */}
        <div className="flex items-center justify-between mb-6 px-1">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2.5">
            {activeTab === "experts" ? "Available Experts" : "Open Requests"}
            <span className="px-2.5 py-0.5 rounded-full bg-[#0a9396]/10 border border-[#0a9396]/20 text-[#0a9396] font-bold text-sm">
              {(activeTab === "experts" ? filteredPros : filteredRequests).length}
            </span>
          </h2>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24 bg-white/40 backdrop-blur-xl border border-white/80 rounded-2xl"
            >
              <div className="relative">
                <div className="w-16 h-16 border-4 border-[#0a9396]/20 border-t-[#0a9396] rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-[#0a9396]/10 rounded-full animate-pulse" />
                </div>
              </div>
              <p className="mt-6 text-gray-500 font-bold tracking-widest uppercase text-xs animate-pulse">
                Fetching latest marketplace data...
              </p>
            </motion.div>
          ) : activeTab === "experts" ? (
            <motion.div
              key="experts"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
            >
              {filteredPros.length === 0 ? (
                <div className="bg-white/50 backdrop-blur-xl border border-white/80 rounded-2xl p-16 text-center">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-700 mb-1">No experts found</h3>
                  <p className="text-gray-400">Try adjusting your filters or search term.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPros.map((pro, index) => (
                    <motion.div
                      key={pro.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08 }}
                    >
                      <Link href={`/marketplace/${pro.id}`}>
                        <div className="h-full bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group cursor-pointer">
                          {/* Name + rating */}
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#0a9396] transition-colors">
                                  {pro.name}
                                </h3>
                                {pro.verified && <CheckCircle2 className="h-4 w-4 text-[#6ece39]" />}
                              </div>
                              <p className="text-sm text-gray-500">{pro.title}</p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-lg border border-yellow-100">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-yellow-700 font-bold text-xs">{pro.rating}</span>
                              </div>
                              <span className="text-xs text-gray-400">{pro.reviews} reviews</span>
                            </div>
                          </div>

                          {/* Location + availability */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100 text-sm text-gray-600">
                              <MapPin className="h-3.5 w-3.5 text-gray-400" />
                              {pro.city && pro.country ? `${pro.city}, ${pro.country}` : pro.location}
                            </div>
                            <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100 text-sm">
                              <span className="relative flex h-2 w-2">
                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${pro.availability === "available" ? "bg-[#6ece39]" : "bg-amber-400"}`} />
                                <span className={`relative inline-flex rounded-full h-2 w-2 ${pro.availability === "available" ? "bg-[#6ece39]" : "bg-amber-500"}`} />
                              </span>
                              <span className={pro.availability === "available" ? "text-green-700" : "text-amber-700"}>
                                {pro.availability === "available" ? "Available" : "Busy"}
                              </span>
                            </div>
                          </div>

                          {/* Specialties */}
                          <div className="flex flex-wrap gap-1.5 mb-5">
                            {pro.specialties.slice(0, 3).map((specialty: string) => (
                              <span
                                key={specialty}
                                className="px-2.5 py-1 bg-[#0a9396]/8 border border-[#0a9396]/15 rounded-lg text-xs font-medium text-[#0a9396]"
                              >
                                {specialty}
                              </span>
                            ))}
                            {pro.specialties.length > 3 && (
                              <span className="px-2.5 py-1 bg-gray-50 border border-gray-100 rounded-lg text-xs font-medium text-gray-400">
                                +{pro.specialties.length - 3}
                              </span>
                            )}
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            {pro.certifications && pro.certifications.length > 0 ? (
                              <div className="flex items-center gap-1.5">
                                <Award className="h-4 w-4 text-[#0a9396]" />
                                <span className="text-xs text-gray-500 font-medium">
                                  {pro.certifications.length} credential{pro.certifications.length !== 1 ? "s" : ""}
                                </span>
                              </div>
                            ) : <div />}
                            <span className="font-bold text-gray-900 text-sm">{pro.price}</span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="requests"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
            >
              {filteredRequests.length === 0 ? (
                <div className="bg-white/50 backdrop-blur-xl border border-white/80 rounded-2xl p-16 text-center">
                  <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-700 mb-1">No requests found</h3>
                  <p className="text-gray-400">Try adjusting your filters or search term.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRequests.map((request, index) => (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08 }}
                    >
                      <Link href={`/marketplace/requests/${request.id}`}>
                        <div className="h-full bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group cursor-pointer flex flex-col">
                          {/* Project + status */}
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1 pr-3">
                              <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#0a9396] transition-colors leading-tight mb-1">
                                {request.project}
                              </h3>
                              <p className="text-sm text-gray-500">{request.company}</p>
                            </div>
                            <div className="flex items-center gap-1.5 bg-[#6ece39]/10 border border-[#6ece39]/30 px-2.5 py-1 rounded-lg shrink-0">
                              <div className="h-1.5 w-1.5 rounded-full bg-[#6ece39] animate-pulse" />
                              <span className="text-xs font-semibold text-green-800 capitalize">{request.status}</span>
                            </div>
                          </div>

                          {/* Description */}
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed flex-1">
                            {request.description}
                          </p>

                          {/* Location + posted */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100 text-sm text-gray-600">
                              <MapPin className="h-3.5 w-3.5 text-gray-400" />
                              {request.city && request.country
                                ? `${request.city}, ${request.country}`
                                : request.location}
                            </div>
                            <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100 text-sm text-gray-600">
                              <Clock className="h-3.5 w-3.5 text-gray-400" />
                              {request.posted}
                            </div>
                          </div>

                          {/* Requirements */}
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {request.requirements.slice(0, 2).map((req: string) => (
                              <span
                                key={req}
                                className="px-2.5 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-600"
                              >
                                {req}
                              </span>
                            ))}
                            {request.requirements.length > 2 && (
                              <span className="px-2.5 py-1 bg-gray-50 border border-gray-100 rounded-lg text-xs font-medium text-gray-400">
                                +{request.requirements.length - 2}
                              </span>
                            )}
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-1">
                              <span className="text-xl font-black text-gray-900">
                                {request.currency}{request.budget.toLocaleString()}
                              </span>
                              <span className="text-sm text-gray-400 ml-0.5">budget</span>
                            </div>
                            <Button
                              size="sm"
                              className="h-8 px-4 bg-[#0a9396] hover:bg-[#087579] text-white font-semibold rounded-xl shadow-sm"
                            >
                              View
                            </Button>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
