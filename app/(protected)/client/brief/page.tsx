"use client";

import {
  ClipboardList, Plus, X, AlertCircle, CheckCircle2,
  Send, ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PLATFORMS = ["Meta / Facebook", "Instagram", "Google Ads", "LinkedIn", "TikTok", "Twitter / X", "Email", "SEO", "YouTube", "Other"];
const DELIVERABLE_OPTIONS = ["Social media posts", "Paid ad creatives", "Email campaigns", "Campaign strategy", "Analytics report", "Landing page copy", "Video content", "Blog articles", "Brand guidelines", "Other"];

interface Brief {
  id: string;
  title: string;
  objective: string;
  targetAudience: string | null;
  budget: number | null;
  currency: string;
  platforms: string[];
  deliverables: string[];
  timeline: string | null;
  additionalNotes: string | null;
  createdAt: string;
  project: { id: string; title: string } | null;
}

const emptyForm = {
  title: "", objective: "", targetAudience: "", budget: "", currency: "GBP",
  platforms: [] as string[], deliverables: [] as string[], timeline: "", additionalNotes: "",
};

export default function ClientBriefPage() {
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    fetch("/api/client/briefs")
      .then(r => r.json())
      .then(d => setBriefs(d.briefs ?? []))
      .finally(() => setLoading(false));
  }, []);

  const togglePlatform = (p: string) =>
    setForm(f => ({ ...f, platforms: f.platforms.includes(p) ? f.platforms.filter(x => x !== p) : [...f.platforms, p] }));

  const toggleDeliverable = (d: string) =>
    setForm(f => ({ ...f, deliverables: f.deliverables.includes(d) ? f.deliverables.filter(x => x !== d) : [...f.deliverables, d] }));

  const handleNext = () => {
    if (step === 1 && (!form.title || !form.objective)) {
      setFormError("Please fill in the project title and objective.");
      return;
    }
    setFormError("");
    setStep(s => s + 1);
  };

  const handleSave = async () => {
    setFormError("");
    setSaving(true);
    try {
      const res = await fetch("/api/client/briefs", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, budget: form.budget || null }),
      });
      if (!res.ok) { setFormError((await res.json()).error ?? "Failed to submit"); return; }
      const { brief } = await res.json();
      setBriefs(prev => [brief, ...prev]);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setIsCreating(false);
        setForm(emptyForm);
        setStep(1);
      }, 2000);
    } catch { setFormError("Network error."); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Project Briefs</h1>
          <p className="text-gray-500 font-medium mt-1">Tell your marketing pro exactly what you need</p>
        </div>
        <button onClick={() => setIsCreating(true)}
          className="h-11 px-5 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-sm flex items-center gap-2 cursor-pointer shadow-sm">
          <Plus className="h-4 w-4" /> New Brief
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400 font-medium">Loading briefs...</div>
      ) : briefs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-20 w-20 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-5">
            <ClipboardList className="h-9 w-9 text-gray-300" />
          </div>
          <h3 className="text-lg font-black text-gray-900 mb-1">No briefs submitted yet</h3>
          <p className="text-gray-400 font-medium text-sm max-w-xs mb-6">
            A well-written brief helps your marketing pro understand your goals and deliver better results.
          </p>
          <button onClick={() => setIsCreating(true)}
            className="h-10 px-5 rounded-xl bg-gray-900 text-white font-bold text-sm flex items-center gap-2 cursor-pointer">
            <Plus className="h-4 w-4" /> Create Your First Brief
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {briefs.map(brief => (
            <div key={brief.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-gray-200 transition-all">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-gray-900 text-lg mb-1">{brief.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{brief.objective}</p>
                  <div className="flex items-center gap-3 mt-3 flex-wrap">
                    {brief.budget && (
                      <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        Budget: {brief.currency} {brief.budget.toLocaleString()}
                      </span>
                    )}
                    {brief.timeline && (
                      <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        Timeline: {brief.timeline}
                      </span>
                    )}
                    {brief.platforms.slice(0, 3).map(p => (
                      <span key={p} className="text-xs font-bold text-[#0a9396] bg-[#0a9396]/10 px-3 py-1 rounded-full">{p}</span>
                    ))}
                    {brief.platforms.length > 3 && (
                      <span className="text-xs font-bold text-gray-400">+{brief.platforms.length - 3} more</span>
                    )}
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-300 mt-1 ml-4 shrink-0" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Multi-step Brief Modal */}
      <AnimatePresence>
        {isCreating && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}>
              <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                <div>
                  <h2 className="text-xl font-black text-gray-900">New Project Brief</h2>
                  <p className="text-sm text-gray-400 font-medium">Step {step} of 3</p>
                </div>
                <button onClick={() => { setIsCreating(false); setForm(emptyForm); setFormError(""); setStep(1); }}
                  className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900 cursor-pointer">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Progress */}
              <div className="px-6 pt-4">
                <div className="flex gap-2">
                  {[1, 2, 3].map(s => (
                    <div key={s} className={`flex-1 h-1.5 rounded-full transition-all ${step >= s ? "bg-[#0a9396]" : "bg-gray-100"}`} />
                  ))}
                </div>
              </div>

              <div className="p-6 space-y-5">
                <AnimatePresence>
                  {formError && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
                      <AlertCircle className="h-4 w-4 shrink-0" />{formError}
                    </motion.div>
                  )}
                  {success && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm font-medium">
                      <CheckCircle2 className="h-4 w-4 shrink-0" />Brief submitted successfully!
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                      <div className="space-y-1.5">
                        <label className="block text-[13px] font-black uppercase tracking-wider text-gray-500">
                          Project Title <span className="text-red-400">*</span>
                        </label>
                        <input type="text" placeholder="e.g. Q3 Social Media Marketing Campaign"
                          value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 transition-all" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[13px] font-black uppercase tracking-wider text-gray-500">
                          Campaign Objective <span className="text-red-400">*</span>
                        </label>
                        <textarea rows={4} placeholder="What are you trying to achieve? e.g. Increase brand awareness, generate 200 leads per month, drive £50K in online sales..."
                          value={form.objective} onChange={e => setForm(f => ({ ...f, objective: e.target.value }))}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 transition-all resize-none" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[13px] font-black uppercase tracking-wider text-gray-500">Target Audience</label>
                        <input type="text" placeholder="e.g. UK homeowners aged 30-55, interested in home improvement"
                          value={form.targetAudience} onChange={e => setForm(f => ({ ...f, targetAudience: e.target.value }))}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 transition-all" />
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                      <div>
                        <label className="block text-[13px] font-black uppercase tracking-wider text-gray-500 mb-3">Platforms</label>
                        <div className="flex flex-wrap gap-2">
                          {PLATFORMS.map(p => (
                            <button key={p} onClick={() => togglePlatform(p)}
                              className={`h-9 px-3 rounded-xl text-sm font-bold border transition-all cursor-pointer ${form.platforms.includes(p) ? "bg-[#0a9396] text-white border-[#0a9396]" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}>
                              {p}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-[13px] font-black uppercase tracking-wider text-gray-500 mb-3">Expected Deliverables</label>
                        <div className="flex flex-wrap gap-2">
                          {DELIVERABLE_OPTIONS.map(d => (
                            <button key={d} onClick={() => toggleDeliverable(d)}
                              className={`h-9 px-3 rounded-xl text-sm font-bold border transition-all cursor-pointer ${form.deliverables.includes(d) ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}>
                              {d}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2 space-y-1.5">
                          <label className="block text-[13px] font-black uppercase tracking-wider text-gray-500">Budget</label>
                          <input type="number" placeholder="5000"
                            value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 transition-all" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-[13px] font-black uppercase tracking-wider text-gray-500">Currency</label>
                          <select value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 transition-all">
                            {["GBP", "USD", "EUR"].map(c => <option key={c}>{c}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[13px] font-black uppercase tracking-wider text-gray-500">Timeline</label>
                        <input type="text" placeholder="e.g. 3 months starting ASAP"
                          value={form.timeline} onChange={e => setForm(f => ({ ...f, timeline: e.target.value }))}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 transition-all" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[13px] font-black uppercase tracking-wider text-gray-500">Additional Notes</label>
                        <textarea rows={3} placeholder="Anything else your pro should know..."
                          value={form.additionalNotes} onChange={e => setForm(f => ({ ...f, additionalNotes: e.target.value }))}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 transition-all resize-none" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex gap-3 pt-2">
                  {step > 1 && (
                    <button onClick={() => { setStep(s => s - 1); setFormError(""); }}
                      className="h-11 px-5 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 cursor-pointer">
                      Back
                    </button>
                  )}
                  {step < 3 ? (
                    <button onClick={handleNext}
                      className="flex-1 h-11 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer">
                      Continue <ChevronRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button onClick={handleSave} disabled={saving}
                      className="flex-1 h-11 rounded-xl bg-[#0a9396] hover:bg-[#0a9396]/90 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm shadow-teal-500/20">
                      <Send className="h-4 w-4" />{saving ? "Submitting..." : "Submit Brief"}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
