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
    description: "Google Ads and Facebook Ads campaign setup and optimization",
  },
];

export default function ClientProjectsPage() {

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const stats = {
    total: projects.length,
    active: projects.filter((p) => p.status === "active").length,
    completed: projects.filter((p) => p.status === "completed").length,
    totalBudget: projects.reduce((sum, p) => sum + p.budget, 0),
    totalSpent: projects.reduce((sum, p) => sum + p.spent, 0),
  };

  const handleViewDetails = (project: typeof projects[0]) => {
    setSelectedProject(project);
    setShowProjectDetails(true);
  };

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { bg: string, text: string, border: string }> = {
      active: { bg: "bg-emerald-500/10", text: "text-emerald-600", border: "border-emerald-500/20" },
      completed: { bg: "bg-blue-500/10", text: "text-blue-600", border: "border-blue-500/20" },
      planning: { bg: "bg-amber-500/10", text: "text-amber-600", border: "border-amber-500/20" },
      "on-hold": { bg: "bg-red-500/10", text: "text-red-600", border: "border-red-500/20" },
    };
    const config = configs[status] || configs.active;
    return (
      <div className={`px-3 py-1 rounded-full ${config.bg} ${config.text} ${config.border} border text-[10px] font-black uppercase tracking-widest`}>
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

  return (
    <div className="relative min-h-screen bg-transparent">
      {/* Ambient Animated Orbs */}
      <div className="fixed top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-[#0a9396]/10 blur-[130px] pointer-events-none mix-blend-multiply animate-pulse z-0" />
      <div className="fixed top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-400/10 blur-[140px] pointer-events-none mix-blend-multiply animate-pulse-slow z-0" />
      <div className="fixed bottom-[-10%] left-[20%] w-[45%] h-[45%] rounded-full bg-emerald-400/10 blur-[130px] pointer-events-none mix-blend-multiply opacity-70 animate-pulse z-0" />

      <div className="space-y-10 relative z-10 max-w-[1600px] mx-auto pb-12">
        {/* Cinematic Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/40 backdrop-blur-2xl border border-white rounded-[2.5rem] p-8 lg:p-10 shadow-[inset_0_2px_15px_rgb(255,255,255,0.7),0_10px_30px_rgb(0,0,0,0.03)] overflow-hidden relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a9396]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
            <div className="flex items-center gap-6">
              <div className="p-4 rounded-3xl bg-[#0a9396]/10 border border-[#0a9396]/20">
                <FolderKanban className="h-10 w-10 text-[#0a9396]" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight leading-tight mb-1">
                  My <span className="bg-gradient-to-r from-[#0a9396] to-teal-500 bg-clip-text text-transparent">Project Matrix</span>
                </h1>
                <p className="text-gray-600 font-bold tracking-wide flex items-center gap-2 text-[15px]">
                  Monitoring {projects.length} Active Operational Transmissions.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowNewProjectModal(true)}
              className="px-8 py-4 rounded-2xl bg-gray-900 hover:bg-black text-white font-bold tracking-wide text-[15px] shadow-xl shadow-gray-900/20 border-none transition-all cursor-pointer flex items-center justify-center gap-2 group/btn"
            >
              <Plus className="h-5 w-5" />
              Start New Transmission
            </button>
          </div>
        </motion.div>

        {/* Holographic Stats Ribbon */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Project Pool", value: stats.total, icon: FolderKanban, gradient: "from-indigo-500 to-purple-500" },
            { title: "Active Deployments", value: stats.active, icon: TrendingUp, gradient: "from-emerald-500 to-[#0a9396]" },
            { title: "Unit Completions", value: stats.completed, icon: CheckCircle2, gradient: "from-blue-600 to-cyan-500" },
            { title: "Net Capital Spent", value: formatCurrency(stats.totalSpent), icon: DollarSign, gradient: "from-amber-500 to-orange-500" },
          ].map((stat, idx) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
              className="bg-white/40 backdrop-blur-xl border border-white rounded-[2rem] p-6 shadow-[inset_0_2px_15px_rgb(255,255,255,0.7),0_10px_30px_rgb(0,0,0,0.03)] group hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden"
            >
              <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${stat.gradient} rounded-full blur-[40px] opacity-10 group-hover:opacity-25 transition-opacity`} />
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-lg shadow-gray-900/5`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl lg:text-3xl font-black text-gray-900 tracking-tight">{stat.value}</h3>
                <p className="text-[12px] font-bold text-gray-500 tracking-widest uppercase mt-1">{stat.title}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Intelligence Filters */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white/40 backdrop-blur-3xl border border-white rounded-3xl p-4 shadow-[inset_0_2px_15px_rgb(255,255,255,0.7),0_5px_20px_rgb(0,0,0,0.02)]"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 group-focus-within:text-[#0a9396] transition-colors" />
              <input
                type="text"
                placeholder="Synchronize by project name, assigned pro, or vector..."
                className="w-full pl-14 pr-6 py-4 bg-white/60 focus:bg-white backdrop-blur-md border border-gray-100 rounded-2xl text-gray-900 font-bold placeholder:text-gray-300 outline-none focus:ring-4 focus:ring-[#0a9396]/5 transition-all shadow-inner"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
              {["all", "active", "planning", "completed", "on-hold"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-5 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all whitespace-nowrap cursor-pointer ${
                    statusFilter === status 
                      ? "bg-gray-900 text-white shadow-lg shadow-gray-900/10" 
                      : "bg-white/60 text-gray-400 hover:text-gray-600 border border-gray-100"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Project Intelligence Grid */}
        <AnimatePresence mode="popLayout">
          {filteredProjects.length === 0 ? (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-white/40 backdrop-blur-3xl border border-white rounded-[2.5rem] p-20 text-center shadow-xl flex flex-col items-center justify-center"
            >
              <div className="h-20 w-20 rounded-3xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-6 shadow-sm">
                <FolderKanban className="h-10 w-10 text-gray-300" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-2">Matrix Empty.</h3>
              <p className="text-gray-500 font-bold max-w-sm mx-auto leading-relaxed mb-8">No operational deployments match the current filter vector. Reset synchronization?</p>
              <button 
                onClick={() => { setSearchQuery(""); setStatusFilter("all"); }} 
                className="px-8 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 font-bold text-gray-900 transition-all cursor-pointer"
              >
                Reset Matrix Scan
              </button>
            </motion.div>
          ) : (
            <motion.div layout className="flex flex-col gap-6">
              {filteredProjects.map((project, idx) => {
                 const daysLeft = getDaysUntilDeadline(project.deadline);
                 const isOverdue = daysLeft < 0 && project.status !== "completed";
                 
                 return (
                   <motion.div
                     key={project.id}
                     layout
                     initial={{ opacity: 0, scale: 0.98 }}
                     animate={{ opacity: 1, scale: 1 }}
                     transition={{ delay: idx * 0.1 }}
                     className="group bg-white/50 backdrop-blur-3xl border border-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgb(10,147,150,0.1)] hover:border-[#0a9396]/20 transition-all duration-500 overflow-hidden relative"
                   >
                     <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-teal-400/5 to-transparent blur-3xl pointer-events-none" />
                     
                     <div className="p-8 lg:p-10 flex flex-col lg:flex-row gap-10">
                        {/* Status & Identity Column */}
                        <div className="flex lg:flex-col items-center lg:items-center justify-between lg:justify-center lg:w-48 lg:border-r border-gray-100/50 pr-0 lg:pr-10 shrink-0">
                           <div className="relative mb-0 lg:mb-6">
                              <div className="h-24 w-24 rounded-full border-[6px] border-[#0a9396]/10 p-1 relative">
                                 <svg className="w-full h-full -rotate-90">
                                   <circle
                                     cx="40" cy="40" r="34"
                                     className="fill-none stroke-gray-100 stroke-[5]"
                                   />
                                   <motion.circle
                                     cx="40" cy="40" r="34"
                                     className="fill-none stroke-[#0a9396] stroke-[5]"
                                     strokeDasharray="213.6"
                                     strokeLinecap="round"
                                     initial={{ strokeDashoffset: 213.6 }}
                                     animate={{ strokeDashoffset: 213.6 - (213.6 * project.progress) / 100 }}
                                     transition={{ duration: 1.5, ease: "circOut" }}
                                   />
                                 </svg>
                                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-xl font-black text-gray-900 tracking-tighter">{project.progress}%</span>
                                 </div>
                              </div>
                           </div>
                           <div className="flex flex-col items-center gap-2">
                             {getStatusBadge(project.status)}
                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{project.completedTasks}/{project.tasks} TASKS</p>
                           </div>
                        </div>

                        {/* Project Info Center */}
                        <div className="flex-1 flex flex-col justify-center">
                           <div className="flex items-start justify-between mb-2">
                              <div>
                                 <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-2 group-hover:text-[#0a9396] transition-colors">{project.name}</h3>
                                 <p className="text-gray-500 font-bold max-w-2xl leading-relaxed mb-6">{"\""}{project.description}{"\""}</p>
                              </div>
                           </div>

                           <div className="flex flex-wrap items-center gap-8 mb-8">
                              <div className="space-y-1">
                                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Assigned Specialist</p>
                                 <div className="flex items-center gap-2 font-bold text-gray-700">
                                    <div className="h-6 w-6 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[10px] text-indigo-600 font-black">
                                       {project.pro.charAt(0)}
                                    </div>
                                    {project.pro}
                                 </div>
                              </div>
                              <div className="h-8 w-px bg-gray-100 hidden sm:block" />
                              <div className="space-y-1">
                                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Capital Deployment</p>
                                 <div className="flex items-center gap-2 font-black text-emerald-600 text-lg tracking-tight">
                                    <DollarSign className="h-4 w-4 opacity-50" />
                                    {formatCurrency(project.budget)}
                                 </div>
                              </div>
                              <div className="h-8 w-px bg-gray-100 hidden sm:block" />
                              <div className="space-y-1">
                                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Timeframe</p>
                                 <div className={`flex items-center gap-2 font-bold text-sm ${isOverdue ? "text-red-500" : "text-gray-700"}`}>
                                    <Calendar className="h-4 w-4 opacity-50" />
                                    {isOverdue ? `CRITICAL: ${Math.abs(daysLeft)}D OVERDUE` : `${daysLeft}D REMAINING`}
                                 </div>
                              </div>
                           </div>

                           {/* Progress Visualizer */}
                           <div className="space-y-3">
                              <div className="h-2.5 rounded-full bg-gray-100 border border-gray-100 relative overflow-hidden">
                                 <motion.div
                                   className="absolute h-full bg-[#0a9396]"
                                   initial={{ width: 0 }}
                                   animate={{ width: `${project.progress}%` }}
                                   transition={{ duration: 1, ease: "circOut" }}
                                 />
                              </div>
                              <div className="flex items-center justify-between">
                                 <div className="flex items-center gap-2 text-xs font-black text-[#0a9396] uppercase">
                                    <TrendingUp className="h-3.5 w-3.5" />
                                    Next Phase: {project.nextMilestone}
                                 </div>
                                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">SYCHRONIZED GBP/INTEL</p>
                              </div>
                           </div>
                        </div>

                        {/* Action Bay */}
                        <div className="lg:w-56 flex flex-col gap-3 shrink-0 justify-center">
                            <button
                             onClick={() => handleViewDetails(project)}
                             className="h-12 w-full rounded-2xl bg-white border border-gray-200 hover:border-[#0a9396]/30 hover:bg-white text-gray-600 hover:text-gray-900 font-bold uppercase tracking-[0.15em] text-[10px] shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 group/act"
                           >
                             Intelligence
                             <ArrowRight className="h-3.5 w-3.5 group-hover/act:translate-x-1 transition-transform" />
                           </button>
                           <Link href={`/messaging?proId=${project.proId}&projectId=${project.id}`}>
                             <button className="h-12 w-full rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-indigo-600/20 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2">
                               <MessageSquare className="h-3.5 w-3.5 fill-current" />
                               Uplink
                             </button>
                           </Link>
                           <Link href={`/client/reports/${project.id}`}>
                             <button className="h-10 w-full rounded-2xl bg-transparent hover:bg-gray-50 text-gray-400 hover:text-gray-900 font-bold uppercase tracking-[0.1em] text-[9px] transition-all cursor-pointer flex items-center justify-center gap-2">
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

        {/* Cinematic Details Modal */}
        <AnimatePresence>
          {showProjectDetails && selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8"
            >
              <div className="absolute inset-0 bg-gray-950/40 backdrop-blur-md" onClick={() => setShowProjectDetails(false)} />
              <motion.div
                initial={{ scale: 0.9, y: 30, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 30, opacity: 0 }}
                className="bg-white/90 backdrop-blur-3xl border border-white rounded-[3rem] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-[0_30px_100px_rgb(0,0,0,0.2)] relative z-10 flex flex-col"
              >
                  {/* Modal Header */}
                  <div className="p-8 lg:p-10 border-b border-gray-100 flex items-start justify-between bg-white/50 relative overflow-hidden">
                    <div className="absolute top-0 right-[-10%] w-64 h-64 bg-[#0a9396]/10 rounded-full blur-[80px]" />
                    <div className="relative z-10">
                       <div className="flex items-center gap-3 mb-3">
                          {getStatusBadge(selectedProject.status)}
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">UPLINK ACTIVE</p>
                       </div>
                       <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-4 uppercase">{selectedProject.name}</h2>
                       <p className="text-gray-600 font-bold leading-relaxed max-w-2xl">{"\""}{selectedProject.description}{"\""}</p>
                    </div>
                    <button 
                      onClick={() => setShowProjectDetails(false)}
                      className="h-12 w-12 rounded-2xl bg-white/80 border border-gray-100 hover:bg-gray-100 text-gray-500 transition-all flex items-center justify-center cursor-pointer shadow-sm relative z-20 group"
                    >
                      <X className="h-5 w-5 group-hover:rotate-90 transition-transform duration-500" />
                    </button>
                  </div>

                  {/* Modal Content */}
                  <div className="flex-1 overflow-y-auto p-8 lg:p-10 space-y-12 scrollbar-premium">
                     {/* Intelligence Grid */}
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 rounded-[2rem] bg-gray-50/50 border border-white shadow-sm space-y-2">
                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Unit Assigned</p>
                           <p className="text-lg font-black text-gray-900 uppercase">{selectedProject.pro}</p>
                           <p className="text-[10px] font-bold text-[#0a9396] uppercase tracking-widest">VERIFIED SPECIALIST</p>
                        </div>
                        <div className="p-6 rounded-[2rem] bg-gray-50/50 border border-white shadow-sm space-y-2">
                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Net Capital</p>
                           <p className="text-lg font-black text-emerald-600 uppercase">{formatCurrency(selectedProject.budget)}</p>
                           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">TOTAL ALLOCATION</p>
                        </div>
                        <div className="p-6 rounded-[2rem] bg-gray-50/50 border border-white shadow-sm space-y-2">
                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Temporal Limit</p>
                           <p className="text-lg font-black text-gray-900 uppercase">{new Date(selectedProject.deadline).toLocaleDateString()}</p>
                           <p className="text-[10px] font-bold text-red-500/80 uppercase tracking-widest">DEADLINE VECTOR</p>
                        </div>
                     </div>

                     {/* Progress Section */}
                     <div className="space-y-6">
                        <div className="flex items-end justify-between">
                           <div>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Completion Progress</p>
                              <h4 className="text-3xl font-black text-gray-900 tracking-tighter">{selectedProject.progress}%</h4>
                           </div>
                           <p className="text-[11px] font-black text-[#0a9396] uppercase tracking-widest">{selectedProject.completedTasks} / {selectedProject.tasks} OPERATIONAL TASKS</p>
                        </div>
                        <div className="h-4 rounded-full bg-gray-100 border border-gray-100 relative overflow-hidden">
                           <motion.div
                             className="absolute h-full bg-[#0a9396]"
                             initial={{ width: 0 }}
                             animate={{ width: `${selectedProject.progress}%` }}
                             transition={{ duration: 1, ease: "circOut" }}
                           />
                        </div>
                     </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="p-8 lg:p-10 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
                     <Link href={`/messaging?proId=${selectedProject.proId}&projectId=${selectedProject.id}`} className="flex-1">
                       <button className="h-14 w-full rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-lg shadow-indigo-600/20 transition-all cursor-pointer flex items-center justify-center gap-3">
                         <MessageSquare className="h-4 w-4 fill-current" />
                         Establish Uplink
                       </button>
                     </Link>
                     <Link href={`/client/reports/${selectedProject.id}`} className="flex-1">
                       <button className="h-14 w-full rounded-2xl bg-white border border-gray-200 hover:border-[#0a9396]/30 text-gray-600 font-bold uppercase tracking-[0.2em] text-[11px] italic transition-all cursor-pointer flex items-center justify-center gap-3">
                         <TrendingUp className="h-4 w-4" />
                         View Analytics
                       </button>
                     </Link>
                  </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cinematic New Project Modal */}
        <AnimatePresence>
          {showNewProjectModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8"
            >
              <div className="absolute inset-0 bg-gray-950/40 backdrop-blur-md" onClick={() => !isSubmitting && setShowNewProjectModal(false)} />
              <motion.div
                initial={{ scale: 0.9, y: 30, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 30, opacity: 0 }}
                className="bg-white/90 backdrop-blur-3xl border border-white rounded-[3rem] w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-[0_30px_100px_rgb(0,0,0,0.2)] relative z-10 flex flex-col"
              >
                  <div className="p-8 lg:p-10 border-b border-gray-100 flex items-center justify-between bg-white/50 relative overflow-hidden shrink-0">
                    <div className="absolute top-0 left-[-10%] w-64 h-64 bg-[#0a9396]/5 rounded-full blur-[80px]" />
                    <div className="relative z-10">
                       <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase leading-none mb-2">New Transmission</h2>
                       <p className="text-gray-400 font-black text-[10px] uppercase tracking-[0.3em]">Operational Parameter Setup</p>
                    </div>
                    <button 
                      onClick={() => !isSubmitting && setShowNewProjectModal(false)}
                      className="h-10 w-10 rounded-xl hover:bg-gray-100 text-gray-400 transition-all flex items-center justify-center cursor-pointer"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-8 lg:p-10 space-y-8 scrollbar-premium">
                     <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Transmission Alias</label>
                              <input 
                                type="text"
                                placeholder="e.g. VECTOR CAMPAIGN Q4"
                                className="w-full bg-white/50 border border-gray-100 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-[#0a9396]/5 focus:border-[#0a9396]/20 font-bold transition-all placeholder:text-gray-200"
                                value={newProject.name}
                                onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                              />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Vector Category</label>
                              <select 
                                className="w-full bg-white/50 border border-gray-100 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-[#0a9396]/5 focus:border-[#0a9396]/20 font-bold text-gray-600 transition-all appearance-none cursor-pointer"
                                value={newProject.category}
                                onChange={(e) => setNewProject({...newProject, category: e.target.value})}
                              >
                                 <option value="">SELECT VECTOR</option>
                                 <option value="seo">SEO MATRIX</option>
                                 <option value="ppc">PAID ADS / PPC</option>
                                 <option value="social">SOCIAL SYSTEMS</option>
                                 <option value="content">CONTENT FUEL</option>
                                 <option value="email">EMAIL DEPLOYMENT</option>
                              </select>
                           </div>
                        </div>

                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mission Parameters</label>
                           <textarea 
                             rows={4}
                             placeholder="Detail the operational objectives and required outcomes..."
                             className="w-full bg-white/50 border border-gray-100 p-4 rounded-3xl outline-none focus:ring-4 focus:ring-[#0a9396]/5 focus:border-[#0a9396]/20 font-bold transition-all placeholder:text-gray-200 resize-none"
                             value={newProject.description}
                             onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                           />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Capital Allocation (£)</label>
                              <input 
                                type="number"
                                placeholder="e.g. 10000"
                                className="w-full bg-white/50 border border-gray-100 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-[#0a9396]/5 focus:border-[#0a9396]/20 font-black text-emerald-600 transition-all placeholder:text-gray-200"
                                value={newProject.budget}
                                onChange={(e) => setNewProject({...newProject, budget: e.target.value})}
                              />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Temporal Limit</label>
                              <input 
                                type="date"
                                className="w-full bg-white/50 border border-gray-100 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-[#0a9396]/5 focus:border-[#0a9396]/20 font-bold text-gray-600 transition-all"
                                value={newProject.deadline}
                                min={new Date().toISOString().split("T")[0]}
                                onChange={(e) => setNewProject({...newProject, deadline: e.target.value})}
                              />
                           </div>
                        </div>

                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Vector Requirements (Optional)</label>
                           <textarea 
                             rows={3}
                             placeholder="Specific technical requirements or skill vectors..."
                             className="w-full bg-white/50 border border-gray-100 p-4 rounded-3xl outline-none focus:ring-4 focus:ring-[#0a9396]/5 focus:border-[#0a9396]/20 font-bold transition-all placeholder:text-gray-200 resize-none"
                             value={newProject.requirements}
                             onChange={(e) => setNewProject({...newProject, requirements: e.target.value})}
                           />
                        </div>
                     </div>
                  </div>

                  <div className="p-8 lg:p-10 bg-gray-50/50 border-t border-gray-100 flex gap-4 shrink-0">
                     <button 
                       onClick={() => !isSubmitting && setShowNewProjectModal(false)}
                       className="h-14 flex-1 rounded-2xl bg-white border border-gray-200 text-gray-400 font-bold uppercase tracking-widest text-[11px] hover:text-gray-600 transition-all cursor-pointer"
                       disabled={isSubmitting}
                     >
                        Abort
                     </button>
                     <button 
                       onClick={async () => {
                         if (!newProject.name || !newProject.description || !newProject.budget || !newProject.deadline || !newProject.category) {
                           alert("Matrix Incomplete: All required parameters must be set.");
                           return;
                         }
                         setIsSubmitting(true);
                         await new Promise(r => setTimeout(r, 1500));
                         alert("Transmission Successful: Project data synchronized with the marketplace.");
                         setIsSubmitting(false);
                         setShowNewProjectModal(false);
                         setNewProject({ name: "", description: "", budget: "", deadline: "", category: "", requirements: "" });
                       }}
                       disabled={isSubmitting}
                       className="h-14 flex-[2] rounded-2xl bg-[#0a9396] hover:bg-[#087579] text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-lg shadow-[#0a9396]/20 transition-all cursor-pointer flex items-center justify-center gap-3 disabled:opacity-50"
                     >
                        {isSubmitting ? (
                          <>
                            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Synchronizing...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-4 w-4" />
                            Deploy to Marketplace
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


