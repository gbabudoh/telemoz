"use client";

import {
  FolderKanban,
  DollarSign,
  TrendingUp,
  Search,
  CheckCircle2,
  Calendar,
  Clock,
  X,
  Plus,
  ArrowRight,
  MessageSquare,
  FileText,
  Flag,
  Package,
  AlertCircle,
  Circle,
  Loader2,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NewProjectModal, ProjectData } from "@/components/projects/NewProjectModal";
import { format, differenceInDays, isPast } from "date-fns";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Milestone {
  id: string;
  title: string;
  status: string; // pending | in-progress | completed
  dueDate: string | null;
}

interface Deliverable {
  id: string;
  title: string;
  approvalStatus: string; // pending_review | approved | revision_requested
}

interface Project {
  id: string;
  name: string;
  pro: string;
  proId: string | null;
  status: string;
  progress: number;
  budget: number;
  currency: string;
  deadline: string | null;
  startDate: string | null;
  description: string;
  // Real tracking data
  totalMilestones: number;
  completedMilestones: number;
  totalDeliverables: number;
  approvedDeliverables: number;
  amountPaid: number;
  nextMilestoneName: string | null;
  nextMilestoneDue: string | null;
  milestones: Milestone[];
  deliverables: Deliverable[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getStatusConfig(status: string) {
  const configs: Record<string, { bg: string; text: string; border: string; label: string }> = {
    active:       { bg: "bg-emerald-50",  text: "text-emerald-700", border: "border-emerald-200", label: "Active" },
    completed:    { bg: "bg-teal-50",     text: "text-[#0a9396]",   border: "border-[#0a9396]/20", label: "Completed" },
    planning:     { bg: "bg-amber-50",    text: "text-amber-700",   border: "border-amber-200",  label: "Planning" },
    on_hold:      { bg: "bg-red-50",      text: "text-red-600",     border: "border-red-200",    label: "On Hold" },
    under_review: { bg: "bg-gray-100",    text: "text-gray-600",    border: "border-gray-200",   label: "Under Review" },
    cancelled:    { bg: "bg-gray-100",    text: "text-gray-400",    border: "border-gray-200",   label: "Cancelled" },
  };
  return configs[status] ?? configs.under_review;
}

function getMilestoneIcon(status: string) {
  if (status === "completed") return <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />;
  if (status === "in-progress") return <Circle className="h-4 w-4 text-amber-500 fill-amber-100 shrink-0" />;
  return <Circle className="h-4 w-4 text-gray-300 shrink-0" />;
}

function getDeliverableIcon(status: string) {
  if (status === "approved") return <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />;
  if (status === "revision_requested") return <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />;
  return <Circle className="h-4 w-4 text-gray-300 shrink-0" />;
}

function progressLabel(p: Project): string {
  if (p.totalMilestones > 0)
    return `${p.completedMilestones} of ${p.totalMilestones} milestones done`;
  if (p.totalDeliverables > 0)
    return `${p.approvedDeliverables} of ${p.totalDeliverables} deliverables approved`;
  return "No milestones set yet";
}

function daysInfo(deadline: string | null, status: string) {
  if (!deadline || status === "completed") return null;
  const days = differenceInDays(new Date(deadline), new Date());
  const overdue = days < 0;
  return { days: Math.abs(days), overdue };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ClientProjectsPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchProjects = useCallback(async () => {
    if (!session?.user?.id) return;
    try {
      const r = await fetch("/api/projects?userType=client");
      const d = await r.json();
      const mapped: Project[] = (d.projects ?? []).map((p: {
        id: string; title: string; status: string; budget?: number; currency: string;
        endDate?: string | null; startDate?: string | null; description: string;
        pro?: { id: string; name: string } | null;
        progress: number;
        totalMilestones: number; completedMilestones: number;
        totalDeliverables: number; approvedDeliverables: number;
        amountPaid: number;
        nextMilestoneName: string | null; nextMilestoneDue: string | null;
        milestones: Milestone[]; deliverables: Deliverable[];
      }) => ({
        id: p.id,
        name: p.title,
        pro: p.pro?.name ?? "Assigning Pro…",
        proId: p.pro?.id ?? null,
        status: p.status,
        progress: p.progress,
        budget: p.budget ?? 0,
        currency: p.currency ?? "GBP",
        deadline: p.endDate ?? null,
        startDate: p.startDate ?? null,
        description: p.description,
        totalMilestones: p.totalMilestones,
        completedMilestones: p.completedMilestones,
        totalDeliverables: p.totalDeliverables,
        approvedDeliverables: p.approvedDeliverables,
        amountPaid: p.amountPaid,
        nextMilestoneName: p.nextMilestoneName,
        nextMilestoneDue: p.nextMilestoneDue,
        milestones: p.milestones ?? [],
        deliverables: p.deliverables ?? [],
      }));
      setProjects(mapped);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  }, [session]);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const openDetail = async (project: Project) => {
    // Show modal immediately but with corrected progress (0 unless milestones exist)
    const initialProgress = project.totalMilestones > 0
      ? project.progress
      : project.totalDeliverables > 0
      ? project.progress
      : project.status === "completed" ? 100 : 0;
    setSelectedProject({ ...project, progress: initialProgress });
    setDetailLoading(true);
    try {
      const r = await fetch(`/api/projects/${project.id}`);
      const d = await r.json();
      if (d.project) {
        const p = d.project;
        const totalMilestones = p.milestones?.length ?? 0;
        const completedMilestones = p.milestones?.filter((m: Milestone) => m.status === "completed").length ?? 0;
        const totalDeliverables = p.deliverables?.length ?? 0;
        const approvedDeliverables = p.deliverables?.filter((d: Deliverable) => d.approvalStatus === "approved").length ?? 0;
        setSelectedProject({
          ...project,
          milestones: p.milestones ?? [],
          deliverables: p.deliverables ?? [],
          totalMilestones,
          completedMilestones,
          totalDeliverables,
          approvedDeliverables,
          progress: totalMilestones > 0
            ? Math.round((completedMilestones / totalMilestones) * 100)
            : totalDeliverables > 0
            ? Math.round((approvedDeliverables / totalDeliverables) * 100)
            : p.status === "completed" ? 100 : 0,
        });
      }
    } catch { /* keep existing */ }
    finally { setDetailLoading(false); }
  };

  const handleOnSuccess = (p: ProjectData) => {
    fetchProjects();
  };

  const filteredProjects = projects.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      (p.name.toLowerCase().includes(q) || p.pro.toLowerCase().includes(q)) &&
      (statusFilter === "all" || p.status === statusFilter)
    );
  });

