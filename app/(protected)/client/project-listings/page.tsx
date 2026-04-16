"use client";

import { Plus, Search, X, CheckCircle2, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency } from "@/lib/utils";

interface Listing {
  id: string;
  title: string;
  description: string;
  budget: number;
  currency: string;
  status: string;
  applicants: number;
  postedDate: string;
}

export default function ProjectListingsPage() {
  const { data: session } = useSession();
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    budget: "",
    category: "",
    timeline: "",
  });

  useEffect(() => {
    if (!session?.user?.id) return;
    setIsLoading(true);
    fetch("/api/projects?userType=client")
      .then((r) => r.json())
      .then((d) => {
        interface BackendProject {
          id: string;
          title: string;
          description: string;
          budget?: number;
          currency: string;
          status: string;
          createdAt: string;
          _count?: { proposals: number };
        }
        const mapped: Listing[] = (d.projects ?? []).map((p: BackendProject) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          budget: p.budget ?? 0,
          currency: p.currency ?? "GBP",
          status: p.status,
          applicants: p._count?.proposals ?? 0,
          postedDate: new Date(p.createdAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
        }));
        setListings(mapped);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [session]);

  const filteredListings = listings.filter(
    (l) =>
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePostListing = async () => {
    setFormError("");
    if (!form.title || !form.description || !form.budget) {
      setFormError("Please fill in the title, description, and budget.");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          budget: form.budget,
          category: form.category || undefined,
          timeline: form.timeline || undefined,
        }),
      });
      if (!response.ok) {
        const data = await response.json();
        setFormError(data.error ?? "Failed to post listing.");
        return;
      }
      const { project: p } = await response.json();
      const newListing: Listing = {
        id: p.id,
        title: p.title,
        description: p.description,
        budget: p.budget ?? 0,
        currency: p.currency ?? "GBP",
        status: p.status,
        applicants: 0,
        postedDate: new Date(p.createdAt).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
      };
      setListings((prev) => [newListing, ...prev]);
      setFormSuccess(true);
      setTimeout(() => {
        setShowForm(false);
        setFormSuccess(false);
        setForm({ title: "", description: "", budget: "", category: "", timeline: "" });
      }, 1500);
    } catch {
      setFormError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusLabel = (status: string) => {
    const map: Record<string, { label: string; className: string }> = {
      under_review: { label: "Under Review", className: "bg-yellow-50 text-yellow-700 border-yellow-200" },
      planning: { label: "Planning", className: "bg-blue-50 text-blue-700 border-blue-200" },
      active: { label: "Active", className: "bg-[#6ece39]/10 text-green-700 border-[#6ece39]/25" },
      completed: { label: "Completed", className: "bg-[#0a9396]/10 text-[#0a9396] border-[#0a9396]/20" },
      on_hold: { label: "On Hold", className: "bg-red-50 text-red-600 border-red-200" },
      cancelled: { label: "Cancelled", className: "bg-gray-100 text-gray-500 border-gray-200" },
    };
    const c = map[status] ?? { label: status, className: "bg-gray-100 text-gray-500 border-gray-200" };
    return (
      <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${c.className}`}>
        {c.label}
      </span>
    );
  };

  const panelClass = "bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl shadow-sm";

  return (
    <div className="relative min-h-screen bg-transparent">
      <div className="fixed top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-[#0a9396]/10 blur-[130px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] left-[20%] w-[45%] h-[45%] rounded-full bg-[#6ece39]/8 blur-[130px] pointer-events-none z-0" />

      <div className="space-y-6 relative z-10 max-w-[1600px] mx-auto pb-12">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className={panelClass}>
          <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Project Listings</h1>
              <p className="text-sm text-gray-500 mt-0.5">Post opportunities and manage your listings</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="h-11 px-5 rounded-xl bg-[#0a9396] hover:bg-[#087579] text-white font-semibold text-sm shadow-sm transition-all flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New Listing
            </button>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className={panelClass}>
          <div className="p-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-[#0a9396] transition-colors" />
              <input
                type="text"
                placeholder="Search listings..."
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-[#0a9396] focus:ring-2 focus:ring-[#0a9396]/10 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </motion.div>

        {/* Listings */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-10 w-10 rounded-full border-4 border-[#0a9396]/20 border-t-[#0a9396] animate-spin" />
          </div>
        ) : filteredListings.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`${panelClass} p-16 text-center flex flex-col items-center`}>
            <div className="h-14 w-14 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center mb-4">
              <Plus className="h-7 w-7 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {searchQuery ? "No listings found" : "No listings yet"}
            </h3>
            <p className="text-gray-500 text-sm max-w-xs mx-auto mb-6">
              {searchQuery ? "Try a different search term." : "Post your first project listing to attract marketing professionals."}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowForm(true)}
                className="px-5 py-2.5 rounded-xl bg-[#0a9396] hover:bg-[#087579] text-white font-semibold text-sm shadow-sm transition-all"
              >
                Post a Listing
              </button>
            )}
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredListings.map((listing, idx) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 }}
                className={`${panelClass} p-6 hover:shadow-md hover:border-[#0a9396]/20 transition-all`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="font-bold text-gray-900 text-lg">{listing.title}</h3>
                      {statusLabel(listing.status)}
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-3">{listing.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                      <span>Budget: {formatCurrency(listing.budget, listing.currency)}</span>
                      <span className="text-gray-200">•</span>
                      <span>Posted: {listing.postedDate}</span>
                      <span className="text-gray-200">•</span>
                      <span>{listing.applicants} applicant{listing.applicants !== 1 ? "s" : ""}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* New Listing Modal */}
        <AnimatePresence>
          {showForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
                onClick={() => !isSubmitting && setShowForm(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="w-full max-w-xl bg-white/95 backdrop-blur-2xl border border-white/80 rounded-2xl shadow-2xl overflow-hidden relative z-10"
              >
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Create New Listing</h3>
                    <p className="text-sm text-gray-500 mt-0.5">Describe your project to attract the right professionals.</p>
                  </div>
                  <button
                    onClick={() => !isSubmitting && setShowForm(false)}
                    className="h-9 w-9 rounded-xl hover:bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-all"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <AnimatePresence>
                    {formError && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="flex items-center gap-2.5 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4 shrink-0" />{formError}
                      </motion.div>
                    )}
                    {formSuccess && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />Listing posted successfully!
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Project Title <span className="text-red-400">*</span></label>
                    <input
                      type="text"
                      placeholder="e.g. SEO Optimization Campaign"
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:border-[#0a9396] focus:ring-2 focus:ring-[#0a9396]/10 outline-none transition-all placeholder-gray-300"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description <span className="text-red-400">*</span></label>
                    <textarea
                      rows={3}
                      placeholder="Describe your project requirements..."
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:border-[#0a9396] focus:ring-2 focus:ring-[#0a9396]/10 outline-none transition-all placeholder-gray-300 resize-none"
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Budget (£) <span className="text-red-400">*</span></label>
                      <input
                        type="number"
                        placeholder="e.g. 2000"
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:border-[#0a9396] focus:ring-2 focus:ring-[#0a9396]/10 outline-none transition-all placeholder-gray-300"
                        value={form.budget}
                        onChange={(e) => setForm({ ...form, budget: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Timeline</label>
                      <input
                        type="text"
                        placeholder="e.g. 3 months"
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:border-[#0a9396] focus:ring-2 focus:ring-[#0a9396]/10 outline-none transition-all placeholder-gray-300"
                        value={form.timeline}
                        onChange={(e) => setForm({ ...form, timeline: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end gap-3">
                  <button
                    onClick={() => !isSubmitting && setShowForm(false)}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePostListing}
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-[#0a9396] hover:bg-[#087579] disabled:opacity-50 text-white font-semibold text-sm shadow-sm transition-all flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4" />
                    )}
                    Post Listing
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
