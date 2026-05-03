"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

export interface ProjectData {
  id?: string;
  name: string;
  description: string;
  budget: string | number | null;
  deadline?: string;
  category?: string;
  requirements?: string;
  objective?: string;
  targetAudience?: string;
  platforms?: string[];
  deliverables?: string[];
  title?: string; // Some parts of the API use 'title' instead of 'name'
  currency?: string;
  status?: string;
  timeline?: string | null;
  pro?: { name: string; id?: string } | null;
  endDate?: string | null;
  startDate?: string | null;
}

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (project: ProjectData) => void;
  title?: string;
  description?: string;
  initialData?: ProjectData | null;
}

const PLATFORMS = ["Meta / Facebook", "Instagram", "Google Ads", "LinkedIn", "TikTok", "Twitter / X", "Email", "SEO", "YouTube", "Other"];
const DELIVERABLE_OPTIONS = ["Social media posts", "Paid ad creatives", "Email campaigns", "Campaign strategy", "Analytics report", "Landing page copy", "Video content", "Blog articles", "Brand guidelines", "Other"];

export function NewProjectModal({ isOpen, onClose, onSuccess, title, description, initialData }: NewProjectModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    budget: "",
    deadline: "",
    category: "",
    requirements: "",
    objective: "",
    targetAudience: "",
    platforms: [] as string[],
    deliverables: [] as string[],
  });

  useEffect(() => {
    if (isOpen && initialData) {
      setNewProject({
        name: initialData.name || "",
        description: initialData.description || "",
        budget: initialData.budget?.toString() || "",
        deadline: initialData.deadline || "",
        category: initialData.category || "",
        requirements: initialData.requirements || "",
        objective: initialData.objective || "",
        targetAudience: initialData.targetAudience || "",
        platforms: initialData.platforms || [],
        deliverables: initialData.deliverables || [],
      });
    } else if (isOpen && !initialData) {
      // Reset for new project
      setNewProject({
        name: "",
        description: "",
        budget: "",
        deadline: "",
        category: "",
        requirements: "",
        objective: "",
        targetAudience: "",
        platforms: [],
        deliverables: [],
      });
    }
  }, [isOpen, initialData]);

  const handleCreateProject = async () => {
    setFormError("");
    if (!newProject.name || !newProject.description || !newProject.budget || !newProject.category || !newProject.objective) {
      setFormError("Please fill in all required fields (including Campaign Objective).");
      return;
    }
    setIsSubmitting(true);
    try {
      const isEditing = !!initialData?.id;
      const url = isEditing ? `/api/projects/${initialData.id}` : "/api/projects";
      const method = isEditing ? "PATCH" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newProject.name,
          description: newProject.description,
          budget: parseFloat(newProject.budget),
          category: newProject.category,
          endDate: newProject.deadline || undefined,
          objective: newProject.objective,
          targetAudience: newProject.targetAudience,
          platforms: newProject.platforms,
          deliverables: newProject.deliverables,
          additionalNotes: newProject.requirements,
        }),
      });
      if (!response.ok) {
        const data = await response.json();
        setFormError(data.error ?? "Failed to create project.");
        return;
      }
      const data = await response.json();
      setFormSuccess(true);
      setTimeout(() => {
        onSuccess(data.project);
        onClose();
        setFormSuccess(false);
        setNewProject({ 
          name: "", description: "", budget: "", deadline: "", category: "", requirements: "",
          objective: "", targetAudience: "", platforms: [], deliverables: [],
        });
      }, 1500);
    } catch {
      setFormError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8"
        >
          <div className="absolute inset-0 bg-gray-950/40 backdrop-blur-sm" onClick={() => !isSubmitting && onClose()} />
          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            className="bg-white/95 backdrop-blur-2xl border border-white/80 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-hidden shadow-xl relative z-10 flex flex-col"
          >
            <div className="p-6 lg:p-8 border-b border-gray-100 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {initialData ? "Edit Product" : (title || "New Product")}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {initialData ? "Update your product details." : (description || "Fill in the details below to get started")}
                </p>
              </div>
              <button
                onClick={() => !isSubmitting && onClose()}
                className="h-9 w-9 rounded-xl hover:bg-gray-100 text-gray-400 transition-all flex items-center justify-center cursor-pointer border-none bg-transparent"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-5">
              <AnimatePresence>
                {formError && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {formError}
                  </motion.div>
                )}
                {formSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex items-center gap-2.5 p-3.5 rounded-xl bg-[#6ece39]/10 border border-[#6ece39]/20 text-[#5ab830] text-sm"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    Project created successfully!
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-600">Project Name <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    placeholder="e.g. Q4 Social Media Campaign"
                    className="w-full bg-white border border-gray-200 p-3 rounded-xl text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#0a9396]/20 focus:border-[#0a9396]/40 transition-all placeholder:text-gray-300"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-600">Category <span className="text-red-400">*</span></label>
                  <select
                    className="w-full bg-white border border-gray-200 p-3 rounded-xl text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#0a9396]/20 focus:border-[#0a9396]/40 transition-all appearance-none cursor-pointer"
                    value={newProject.category}
                    onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                  >
                    <option value="">Select a category</option>
                    <option value="SEO">SEO</option>
                    <option value="PPC">Paid Ads / PPC</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Content Marketing">Content Marketing</option>
                    <option value="Email Marketing">Email Marketing</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600">Description <span className="text-red-400">*</span></label>
                <textarea
                  rows={4}
                  placeholder="Describe the project goals and expected outcomes..."
                  className="w-full bg-white border border-gray-200 p-3 rounded-xl text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#0a9396]/20 focus:border-[#0a9396]/40 transition-all placeholder:text-gray-300 resize-none"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-600">Budget (£) <span className="text-red-400">*</span></label>
                  <input
                    type="number"
                    placeholder="e.g. 5000"
                    className="w-full bg-white border border-gray-200 p-3 rounded-xl text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#0a9396]/20 focus:border-[#0a9396]/40 transition-all placeholder:text-gray-300"
                    value={newProject.budget}
                    onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-600">Deadline</label>
                  <input
                    type="date"
                    className="w-full bg-white border border-gray-200 p-3 rounded-xl text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#0a9396]/20 focus:border-[#0a9396]/40 transition-all"
                    value={newProject.deadline}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5 pt-4 border-t border-gray-100">
                <h3 className="text-sm font-bold text-gray-900">Project Brief Details</h3>
                <p className="text-xs text-gray-500">Provide deeper context for your marketing professional</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600">Campaign Objective <span className="text-red-400">*</span></label>
                <textarea
                  rows={3}
                  placeholder="What is the main goal of this project?"
                  className="w-full bg-white border border-gray-200 p-3 rounded-xl text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#0a9396]/20 focus:border-[#0a9396]/40 transition-all placeholder:text-gray-300 resize-none"
                  value={newProject.objective}
                  onChange={(e) => setNewProject({ ...newProject, objective: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600">Target Audience</label>
                <input
                  type="text"
                  placeholder="e.g. Small business owners in the UK"
                  className="w-full bg-white border border-gray-200 p-3 rounded-xl text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#0a9396]/20 focus:border-[#0a9396]/40 transition-all placeholder:text-gray-300"
                  value={newProject.targetAudience}
                  onChange={(e) => setNewProject({ ...newProject, targetAudience: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600 mb-2 block">Target Platforms</label>
                <div className="flex flex-wrap gap-2">
                  {PLATFORMS.map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewProject(f => ({
                        ...f,
                        platforms: f.platforms.includes(p) ? f.platforms.filter(x => x !== p) : [...f.platforms, p]
                      }))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        newProject.platforms.includes(p) 
                          ? "bg-[#0a9396] text-white border-[#0a9396]" 
                          : "bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600 mb-2 block">Expected Deliverables</label>
                <div className="flex flex-wrap gap-2">
                  {DELIVERABLE_OPTIONS.map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setNewProject(f => ({
                        ...f,
                        deliverables: f.deliverables.includes(d) ? f.deliverables.filter(x => x !== d) : [...f.deliverables, d]
                      }))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        newProject.deliverables.includes(d) 
                          ? "bg-gray-900 text-white border-gray-900" 
                          : "bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600">Additional Requirements</label>
                <textarea
                  rows={3}
                  placeholder="Any specific requirements or details for the pro..."
                  className="w-full bg-white border border-gray-200 p-3 rounded-xl text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#0a9396]/20 focus:border-[#0a9396]/40 transition-all placeholder:text-gray-300 resize-none"
                  value={newProject.requirements}
                  onChange={(e) => setNewProject({ ...newProject, requirements: e.target.value })}
                />
              </div>
            </div>

            <div className="p-6 lg:p-8 bg-gray-50/60 border-t border-gray-100 flex gap-3 shrink-0">
              <button
                type="button"
                onClick={() => !isSubmitting && onClose()}
                className="h-11 flex-1 rounded-xl bg-white border border-gray-200 text-gray-500 text-sm font-medium hover:text-gray-700 transition-all cursor-pointer"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateProject}
                disabled={isSubmitting}
                className="h-11 flex-[2] rounded-xl bg-[#0a9396] hover:bg-[#087579] text-white font-semibold text-sm shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    {initialData ? "Save Changes" : "Create Product"}
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