  const stats = [
    { title: "In Progress", value: projects.filter((p) => ["active", "planning"].includes(p.status)).length, icon: TrendingUp, color: "text-[#0a9396]", bg: "bg-[#0a9396]/10" },
    { title: "Under Review", value: projects.filter((p) => p.status === "under_review").length, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { title: "Completed", value: projects.filter((p) => p.status === "completed").length, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Total Budget", value: formatCurrency(projects.reduce((s, p) => s + p.budget, 0), "GBP"), icon: DollarSign, color: "text-[#0a9396]", bg: "bg-[#0a9396]/10" },
  ];

  const panelClass = "bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl shadow-sm overflow-hidden";

  return (
    <div className="relative min-h-screen bg-transparent">
      <div className="fixed top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-[#0a9396]/10 blur-[130px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] left-[20%] w-[45%] h-[45%] rounded-full bg-[#0a9396]/8 blur-[130px] pointer-events-none z-0" />

      <div className="space-y-8 relative z-10 max-w-[1600px] mx-auto pb-12">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className={panelClass}>
          <div className="p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-[#0a9396]/10 border border-[#0a9396]/20 shrink-0">
                <FolderKanban className="h-7 w-7 text-[#0a9396]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Projects</h1>
                <p className="text-gray-500 text-sm mt-0.5">
                  {isLoading ? "Loading…" : `${projects.length} project${projects.length !== 1 ? "s" : ""} in your workspace`}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowNewProjectModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0a9396] hover:bg-[#087579] text-white font-semibold text-sm shadow-sm transition-all"
            >
              <Plus className="h-4 w-4" />
              New Project
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div key={s.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 * i }}
              className={`${panelClass} p-5`}>
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${s.bg} shrink-0`}>
                  <s.icon className={`h-4 w-4 ${s.color}`} />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{s.value}</p>
                  <p className="text-xs text-gray-500">{s.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className={`${panelClass} p-4`}>
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
              <input
                type="text"
                placeholder="Search by project name or assigned pro…"
                className="w-full pl-11 pr-4 py-2.5 bg-white/60 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#0a9396]/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto">
              {["all", "active", "planning", "under_review", "on_hold", "completed"].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    statusFilter === s ? "bg-[#0a9396] text-white" : "bg-white/60 text-gray-500 border border-gray-100 hover:text-gray-700"
                  }`}
                >
                  {s === "all" ? "All" : s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* List */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 rounded-full border-4 border-[#0a9396]/20 border-t-[#0a9396] animate-spin" />
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredProjects.length === 0 ? (
              <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className={`${panelClass} p-16 text-center flex flex-col items-center`}>
                <FolderKanban className="h-10 w-10 text-gray-200 mb-4" />
                <h3 className="text-base font-semibold text-gray-900 mb-2">
                  {searchQuery || statusFilter !== "all" ? "No projects match" : "No projects yet"}
                </h3>
                <p className="text-sm text-gray-400 max-w-xs mb-5">
                  {searchQuery || statusFilter !== "all"
                    ? "Clear your filters to see all projects."
                    : "Post your first project and get matched with a marketing professional."}
                </p>
                {searchQuery || statusFilter !== "all" ? (
                  <button onClick={() => { setSearchQuery(""); setStatusFilter("all"); }}
                    className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-all">
                    Clear Filters
                  </button>
                ) : (
                  <button onClick={() => setShowNewProjectModal(true)}
                    className="px-5 py-2.5 rounded-xl bg-[#0a9396] text-white font-semibold text-sm">
                    New Project
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.div layout className="flex flex-col gap-5">
                {filteredProjects.map((project, idx) => {
                  const sc = getStatusConfig(project.status);
                  const deadline = daysInfo(project.deadline, project.status);
                  const budgetUsed = project.budget > 0 ? Math.min(100, Math.round((project.amountPaid / project.budget) * 100)) : 0;

                  return (
                    <motion.div key={project.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.06 }}
                      className={`${panelClass} hover:shadow-md hover:border-[#0a9396]/20 transition-all`}>
                      <div className="p-6 lg:p-8 flex flex-col lg:flex-row gap-8">

                        {/* Progress ring */}
                        <div className="flex lg:flex-col items-center lg:justify-center lg:w-36 lg:border-r border-gray-100 lg:pr-8 shrink-0 gap-4 lg:gap-0">
                          <div className="relative h-20 w-20 lg:mb-4 shrink-0">
                            <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                              <circle cx="40" cy="40" r="32" fill="none" stroke="#f3f4f6" strokeWidth="6" />
                              <motion.circle
                                cx="40" cy="40" r="32" fill="none"
                                stroke={project.progress === 100 ? "#10b981" : "#0a9396"}
                                strokeWidth="6" strokeLinecap="round"
                                strokeDasharray="201.06"
                                initial={{ strokeDashoffset: 201.06 }}
                                animate={{ strokeDashoffset: 201.06 - (201.06 * project.progress) / 100 }}
                                transition={{ duration: 1, ease: "circOut" }}
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center flex-col">
                              <span className="text-sm font-bold text-gray-900">{project.progress}%</span>
                            </div>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full ${sc.bg} ${sc.text} ${sc.border} border text-[10px] font-bold uppercase tracking-wide`}>
                            {sc.label}
                          </span>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between gap-5">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">{project.name}</h3>
                            <p className="text-gray-500 text-sm line-clamp-2">{project.description}</p>
                          </div>

                          {/* Metrics row */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div>
                              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Assigned Pro</p>
                              <p className="text-sm font-semibold text-gray-800 truncate">{project.pro}</p>
                            </div>
                            <div>
                              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Budget</p>
                              <p className="text-sm font-semibold text-gray-800">{formatCurrency(project.budget, project.currency)}</p>
                            </div>
                            <div>
                              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Milestones</p>
                              <p className="text-sm font-semibold text-gray-800">
                                {project.totalMilestones > 0
                                  ? `${project.completedMilestones}/${project.totalMilestones} done`
                                  : <span className="text-gray-400 font-normal text-xs">None set</span>}
                              </p>
                            </div>
                            <div>
                              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                                {deadline ? (deadline.overdue ? "Overdue by" : "Deadline") : "Deadline"}
                              </p>
                              <p className={`text-sm font-semibold ${deadline?.overdue ? "text-red-500" : "text-gray-800"}`}>
                                {deadline
                                  ? deadline.overdue
                                    ? `${deadline.days}d overdue`
                                    : `${deadline.days}d left`
                                  : "Not set"}
                              </p>
                            </div>
                          </div>

                          {/* Progress bar with label */}
                          <div className="space-y-1.5">
                            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                              <motion.div
                                className={`h-full rounded-full ${project.progress === 100 ? "bg-emerald-500" : "bg-gradient-to-r from-[#0a9396] to-[#6ece39]"}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${project.progress}%` }}
                                transition={{ duration: 1, ease: "circOut" }}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-[11px] text-gray-400">{progressLabel(project)}</p>
                              {project.nextMilestoneName && (
                                <p className="text-[11px] text-[#0a9396] font-medium flex items-center gap-1">
                                  <Flag className="h-2.5 w-2.5" />
                                  Next: {project.nextMilestoneName}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Budget utilisation */}
                          {project.amountPaid > 0 && (
                            <div className="space-y-1.5">
                              <div className="flex justify-between items-center">
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Budget utilised</p>
                                <p className="text-[11px] font-semibold text-gray-700">
                                  {formatCurrency(project.amountPaid, project.currency)} / {formatCurrency(project.budget, project.currency)} ({budgetUsed}%)
                                </p>
                              </div>
                              <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                                <motion.div
                                  className="h-full rounded-full bg-emerald-400"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${budgetUsed}%` }}
                                  transition={{ duration: 1, ease: "circOut" }}
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex lg:flex-col gap-2.5 lg:w-40 shrink-0 lg:justify-center">
                          <button
                            onClick={() => openDetail(project)}
                            className="h-10 flex-1 lg:flex-none rounded-xl bg-white border border-gray-200 hover:border-[#0a9396]/30 text-gray-600 hover:text-gray-900 text-xs font-medium transition-all flex items-center justify-center gap-1.5"
                          >
                            Details <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                          {project.proId && (
                            <button
                              onClick={() => router.push("/client/messaging")}
                              className="h-9 flex-1 lg:flex-none rounded-xl bg-[#0a9396]/8 border border-[#0a9396]/15 hover:bg-[#0a9396]/15 text-[#0a9396] text-xs font-medium transition-all flex items-center justify-center gap-1.5"
                            >
                              <MessageSquare className="h-3.5 w-3.5" />
                              Message
                            </button>
                          )}
                          <Link href={`/client/reports/${project.id}`} className="flex-1 lg:flex-none">
                            <button className="h-9 w-full rounded-xl hover:bg-gray-50 text-gray-400 hover:text-gray-700 text-xs transition-all flex items-center justify-center gap-1.5">
                              <TrendingUp className="h-3.5 w-3.5" />
                              Analytics
                            </button>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Detail modal */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8">
              <div className="absolute inset-0 bg-gray-950/40 backdrop-blur-sm" onClick={() => setSelectedProject(null)} />
              <motion.div initial={{ scale: 0.95, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 20, opacity: 0 }}
                className="bg-white/95 backdrop-blur-2xl border border-white/80 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-xl relative z-10 overflow-hidden">

                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-start justify-between shrink-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {(() => { const sc = getStatusConfig(selectedProject.status); return (
                        <span className={`px-2.5 py-1 rounded-full ${sc.bg} ${sc.text} ${sc.border} border text-[10px] font-bold uppercase tracking-wide`}>
                          {sc.label}
                        </span>
                      ); })()}
                      <span className="text-xs text-gray-400">{selectedProject.pro}</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 truncate">{selectedProject.name}</h2>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{selectedProject.description}</p>
                  </div>
                  <button onClick={() => setSelectedProject(null)}
                    className="h-9 w-9 rounded-xl hover:bg-gray-100 text-gray-400 flex items-center justify-center shrink-0 ml-4">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {detailLoading && (
                    <div className="flex justify-center py-4">
                      <Loader2 className="h-5 w-5 animate-spin text-[#0a9396]" />
                    </div>
                  )}

                  {/* KPI grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: "Progress", value: `${selectedProject.progress}%` },
                      { label: "Budget", value: formatCurrency(selectedProject.budget, selectedProject.currency) },
                      { label: "Amount Paid", value: formatCurrency(selectedProject.amountPaid, selectedProject.currency) },
                      { label: "Deadline", value: selectedProject.deadline
                          ? format(new Date(selectedProject.deadline), "d MMM yyyy")
                          : "Not set" },
                    ].map((kpi) => (
                      <div key={kpi.label} className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-1">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">{kpi.label}</p>
                        <p className="text-base font-bold text-gray-900">{kpi.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Overall progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-gray-700">Overall Progress</span>
                      <span className="text-gray-500">{progressLabel(selectedProject)}</span>
                    </div>
                    <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${selectedProject.progress === 100 ? "bg-emerald-500" : "bg-gradient-to-r from-[#0a9396] to-[#6ece39]"}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedProject.progress}%` }}
                        transition={{ duration: 1, ease: "circOut" }}
                      />
                    </div>
                  </div>

                  {/* Budget utilisation */}
                  {selectedProject.budget > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-semibold text-gray-700">Budget Utilisation</span>
                        <span className="text-gray-500">
                          {formatCurrency(selectedProject.amountPaid, selectedProject.currency)} of {formatCurrency(selectedProject.budget, selectedProject.currency)}
                        </span>
                      </div>
                      <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-emerald-400"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, selectedProject.budget > 0 ? Math.round((selectedProject.amountPaid / selectedProject.budget) * 100) : 0)}%` }}
                          transition={{ duration: 1, ease: "circOut" }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Milestones */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Flag className="h-4 w-4 text-[#0a9396]" />
                      <h3 className="text-sm font-bold text-gray-900">
                        Milestones
                        {selectedProject.totalMilestones > 0 && (
                          <span className="ml-2 text-xs font-normal text-gray-400">
                            ({selectedProject.completedMilestones}/{selectedProject.totalMilestones} completed)
                          </span>
                        )}
                      </h3>
                    </div>
                    {selectedProject.milestones.length === 0 ? (
                      <p className="text-sm text-gray-400 pl-1">No milestones set yet. Your professional will add these once the project starts.</p>
                    ) : (
                      <div className="space-y-2">
                        {selectedProject.milestones.map((m) => (
                          <div key={m.id} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                            {getMilestoneIcon(m.status)}
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium ${m.status === "completed" ? "line-through text-gray-400" : "text-gray-800"}`}>{m.title}</p>
                              {m.dueDate && (
                                <p className={`text-xs mt-0.5 ${isPast(new Date(m.dueDate)) && m.status !== "completed" ? "text-red-500" : "text-gray-400"}`}>
                                  Due {format(new Date(m.dueDate), "d MMM yyyy")}
                                  {isPast(new Date(m.dueDate)) && m.status !== "completed" && " · Overdue"}
                                </p>
                              )}
                            </div>
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full shrink-0 ${
                              m.status === "completed" ? "bg-emerald-50 text-emerald-600" :
                              m.status === "in-progress" ? "bg-amber-50 text-amber-600" :
                              "bg-gray-100 text-gray-500"
                            }`}>
                              {m.status.replace("-", " ")}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Deliverables */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Package className="h-4 w-4 text-[#0a9396]" />
                      <h3 className="text-sm font-bold text-gray-900">
                        Deliverables
                        {selectedProject.totalDeliverables > 0 && (
                          <span className="ml-2 text-xs font-normal text-gray-400">
                            ({selectedProject.approvedDeliverables}/{selectedProject.totalDeliverables} approved)
                          </span>
                        )}
                      </h3>
                    </div>
                    {selectedProject.deliverables.length === 0 ? (
                      <p className="text-sm text-gray-400 pl-1">No deliverables uploaded yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {selectedProject.deliverables.map((d) => (
                          <div key={d.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                            {getDeliverableIcon(d.approvalStatus)}
                            <p className={`text-sm font-medium flex-1 ${d.approvalStatus === "approved" ? "text-gray-500" : "text-gray-800"}`}>{d.title}</p>
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                              d.approvalStatus === "approved" ? "bg-emerald-50 text-emerald-600" :
                              d.approvalStatus === "revision_requested" ? "bg-amber-50 text-amber-600" :
                              "bg-gray-100 text-gray-500"
                            }`}>
                              {d.approvalStatus.replace(/_/g, " ")}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer actions */}
                <div className="p-5 bg-gray-50/60 border-t border-gray-100 flex gap-3 shrink-0">
                  {selectedProject.proId && (
                    <button
                      onClick={() => { setSelectedProject(null); router.push("/client/messaging"); }}
                      className="h-11 flex-1 rounded-xl bg-[#0a9396] hover:bg-[#087579] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
                    >
                      <MessageSquare className="h-4 w-4" />
                      Message Pro
                    </button>
                  )}
                  <Link href="/client/proposals" className="flex-1">
                    <button className="h-11 w-full rounded-xl bg-white border border-gray-200 hover:border-[#0a9396]/30 text-gray-600 text-sm font-medium flex items-center justify-center gap-2 transition-all">
                      <FileText className="h-4 w-4" />
                      Proposals
                    </button>
                  </Link>
                  <Link href={`/client/reports/${selectedProject.id}`} className="flex-1">
                    <button className="h-11 w-full rounded-xl bg-white border border-gray-200 hover:border-[#0a9396]/30 text-gray-600 text-sm font-medium flex items-center justify-center gap-2 transition-all">
                      <TrendingUp className="h-4 w-4" />
                      Analytics
                    </button>
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <NewProjectModal
          isOpen={showNewProjectModal}
          onClose={() => setShowNewProjectModal(false)}
          onSuccess={handleOnSuccess}
        />
      </div>
    </div>
  );
}
