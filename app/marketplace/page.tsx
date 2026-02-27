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
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { regions, countriesByRegion } from "@/lib/countries";

// Categories for filtering
const categories = [
  { id: "all", name: "All Categories", icon: Briefcase },
  { id: "seo", name: "SEO", icon: TrendingUp },
  { id: "ppc", name: "PPC & Ads", icon: DollarSign },
  { id: "social", name: "Social Media", icon: Users },
  { id: "content", name: "Content Marketing", icon: Mail },
  { id: "email", name: "Email Marketing", icon: Mail },
  { id: "analytics", name: "Analytics", icon: TrendingUp },
];

// Mock data - replace with real data from API
const pros = [
  {
    id: "1",
    name: "Sarah Johnson",
    title: "SEO Specialist",
    location: "London, UK",
    country: "United Kingdom",
    city: "London",
    timezone: "Europe/London",
    rating: 4.9,
    reviews: 127,
    specialties: ["SEO", "Content Marketing", "Analytics"],
    price: "£500-£2000/month",
    category: "seo",
    verified: true,
    availability: "available",
    certifications: [
      { name: "Google Ads Certification", issuer: "Google", issueDate: "2023-01-15", expiryDate: "2025-01-15" },
      { name: "Meta (Facebook) Certified", issuer: "Meta", issueDate: "2023-03-20", expiryDate: "2024-03-20" },
    ],
  },
  {
    id: "2",
    name: "Michael Chen",
    title: "PPC Expert",
    location: "Manchester, UK",
    country: "United Kingdom",
    city: "Manchester",
    timezone: "Europe/London",
    rating: 4.8,
    reviews: 89,
    specialties: ["Google Ads", "Facebook Ads", "Conversion Optimization"],
    price: "£800-£3000/month",
    category: "ppc",
    verified: true,
    availability: "available",
    certifications: [
      { name: "Google Ads Certification", issuer: "Google", issueDate: "2023-01-15" },
    ],
  },
  {
    id: "3",
    name: "Emma Williams",
    title: "Social Media Strategist",
    location: "Birmingham, UK",
    country: "United Kingdom",
    city: "Birmingham",
    timezone: "Europe/London",
    rating: 4.7,
    reviews: 156,
    specialties: ["Social Media", "Content Creation", "Community Management"],
    price: "£400-£1500/month",
    category: "social",
    verified: true,
    availability: "available",
    certifications: [
      { name: "HubSpot Content Marketing", issuer: "HubSpot", issueDate: "2023-05-10" },
    ],
  },
  {
    id: "4",
    name: "David Thompson",
    title: "Content Marketing Expert",
    location: "Edinburgh, UK",
    country: "United Kingdom",
    city: "Edinburgh",
    timezone: "Europe/London",
    rating: 4.9,
    reviews: 203,
    specialties: ["Content Strategy", "Blog Writing", "SEO Content"],
    price: "£600-£2500/month",
    category: "content",
    verified: true,
    availability: "busy",
    certifications: [
      { name: "Google Analytics Certification", issuer: "Google", issueDate: "2022-11-10" },
      { name: "SEMrush SEO Toolkit", issuer: "SEMrush", issueDate: "2023-02-15" },
    ],
  },
];

const clientRequests = [
  {
    id: "1",
    client: "TechStart Inc.",
    company: "TechStart Inc.",
    project: "SEO Optimization Campaign",
    budget: 2500,
    category: "seo",
    location: "London, UK",
    country: "United Kingdom",
    city: "London",
    timezone: "Europe/London",
    posted: "2 hours ago",
    description: "Looking for an SEO specialist to optimize our website and improve search rankings.",
    requirements: ["Technical SEO", "Content Strategy", "Analytics"],
    status: "open",
  },
  {
    id: "2",
    client: "E-Commerce Pro",
    company: "E-Commerce Pro Ltd",
    project: "PPC Management",
    budget: 1800,
    category: "ppc",
    location: "Manchester, UK",
    country: "United Kingdom",
    city: "Manchester",
    timezone: "Europe/London",
    posted: "5 hours ago",
    description: "Need a PPC expert to manage our Google Ads and Facebook Ads campaigns.",
    requirements: ["Google Ads", "Facebook Ads", "Conversion Optimization"],
    status: "open",
  },
  {
    id: "3",
    client: "Local Business Hub",
    company: "Local Business Hub",
    project: "Social Media Strategy",
    budget: 1200,
    category: "social",
    location: "Birmingham, UK",
    country: "United Kingdom",
    city: "Birmingham",
    timezone: "Europe/London",
    posted: "1 day ago",
    description: "Seeking a social media strategist to help grow our online presence.",
    requirements: ["Social Media", "Content Creation", "Community Management"],
    status: "open",
  },
];

