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
  X
} from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Project {
  id: string;
  name: string;
  category: string;
  pro: string;
  progress: number;
  status: string;
  timeline: string;
  budget: string;
  currency: string;
  country: string;
  description: string;
  nextMilestone: string;
}

interface Message {
  id: number;
  from: string;
  subject: string;
  preview: string;
  time: string;
  unread: boolean;
}

export default function ClientDashboard() {
  const { data: session } = useSession();
  const userName = session?.user?.name || "Amaebi";

  const [projects, setProjects] = useState<Project[]>([]);
  const [messages] = useState<Message[]>([
    { id: 1, from: "Michael Chen", subject: "Q3 Campaign Structure", preview: "I've drafted the initial PPC funnels for review. The ROAS projections look excellent.", time: "2h ago", unread: true },
    { id: 2, from: "Sarah Marketing", subject: "SEO Technical Audit", preview: "The crawler finished the sitemap scan. We have 4 high priority fixes.", time: "1d ago", unread: false }
  ]);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [isSavingProject, setIsSavingProject] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  const [newProjectData, setNewProjectData] = useState({
    name: "",
    category: "SEO (search engine optimisation)",
    budget: "",
    currency: "GBP",
    country: "United Kingdom",
    timeline: "1 Month",
    description: "",
  });

  // Fetch projects on mount
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
            category: p.category || "Marketing",
            pro: p.pro?.name || "Assigning Pro...",
            progress: p.status === "completed" ? 100 : (p.status === "active" ? 50 : 0),
            status: p.status,
            timeline: p.timeline || "N/A",
            budget: p.budget?.toString() || "0",
            currency: p.currency || "GBP",
            country: p.country || "United Kingdom",
            description: p.description,
            nextMilestone: p.status === "under_review" ? "Initial Review in Progress" : "Project in Status: " + p.status,
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
          setProjects(projects.map(proj => 
            proj.id === editingProjectId 
              ? { 
                  ...proj, 
                  name: p.title, 
                  category: p.category,
                  budget: p.budget?.toString(),
                  timeline: p.timeline,
                  description: p.description,
                  currency: p.currency || "GBP",
                  country: p.country || "United Kingdom"
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
          const newProject: Project = {
            id: p.id,
            name: p.title,
            category: p.category || "Marketing",
            pro: "Assigning Pro...",
            progress: 0,
            status: p.status,
            timeline: p.timeline || "N/A",
            budget: p.budget?.toString() || "0",
            currency: p.currency || "GBP",
            country: p.country || "United Kingdom",
            description: p.description,
            nextMilestone: "Initial Review in Progress",
          };
          setProjects([newProject, ...projects]);
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
      category: project.category,
      budget: project.budget,
      timeline: project.timeline,
      description: project.description,
      currency: project.currency,
      country: project.country,
    });
    setIsProjectModalOpen(true);
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

  return (
    <div className="relative min-h-screen bg-transparent">
      
      {/* Ambient Animated Orbs */}
      <div className="fixed top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-[#0a9396]/10 blur-[130px] pointer-events-none mix-blend-multiply animate-pulse z-0" />
      <div className="fixed top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-400/10 blur-[140px] pointer-events-none mix-blend-multiply animate-pulse-slow z-0" />
      <div className="fixed bottom-[-10%] left-[20%] w-[45%] h-[45%] rounded-full bg-emerald-400/10 blur-[130px] pointer-events-none mix-blend-multiply opacity-70 animate-pulse z-0" />

      <div className="space-y-8 relative z-10 max-w-[1600px] mx-auto pb-12">
        
        {/* Sleek Intelligence Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/40 backdrop-blur-2xl border border-white rounded-[2rem] p-6 lg:p-8 shadow-[inset_0_2px_15px_rgb(255,255,255,0.7),0_5px_25px_rgb(0,0,0,0.02)] overflow-hidden relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-5">
              <div className="relative shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0a9396] to-emerald-400 rounded-xl blur-sm opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-[#0a9396] to-emerald-300 p-[1.5px] shadow-sm relative z-10 transform group-hover:-rotate-3 transition-transform">
                   <div className="h-full w-full rounded-[10px] bg-white/20 backdrop-blur-md flex items-center justify-center text-xl font-black text-white mix-blend-overlay">
                     {userName.charAt(0)}
                   </div>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-1">SYSTEM ACCESS ENABLED</p>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight leading-none">
                  Welcome back, <span className="bg-gradient-to-r from-[#0a9396] to-teal-500 bg-clip-text text-transparent">{userName}</span>
                </h1>
              </div>
            </div>
            
            <button 
              className="h-12 px-6 rounded-xl bg-gray-950 hover:bg-black text-white font-bold tracking-wide text-[14px] shadow-lg shadow-gray-900/10 border-none transition-all cursor-pointer flex items-center justify-center gap-2 group/btn active:scale-95"
              onClick={openCreateModal}
            >
              New Transmission
              <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>

        {/* Translucent Key Performance Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Total Spend (MoM)", value: formatCurrency(12450), trend: "+12.5%", isUp: true, icon: Wallet, gradient: "from-indigo-500 to-purple-500", glow: "indigo-500/20" },
            { title: "Active Campaigns", value: formatNumber(projects.length), trend: "+1", isUp: true, icon: LayoutDashboard, gradient: "from-emerald-500 to-[#0a9396]", glow: "emerald-500/20" },
            { title: "Portfolio ROAS", value: "3.2x", trend: "+0.4x", isUp: true, icon: TrendingUp, gradient: "from-cyan-500 to-blue-500", glow: "cyan-500/20" },
            { title: "Pending Invoices", value: formatCurrency(0), trend: "-100%", isUp: false, icon: FileText, gradient: "from-rose-500 to-pink-500", glow: "rose-500/20" },
          ].map((stat, idx) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
              className="bg-white/40 backdrop-blur-xl border border-white rounded-[2rem] p-6 shadow-[inset_0_2px_15px_rgb(255,255,255,0.7),0_10px_30px_rgb(0,0,0,0.03)] group hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden"
            >
              <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${stat.gradient} rounded-full blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity`} />
              
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-md shadow-${stat.glow}`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
                <div className={`px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider ${stat.isUp ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-rose-50 text-rose-600 border border-rose-100"}`}>
                  {stat.trend}
                </div>
              </div>
              
              <div className="relative z-10">
                <h3 className="text-3xl font-black text-gray-900 tracking-tight mb-1">{stat.value}</h3>
                <p className="text-[13px] font-bold text-gray-500 tracking-wide uppercase">{stat.title}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Cinematic Unified Board (Projects + Messages) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Active Projects Core */}
          <div className="lg:col-span-8 flex flex-col min-h-[500px]">
            <div className="bg-white/40 backdrop-blur-3xl border border-white rounded-[2.5rem] shadow-[inset_0_2px_15px_rgb(255,255,255,0.7),0_10px_30px_rgb(0,0,0,0.03)] overflow-hidden flex-1 flex flex-col">
               
               <div className="p-6 lg:p-8 border-b border-gray-100/50 bg-gradient-to-br from-white/40 to-transparent flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-20 backdrop-blur-xl">
                 <div>
                   <h2 className="text-2xl font-black text-gray-900 tracking-tight">Active Operation Matrix</h2>
                   <p className="text-sm font-bold text-gray-500 tracking-wide mt-1">Real-time status of your marketing initiatives.</p>
                 </div>
                 
                 <div className="flex items-center bg-white/80 border border-gray-100 shadow-sm rounded-xl p-1 shrink-0">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-lg transition-colors cursor-pointer ${
                        viewMode === "grid" 
                          ? "bg-[#0a9396]/10 text-[#0a9396] shadow-inner" 
                          : "text-gray-400 hover:text-gray-900"
                      }`}
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </button>
                    <div className="w-px h-4 bg-gray-200 mx-1" />
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-lg transition-colors cursor-pointer ${
                        viewMode === "list" 
                          ? "bg-[#0a9396]/10 text-[#0a9396] shadow-inner" 
                          : "text-gray-400 hover:text-gray-900"
                      }`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                 </div>
               </div>

               <div className="flex-1 p-6 lg:p-8 bg-white/20 relative">
                 {isLoadingProjects ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="h-12 w-12 rounded-full border-4 border-[#0a9396]/20 border-t-[#0a9396] animate-spin mb-4" />
                      <p className="text-[13px] font-bold text-gray-500 uppercase tracking-widest animate-pulse">Establishing Secure Uplink...</p>
                    </div>
                 ) : projects.length === 0 ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center max-w-sm mx-auto text-center px-6">
                       <div className="relative mb-8">
                         <div className="absolute inset-0 bg-[#0a9396] blur-2xl opacity-20 rounded-full animate-pulse-slow" />
                         <div className="h-24 w-24 rounded-[2rem] bg-white border border-gray-100 shadow-xl flex items-center justify-center relative z-10 rotate-3 hover:rotate-6 transition-transform">
                           <Briefcase className="h-10 w-10 text-[#0a9396]" />
                         </div>
                       </div>
                       <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-2">No Active Vectors found.</h3>
                       <p className="text-gray-500 font-medium leading-relaxed mb-8">Your dashboard is clear. Initiate a deployment sequence to begin scaling your operations with an expert Pro.</p>
                       <button onClick={openCreateModal} className="h-12 px-6 rounded-2xl bg-gray-900 hover:bg-black text-white font-bold tracking-wide shadow-lg shadow-gray-900/20 transition-all">
                         Initialize Mission
                       </button>
                    </div>
                 ) : (
                    <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-5" : "flex flex-col gap-4"}>
                      <AnimatePresence>
                        {projects.map((project, idx) => (
                           <motion.div 
                             key={project.id}
                             initial={{ opacity: 0, scale: 0.95, y: 10 }}
                             animate={{ opacity: 1, scale: 1, y: 0 }}
                             exit={{ opacity: 0, scale: 0.95 }}
                             transition={{ duration: 0.3, delay: idx * 0.05 }}
                             className={`bg-white/80 backdrop-blur-xl border border-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgb(10,147,150,0.08)] hover:border-[#0a9396]/20 transition-all relative overflow-hidden group ${viewMode === "list" ? "flex flex-col md:flex-row p-1" : "p-6"}`}
                           >
                             <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-cyan-400/10 to-transparent blur-2xl pointer-events-none" />

                             {/* Project Identity Block */}
                             <div className={`${viewMode === "list" ? "p-5 md:w-2/5 md:border-r border-gray-100" : "mb-5"}`}>
                               <div className="flex items-start justify-between gap-4">
                                 <div className="flex-1">
                                   <h4 className="text-[17px] font-black text-gray-900 tracking-tight leading-snug mb-2 group-hover:text-[#0a9396] transition-colors">{project.name}</h4>
                                   <div className="flex items-center gap-2">
                                     <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center shrink-0 shadow-inner">
                                       <span className="text-[10px] font-black text-white">{project.pro.charAt(0)}</span>
                                     </div>
                                     <span className="text-[13px] font-bold text-gray-600 truncate">{project.pro}</span>
                                   </div>
                                 </div>
                                 <button 
                                   onClick={() => handleEditProject(project)}
                                   className="h-8 w-8 rounded-xl bg-gray-50 hover:bg-[#0a9396]/10 text-gray-400 hover:text-[#0a9396] border border-gray-100 hover:border-[#0a9396]/20 flex items-center justify-center transition-all cursor-pointer shrink-0 opacity-0 group-hover:opacity-100"
                                 >
                                   <Pencil className="h-3.5 w-3.5" />
                                 </button>
                               </div>
                             </div>

                             {/* Metrics & Progress Box */}
                             <div className={`${viewMode === "list" ? "p-5 flex-1 flex flex-col justify-center" : ""}`}>
                               
                               <div className={`grid ${viewMode === "list" ? "grid-cols-4 gap-4 items-center" : "grid-cols-2 gap-y-4 gap-x-2"} mb-4`}>
                                 <div>
                                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
                                   <div className="inline-flex px-2 py-0.5 rounded border text-[11px] font-bold uppercase tracking-wide bg-gray-50 text-gray-600 border-gray-200">
                                     {project.status.replace("_", " ")}
                                   </div>
                                 </div>
                                 <div>
                                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 border-l border-gray-200 pl-3">Phase</p>
                                   <p className="text-[12px] font-black text-gray-900 pl-3">{project.timeline}</p>
                                 </div>
                                 <div className={viewMode === "list" ? "col-span-2 text-right" : "col-span-2"}>
                                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Capital Allocated</p>
                                   <p className="text-lg font-black text-emerald-600 tracking-tight leading-none bg-emerald-50 inline-block px-2 py-1 rounded-lg border border-emerald-100">
                                     {formatCurrency(Number(project.budget) || 0, project.currency)}
                                   </p>
                                 </div>
                               </div>

                               <div className="space-y-2">
                                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-[#0a9396]">
                                    <span>Deployment Progress</span>
                                    <span>{project.progress}%</span>
                                  </div>
                                  <div className="h-2 w-full bg-cyan-900/5 rounded-full overflow-hidden shadow-inner">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${project.progress}%` }}
                                      transition={{ duration: 1, ease: "easeOut", type: "spring", bounce: 0.4 }}
                                      className="h-full bg-gradient-to-r from-teal-400 via-[#0a9396] to-indigo-500 relative"
                                    >
                                      <div className="absolute inset-0 bg-white/20 w-1/2 rounded-full blur-sm" />
                                    </motion.div>
                                  </div>
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

          {/* Secure Transmissions Panel */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="bg-white/40 backdrop-blur-3xl border border-white rounded-[2.5rem] shadow-[inset_0_2px_15px_rgb(255,255,255,0.7),0_10px_30px_rgb(0,0,0,0.03)] overflow-hidden flex-1 flex flex-col h-[500px]">
               <div className="p-6 border-b border-gray-100/50 bg-gradient-to-br from-white/40 to-transparent sticky top-0 z-20 backdrop-blur-xl">
                 <div className="flex items-center justify-between">
                   <h2 className="text-xl font-black text-gray-900 tracking-tight">Transmissions</h2>
                   <Link href="/messaging">
                      <div className="h-8 w-8 rounded-full bg-white hover:bg-[#0a9396]/10 border border-gray-100 shadow-sm flex items-center justify-center text-gray-400 hover:text-[#0a9396] transition-colors cursor-pointer">
                        <ArrowRight className="h-4 w-4 -rotate-45" />
                      </div>
                   </Link>
                 </div>
               </div>

               <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white/20">
                 {messages.length > 0 ? (
                    messages.map((message, i) => (
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * i }}
                        key={message.id} 
                        className={`p-4 rounded-[1.5rem] border transition-all cursor-pointer block relative overflow-hidden group ${message.unread ? "bg-white border-[#0a9396]/20 shadow-md" : "bg-white/60 border-white hover:bg-white shadow-sm"}`}
                      >
                        {message.unread && <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[#0a9396] to-teal-400" />}
                        
                        <div className="flex items-center justify-between mb-2 pl-1">
                          <p className="text-[13px] font-black text-gray-900 tracking-tight flex items-center gap-2">
                            {message.from}
                            {message.unread && <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />}
                          </p>
                          <span className="text-[11px] font-bold text-gray-400">{message.time}</span>
                        </div>
                        <p className="text-[12px] font-bold text-gray-700 leading-tight mb-2 pl-1">{message.subject}</p>
                        <p className="text-[12px] font-medium text-gray-500 leading-relaxed line-clamp-2 pl-1">{message.preview}</p>
                      </motion.div>
                    ))
                 ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center px-6">
                       <div className="h-16 w-16 rounded-3xl bg-white border border-gray-100 shadow-md flex items-center justify-center mb-4">
                         <MessageSquare className="h-6 w-6 text-gray-300" />
                       </div>
                       <h4 className="text-[15px] font-black text-gray-900 tracking-tight mb-1">Silence.</h4>
                       <p className="text-[12px] font-bold text-gray-500 tracking-wide">No new secure transmissions inbound.</p>
                    </div>
                 )}
               </div>
            </div>
          </div>

        </div>
      </div>

      {/* Cinematic Project Modal Overlay */}
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
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="w-full max-w-xl bg-white/90 backdrop-blur-3xl border border-white rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.12),inset_0_2px_15px_rgba(255,255,255,0.8)] overflow-hidden relative z-10"
            >
               <div className="p-6 lg:p-8 border-b border-gray-100/50 bg-gradient-to-br from-white/40 to-transparent flex items-center justify-between">
                 <div>
                   <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                     {editingProjectId ? "Modify Architecture" : "Deploy Operation"}
                   </h3>
                   <p className="text-sm font-bold text-gray-500 tracking-wide mt-1">
                     Define the parameters of your project securely.
                   </p>
                 </div>
                 <button 
                   onClick={() => setIsProjectModalOpen(false)}
                   className="p-3 rounded-full hover:bg-white/60 bg-white/40 border border-gray-100 transition-all text-gray-500 hover:text-gray-900 cursor-pointer shadow-sm"
                 >
                   <X className="h-5 w-5" />
                 </button>
               </div>

               <div className="p-6 lg:p-8 space-y-6 bg-white/40">
                 {/* Cinematic Deep Inputs */}
                 <div>
                   <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 pl-1">Operation Title</label>
                   <div className="relative group">
                     <div className="absolute -inset-0.5 bg-gradient-to-r from-[#0a9396]/20 to-teal-400/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none" />
                     <input
                       type="text"
                       placeholder="e.g. Q4 Website Rework Pipeline..."
                       className="relative w-full bg-white backdrop-blur-md border border-gray-200/60 rounded-xl px-5 py-4 text-[15px] font-bold text-gray-900 focus:border-[#0a9396]/50 focus:ring-0 outline-none transition-all shadow-inner placeholder-gray-300"
                       value={newProjectData.name}
                       onChange={(e) => setNewProjectData({ ...newProjectData, name: e.target.value })}
                     />
                   </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                   <div>
                     <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 pl-1">Vector / Category</label>
                     <select
                       className="w-full bg-white backdrop-blur-md border border-gray-200/60 rounded-xl px-5 py-4 text-[15px] font-bold text-gray-900 focus:border-[#0a9396]/50 outline-none transition-all shadow-inner"
                       value={newProjectData.category}
                       onChange={(e) => setNewProjectData({ ...newProjectData, category: e.target.value })}
                     >
                        <option value="SEO (search engine optimisation)">Optimization (SEO)</option>
                        <option value="PPC">Paid Media (PPC)</option>
                        <option value="Social Media">Social Frameworks</option>
                        <option value="Content Marketing">Content Logistics</option>
                        <option value="Email Marketing">Email Deployment</option>
                        <option value="Other">Custom Vector</option>
                     </select>
                   </div>
                   <div>
                     <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 pl-1">Time Horizon</label>
                     <select
                       className="w-full bg-white backdrop-blur-md border border-gray-200/60 rounded-xl px-5 py-4 text-[15px] font-bold text-gray-900 focus:border-[#0a9396]/50 outline-none transition-all shadow-inner"
                       value={newProjectData.timeline}
                       onChange={(e) => setNewProjectData({ ...newProjectData, timeline: e.target.value })}
                     >
                       <option>Sprint (1 Week)</option>
                       <option>1 Month Cycle</option>
                       <option>Quarterly (3 Months)</option>
                       <option>Bi-Annual (6 Months)</option>
                     </select>
                   </div>
                 </div>

                 <div className="grid grid-cols-[1fr_2fr_2fr] gap-3">
                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 pl-1">Currency</label>
                      <select
                        className="w-full bg-white backdrop-blur-md border border-gray-200/60 rounded-xl px-4 py-4 text-[15px] font-bold text-gray-900 focus:border-[#0a9396]/50 outline-none transition-all shadow-inner"
                        value={newProjectData.currency}
                        onChange={(e) => setNewProjectData({ ...newProjectData, currency: e.target.value })}
                      >
                         <option value="USD">USD</option>
                         <option value="GBP">GBP</option>
                         <option value="EUR">EUR</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                       <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 pl-1">Capital Reserve</label>
                       <div className="relative">
                         <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-black text-[15px] pointer-events-none">$</span>
                         <input
                           type="number"
                           placeholder="5000"
                           className="w-full bg-white backdrop-blur-md border border-gray-200/60 rounded-xl pl-9 pr-5 py-4 text-[15px] font-black text-gray-900 focus:border-[#0a9396]/50 focus:ring-0 outline-none transition-all shadow-inner placeholder-gray-300"
                           value={newProjectData.budget}
                           onChange={(e) => setNewProjectData({ ...newProjectData, budget: e.target.value })}
                         />
                       </div>
                    </div>
                 </div>

                 <div>
                   <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 pl-1">Strategic Overview</label>
                   <div className="relative group">
                     <div className="absolute -inset-0.5 bg-gradient-to-r from-[#0a9396]/20 to-teal-400/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none" />
                     <textarea
                       rows={4}
                       placeholder="Detail your goals, metrics for success, and brand context..."
                       className="relative w-full bg-white backdrop-blur-md border border-gray-200/60 rounded-xl px-5 py-4 text-[14px] font-bold text-gray-700 focus:border-[#0a9396]/50 focus:ring-0 outline-none transition-all shadow-inner placeholder-gray-300 resize-none"
                       value={newProjectData.description}
                       onChange={(e) => setNewProjectData({ ...newProjectData, description: e.target.value })}
                     />
                   </div>
                 </div>

               </div>
               
               <div className="p-6 lg:p-8 border-t border-gray-100/50 bg-white/60 flex items-center justify-end gap-4">
                  <button 
                    onClick={() => setIsProjectModalOpen(false)}
                    className="px-6 py-4 rounded-xl font-bold tracking-wide text-gray-500 hover:bg-white hover:text-gray-900 hover:shadow-sm border border-transparent hover:border-gray-200 transition-all cursor-pointer text-[14px]"
                  >
                    Abort Sequence
                  </button>
                  <button
                    onClick={handlePostProject}
                    disabled={isSavingProject || !newProjectData.name.trim() || !newProjectData.description.trim()}
                    className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#0a9396] to-teal-500 hover:from-teal-500 hover:to-[#0a9396] disabled:opacity-50 disabled:grayscale text-white font-bold tracking-wide text-[15px] shadow-lg shadow-teal-500/20 border-none transition-all cursor-pointer flex items-center gap-2"
                  >
                    {isSavingProject ? (
                      <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-5 w-5" />
                    )}
                    {editingProjectId ? "Confirm Override" : "Execute Deployment"}
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
