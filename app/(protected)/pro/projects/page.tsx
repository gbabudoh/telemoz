"use client";

import { Badge } from "@/components/ui/Badge";
import { FolderKanban, Clock, DollarSign, Users, X, Eye, CheckSquare, Calendar, TrendingUp, Plus, LayoutGrid, List } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { formatCurrency } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

interface Project {
  id: number;
  name: string;
  client: string;
  status: string;
  progress: number;
  budget: number;
  deadline: string;
  tasks: number;
  completedTasks: number;
  tasksList?: Task[];
}

const projects: Project[] = [
  {
    id: 1,
    name: "E-Commerce SEO Optimization",
    client: "TechStart Inc.",
    status: "active",
    progress: 65,
    budget: 5000,
    deadline: "2024-12-15",
    tasks: 12,
    completedTasks: 8,
  },
  {
    id: 2,
    name: "PPC Campaign Management",
    client: "Digital Retail Co.",
    status: "active",
    progress: 45,
    budget: 3500,
    deadline: "2024-12-20",
    tasks: 15,
    completedTasks: 7,
  },
  {
    id: 3,
    name: "Social Media Strategy",
    client: "Local Business Hub",
    status: "completed",
    progress: 100,
    budget: 2500,
    deadline: "2024-11-30",
    tasks: 10,
    completedTasks: 10,
  },
];