export default function MarketplacePage() {
  const [activeTab, setActiveTab] = useState<"experts" | "requests">("experts");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPros = pros.filter((pro) => {
    const matchesCategory = selectedCategory === "all" || pro.category === selectedCategory;
    const matchesCountry = selectedCountry === "all" || pro.country === selectedCountry;
    const matchesSearch =
      searchQuery === "" ||
      pro.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pro.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pro.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
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
      request.requirements.some((r) => r.toLowerCase().includes(searchQuery.toLowerCase())) ||
      request.country?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.city?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesCountry && matchesSearch;
  });

  return (
    <div className="relative min-h-screen bg-gray-50 overflow-hidden py-12">
      {/* Ambient Animated Orbs */}
      <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-teal-400/10 blur-[120px] pointer-events-none mix-blend-multiply animate-pulse" />
      <div className="absolute bottom-[20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#0a9396]/10 blur-[130px] pointer-events-none mix-blend-multiply animate-pulse-slow" />
      <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] rounded-full bg-emerald-400/10 blur-[100px] pointer-events-none mix-blend-multiply opacity-70 animate-pulse" />

      <div className="container mx-auto max-w-7xl px-6 relative z-10">
        
        {/* Cinematic Header */}
        <div className="text-center mb-12">
           <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, type: "spring" }}>
             <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tighter drop-shadow-sm flex flex-wrap justify-center items-center gap-3">
               <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
                 Digital
               </span>
               <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0a9396] to-teal-400 drop-shadow-lg">
                 Marketplace
               </span>
             </h1>
             <p className="text-gray-500 text-[17px] max-w-2xl mx-auto font-bold tracking-wide">
               The premier nexus for elite digital talent and hyper-growth client requests.
             </p>
           </motion.div>
        </div>

        {/* Floating Search Bar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, type: "spring" }} className="max-w-3xl mx-auto mb-10 relative group/search">
           <div className="absolute -inset-1 bg-gradient-to-r from-teal-400/20 via-[#0a9396]/20 to-emerald-400/20 rounded-[2rem] blur opacity-75 group-hover/search:opacity-100 transition duration-1000 group-hover/search:duration-200" />
           <div className="relative flex items-center bg-white/60 backdrop-blur-2xl border border-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-16 px-6">
              <Search className="h-6 w-6 text-[#0a9396] absolute left-6 shrink-0 group-hover/search:scale-110 transition-transform" />
              <input 
                type="search"
                placeholder={activeTab === "experts" ? "Search expert talent by specialty, node, or identity..." : "Search project vectors, clients, or pipelines..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none pl-12 pr-4 h-full outline-none text-gray-900 font-bold placeholder-gray-400 tracking-wide text-[15px]"
              />
           </div>
        </motion.div>

        {/* Animated Segmented Switch */}
        <div className="flex justify-center mb-12">
           <div className="inline-flex bg-white/40 backdrop-blur-xl border border-white p-1.5 rounded-2xl shadow-inner relative">
             <button
               onClick={() => setActiveTab("experts")}
               className={`relative z-10 flex items-center gap-2 px-6 sm:px-8 py-3 rounded-xl font-bold tracking-wide transition-colors ${activeTab === "experts" ? "text-teal-900" : "text-gray-500 hover:text-gray-900"}`}
             >
               <Users className={`h-5 w-5 ${activeTab === "experts" ? "text-[#0a9396]" : ""}`} />
               <span className="hidden sm:inline">Find</span> Experts
               {activeTab === "experts" && (
                 <motion.div layoutId="marketplaceTabs" className="absolute inset-0 bg-gradient-to-br from-teal-100/50 to-white/80 border border-white shadow-sm rounded-xl -z-10" />
               )}
             </button>
             <button
               onClick={() => setActiveTab("requests")}
               className={`relative z-10 flex items-center gap-2 px-6 sm:px-8 py-3 rounded-xl font-bold tracking-wide transition-colors ${activeTab === "requests" ? "text-teal-900" : "text-gray-500 hover:text-gray-900"}`}
             >
               <Briefcase className={`h-5 w-5 ${activeTab === "requests" ? "text-[#0a9396]" : ""}`} />
               <span className="hidden sm:inline">Client</span> Requests
               {activeTab === "requests" && (
                 <motion.div layoutId="marketplaceTabs" className="absolute inset-0 bg-gradient-to-br from-teal-100/50 to-white/80 border border-white shadow-sm rounded-xl -z-10" />
               )}
             </button>
           </div>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
          
          <div className="lg:col-span-3">
             <div className="bg-white/40 backdrop-blur-xl border border-white rounded-[2rem] p-6 shadow-[inset_0_2px_15px_rgb(255,255,255,0.7),0_10px_30px_rgb(0,0,0,0.03)] h-full">
               <div className="flex items-center gap-2 mb-4">
                 <Filter className="h-5 w-5 text-[#0a9396]" />
                 <h3 className="text-[14px] font-black text-gray-900 tracking-wide uppercase">Sector Topology</h3>
               </div>
               <div className="flex flex-wrap gap-2.5">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    const isActive = selectedCategory === category.id;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-[13px] tracking-wide transition-all ${
                          isActive
                            ? "bg-gradient-to-r from-[#0a9396] to-teal-500 text-white shadow-md shadow-teal-500/20 border-none rotate-0 scale-105"
                            : "bg-white/60 text-gray-600 hover:text-gray-900 hover:bg-white border border-white/80"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {category.name}
                      </button>
                    );
                  })}
               </div>
             </div>
          </div>

          <div className="lg:col-span-1">
             <div className="bg-white/40 backdrop-blur-xl border border-white rounded-[2rem] p-6 shadow-[inset_0_2px_15px_rgb(255,255,255,0.7),0_10px_30px_rgb(0,0,0,0.03)] h-full">
               <div className="flex items-center gap-2 mb-4">
                 <MapPin className="h-5 w-5 text-[#0a9396]" />
                 <h3 className="text-[14px] font-black text-gray-900 tracking-wide uppercase">Territories</h3>
               </div>
               <select
                 value={selectedCountry}
                 onChange={(e) => setSelectedCountry(e.target.value)}
                 className="w-full px-4 py-3 rounded-xl border border-white/60 bg-white/60 text-sm font-bold tracking-wide text-gray-900 focus:border-[#0a9396] focus:outline-none focus:ring-4 focus:ring-[#0a9396]/10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] transition-all"
               >
                 <option value="all">Global Matrix (All)</option>
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

        </div>

        {/* Content Grids */}
        <div>
          <div className="flex items-center justify-between mb-8 px-2">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              {activeTab === "experts" ? "Available Pro Nodes" : "Active Client Vectors"}
              <div className="px-3 py-1 rounded-full bg-teal-100/50 border border-teal-200 text-[#0a9396] font-extrabold text-sm shadow-sm backdrop-blur-sm">
                {(activeTab === "experts" ? filteredPros : filteredRequests).length}
              </div>
            </h2>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "experts" && (
               <motion.div key="experts" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                 {filteredPros.length === 0 ? (
                   <div className="bg-white/40 backdrop-blur-2xl border border-white rounded-[2rem] p-16 text-center shadow-[inset_0_2px_15px_rgb(255,255,255,0.7),0_10px_30px_rgb(0,0,0,0.03)]">
                     <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                     <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-2">No nodes found</h3>
                     <p className="text-gray-500 font-bold tracking-wide">Adjust topological filters to reveal targets.</p>
                   </div>
                 ) : (
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                     {filteredPros.map((pro, index) => (
                        <motion.div key={pro.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                          <Link href={`/marketplace/${pro.id}`}>
                            <div className="h-full bg-white/40 backdrop-blur-2xl border border-white rounded-[2rem] p-1.5 shadow-[inset_0_2px_15px_rgb(255,255,255,0.7),0_10px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 group cursor-pointer relative overflow-hidden">
                               <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                               
                               <div className="bg-white/60 rounded-[1.8rem] p-6 lg:p-8 border border-transparent group-hover:border-white/80 h-full flex flex-col relative z-10 transition-colors">
                                 <div className="flex items-start justify-between mb-5">
                                   <div>
                                      <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-xl font-black text-gray-900 tracking-tight group-hover:text-[#0a9396] transition-colors">{pro.name}</h3>
                                        {pro.verified && <CheckCircle2 className="h-5 w-5 text-emerald-500 drop-shadow-sm" />}
                                      </div>
                                      <p className="text-gray-500 font-bold tracking-wide text-sm">{pro.title}</p>
                                   </div>
                                   <div className="flex flex-col items-end gap-1">
                                      <div className="flex items-center gap-1.5 bg-yellow-50/80 px-2.5 py-1 rounded-lg border border-yellow-200/50">
                                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-500" />
                                        <span className="text-yellow-700 font-bold text-xs">{pro.rating}</span>
                                      </div>
                                      <span className="text-xs text-gray-400 font-bold tracking-wide group-hover:text-[#0a9396] transition-colors">{pro.reviews} reviews</span>
                                   </div>
                                 </div>

                                 <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 font-semibold mb-6">
                                    <div className="flex items-center gap-1.5 bg-white/80 px-2.5 py-1 rounded-lg border border-gray-100">
                                      <MapPin className="h-3.5 w-3.5 text-indigo-400" />
                                      <span>{pro.city && pro.country ? `${pro.city}, ${pro.country}` : pro.location}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-white/80 px-2.5 py-1 rounded-lg border border-gray-100">
                                      <span className="relative flex h-2 w-2">
                                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${pro.availability === "available" ? "bg-emerald-400" : "bg-amber-400"}`}></span>
                                        <span className={`relative inline-flex rounded-full h-2 w-2 ${pro.availability === "available" ? "bg-emerald-500" : "bg-amber-500"}`}></span>
                                      </span>
                                      <span className={pro.availability === "available" ? "text-emerald-700" : "text-amber-700 capitalize"}>{pro.availability === "available" ? "Active" : "Busy"}</span>
                                    </div>
                                 </div>

                                 <div className="flex flex-wrap gap-2 mb-6 flex-1">
                                   {pro.specialties.slice(0, 3).map((specialty) => (
                                     <div key={specialty} className="px-3 py-1 bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-100/50 rounded-xl text-[12px] font-bold text-teal-800 tracking-wide">
                                       {specialty}
                                     </div>
                                   ))}
                                   {pro.specialties.length > 3 && (
                                     <div className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-xl text-[12px] font-bold text-gray-600 tracking-wide">
                                       +{pro.specialties.length - 3}
                                     </div>
                                   )}
                                 </div>

                                 <div className="flex items-center justify-between pt-5 border-t border-gray-100/80">
                                    {pro.certifications && pro.certifications.length > 0 ? (
                                      <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-blue-50 rounded-lg">
                                           <Award className="h-4 w-4 text-blue-500" />
                                        </div>
                                        <span className="text-xs text-blue-900 font-bold tracking-wide">
                                          {pro.certifications.length} Credentials
                                        </span>
                                      </div>
                                    ) : <div />}
                                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-[#0a9396] font-black text-lg tracking-tight">
                                      {pro.price}
                                    </span>
                                 </div>
                               </div>
                            </div>
                          </Link>
                        </motion.div>
                     ))}
                   </div>
                 )}
               </motion.div>
            )}

            {activeTab === "requests" && (
               <motion.div key="requests" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                 {filteredRequests.length === 0 ? (
                   <div className="bg-white/40 backdrop-blur-2xl border border-white rounded-[2rem] p-16 text-center shadow-[inset_0_2px_15px_rgb(255,255,255,0.7),0_10px_30px_rgb(0,0,0,0.03)]">
                     <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                     <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-2">No vectors found</h3>
                     <p className="text-gray-500 font-bold tracking-wide">All local request streams are currently empty.</p>
                   </div>
                 ) : (
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                     {filteredRequests.map((request, index) => (
                        <motion.div key={request.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                          <Link href={`/marketplace/requests/${request.id}`}>
                            <div className="h-full bg-white/40 backdrop-blur-2xl border border-white rounded-[2rem] p-1.5 shadow-[inset_0_2px_15px_rgb(255,255,255,0.7),0_10px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 group cursor-pointer relative overflow-hidden">
                               <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                               
                               <div className="bg-white/60 rounded-[1.8rem] p-6 lg:p-8 border border-transparent group-hover:border-white/80 h-full flex flex-col relative z-10 transition-colors">
                                 <div className="flex items-start justify-between mb-4">
                                   <div className="flex-1 pr-3">
                                      <h3 className="text-xl font-black text-gray-900 tracking-tight group-hover:text-indigo-600 transition-colors leading-tight mb-2">{request.project}</h3>
                                      <p className="text-indigo-600/80 font-bold tracking-wide text-sm">{request.company}</p>
                                   </div>
                                   <div className="bg-white px-3 py-1.5 rounded-xl border border-indigo-100 shadow-sm flex items-center gap-1.5 shrink-0">
                                      <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                                      <span className="text-xs font-bold text-indigo-900 uppercase tracking-widest leading-none">{request.status}</span>
                                   </div>
                                 </div>

                                 <p className="text-gray-600 font-medium text-[15px] mb-6 line-clamp-2 italic">
                                   &quot;{request.description}&quot;
                                 </p>

                                 <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 font-semibold mb-6 flex-1">
                                    <div className="flex items-center gap-1.5 bg-white/80 px-2.5 py-1 rounded-lg border border-gray-100">
                                      <MapPin className="h-3.5 w-3.5 text-teal-400" />
                                      <span>{request.city && request.country ? `${request.city}, ${request.country}` : request.location}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-white/80 px-2.5 py-1 rounded-lg border border-gray-100">
                                      <Clock className="h-3.5 w-3.5 text-orange-400" />
                                      <span>{request.posted}</span>
                                    </div>
                                 </div>

                                 <div className="flex flex-wrap gap-2 mb-6">
                                   {request.requirements.slice(0, 2).map((req) => (
                                     <div key={req} className="px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-50 border border-gray-200/50 rounded-xl text-[12px] font-bold text-gray-700 tracking-wide">
                                       {req}
                                     </div>
                                   ))}
                                   {request.requirements.length > 2 && (
                                     <div className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-xl text-[12px] font-bold text-gray-400 tracking-wide">
                                       +{request.requirements.length - 2}
                                     </div>
                                   )}
                                 </div>

                                 <div className="flex items-center justify-between pt-5 border-t border-gray-100/80">
                                    <div className="flex items-center gap-1.5">
                                      <div className="h-8 w-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                                        <DollarSign className="h-4 w-4 text-emerald-600" />
                                      </div>
                                      <span className="font-black text-xl text-emerald-700 tracking-tight">
                                        {request.budget.toLocaleString()}
                                      </span>
                                    </div>
                                    <Button className="h-9 px-5 bg-gray-900 hover:bg-black text-white font-bold tracking-wide rounded-xl border-none shadow-md">
                                       Preview
                                    </Button>
                                 </div>
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
    </div>
  );
}
