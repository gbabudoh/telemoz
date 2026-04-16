"use client";

import {
  Briefcase,
  TrendingUp,
  MessageSquare,
  ArrowRight,
  Wallet,
  LayoutDashboard,
  FileText,
  Pencil,
  LayoutGrid,
  List,
  CheckCircle2,
  X,
  Trash2,
  Archive,
  AlertTriangle,
} from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Project {
  id: string;
  name: string;
  status: string;
  timeline: string | null;
  budget: number | null;
  currency: string;
  pro: string | null;
  description: string;
}

interface Message {
  id: number;
  from: string;
  subject: string;
  preview: string;
  time: string;
  unread: boolean;
}

const currencySymbols: Record<string, string> = {
  GBP: "£",
  USD: "$",
  EUR: "€",
};

export default function ClientDashboard() {
  const { data: session } = useSession();
  const userName = session?.user?.name || "there";

  const [projects, setProjects] = useState<Project[]>([]);
  const [messages] = useState<Message[]>([]);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [isSavingProject, setIsSavingProject] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isDeletingProject, setIsDeletingProject] = useState(false);
  const [isArchivingId, setIsArchivingId] = useState<string | null>(null);
  const [dashStats, setDashStats] = useState<{
    pendingInvoicesAmount: number;
    pendingInvoicesCount: number;
    portfolioROAS: number | null;
  }>({ pendingInvoicesAmount: 0, pendingInvoicesCount: 0, portfolioROAS: null });

  const [newProjectData, setNewProjectData] = useState({
    name: "",
    category: "SEO (search engine optimisation)",
    budget: "",
    currency: "GBP",
    country: "United Kingdom",
    timeline: "1 Month",
    description: "",
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoadingProjects(true);
        const response = await fetch("/api/projects?userType=client");
        if (response.ok) {
          interface BackendProject {
            id: string;
            title: string;
            category?: string;
            timeline?: string;
            status: string;
            budget?: number;
            currency: string;
            country?: string;
            description: string;
            pro?: { name: string };
          }
          const data = (await response.json()) as { projects: BackendProject[] };
          const mappedProjects: Project[] = data.projects.map((p: BackendProject) => ({
            id: p.id,
            name: p.title,
            status: p.status,
            timeline: p.timeline ?? null,
            budget: p.budget ?? null,
            currency: p.currency,
            pro: p.pro?.name ?? null,
            description: p.description,
          }));
          setProjects(mappedProjects);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setIsLoadingProjects(false);
      }
    };

    if (session?.user?.id) {
      fetchProjects();
      fetch("/api/client/dashboard-stats")
        .then((r) => r.json())
        .then((d) => {
          if (!d.error) setDashStats(d);
        })
        .catch(console.error);
    }
  }, [session]);

  const handlePostProject = async () => {
    if (!newProjectData.name || !newProjectData.description) return;
    setIsSavingProject(true);
    try {
      if (editingProjectId !== null) {
        const response = await fetch(`/api/projects/${editingProjectId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: newProjectData.name,
            category: newProjectData.category,
            budget: newProjectData.budget,
            timeline: newProjectData.timeline,
            description: newProjectData.description,
            currency: newProjectData.currency,
            country: newProjectData.country,
          }),
        });
        if (response.ok) {
          const { project: p } = await response.json();
          setProjects(projects.map((proj) =>
            proj.id === editingProjectId
              ? {
                  ...proj,
                  name: p.title,
                  timeline: p.timeline ?? null,
                  budget: p.budget ?? null,
                  description: p.description,
                  currency: p.currency,
                }
              : proj
          ));
          setIsProjectModalOpen(false);
        }
      } else {
        const response = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: newProjectData.name,
            description: newProjectData.description,
            category: newProjectData.category,
            timeline: newProjectData.timeline,
            budget: newProjectData.budget,
            currency: newProjectData.currency,
            country: newProjectData.country,
          }),
        });
        if (response.ok) {
          const { project: p } = await response.json();
          setProjects([{
            id: p.id,
            name: p.title,
            status: p.status,
            timeline: p.timeline ?? null,
            budget: p.budget ?? null,
            currency: p.currency,
            pro: null,
            description: p.description,
          }, ...projects]);
          setIsProjectModalOpen(false);
        }
      }
      setEditingProjectId(null);
      setNewProjectData({
        name: "",
        category: "Marketing",
        budget: "",
        currency: "GBP",
        country: "United Kingdom",
        timeline: "1 Month",
        description: "",
      });
    } catch (error) {
      console.error("Error saving project:", error);
    } finally {
      setIsSavingProject(false);
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProjectId(project.id);
    setNewProjectData({
      name: project.name,
      category: "",
      budget: project.budget?.toString() ?? "",
      timeline: project.timeline ?? "",
      description: project.description,
      currency: project.currency,
      country: "",
    });
    setIsProjectModalOpen(true);
  };

  const handleDeleteProject = async () => {
    if (!confirmDeleteId) return;
    setIsDeletingProject(true);
    try {
      const res = await fetch(`/api/projects/${confirmDeleteId}`, { method: "DELETE" });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== confirmDeleteId));
        setConfirmDeleteId(null);
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    } finally {
      setIsDeletingProject(false);
    }
  };

  const handleArchiveProject = async (id: string) => {
    setIsArchivingId(id);
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error("Error archiving project:", error);
    } finally {
      setIsArchivingId(null);
    }
  };

  const openCreateModal = () => {
    setEditingProjectId(null);
    setNewProjectData({
      name: "",
      category: "Marketing",
      budget: "",
      currency: "GBP",
      country: "United Kingdom",
      timeline: "1 Month",
      description: "",
    });
    setIsProjectModalOpen(true);
  };

  const stats = [
    { title: "Total Projects", value: formatNumber(projects.length), trend: "", isUp: true, icon: LayoutDashboard },
    { title: "Active Projects", value: formatNumber(projects.filter((p) => p.status === "active").length), trend: "", isUp: true, icon: Wallet },
    {
      title: "Portfolio ROAS",
      value: dashStats.portfolioROAS !== null ? `${dashStats.portfolioROAS}x` : "—",
      trend: "",
      isUp: true,
      icon: TrendingUp,
    },
    {
      title: "Pending Invoices",
      value: formatCurrency(dashStats.pendingInvoicesAmount),
      trend: dashStats.pendingInvoicesCount > 0 ? `${dashStats.pendingInvoicesCount} pending` : "—",
      isUp: dashStats.pendingInvoicesCount === 0,
      icon: FileText,
    },
  ];

  return (
    <div className="relative min-h-screen bg-transparent">
      {/* Ambient orbs */}
      <div className="fixed top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-[#0a9396]/10 blur-[130px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] left-[20%] w-[45%] h-[45%] rounded-full bg-[#6ece39]/8 blur-[130px] pointer-events-none z-0" />

      <div className="space-y-6 relative z-10 max-w-[1600px] mx-auto pb-12">

        {/* Welcome bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl p-6 shadow-sm"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-linear-to-br from-[#0a9396] to-[#6ece39] flex items-center justify-center text-xl font-bold text-white shadow-sm shrink-0">
                {userName.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-0.5">Client Dashboard</p>
                <h1 className="text-xl font-bold text-gray-900">
                  Welcome back, <span className="text-[#0a9396]">{userName}</span>
                </h1>
              </div>
            </div>
            <button
              onClick={openCreateModal}
              className="h-11 px-6 rounded-xl bg-[#0a9396] hover:bg-[#087579] text-white font-semibold text-sm shadow-sm shadow-[#0a9396]/20 transition-all hover:-translate-y-0.5 flex items-center gap-2"
            >
              Post a Project
              <ArrowRight className="h-4 w-4" />
            </button>
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
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-linear-to-br from-[#0a9396]/10 to-[#6ece39]/10 flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-[#0a9396]" />
                </div>
                <div className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${
                  stat.isUp
                    ? "bg-[#6ece39]/10 text-green-700 border border-[#6ece39]/25"
                    : "bg-red-50 text-red-600 border border-red-100"
                }`}>
                  {stat.trend}
                </div>
              </div>
              <p className="text-2xl font-black text-gray-900 tracking-tight mb-1">{stat.value}</p>
              <p className="text-xs font-medium text-gray-500">{stat.title}</p>
            </motion.div>
          ))}
        </div>

        {/* Projects + Messages */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Projects */}
          <div className="lg:col-span-8 flex flex-col min-h-[480px]">
            <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl shadow-sm overflow-hidden flex-1 flex flex-col">

              <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sticky top-0 z-20 bg-white/80 backdrop-blur-xl">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Active Projects</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Real-time status of your marketing initiatives</p>
                </div>
                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-1 shrink-0">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-white text-[#0a9396] shadow-sm" : "text-gray-400 hover:text-gray-700"}`}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <div className="w-px h-4 bg-gray-200 mx-1" />
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-white text-[#0a9396] shadow-sm" : "text-gray-400 hover:text-gray-700"}`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 p-6 relative">
                {isLoadingProjects ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <div className="h-10 w-10 rounded-full border-4 border-[#0a9396]/20 border-t-[#0a9396] animate-spin" />
                    <p className="text-sm text-gray-400">Loading projects...</p>
                  </div>
                ) : projects.length === 0 ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                    <div className="h-16 w-16 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center mb-4">
                      <Briefcase className="h-8 w-8 text-[#0a9396]" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">No projects yet</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-xs">
                      Post your first project to start connecting with verified digital marketing professionals.
                    </p>
                    <button
                      onClick={openCreateModal}
                      className="h-11 px-6 rounded-xl bg-[#0a9396] hover:bg-[#087579] text-white font-semibold text-sm shadow-sm transition-all"
                    >
                      Post a Project
                    </button>
                  </div>
                ) : (
                  <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "flex flex-col gap-3"}>
                    <AnimatePresence>
                      {projects.map((project, idx) => (
                        <motion.div
                          key={project.id}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.97 }}
                          transition={{ duration: 0.25, delay: idx * 0.05 }}
                          className={`bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-[#0a9396]/20 transition-all group ${viewMode === "list" ? "flex flex-col md:flex-row" : "p-5"}`}
                        >
                          {/* Identity */}
                          <div className={`${viewMode === "list" ? "p-5 md:w-2/5 md:border-r border-gray-100" : "mb-4"}`}>
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <h4 className="font-bold text-gray-900 leading-snug mb-1.5 group-hover:text-[#0a9396] transition-colors text-sm">{project.name}</h4>
                                {project.pro && (
                                  <div className="flex items-center gap-1.5">
                                    <div className="h-5 w-5 rounded-lg bg-[#0a9396]/10 flex items-center justify-center shrink-0">
                                      <span className="text-[9px] font-bold text-[#0a9396]">{project.pro.charAt(0)}</span>
                                    </div>
                                    <span className="text-xs text-gray-500 truncate">{project.pro}</span>
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all shrink-0">
                                <button
                                  onClick={() => handleEditProject(project)}
                                  className="h-7 w-7 rounded-lg bg-gray-50 hover:bg-[#0a9396]/10 text-gray-400 hover:text-[#0a9396] border border-gray-100 hover:border-[#0a9396]/20 flex items-center justify-center transition-all"
                                  title="Edit project"
                                >
                                  <Pencil className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={() => handleArchiveProject(project.id)}
                                  disabled={isArchivingId === project.id}
                                  className="h-7 w-7 rounded-lg bg-gray-50 hover:bg-amber-50 text-gray-400 hover:text-amber-500 border border-gray-100 hover:border-amber-200 flex items-center justify-center transition-all disabled:opacity-50"
                                  title="Archive project"
                                >
                                  {isArchivingId === project.id
                                    ? <div className="h-3 w-3 border border-amber-400 border-t-transparent rounded-full animate-spin" />
                                    : <Archive className="h-3 w-3" />
                                  }
                                </button>
                                <button
                                  onClick={() => setConfirmDeleteId(project.id)}
                                  className="h-7 w-7 rounded-lg bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 border border-gray-100 hover:border-red-200 flex items-center justify-center transition-all"
                                  title="Delete project"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Metrics */}
                          <div className={`${viewMode === "list" ? "p-5 flex-1 flex flex-col justify-center" : ""}`}>
                            <div className={`grid ${viewMode === "list" ? "grid-cols-3 gap-4 items-center" : "grid-cols-2 gap-3"}`}>
                              <div>
                                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Status</p>
                                <span className="inline-flex px-2 py-0.5 rounded-lg border text-[11px] font-semibold bg-gray-50 text-gray-600 border-gray-200">
                                  {project.status.replace("_", " ")}
                                </span>
                              </div>
                              {project.timeline && (
                                <div className={viewMode === "list" ? "pl-3 border-l border-gray-100" : ""}>
                                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Timeline</p>
                                  <p className="text-xs font-bold text-gray-900">{project.timeline}</p>
                                </div>
                              )}
                              {project.budget !== null && (
                                <div className={viewMode === "list" ? "text-right" : "col-span-2"}>
                                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Budget</p>
                                  <p className="text-sm font-black text-[#0a9396]">
                                    {formatCurrency(project.budget, project.currency)}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl shadow-sm overflow-hidden flex-1 flex flex-col h-[480px]">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 z-20 bg-white/80 backdrop-blur-xl">
                <h2 className="font-bold text-gray-900">Messages</h2>
                <Link href="/messaging">
                  <div className="h-8 w-8 rounded-full bg-gray-50 hover:bg-[#0a9396]/10 border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#0a9396] transition-colors cursor-pointer">
                    <ArrowRight className="h-4 w-4 -rotate-45" />
                  </div>
                </Link>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {messages.length > 0 ? (
                  messages.map((message, i) => (
                    <motion.div
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.08 * i }}
                      key={message.id}
                      className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                        message.unread
                          ? "bg-white border-[#0a9396]/20 shadow-sm"
                          : "bg-white/60 border-gray-100 hover:bg-white hover:shadow-sm"
                      }`}
                    >
                      {message.unread && (
                        <div className="absolute top-0 left-0 w-1 h-full bg-[#0a9396] rounded-l-xl" />
                      )}
                      <div className="flex items-center justify-between mb-1 pl-2">
                        <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                          {message.from}
                          {message.unread && (
                            <span className="h-1.5 w-1.5 rounded-full bg-[#6ece39] animate-pulse inline-block" />
                          )}
                        </p>
                        <span className="text-xs text-gray-400">{message.time}</span>
                      </div>
                      <p className="text-xs font-semibold text-gray-700 mb-1 pl-2">{message.subject}</p>
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 pl-2">{message.preview}</p>
                    </motion.div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center px-6">
                    <div className="h-12 w-12 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center mb-3">
                      <MessageSquare className="h-5 w-5 text-gray-300" />
                    </div>
                    <p className="text-sm font-semibold text-gray-600 mb-1">No messages yet</p>
                    <p className="text-xs text-gray-400">Messages from your professionals will appear here.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Confirm Delete Modal */}
      <AnimatePresence>
        {confirmDeleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
              onClick={() => setConfirmDeleteId(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              className="relative z-10 w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-11 w-11 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Delete project?</h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {projects.find((p) => p.id === confirmDeleteId)?.name}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  This action cannot be undone. All data associated with this project will be permanently removed.
                </p>
              </div>
              <div className="px-6 pb-6 flex items-center gap-3">
                <button
                  onClick={() => setConfirmDeleteId(null)}
                  className="flex-1 h-10 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteProject}
                  disabled={isDeletingProject}
                  className="flex-1 h-10 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                >
                  {isDeletingProject
                    ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <Trash2 className="h-4 w-4" />
                  }
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Project Modal */}
      <AnimatePresence>
        {isProjectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
              onClick={() => setIsProjectModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -16 }}
              className="w-full max-w-xl bg-white/95 backdrop-blur-2xl border border-white/80 rounded-2xl shadow-2xl overflow-hidden relative z-10"
            >
              {/* Modal header */}
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {editingProjectId ? "Edit Project" : "Post a Project"}
                  </h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {editingProjectId ? "Update your project details." : "Describe your project to attract the right professional."}
                  </p>
                </div>
                <button
                  onClick={() => setIsProjectModalOpen(false)}
                  className="h-9 w-9 rounded-xl hover:bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-all"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Modal body */}
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Project Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Q4 SEO Campaign"
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:border-[#0a9396] focus:ring-2 focus:ring-[#0a9396]/10 outline-none transition-all placeholder-gray-300"
                    value={newProjectData.name}
                    onChange={(e) => setNewProjectData({ ...newProjectData, name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                    <select
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:border-[#0a9396] focus:ring-2 focus:ring-[#0a9396]/10 outline-none transition-all"
                      value={newProjectData.category}
                      onChange={(e) => setNewProjectData({ ...newProjectData, category: e.target.value })}
                    >
                      <option value="SEO (search engine optimisation)">SEO</option>
                      <option value="PPC">PPC & Ads</option>
                      <option value="Social Media">Social Media</option>
                      <option value="Content Marketing">Content Marketing</option>
                      <option value="Email Marketing">Email Marketing</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Timeline</label>
                    <select
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:border-[#0a9396] focus:ring-2 focus:ring-[#0a9396]/10 outline-none transition-all"
                      value={newProjectData.timeline}
                      onChange={(e) => setNewProjectData({ ...newProjectData, timeline: e.target.value })}
                    >
                      <option>1 Week</option>
                      <option>1 Month</option>
                      <option>3 Months</option>
                      <option>6 Months</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-[1fr_2fr] gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Currency</label>
                    <select
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:border-[#0a9396] focus:ring-2 focus:ring-[#0a9396]/10 outline-none transition-all"
                      value={newProjectData.currency}
                      onChange={(e) => setNewProjectData({ ...newProjectData, currency: e.target.value })}
                    >
                      <option value="GBP">GBP</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Budget</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
                        {currencySymbols[newProjectData.currency] ?? newProjectData.currency}
                      </span>
                      <input
                        type="number"
                        placeholder="5000"
                        className="w-full bg-white border border-gray-200 rounded-xl pl-8 pr-4 py-3 text-sm text-gray-900 focus:border-[#0a9396] focus:ring-2 focus:ring-[#0a9396]/10 outline-none transition-all placeholder-gray-300"
                        value={newProjectData.budget}
                        onChange={(e) => setNewProjectData({ ...newProjectData, budget: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                  <textarea
                    rows={4}
                    placeholder="Describe your goals, target audience, and any relevant context..."
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:border-[#0a9396] focus:ring-2 focus:ring-[#0a9396]/10 outline-none transition-all placeholder-gray-300 resize-none"
                    value={newProjectData.description}
                    onChange={(e) => setNewProjectData({ ...newProjectData, description: e.target.value })}
                  />
                </div>
              </div>

              {/* Modal footer */}
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end gap-3">
                <button
                  onClick={() => setIsProjectModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePostProject}
                  disabled={isSavingProject || !newProjectData.name.trim() || !newProjectData.description.trim()}
                  className="px-6 py-2.5 rounded-xl bg-[#0a9396] hover:bg-[#087579] disabled:opacity-50 text-white font-semibold text-sm shadow-sm shadow-[#0a9396]/20 transition-all flex items-center gap-2"
                >
                  {isSavingProject ? (
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  {editingProjectId ? "Save Changes" : "Post Project"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