export default function ProjectsPage() {
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [showTaskManagement, setShowTaskManagement] = useState(false);
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [newProject, setNewProject] = useState({
    name: "",
    client: "",
    budget: "",
    deadline: "",
    status: "active",
  });
  const [projectsList, setProjectsList] = useState(projects);
  const [completedTasks, setCompletedTasks] = useState<Record<number, number>>({
    1: 8,
    2: 7,
    3: 10,
  });
  const [projectTasks, setProjectTasks] = useState<Record<number, Task[]>>({
    1: Array.from({ length: 12 }, (_, i) => ({ id: i + 1, title: `Keyword Research Phase ${i + 1}`, completed: i < 8 })),
    2: Array.from({ length: 15 }, (_, i) => ({ id: i + 1, title: `Ad Copy Review ${i + 1}`, completed: i < 7 })),
    3: Array.from({ length: 10 }, (_, i) => ({ id: i + 1, title: `Content Calendar Week ${i + 1}`, completed: i < 10 })),
  });

  const handleViewDetails = (project: Project) => {
    setSelectedProject(project);
    setShowProjectDetails(true);
  };

  const handleManageTasks = (project: Project) => {
    const currentTasks = projectTasks[project.id] || Array.from({ length: project.tasks }, (_, i) => ({
      id: i + 1,
      title: `Task ${i + 1}`,
      completed: i < (completedTasks[project.id] || project.completedTasks),
    }));
    setSelectedProject({
      ...project,
      completedTasks: completedTasks[project.id] || project.completedTasks,
      tasksList: currentTasks,
    });
    setShowTaskManagement(true);
  };

  const handleMarkTaskComplete = (taskId: number) => {
    if (!selectedProject) return;

    const currentTasks = projectTasks[selectedProject.id] || selectedProject.tasksList || [];
    const taskIndex = currentTasks.findIndex((t: Task) => t.id === taskId);
    
    if (taskIndex === -1) return;

    const isNowCompleted = !currentTasks[taskIndex].completed;

    const updatedTasks = currentTasks.map((task: Task) =>
      task.id === taskId ? { ...task, completed: isNowCompleted } : task
    );
    
    const newCompleted = updatedTasks.filter((t: Task) => t.completed).length;
    const updatedProjectTasks = { ...projectTasks, [selectedProject.id]: updatedTasks };
    setProjectTasks(updatedProjectTasks);
    
    const updatedCompletedTasks = { ...completedTasks, [selectedProject.id]: newCompleted };
    setCompletedTasks(updatedCompletedTasks);

    const updatedProject = {
      ...selectedProject,
      tasksList: updatedTasks,
      tasks: updatedTasks.length,
      completedTasks: newCompleted,
      progress: Math.round((newCompleted / updatedTasks.length) * 100),
    };
    setSelectedProject(updatedProject);
  };

  const handleAddTask = () => {
    if (!selectedProject || !newTaskTitle.trim()) return;

    const currentTasks = projectTasks[selectedProject.id] || selectedProject.tasksList || [];
    const newTask = {
      id: currentTasks.length > 0 ? Math.max(...currentTasks.map((t: Task) => t.id)) + 1 : 1,
      title: newTaskTitle.trim(),
      completed: false,
    };

    const updatedTasks = [...currentTasks, newTask];
    const updatedProjectTasks = { ...projectTasks, [selectedProject.id]: updatedTasks };
    setProjectTasks(updatedProjectTasks);

    const updatedProject = {
      ...selectedProject,
      tasksList: updatedTasks,
      tasks: updatedTasks.length,
      progress: Math.round((selectedProject.completedTasks / updatedTasks.length) * 100),
    };
    setSelectedProject(updatedProject);
    setNewTaskTitle("");
    setShowAddTaskForm(false);
  };

  const handleAddNewProject = () => {
    if (!newProject.name || !newProject.client || !newProject.budget || !newProject.deadline) {
      alert("Please fill in all required fields");
      return;
    }

    const newProjectId = projectsList.length > 0 ? Math.max(...projectsList.map((p) => p.id)) + 1 : 1;
    const addedProject = {
      id: newProjectId,
      name: newProject.name,
      client: newProject.client,
      status: newProject.status,
      progress: 0,
      budget: parseFloat(newProject.budget),
      deadline: newProject.deadline,
      tasks: 0,
      completedTasks: 0,
    };

    setProjectsList([addedProject, ...projectsList]);
    setCompletedTasks({ ...completedTasks, [newProjectId]: 0 });
    setProjectTasks({ ...projectTasks, [newProjectId]: [] });

    setNewProject({
      name: "",
      client: "",
      budget: "",
      deadline: "",
      status: "active",
    });
    setShowNewProjectModal(false);
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  return (
    <div className="relative min-h-screen max-w-7xl mx-auto pb-12 space-y-8 overflow-hidden">
      {/* Dynamic Ambient Background Orbs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
         <motion.div 
            animate={{ 
              x: ["-10%", "100%", "-10%"],
              y: ["-20%", "50%", "-20%"],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-r from-teal-200/40 to-cyan-300/40 blur-[120px] mix-blend-multiply" 
          />
         <motion.div 
            animate={{ 
              x: ["100%", "-20%", "100%"],
              y: ["80%", "-10%", "80%"],
              scale: [1, 1.3, 1],
            }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-l from-indigo-200/30 to-purple-300/30 blur-[120px] mix-blend-multiply" 
          />
      </div>

      <div className="relative z-10 space-y-8">
        {/* Ultra-Premium Hero Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/40 p-6 lg:p-8 rounded-[2rem] border border-white/60 shadow-[0_8px_32px_rgb(0,0,0,0.04)] backdrop-blur-xl">
          <div>
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-white to-gray-50/50 rounded-2xl shadow-[inset_0_2px_10px_rgb(255,255,255,0.8),0_4px_15px_rgb(0,0,0,0.05)] border border-white/80">
                  <FolderKanban className="h-7 w-7 text-[#0a9396]" />
              </div>
              <div>
                  <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 flex items-center gap-3">
                    Project Portfolio
                    <Badge variant="primary" size="sm" className="hidden sm:inline-flex bg-[#0a9396]/10 text-[#0a9396] border-[#0a9396]/20 py-1.5 px-3 rounded-xl shadow-inner font-bold tracking-wider text-[11px] uppercase">
                      {projectsList.length} Active Records
                    </Badge>
                  </h1>
                  <p className="text-gray-500 mt-2 font-medium text-lg">
                    Manage, track, and deliver professional digital marketing campaigns.
                  </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
            {/* High Contrast View Toggles */}
            <div className="hidden sm:flex bg-white/60 backdrop-blur-md rounded-2xl p-1.5 border border-white/80 shadow-[inset_0_2px_5px_rgb(0,0,0,0.02)]">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-3 rounded-xl transition-all font-bold flex items-center gap-2 ${viewMode === "grid" ? "bg-white text-[#0a9396] shadow-md border border-gray-100" : "text-gray-500 hover:text-gray-900 hover:bg-white/50"}`}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-3 rounded-xl transition-all font-bold flex items-center gap-2 ${viewMode === "list" ? "bg-white text-[#0a9396] shadow-md border border-gray-100" : "text-gray-500 hover:text-gray-900 hover:bg-white/50"}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            <button
               onClick={() => setShowNewProjectModal(true)}
               className="relative group h-14 px-8 rounded-2xl overflow-hidden font-bold tracking-wide shadow-xl shadow-[#0a9396]/20 transition-all hover:scale-[1.03] active:scale-[0.98] w-full sm:w-auto"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a9396] via-[#057a7d] to-[#0a9396] bg-[length:200%_auto] group-hover:animate-gradient" />
              <div className="absolute inset-[1px] rounded-[15px] bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
              <span className="relative z-10 flex items-center justify-center text-white text-[16px]">
                <Plus className="mr-2 h-5 w-5" />
                Initialize Project
              </span>
            </button>
          </div>
        </div>

        {/* Deep Glass Projects Grid / List */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className={viewMode === "grid" ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8" : "flex flex-col gap-6"}
        >
          <AnimatePresence>
            {projectsList.map((project) => {
              const projectCompletedTasks = completedTasks[project.id] || project.completedTasks;
              const projectProgress = project.tasks > 0 ? Math.round((projectCompletedTasks / project.tasks) * 100) : 0;
              const updatedProject = { ...project, completedTasks: projectCompletedTasks, progress: projectProgress };
              const isDone = projectProgress === 100;

              return (
                <motion.div
                  key={updatedProject.id}
                  variants={itemVariants}
                  layout
                  className={`group h-full relative ${viewMode === 'list' && 'w-full'}`}
                >
                  <div className={`
                    h-full flex flex-col justify-between overflow-hidden relative transition-all duration-500 rounded-[2.5rem] border backdrop-blur-xl hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1
                    ${isDone ? 'bg-emerald-50/40 border-emerald-100/50 shadow-[0_8px_32px_rgb(16,185,129,0.04)]' : 'bg-white/60 border-white/80 shadow-[0_8px_32px_rgb(0,0,0,0.04)]'}
                    ${viewMode === 'list' ? 'sm:flex-row' : ''}
                  `}>
                    
                    {/* Glossy top edge highlight */}
                    <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />
                    
                    {/* Status Top border indicator */}
                    <div className={`absolute top-0 left-0 w-full h-1.5 ${isDone ? "bg-gradient-to-r from-emerald-400 to-emerald-500" : "bg-gradient-to-r from-[#0a9396] to-cyan-400"}`} />
                    
                    <div className={`p-8 lg:p-10 flex-col flex ${viewMode === 'list' ? 'sm:flex-row sm:items-center sm:justify-between sm:w-full' : 'flex-grow h-full'}`}>
                       <div className={`${viewMode === 'list' ? 'flex-1 pr-6' : 'mb-8'}`}>
                         <div className="flex items-start justify-between mb-3">
                            <div>
                               <h3 className="text-2xl font-black text-gray-900 tracking-tight leading-tight group-hover:text-[#0a9396] transition-colors mb-3">
                                 {updatedProject.name}
                               </h3>
                               <p className="text-[14px] font-bold text-gray-500 flex items-center gap-2 bg-white/60 px-3 py-1.5 rounded-lg border border-white shadow-sm w-max">
                                 <Users className="w-4 h-4 text-[#0a9396]" />
                                 {updatedProject.client}
                               </p>
                            </div>
                            <Badge
                              variant={updatedProject.status === "completed" ? "success" : "info"}
                              size="md"
                              className="uppercase font-black text-[10px] tracking-widest px-3 py-1 shadow-sm shrink-0"
                            >
                              {updatedProject.status}
                            </Badge>
                         </div>
                       </div>
                       
                       <div className={`${viewMode === 'list' ? 'flex items-center gap-8 pl-6 border-l border-gray-200/50' : ''}`}>
                          <div className={`grid grid-cols-2 gap-y-5 gap-x-6 py-5 border-y border-white/60 bg-white/40 shadow-[inset_0_2px_10px_rgb(255,255,255,0.5)] rounded-2xl px-5 ${viewMode === 'list' ? 'border-y-0 bg-transparent shadow-none px-0 py-0' : 'mb-8'}`}>
                            <div className="flex items-center gap-3">
                              <div className="p-2.5 bg-gray-100/80 rounded-xl text-gray-600 border border-white">
                                <DollarSign className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black mb-0.5">Budget</p>
                                <span className="text-[15px] font-black text-gray-900">{formatCurrency(updatedProject.budget)}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="p-2.5 bg-gray-100/80 rounded-xl text-gray-600 border border-white">
                                <Clock className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black mb-0.5">Deadline</p>
                                <span className="text-[15px] font-black text-gray-900">{updatedProject.deadline}</span>
                              </div>
                            </div>
                          </div>
  
                          <div className={`mt-auto ${viewMode === 'list' ? 'w-[280px] shrink-0 mt-0 pt-0' : ''}`}>
                            <div className="flex items-center justify-between text-sm mb-3">
                              <div className="flex items-center gap-2">
                                <CheckSquare className={`h-4 w-4 ${isDone ? "text-emerald-500" : "text-[#0a9396]"}`} />
                                <span className="font-bold text-gray-700 uppercase tracking-wider text-[11px]">Tasks</span>
                              </div>
                              <span className="font-black text-gray-900 text-[15px]">
                                {updatedProject.completedTasks} / {updatedProject.tasks} <span className={`font-bold ml-1 ${isDone ? 'text-emerald-500' : 'text-gray-400'}`}>({updatedProject.progress}%)</span>
                              </span>
                            </div>
                            
                            {/* Deep Neon Fluid Task Bar Component */}
                            <div className="h-3 rounded-full bg-black/5 overflow-hidden relative shadow-[inset_0_2px_4px_rgb(0,0,0,0.05)] border border-white/50">
                              <motion.div
                                className={`absolute top-0 left-0 h-full rounded-full ${isDone ? "bg-gradient-to-r from-emerald-400 to-emerald-500" : "bg-gradient-to-r from-[#0a9396] to-cyan-400"}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${updatedProject.progress}%` }}
                                transition={{ duration: 1.5, type: "spring", bounce: 0.3 }}
                              >
                                {/* Inner glow pulse */}
                                <div className="absolute inset-0 bg-white/30 w-full h-full animate-pulse blur-[2px]" />
                              </motion.div>
                            </div>
                          </div>
                       </div>
                    </div>
                    
                    {/* Bottom Action Footer */}
                    <div className={`p-5 bg-gray-50/60 backdrop-blur-md border-t border-white shadow-[inset_1px_0_0_rgb(0,0,0,0.02)] flex gap-4 ${viewMode === 'list' ? 'sm:border-t-0 sm:border-l sm:w-[220px] sm:flex-col sm:justify-center' : ''}`}>
                      <button
                        onClick={() => handleViewDetails(updatedProject)}
                        className={`relative group rounded-xl overflow-hidden font-bold tracking-wide shadow-md shadow-[#0a9396]/10 transition-all hover:scale-[1.03] active:scale-[0.98] ${viewMode === 'list' ? 'h-11 w-full flex-none' : 'flex-1 h-12'}`}
                      >
                         <div className="absolute inset-0 bg-white/80 backdrop-blur border border-white/60 group-hover:bg-[#0a9396]/5 transition-colors" />
                         <span className={`relative z-10 flex items-center justify-center text-gray-700 group-hover:text-[#0a9396] ${viewMode === 'list' ? 'text-[14px]' : 'text-[15px]'}`}>
                           <Eye className="mr-2 h-4 w-4" />
                           View Overview
                         </span>
                      </button>

                      <button
                        onClick={() => handleManageTasks(updatedProject)}
                        className={`relative group rounded-xl overflow-hidden font-bold tracking-wide shadow-lg shadow-gray-900/10 transition-all hover:scale-[1.03] active:scale-[0.98] ${viewMode === 'list' ? 'h-11 w-full flex-none' : 'flex-1 h-12'}`}
                      >
                         <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-[length:200%_auto] group-hover:animate-gradient" />
                         <div className="absolute inset-[1px] rounded-[11px] bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                         <span className={`relative z-10 flex items-center justify-center text-white ${viewMode === 'list' ? 'text-[14px]' : 'text-[15px]'}`}>
                           <List className="mr-2 h-4 w-4" />
                           Tasks
                         </span>
                      </button>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Cinematic Project Details Modal */}
      <AnimatePresence>
        {showProjectDetails && selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-gray-900/40 backdrop-blur-xl"
               onClick={() => setShowProjectDetails(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="bg-white/90 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl border border-white max-w-4xl w-full max-h-[90vh] overflow-y-auto relative z-10"
            >
              <div className="flex flex-row items-start justify-between pb-8 border-b border-gray-100 bg-white/50 pt-10 px-10">
                <div>
                  <div className="flex items-center gap-4 mb-3">
                     <div className="p-4 bg-gradient-to-br from-white to-gray-50/50 rounded-2xl shadow-[inset_0_2px_10px_rgb(255,255,255,0.8),0_4px_15px_rgb(0,0,0,0.05)] border border-white/80">
                        <FolderKanban className="h-7 w-7 text-[#0a9396]" />
                     </div>
                     <div>
                        <h2 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight flex items-center gap-4">
                          {selectedProject.name}
                          <Badge
                            variant={selectedProject.status === "completed" ? "success" : "info"}
                            size="md"
                            className="uppercase font-black text-[11px] tracking-widest px-3 py-1 shadow-sm"
                          >
                            {selectedProject.status}
                          </Badge>
                        </h2>
                        <p className="text-lg font-bold text-gray-500 mt-2">
                          Client: <span className="text-gray-900">{selectedProject.client}</span>
                        </p>
                     </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowProjectDetails(false);
                    setSelectedProject(null);
                  }}
                  className="p-3 rounded-full bg-white border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all shadow-sm"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-10 space-y-10 bg-gray-50/30">
                {/* Project Overview Grid */}
                <div>
                  <h3 className="text-[17px] font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                    <LayoutGrid className="w-5 h-5 text-[#0a9396]" />
                    Project Specifications
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex items-center gap-5 p-6 rounded-2xl border border-white shadow-[0_4px_20px_rgb(0,0,0,0.03)] bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all group hover:-translate-y-1">
                      <div className="p-4 rounded-xl bg-blue-50 text-blue-600 transition-transform shadow-[inset_0_2px_10px_rgb(255,255,255,1)]">
                        <Users className="h-7 w-7" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Origin Client</p>
                        <p className="text-[17px] font-black text-gray-900">{selectedProject.client}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-5 p-6 rounded-2xl border border-white shadow-[0_4px_20px_rgb(0,0,0,0.03)] bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all group hover:-translate-y-1">
                      <div className="p-4 rounded-xl bg-green-50 text-green-600 transition-transform shadow-[inset_0_2px_10px_rgb(255,255,255,1)]">
                        <DollarSign className="h-7 w-7" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Financial Budget</p>
                        <p className="text-[20px] font-black text-gray-900">
                          {formatCurrency(selectedProject.budget)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-5 p-6 rounded-2xl border border-white shadow-[0_4px_20px_rgb(0,0,0,0.03)] bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all group hover:-translate-y-1">
                      <div className="p-4 rounded-xl bg-purple-50 text-purple-600 transition-transform shadow-[inset_0_2px_10px_rgb(255,255,255,1)]">
                        <Calendar className="h-7 w-7" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Submission Deadline</p>
                        <p className="text-[17px] font-black text-gray-900">{selectedProject.deadline}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-5 p-6 rounded-2xl border border-white shadow-[0_4px_20px_rgb(0,0,0,0.03)] bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all group hover:-translate-y-1">
                      <div className="p-4 rounded-xl bg-[#0a9396]/10 text-[#0a9396] transition-transform shadow-[inset_0_2px_10px_rgb(255,255,255,1)]">
                        <CheckSquare className="h-7 w-7" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Task Pipeline</p>
                        <p className="text-[17px] font-black text-gray-900">
                          {selectedProject.completedTasks} / {selectedProject.tasks} Complete
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Big Display */}
                <div className="bg-white p-8 rounded-[2rem] border border-white shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
                  <h3 className="text-[17px] font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-[#0a9396]" />
                      Global Delivery Progress
                    </span>
                    <span className="text-3xl font-black text-gray-900">{selectedProject.progress}%</span>
                  </h3>
                  <div className="h-4 rounded-full bg-black/5 overflow-hidden relative shadow-[inset_0_2px_4px_rgb(0,0,0,0.05)] border border-gray-100">
                    <motion.div
                      className={`h-full relative ${selectedProject.progress === 100 ? "bg-gradient-to-r from-emerald-400 to-emerald-500" : "bg-gradient-to-r from-[#0a9396] to-cyan-400"}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedProject.progress}%` }}
                      transition={{ duration: 1.5, type: "spring" }}
                    >
                       <div className="absolute inset-0 bg-white/30 animate-pulse blur-[1px]" />
                    </motion.div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-6 border-t border-gray-100/50">
                  <button
                    onClick={() => {
                      setShowProjectDetails(false);
                      handleManageTasks(selectedProject);
                    }}
                    className="flex-1 relative group h-14 rounded-2xl overflow-hidden font-bold tracking-wide shadow-xl shadow-gray-900/10 transition-all hover:-translate-y-1 active:scale-[0.98]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-[length:200%_auto] group-hover:animate-gradient" />
                    <div className="absolute inset-[1px] rounded-[15px] bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                    <span className="relative z-10 flex items-center justify-center text-white text-[16px]">
                      <CheckSquare className="mr-2 h-5 w-5" />
                      Open Task Engine
                    </span>
                  </button>
                  <button 
                    className="flex-1 bg-white border-2 border-[#0a9396] text-[#0a9396] hover:bg-[#0a9396] hover:text-white rounded-2xl h-14 shadow-sm hover:shadow-xl hover:shadow-[#0a9396]/20 transition-all text-[16px] font-bold flex items-center justify-center"
                  >
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Pull Analytical Report
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cinematic Task Management Modal */}
      <AnimatePresence>
        {showTaskManagement && selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-gray-900/40 backdrop-blur-xl"
               onClick={() => setShowTaskManagement(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="bg-white/90 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl border border-white max-w-4xl w-full max-h-[90vh] overflow-y-auto relative z-10 flex flex-col"
            >
              <div className="flex flex-row items-center justify-between pb-8 border-b border-gray-100 bg-white/50 pt-10 px-10 shrink-0">
                <div>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                    <List className="h-8 w-8 text-[#0a9396]" />
                    Checklist Controller
                  </h2>
                  <p className="text-lg font-bold text-gray-500 mt-2">
                    {selectedProject.name} Project Protocol
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowTaskManagement(false);
                    setShowAddTaskForm(false);
                    setNewTaskTitle("");
                    setSelectedProject(null);
                  }}
                  className="p-3 rounded-full bg-white border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all shadow-sm"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Progress bar attached right underneath header */}
              <div className="w-full bg-black/5 h-2 shrink-0 border-b border-white shadow-inner">
                <motion.div
                  className={`h-full ${selectedProject.progress === 100 ? 'bg-emerald-500' : 'bg-[#0a9396]'}`}
                  animate={{ width: `${selectedProject.progress}%` }}
                  transition={{ type: "spring", stiffness: 50 }}
                />
              </div>

              <div className="p-10 space-y-8 bg-gray-50/30 overflow-y-auto flex-1">
                <div className="flex items-center justify-between bg-white/60 p-6 rounded-2xl border border-white shadow-[0_4px_15px_rgb(0,0,0,0.03)] backdrop-blur">
                  <div className="px-5 py-2.5 bg-gray-900 rounded-xl shadow-inner font-black text-white text-lg tracking-wide flex items-center gap-3">
                    <CheckSquare className="h-5 w-5 text-[#0a9396]" />
                    {selectedProject.completedTasks} / {selectedProject.tasks} <span className="text-gray-400 font-bold ml-1">Delivered</span>
                  </div>
                  <button
                    onClick={() => setShowAddTaskForm(true)}
                    className="relative group h-12 px-6 rounded-xl overflow-hidden font-bold tracking-wide shadow-xl shadow-[#0a9396]/20 transition-all hover:scale-[1.03] active:scale-[0.98]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0a9396] via-[#057a7d] to-[#0a9396] bg-[length:200%_auto] group-hover:animate-gradient" />
                    <div className="absolute inset-[1px] rounded-[11px] bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                    <span className="relative z-10 flex items-center justify-center text-white text-[15px]">
                      <Plus className="mr-2 h-5 w-5" />
                      Add Checkpoint
                    </span>
                  </button>
                </div>

                {/* Add Task Form (Animated) */}
                <AnimatePresence>
                  {showAddTaskForm && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                      animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
                      exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                      className="bg-white p-6 rounded-2xl border-2 border-[#0a9396]/40 shadow-[0_8px_30px_rgb(10,147,150,0.08)] relative"
                    >
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Input
                          placeholder="Type new project checklist criteria..."
                          value={newTaskTitle}
                          onChange={(e) => setNewTaskTitle(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && handleAddTask()}
                          autoFocus
                          className="flex-1 bg-gray-50 border-gray-200 h-14 rounded-xl text-[16px] font-medium px-5 focus-visible:ring-[#0a9396]/30"
                        />
                        <div className="flex gap-3">
                           <button
                             onClick={handleAddTask}
                             disabled={!newTaskTitle.trim()}
                             className="bg-gray-900 hover:bg-[#0a9396] text-white rounded-xl px-8 font-bold h-14 transition-colors disabled:opacity-50"
                           >
                             Save Node
                           </button>
                           <button
                             onClick={() => {
                               setShowAddTaskForm(false);
                               setNewTaskTitle("");
                             }}
                             className="text-gray-500 hover:bg-gray-100 hover:text-gray-900 font-bold px-6 rounded-xl transition-colors h-14"
                           >
                             Cancel
                           </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Task List items with High-Contrast UX */}
                <div className="space-y-4">
                  <AnimatePresence>
                    {(selectedProject.tasksList || []).map((task: Task) => {
                      const isCompleted = task.completed;
                      return (
                        <motion.div
                          layout
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          key={task.id}
                          className={`group p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-[0_8px_25px_rgb(0,0,0,0.04)] hover:-translate-y-0.5 ${
                            isCompleted
                              ? "bg-emerald-50/40 border-emerald-200"
                              : "bg-white border-white shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:border-[#0a9396]/30"
                          }`}
                          onClick={() => handleMarkTaskComplete(task.id)}
                        >
                          <div className="flex items-center gap-5">
                            {/* Custom Interactive Spring Checkbox */}
                            <div
                              className={`h-8 w-8 rounded-[10px] border-[3px] flex items-center justify-center transition-all duration-300 shrink-0 ${
                                isCompleted
                                  ? "bg-emerald-500 border-emerald-500 shadow-[inset_0_2px_5px_rgb(0,0,0,0.2)]"
                                  : "border-gray-300 bg-gray-50 group-hover:border-[#0a9396]"
                              }`}
                            >
                              <motion.div
                                initial={false}
                                animate={{ scale: isCompleted ? 1 : 0 }}
                                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                              >
                                <CheckSquare className="h-5 w-5 text-white" />
                              </motion.div>
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-[17px] font-black transition-all duration-300 truncate tracking-tight ${
                                  isCompleted ? "text-emerald-800 line-through opacity-60" : "text-gray-900 group-hover:text-[#0a9396]"
                                }`}
                              >
                                {task.title}
                              </p>
                            </div>

                            <Badge variant={isCompleted ? "success" : "default"} size="md" className={`transition-all font-black uppercase tracking-widest text-[10px] ${isCompleted ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                              {isCompleted ? "Verified done" : "Awaiting Actions"}
                            </Badge>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cinematic New Project Modal Container */}
      <AnimatePresence>
        {showNewProjectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-gray-900/40 backdrop-blur-xl"
               onClick={() => setShowNewProjectModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="bg-white/90 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl border border-white max-w-3xl w-full max-h-[90vh] overflow-y-auto relative z-10"
            >
              <div className="p-8 pb-0 flex flex-row items-center justify-between border-b border-gray-100/50 bg-white/50 pt-10 px-10">
                <div className="mb-8">
                  <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3 tracking-tight">
                     <div className="p-3 bg-gradient-to-br from-white to-gray-50/50 rounded-2xl shadow-[inset_0_2px_10px_rgb(255,255,255,0.8),0_4px_15px_rgb(0,0,0,0.05)] border border-white/80">
                         <FolderKanban className="text-[#0a9396] w-6 h-6" />
                     </div>
                     Instantiate New Project
                  </h2>
                  <p className="text-lg font-medium text-gray-500 mt-2">
                    Setup a strict project protocol parameter to begin internal tracking.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowNewProjectModal(false);
                    setNewProject({ name: "", client: "", budget: "", deadline: "", status: "active" });
                  }}
                  className="p-3 rounded-full bg-white border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all shadow-sm mb-6"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-10 space-y-8 bg-gray-50/30">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Project Title <span className="text-red-500">*</span></label>
                    <Input
                      placeholder="e.g., Q1 Marketing Push"
                      value={newProject.name}
                      onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                      className="bg-white border-white shadow-[0_4px_15px_rgb(0,0,0,0.03)] h-14 rounded-2xl text-[15px] focus:ring-[#0a9396]/20 font-medium"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Client Corporation <span className="text-red-500">*</span></label>
                    <Input
                      placeholder="e.g., Acme Corp."
                      value={newProject.client}
                      onChange={(e) => setNewProject({ ...newProject, client: e.target.value })}
                      className="bg-white border-white shadow-[0_4px_15px_rgb(0,0,0,0.03)] h-14 rounded-2xl text-[15px] focus:ring-[#0a9396]/20 font-medium"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Allocated Funds (£) <span className="text-red-500">*</span></label>
                    <Input
                      type="number"
                      placeholder="5000"
                      value={newProject.budget}
                      onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
                      className="bg-white border-white shadow-[0_4px_15px_rgb(0,0,0,0.03)] h-14 rounded-2xl text-[15px] focus:ring-[#0a9396]/20 font-medium"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Target Hand-in <span className="text-red-500">*</span></label>
                    <input
                      type="date"
                      value={newProject.deadline}
                      onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
                      className="w-full h-14 px-5 rounded-2xl border border-white shadow-[0_4px_15px_rgb(0,0,0,0.03)] bg-white text-[15px] text-gray-900 focus:border-[#0a9396] focus:outline-none focus:ring-4 focus:ring-[#0a9396]/10 transition-all font-bold appearance-none"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-10 mt-6 border-t border-gray-200/50">
                  <button
                    onClick={handleAddNewProject}
                    disabled={!newProject.name || !newProject.client || !newProject.budget || !newProject.deadline}
                    className="w-full relative group h-14 rounded-2xl overflow-hidden font-bold tracking-wide shadow-xl shadow-[#0a9396]/20 transition-all hover:-translate-y-1 active:scale-[0.98] disabled:opacity-50 disabled:hover:translate-y-0"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0a9396] via-[#057a7d] to-[#0a9396] bg-[length:200%_auto] group-hover:animate-gradient" />
                    <div className="absolute inset-[1px] rounded-[15px] bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                    <span className="relative z-10 flex items-center justify-center text-white text-[16px]">
                      <FolderKanban className="mr-2 h-5 w-5" />
                      Initialize Project Parameter
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
