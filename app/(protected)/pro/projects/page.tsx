"use client";

import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import {
  FolderKanban, Clock, DollarSign, Users, X, Eye, CheckSquare,
  Calendar, TrendingUp, Plus, LayoutGrid, List, Loader2, Flag,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { format } from "date-fns";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Milestone {
  id: string;
  title: string;
  status: string; // pending | in-progress | completed
  dueDate: string | null;
  completedAt: string | null;
}

interface Project {
  id: string;
  name: string;
  client: string;
  status: string;
  budget: number;
  currency: string;
  deadline: string | null;
  // Real computed progress from API
  progress: number;
  totalMilestones: number;
  completedMilestones: number;
  milestones: Milestone[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDeadline(iso: string | null) {
  if (!iso) return "No deadline";
  const d = new Date(iso);
  return isNaN(d.getTime()) ? iso : format(d, "d MMM yyyy");
}

function calcProgress(milestones: Milestone[]) {
  if (milestones.length === 0) return 0;
  const done = milestones.filter((m) => m.status === "completed").length;
  return Math.round((done / milestones.length) * 100);
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProProjectsPage() {
  const { data: session } = useSession();

  const [projects, setProjects] = useState<Project[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showOverview, setShowOverview] = useState(false);
  const [showMilestones, setShowMilestones] = useState(false);

  // Milestone management
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [milestonesLoading, setMilestonesLoading] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [addingMilestone, setAddingMilestone] = useState(false);

  const fetchProjects = useCallback(async () => {
    if (!session?.user?.id) return;
    const r = await fetch("/api/projects?userType=pro");
    const d = await r.json();
    const mapped: Project[] = (d.projects ?? []).map((p: {
      id: string; title: string; status: string; budget: number; currency: string;
      endDate?: string | null; client?: { name: string } | null;
      progress: number; totalMilestones: number; completedMilestones: number;
      milestones: Milestone[];
    }) => ({
      id: p.id,
      name: p.title,
      client: p.client?.name ?? "Unknown Client",
      status: p.status,
      budget: p.budget ?? 0,
      currency: p.currency ?? "GBP",
      deadline: p.endDate ?? null,
      progress: p.progress ?? 0,
      totalMilestones: p.totalMilestones ?? 0,
      completedMilestones: p.completedMilestones ?? 0,
      milestones: p.milestones ?? [],
    }));
    setProjects(mapped);
  }, [session]);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const openMilestones = async (project: Project) => {
    setSelectedProject(project);
    setShowMilestones(true);
    setMilestonesLoading(true);
    try {
      const r = await fetch(`/api/projects/${project.id}/milestones`);
      const d = await r.json();
      setMilestones(d.milestones ?? []);
    } catch { setMilestones([]); }
    finally { setMilestonesLoading(false); }
  };

  const openOverview = (project: Project) => {
    setSelectedProject(project);
    setShowOverview(true);
  };

  const toggleMilestone = async (milestone: Milestone) => {
    if (!selectedProject) return;
    const newStatus = milestone.status === "completed" ? "pending" : "completed";
    setSavingId(milestone.id);
    try {
      const r = await fetch(`/api/milestones/${milestone.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (r.ok) {
        const updated = milestones.map((m) =>
          m.id === milestone.id ? { ...m, status: newStatus, completedAt: newStatus === "completed" ? new Date().toISOString() : null } : m
        );
        setMilestones(updated);
        const newProgress = calcProgress(updated);
        const updatedProject = {
          ...selectedProject,
          milestones: updated,
          progress: newProgress,
          completedMilestones: updated.filter((m) => m.status === "completed").length,
        };
        setSelectedProject(updatedProject);
        setProjects((prev) => prev.map((p) => p.id === selectedProject.id ? { ...p, progress: newProgress, completedMilestones: updatedProject.completedMilestones } : p));
      }
    } finally { setSavingId(null); }
  };

  const addMilestone = async () => {
    if (!selectedProject || !newTitle.trim()) return;
    setAddingMilestone(true);
    try {
      const r = await fetch(`/api/projects/${selectedProject.id}/milestones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle.trim() }),
      });
      if (r.ok) {
        const d = await r.json();
        const updated = [...milestones, d.milestone];
        setMilestones(updated);
        setNewTitle("");
        setShowAddForm(false);
        const newProgress = calcProgress(updated);
        setSelectedProject((p) => p ? { ...p, milestones: updated, progress: newProgress, totalMilestones: updated.length } : p);
        setProjects((prev) => prev.map((p) => p.id === selectedProject.id ? { ...p, progress: newProgress, totalMilestones: updated.length } : p));
      }
    } finally { setAddingMilestone(false); }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 100, damping: 15 } },
  };

  return (
    <div className="relative min-h-screen max-w-7xl mx-auto pb-12 space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/40 p-6 lg:p-8 rounded-4xl border border-white/60 shadow-sm backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-white rounded-2xl shadow-sm border border-white/80">
            <FolderKanban className="h-7 w-7 text-[#0a9396]" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 flex items-center gap-3">
              Project Portfolio
              <Badge variant="primary" size="sm" className="bg-[#0a9396]/10 text-[#0a9396] border-[#0a9396]/20 font-bold text-[11px] uppercase">
                {projects.filter((p) => p.status === "active").length} Active
              </Badge>
            </h1>
            <p className="text-gray-500 mt-1 font-medium">Manage and deliver your marketing projects.</p>
          </div>
        </div>
        <div className="flex bg-white/60 backdrop-blur-md rounded-2xl p-1.5 border border-white/80 shadow-sm">
          {(["grid", "list"] as const).map((m) => (
            <button key={m} onClick={() => setViewMode(m)}
              className={`p-2.5 rounded-xl transition-all ${viewMode === m ? "bg-white text-[#0a9396] shadow-md" : "text-gray-400 hover:text-gray-700"}`}>
              {m === "grid" ? <LayoutGrid className="h-5 w-5" /> : <List className="h-5 w-5" />}
            </button>
          ))}
        </div>
      </div>

      {/* Project cards */}
      <motion.div
        initial="hidden" animate="show"
        variants={{ show: { transition: { staggerChildren: 0.08 } } }}
        className={viewMode === "grid" ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6" : "flex flex-col gap-5"}
      >
        {projects.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
            <FolderKanban className="h-12 w-12 text-gray-200 mb-4" />
            <p className="text-gray-500 font-semibold">No projects assigned yet</p>
          </div>
        ) : projects.map((project) => {
          const isDone = project.progress === 100;
          return (
            <motion.div key={project.id} variants={itemVariants} layout>
              <div className={`h-full flex flex-col rounded-4xl border backdrop-blur-xl transition-all hover:shadow-lg hover:-translate-y-0.5 overflow-hidden
                ${isDone ? "bg-emerald-50/40 border-emerald-100" : "bg-white/60 border-white/80"} shadow-sm`}>

                {/* Top colour bar */}
                <div className={`h-1.5 ${isDone ? "bg-emerald-400" : "bg-linear-to-r from-[#0a9396] to-cyan-400"}`} />

                <div className="p-7 flex-1 flex flex-col gap-5">
                  {/* Title + status */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-black text-gray-900 leading-tight mb-2">{project.name}</h3>
                      <span className="flex items-center gap-1.5 text-sm font-bold text-gray-500 bg-white/60 px-3 py-1.5 rounded-lg border border-white w-max">
                        <Users className="h-4 w-4 text-[#0a9396]" />
                        {project.client}
                      </span>
                    </div>
                    <Badge
                      variant={project.status === "completed" ? "success" : project.status === "planning" ? "warning" : "info"}
                      size="md" className="uppercase font-black text-[10px] tracking-widest shrink-0">
                      {project.status.replace("_", " ")}
                    </Badge>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: DollarSign, label: "Budget", value: formatCurrency(project.budget, project.currency) },
                      { icon: Clock, label: "Deadline", value: formatDeadline(project.deadline) },
                    ].map((m) => (
                      <div key={m.label} className="flex items-center gap-3 bg-white/60 p-3 rounded-xl border border-white shadow-sm">
                        <div className="p-2 bg-gray-100 rounded-lg shrink-0"><m.icon className="h-4 w-4 text-gray-500" /></div>
                        <div>
                          <p className="text-[9px] text-gray-400 uppercase tracking-widest">{m.label}</p>
                          <p className="text-sm font-black text-gray-900">{m.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1.5 text-gray-600 font-bold">
                        <Flag className="h-3.5 w-3.5 text-[#0a9396]" />
                        Milestones
                      </div>
                      {project.totalMilestones > 0 ? (
                        <span className="font-black text-gray-900">
                          {project.completedMilestones}/{project.totalMilestones}
                          <span className={`ml-2 font-bold text-sm ${isDone ? "text-emerald-500" : "text-gray-400"}`}>
                            ({project.progress}%)
                          </span>
                        </span>
                      ) : (
                        <span className="text-xs text-amber-600 font-semibold">None set</span>
                      )}
                    </div>
                    <div className="h-2.5 rounded-full bg-black/5 overflow-hidden border border-white/50 shadow-inner">
                      <motion.div
                        className={`h-full rounded-full ${isDone ? "bg-emerald-400" : "bg-linear-to-r from-[#0a9396] to-cyan-400"}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${project.progress}%` }}
                        transition={{ duration: 1.2, type: "spring", bounce: 0.2 }}
                      />
                    </div>
                    {project.totalMilestones === 0 && (
                      <p className="text-xs text-amber-600 font-medium">Add milestones in the Tasks panel to track real progress</p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4 bg-gray-50/60 border-t border-white flex gap-3">
                  <button onClick={() => openOverview(project)}
                    className="flex-1 h-11 rounded-xl bg-white border border-gray-200 hover:border-[#0a9396]/30 hover:text-[#0a9396] text-gray-600 text-sm font-bold transition-all flex items-center justify-center gap-2">
                    <Eye className="h-4 w-4" /> View Overview
                  </button>
                  <button onClick={() => openMilestones(project)}
                    className="flex-1 h-11 rounded-xl bg-gray-900 hover:bg-[#0a9396] text-white text-sm font-bold transition-all flex items-center justify-center gap-2">
                    <CheckSquare className="h-4 w-4" /> Tasks
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Overview modal */}
      <AnimatePresence>
        {showOverview && selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-xl" onClick={() => setShowOverview(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }} transition={{ type: "spring", stiffness: 120, damping: 18 }}
              className="bg-white/90 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl border border-white max-w-3xl w-full max-h-[90vh] overflow-y-auto relative z-10">

              <div className="flex items-start justify-between p-8 border-b border-gray-100">
                <div>
                  <h2 className="text-2xl font-black text-gray-900">{selectedProject.name}</h2>
                  <p className="text-gray-500 mt-1">Client: <span className="font-bold text-gray-800">{selectedProject.client}</span></p>
                </div>
                <button onClick={() => setShowOverview(false)} className="p-2 rounded-full hover:bg-gray-100 text-gray-400">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Users, label: "Origin Client", value: selectedProject.client, bg: "bg-blue-50 text-blue-600" },
                    { icon: DollarSign, label: "Financial Budget", value: formatCurrency(selectedProject.budget, selectedProject.currency), bg: "bg-green-50 text-green-600" },
                    { icon: Calendar, label: "Submission Deadline", value: formatDeadline(selectedProject.deadline), bg: "bg-purple-50 text-purple-600" },
                    { icon: Flag, label: "Milestone Progress", value: `${selectedProject.completedMilestones} / ${selectedProject.totalMilestones} complete`, bg: "bg-[#0a9396]/10 text-[#0a9396]" },
                  ].map((kpi) => (
                    <div key={kpi.label} className="flex items-center gap-4 p-5 rounded-2xl border border-white shadow-sm bg-white">
                      <div className={`p-3 rounded-xl ${kpi.bg} shrink-0`}><kpi.icon className="h-6 w-6" /></div>
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest">{kpi.label}</p>
                        <p className="text-base font-black text-gray-900">{kpi.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Progress display */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-sm font-black text-gray-500 uppercase tracking-widest">
                      <TrendingUp className="h-4 w-4 text-[#0a9396]" />
                      Global Delivery Progress
                    </div>
                    <span className="text-2xl font-black text-gray-900">{selectedProject.progress}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${selectedProject.progress === 100 ? "bg-emerald-400" : "bg-linear-to-r from-[#0a9396] to-cyan-400"}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedProject.progress}%` }}
                      transition={{ duration: 1.2, type: "spring" }}
                    />
                  </div>
                  {selectedProject.totalMilestones === 0 && (
                    <p className="text-xs text-amber-600 mt-3 font-medium">Progress is status-based — add milestones in the Tasks panel for real tracking.</p>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={() => { setShowOverview(false); openMilestones(selectedProject); }}
                    className="flex-1 h-12 rounded-2xl bg-gray-900 hover:bg-[#0a9396] text-white font-bold transition-all flex items-center justify-center gap-2">
                    <CheckSquare className="h-4 w-4" /> Open Task Engine
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Milestones modal */}
      <AnimatePresence>
        {showMilestones && selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-xl"
              onClick={() => { setShowMilestones(false); setShowAddForm(false); setNewTitle(""); }} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }} transition={{ type: "spring", stiffness: 120, damping: 18 }}
              className="bg-white/90 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl border border-white max-w-3xl w-full max-h-[90vh] flex flex-col relative z-10 overflow-hidden">

              {/* Progress bar at top */}
              <div className="h-1.5 bg-gray-100 shrink-0">
                <motion.div className="h-full bg-linear-to-r from-[#0a9396] to-cyan-400"
                  animate={{ width: `${calcProgress(milestones)}%` }} transition={{ type: "spring" }} />
              </div>

              <div className="flex items-center justify-between p-7 border-b border-gray-100 shrink-0">
                <div>
                  <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                    <Flag className="h-5 w-5 text-[#0a9396]" />
                    Milestones — {selectedProject.name}
                  </h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {milestones.filter((m) => m.status === "completed").length} of {milestones.length} completed
                    {milestones.length > 0 && ` · ${calcProgress(milestones)}%`}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => setShowAddForm(true)}
                    className="h-10 px-5 rounded-xl bg-[#0a9396] hover:bg-[#087579] text-white font-bold text-sm flex items-center gap-2 transition-all">
                    <Plus className="h-4 w-4" /> Add Milestone
                  </button>
                  <button onClick={() => { setShowMilestones(false); setShowAddForm(false); setNewTitle(""); }}
                    className="p-2 rounded-full hover:bg-gray-100 text-gray-400">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-7 space-y-4">

                {/* Add milestone form */}
                <AnimatePresence>
                  {showAddForm && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <div className="bg-[#0a9396]/5 border-2 border-[#0a9396]/30 rounded-2xl p-5 flex gap-3">
                        <Input
                          placeholder="Milestone title e.g. Keyword research complete"
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && addMilestone()}
                          autoFocus
                          className="flex-1 bg-white border-gray-200 h-12 rounded-xl text-sm"
                        />
                        <button onClick={addMilestone} disabled={!newTitle.trim() || addingMilestone}
                          className="h-12 px-5 bg-gray-900 hover:bg-[#0a9396] text-white font-bold rounded-xl transition-all disabled:opacity-50 flex items-center gap-2">
                          {addingMilestone ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                        </button>
                        <button onClick={() => { setShowAddForm(false); setNewTitle(""); }}
                          className="h-12 px-4 text-gray-500 hover:bg-gray-100 rounded-xl transition-all font-medium text-sm">
                          Cancel
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Milestone list */}
                {milestonesLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-[#0a9396]" />
                  </div>
                ) : milestones.length === 0 ? (
                  <div className="text-center py-14">
                    <Flag className="h-10 w-10 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-500 font-semibold mb-1">No milestones yet</p>
                    <p className="text-sm text-gray-400">Add milestones above — completing them moves the progress bar for both you and the client.</p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {milestones.map((m) => {
                      const done = m.status === "completed";
                      const isSaving = savingId === m.id;
                      return (
                        <motion.div key={m.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          onClick={() => !isSaving && toggleMilestone(m)}
                          className={`group p-5 rounded-2xl border-2 cursor-pointer transition-all hover:-translate-y-0.5 ${
                            done
                              ? "bg-emerald-50/60 border-emerald-200 hover:border-emerald-300"
                              : "bg-white border-white shadow-sm hover:border-[#0a9396]/30"
                          }`}>
                          <div className="flex items-center gap-4">
                            {/* Checkbox */}
                            <div className={`h-8 w-8 rounded-[10px] border-2 flex items-center justify-center transition-all shrink-0 ${
                              done ? "bg-emerald-500 border-emerald-500" : "border-gray-300 group-hover:border-[#0a9396]"
                            }`}>
                              {isSaving
                                ? <Loader2 className="h-4 w-4 text-white animate-spin" />
                                : done && <CheckSquare className="h-4 w-4 text-white" />}
                            </div>

                            <div className="flex-1 min-w-0">
                              <p className={`text-base font-bold transition-all ${done ? "line-through text-gray-400" : "text-gray-900 group-hover:text-[#0a9396]"}`}>
                                {m.title}
                              </p>
                              {m.dueDate && (
                                <p className="text-xs text-gray-400 mt-0.5">Due {format(new Date(m.dueDate), "d MMM yyyy")}</p>
                              )}
                            </div>

                            <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full shrink-0 ${
                              done ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
                            }`}>
                              {done ? "Done" : "Pending"}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
