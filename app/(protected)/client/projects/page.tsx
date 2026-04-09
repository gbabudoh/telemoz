"use client";

import {
  FolderKanban,
  DollarSign,
  MessageSquare,
  TrendingUp,
  Search,
  CheckCircle2,
  Calendar,
  X,
  Plus,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

const projects = [
  {
    id: 1,
    name: "Q4 Social Media Campaign",
    pro: "Digital Marketing Pro",
    proId: "pro-1",
    status: "active",
    progress: 80,
    budget: 5000,
    spent: 4000,
    deadline: "2024-12-15",
    startDate: "2024-10-01",
    tasks: 12,
    completedTasks: 10,
    nextMilestone: "Milestone 3 Due Friday",
    description: "Comprehensive social media strategy and content creation for Q4 holiday season",
  },
  {
    id: 2,
    name: "SEO Optimization",
    pro: "SEO Experts Ltd",
    proId: "pro-2",
    status: "active",
    progress: 45,
    budget: 3500,
    spent: 1575,
    deadline: "2024-12-20",
    startDate: "2024-11-01",
    tasks: 15,
    completedTasks: 7,
    nextMilestone: "Content Audit Complete",
    description: "Technical SEO improvements and content optimization for better search rankings",
  },
  {
    id: 3,
    name: "Email Marketing Campaign",
    pro: "Digital Marketing Pro",
    proId: "pro-1",
    status: "completed",
    progress: 100,
    budget: 2500,
    spent: 2500,
    deadline: "2024-11-30",
    startDate: "2024-09-01",
    tasks: 10,
    completedTasks: 10,
    nextMilestone: "Project Completed",
    description: "Automated email sequences and newsletter campaigns",
  },
  {
    id: 4,
    name: "PPC Campaign Setup",
    pro: "Digital Marketing Pro",
    proId: "pro-1",
    status: "planning",
    progress: 15,
    budget: 4000,
    spent: 600,
    deadline: "2025-01-15",
    startDate: "2024-12-01",
    tasks: 8,
    completedTasks: 1,
    nextMilestone: "Campaign Strategy Review",
    description: "Google Ads and Facebook Ads campaign setup and optimisation",
  },
];

export default function ClientProjectsPage() {

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
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
  });

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.pro.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statsConfig = [
    { title: "Total Projects", value: projects.length, icon: FolderKanban, gradient: "from-[#0a9396]/10 to-[#6ece39]/10", iconColor: "text-[#0a9396]" },
    { title: "Active", value: projects.filter((p) => p.status === "active").length, icon: TrendingUp, gradient: "from-[#0a9396]/10 to-[#6ece39]/10", iconColor: "text-[#0a9396]" },
    { title: "Completed", value: projects.filter((p) => p.status === "completed").length, icon: CheckCircle2, gradient: "from-[#6ece39]/10 to-[#0a9396]/10", iconColor: "text-[#6ece39]" },
    { title: "Total Spent", value: formatCurrency(projects.reduce((sum, p) => sum + p.spent, 0)), icon: DollarSign, gradient: "from-[#0a9396]/10 to-[#6ece39]/10", iconColor: "text-[#0a9396]" },
  ];

  const handleViewDetails = (project: typeof projects[0]) => {
    setSelectedProject(project);
    setShowProjectDetails(true);
  };

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { bg: string, text: string, border: string }> = {
      active: { bg: "bg-[#6ece39]/10", text: "text-[#5ab830]", border: "border-[#6ece39]/20" },
      completed: { bg: "bg-[#0a9396]/10", text: "text-[#0a9396]", border: "border-[#0a9396]/20" },
      planning: { bg: "bg-amber-500/10", text: "text-amber-600", border: "border-amber-500/20" },
      "on-hold": { bg: "bg-red-500/10", text: "text-red-600", border: "border-red-500/20" },
    };
    const config = configs[status] || configs.active;
    return (
      <div className={`px-3 py-1 rounded-full ${config.bg} ${config.text} ${config.border} border text-[10px] font-bold uppercase tracking-widest`}>
        {status}
      </div>
    );
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const panelClass = "bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl shadow-sm overflow-hidden";

  return (
    <div className="relative min-h-screen bg-transparent">
      {/* Ambient orbs */}
      <div className="fixed top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-[#0a9396]/10 blur-[130px] pointer-events-none mix-blend-multiply animate-pulse z-0" />
      <div className="fixed top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#6ece39]/8 blur-[140px] pointer-events-none mix-blend-multiply z-0" />
      <div className="fixed bottom-[-10%] left-[20%] w-[45%] h-[45%] rounded-full bg-[#0a9396]/8 blur-[130px] pointer-events-none mix-blend-multiply opacity-70 animate-pulse z-0" />

      <div className="space-y-8 relative z-10 max-w-[1600px] mx-auto pb-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className={panelClass}
        >
          <div className="p-8 lg:p-10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="p-3.5 rounded-2xl bg-[#0a9396]/10 border border-[#0a9396]/20 shrink-0">
                  <FolderKanban className="h-8 w-8 text-[#0a9396]" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                    My Projects
                  </h1>
                  <p className="text-gray-500 text-sm mt-0.5">
                    {projects.length} project{projects.length !== 1 ? "s" : ""} in your workspace
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowNewProjectModal(true)}
                className="px-6 py-3 rounded-xl bg-[#0a9396] hover:bg-[#087579] text-white font-semibold text-sm shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Plus className="h-4 w-4" />
                New Project
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {statsConfig.map((stat, idx) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * idx }}
              className={`${panelClass} p-6 group hover:-translate-y-1 transition-transform duration-300`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-linear-to-br ${stat.gradient} shrink-0`}>
                  <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{stat.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className={panelClass}
        >
          <div className="p-4">
            <div className="flex flex-col lg:flex-row gap-3">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 group-focus-within:text-[#0a9396] transition-colors" />
                <input
                  type="text"
                  placeholder="Search by project name or assigned pro..."
                  className="w-full pl-11 pr-4 py-3 bg-white/60 focus:bg-white border border-gray-100 rounded-xl text-gray-900 text-sm placeholder:text-gray-300 outline-none focus:ring-2 focus:ring-[#0a9396]/20 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
                {["all", "active", "planning", "completed", "on-hold"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2.5 rounded-xl font-medium capitalize text-xs transition-all whitespace-nowrap cursor-pointer ${
                      statusFilter === status
                        ? "bg-[#0a9396] text-white shadow-sm"
                        : "bg-white/60 text-gray-500 hover:text-gray-700 border border-gray-100"
                    }`}
                  >
                    {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Project List */}
        <AnimatePresence mode="popLayout">
          {filteredProjects.length === 0 ? (
            <motion.div
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`${panelClass} p-16 text-center flex flex-col items-center justify-center`}
            >
              <div className="h-16 w-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-5">
                <FolderKanban className="h-8 w-8 text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects found</h3>
              <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">No projects match your current search or filter.</p>
              <button
                onClick={() => { setSearchQuery(""); setStatusFilter("all"); }}
                className="px-5 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-sm font-medium text-gray-700 transition-all cursor-pointer"
              >
                Clear Filters
              </button>
            </motion.div>
          ) : (
            <motion.div layout className="flex flex-col gap-5">
              {filteredProjects.map((project, idx) => {
                const daysLeft = getDaysUntilDeadline(project.deadline);
                const isOverdue = daysLeft < 0 && project.status !== "completed";

                return (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className={`${panelClass} hover:shadow-md hover:border-[#0a9396]/20 transition-all duration-300`}
                  >
                    <div className="p-6 lg:p-8 flex flex-col lg:flex-row gap-8">

                      {/* Progress ring + status */}
                      <div className="flex lg:flex-col items-center lg:items-center justify-between lg:justify-center lg:w-40 lg:border-r border-gray-100 pr-0 lg:pr-8 shrink-0">
                        <div className="relative mb-0 lg:mb-5 h-20 w-20">
                          <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                            <circle
                              cx="40" cy="40" r="32"
                              fill="none"
                              stroke="#e5e7eb"
                              strokeWidth="5"
                            />
                            <motion.circle
                              cx="40" cy="40" r="32"
                              fill="none"
                              stroke="#0a9396"
                              strokeWidth="5"
                              strokeLinecap="round"
                              strokeDasharray="201.06"
                              initial={{ strokeDashoffset: 201.06 }}
                              animate={{ strokeDashoffset: 201.06 - (201.06 * project.progress) / 100 }}
                              transition={{ duration: 1.2, ease: "circOut" }}
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-base font-bold text-gray-900">{project.progress}%</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-center gap-1.5">
                          {getStatusBadge(project.status)}
                          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{project.completedTasks}/{project.tasks} tasks</p>
                        </div>
                      </div>

                      {/* Project info */}
                      <div className="flex-1 flex flex-col justify-center min-w-0">
                        <h3 className="text-xl font-bold text-gray-900 mb-1.5 group-hover:text-[#0a9396] transition-colors">{project.name}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed mb-5 line-clamp-2">{project.description}</p>

                        <div className="flex flex-wrap items-center gap-6 mb-5">
                          <div className="space-y-0.5">
                            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Assigned Pro</p>
                            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                              <div className="h-5 w-5 rounded-md bg-[#0a9396]/10 border border-[#0a9396]/20 flex items-center justify-center text-[9px] text-[#0a9396] font-bold">
                                {project.pro.charAt(0)}
                              </div>
                              {project.pro}
                            </div>
                          </div>
                          <div className="h-6 w-px bg-gray-100 hidden sm:block" />
                          <div className="space-y-0.5">
                            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Budget</p>
                            <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-900">
                              <DollarSign className="h-3.5 w-3.5 text-gray-400" />
                              {formatCurrency(project.budget)}
                            </div>
                          </div>
                          <div className="h-6 w-px bg-gray-100 hidden sm:block" />
                          <div className="space-y-0.5">
                            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Deadline</p>
                            <div className={`flex items-center gap-1.5 text-sm font-medium ${isOverdue ? "text-red-500" : "text-gray-700"}`}>
                              <Calendar className="h-3.5 w-3.5 opacity-60" />
                              {isOverdue ? `Overdue by ${Math.abs(daysLeft)} day${Math.abs(daysLeft) !== 1 ? "s" : ""}` : `${daysLeft} day${daysLeft !== 1 ? "s" : ""} left`}
                            </div>
                          </div>
                        </div>

                        {/* Progress bar */}
                        <div className="space-y-2">
                          <div className="h-2 rounded-full bg-gray-100 relative overflow-hidden">
                            <motion.div
                              className="absolute h-full bg-linear-to-r from-[#0a9396] to-[#6ece39] rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${project.progress}%` }}
                              transition={{ duration: 1, ease: "circOut" }}
                            />
                          </div>
                          <p className="text-xs text-[#0a9396] font-medium flex items-center gap-1.5">
                            <TrendingUp className="h-3 w-3" />
                            Next: {project.nextMilestone}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="lg:w-44 flex flex-row lg:flex-col gap-2.5 shrink-0 justify-center">
                        <button
                          onClick={() => handleViewDetails(project)}
                          className="h-10 flex-1 lg:flex-none rounded-xl bg-white border border-gray-200 hover:border-[#0a9396]/30 text-gray-600 hover:text-gray-900 text-xs font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          View Details
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                        <Link href={`/messaging?proId=${project.proId}&projectId=${project.id}`} className="flex-1 lg:flex-none">
                          <button className="h-10 w-full rounded-xl bg-[#0a9396] hover:bg-[#087579] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5">
                            <MessageSquare className="h-3.5 w-3.5" />
                            Message
                          </button>
                        </Link>
                        <Link href={`/client/reports/${project.id}`} className="flex-1 lg:flex-none">
                          <button className="h-9 w-full rounded-xl hover:bg-gray-50 text-gray-400 hover:text-gray-700 text-xs font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5">
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

        {/* Project Details Modal */}
        <AnimatePresence>
          {showProjectDetails && selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8"
            >
              <div className="absolute inset-0 bg-gray-950/40 backdrop-blur-sm" onClick={() => setShowProjectDetails(false)} />
              <motion.div
                initial={{ scale: 0.95, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 20, opacity: 0 }}
                className="bg-white/95 backdrop-blur-2xl border border-white/80 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-xl relative z-10 flex flex-col"
              >
                {/* Modal Header */}
                <div className="p-6 lg:p-8 border-b border-gray-100 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2.5 mb-3">
                      {getStatusBadge(selectedProject.status)}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedProject.name}</h2>
                    <p className="text-gray-500 text-sm leading-relaxed max-w-xl">{selectedProject.description}</p>
                  </div>
                  <button
                    onClick={() => setShowProjectDetails(false)}
                    className="h-9 w-9 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 text-gray-400 transition-all flex items-center justify-center cursor-pointer shrink-0 ml-4"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-5 rounded-xl bg-gray-50 border border-gray-100 space-y-1">
                      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Assigned Pro</p>
                      <p className="text-base font-semibold text-gray-900">{selectedProject.pro}</p>
                      <p className="text-xs text-[#0a9396]">Verified Specialist</p>
                    </div>
                    <div className="p-5 rounded-xl bg-gray-50 border border-gray-100 space-y-1">
                      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Budget</p>
                      <p className="text-base font-semibold text-gray-900">{formatCurrency(selectedProject.budget)}</p>
                      <p className="text-xs text-gray-400">Total Budget</p>
                    </div>
                    <div className="p-5 rounded-xl bg-gray-50 border border-gray-100 space-y-1">
                      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Deadline</p>
                      <p className="text-base font-semibold text-gray-900">{new Date(selectedProject.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
                      <p className="text-xs text-gray-400">Project Deadline</p>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="space-y-4">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Overall Progress</p>
                        <p className="text-3xl font-bold text-gray-900">{selectedProject.progress}%</p>
                      </div>
                      <p className="text-sm font-medium text-[#0a9396]">{selectedProject.completedTasks} / {selectedProject.tasks} tasks completed</p>
                    </div>
                    <div className="h-3 rounded-full bg-gray-100 relative overflow-hidden">
                      <motion.div
                        className="absolute h-full bg-linear-to-r from-[#0a9396] to-[#6ece39] rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedProject.progress}%` }}
                        transition={{ duration: 1, ease: "circOut" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 lg:p-8 bg-gray-50/60 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
                  <Link href={`/messaging?proId=${selectedProject.proId}&projectId=${selectedProject.id}`} className="flex-1">
                    <button className="h-12 w-full rounded-xl bg-[#0a9396] hover:bg-[#087579] text-white font-semibold text-sm shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Message Pro
                    </button>
                  </Link>
                  <Link href={`/client/reports/${selectedProject.id}`} className="flex-1">
                    <button className="h-12 w-full rounded-xl bg-white border border-gray-200 hover:border-[#0a9396]/30 text-gray-600 hover:text-gray-900 font-medium text-sm transition-all cursor-pointer flex items-center justify-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      View Analytics
                    </button>
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* New Project Modal */}
        <AnimatePresence>
          {showNewProjectModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8"
            >
              <div className="absolute inset-0 bg-gray-950/40 backdrop-blur-sm" onClick={() => !isSubmitting && setShowNewProjectModal(false)} />
              <motion.div
                initial={{ scale: 0.95, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 20, opacity: 0 }}
                className="bg-white/95 backdrop-blur-2xl border border-white/80 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-hidden shadow-xl relative z-10 flex flex-col"
              >
                <div className="p-6 lg:p-8 border-b border-gray-100 flex items-center justify-between shrink-0">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">New Project</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Fill in the details below to get started</p>
                  </div>
                  <button
                    onClick={() => !isSubmitting && setShowNewProjectModal(false)}
                    className="h-9 w-9 rounded-xl hover:bg-gray-100 text-gray-400 transition-all flex items-center justify-center cursor-pointer"
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
                        <option value="seo">SEO</option>
                        <option value="ppc">Paid Ads / PPC</option>
                        <option value="social">Social Media</option>
                        <option value="content">Content Marketing</option>
                        <option value="email">Email Marketing</option>
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
                      <label className="text-xs font-medium text-gray-600">Deadline <span className="text-red-400">*</span></label>
                      <input
                        type="date"
                        className="w-full bg-white border border-gray-200 p-3 rounded-xl text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#0a9396]/20 focus:border-[#0a9396]/40 transition-all"
                        value={newProject.deadline}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-600">Additional Requirements <span className="text-gray-400">(optional)</span></label>
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
                    onClick={() => !isSubmitting && setShowNewProjectModal(false)}
                    className="h-11 flex-1 rounded-xl bg-white border border-gray-200 text-gray-500 text-sm font-medium hover:text-gray-700 transition-all cursor-pointer"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      setFormError("");
                      if (!newProject.name || !newProject.description || !newProject.budget || !newProject.deadline || !newProject.category) {
                        setFormError("Please fill in all required fields.");
                        return;
                      }
                      setIsSubmitting(true);
                      await new Promise(r => setTimeout(r, 1200));
                      setIsSubmitting(false);
                      setFormSuccess(true);
                      setTimeout(() => {
                        setShowNewProjectModal(false);
                        setFormSuccess(false);
                        setNewProject({ name: "", description: "", budget: "", deadline: "", category: "", requirements: "" });
                      }, 1500);
                    }}
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
                        Create Project
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
