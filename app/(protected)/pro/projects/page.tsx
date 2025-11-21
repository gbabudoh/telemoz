"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FolderKanban, Clock, DollarSign, Users, X, Eye, CheckSquare, Calendar, TrendingUp, Plus } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { formatCurrency } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const projects = [
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
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
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
  const [projectTasks, setProjectTasks] = useState<Record<number, Array<{ id: number; title: string; completed: boolean }>>>({
    1: Array.from({ length: 12 }, (_, i) => ({ id: i + 1, title: `Task ${i + 1}`, completed: i < 8 })),
    2: Array.from({ length: 15 }, (_, i) => ({ id: i + 1, title: `Task ${i + 1}`, completed: i < 7 })),
    3: Array.from({ length: 10 }, (_, i) => ({ id: i + 1, title: `Task ${i + 1}`, completed: i < 10 })),
  });

  const handleViewDetails = (project: any) => {
    setSelectedProject(project);
    setShowProjectDetails(true);
  };

  const handleManageTasks = (project: any) => {
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
    const taskIndex = currentTasks.findIndex((t: any) => t.id === taskId);
    
    if (taskIndex === -1 || currentTasks[taskIndex].completed) return;

    // Mark task as completed
    const updatedTasks = currentTasks.map((task: any) =>
      task.id === taskId ? { ...task, completed: true } : task
    );
    
    const newCompleted = updatedTasks.filter((t: any) => t.completed).length;
    const updatedProjectTasks = { ...projectTasks, [selectedProject.id]: updatedTasks };
    setProjectTasks(updatedProjectTasks);
    
    const updatedCompletedTasks = { ...completedTasks, [selectedProject.id]: newCompleted };
    setCompletedTasks(updatedCompletedTasks);

    // Update selected project
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
      id: currentTasks.length > 0 ? Math.max(...currentTasks.map((t: any) => t.id)) + 1 : 1,
      title: newTaskTitle.trim(),
      completed: false,
    };

    const updatedTasks = [...currentTasks, newTask];
    const updatedProjectTasks = { ...projectTasks, [selectedProject.id]: updatedTasks };
    setProjectTasks(updatedProjectTasks);

    // Update selected project
    const updatedProject = {
      ...selectedProject,
      tasksList: updatedTasks,
      tasks: updatedTasks.length,
      progress: Math.round((selectedProject.completedTasks / updatedTasks.length) * 100),
    };
    setSelectedProject(updatedProject);

    // Reset form
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

    setProjectsList([...projectsList, addedProject]);
    setCompletedTasks({ ...completedTasks, [newProjectId]: 0 });
    setProjectTasks({ ...projectTasks, [newProjectId]: [] });

    // Reset form
    setNewProject({
      name: "",
      client: "",
      budget: "",
      deadline: "",
      status: "active",
    });
    setShowNewProjectModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Projects</h1>
          <p className="text-gray-400 mt-1">Manage all your active and completed projects</p>
        </div>
        <Button
          onClick={() => setShowNewProjectModal(true)}
          className="bg-[#0a9396] hover:bg-[#087579] text-white"
        >
          <FolderKanban className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {projectsList.map((project, index) => {
          const projectCompletedTasks = completedTasks[project.id] || project.completedTasks;
          const projectProgress = Math.round((projectCompletedTasks / project.tasks) * 100);
          const updatedProject = { ...project, completedTasks: projectCompletedTasks, progress: projectProgress };
          
          return (
          <motion.div
            key={updatedProject.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-white">{updatedProject.name}</h3>
                      <Badge
                        variant={updatedProject.status === "active" ? "success" : "default"}
                        size="sm"
                      >
                        {updatedProject.status}
                      </Badge>
                    </div>
                    <p className="text-gray-400 mb-4">{updatedProject.client}</p>
                    
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-400">
                          {formatCurrency(updatedProject.budget)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-400">{updatedProject.deadline}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-400">
                          {updatedProject.completedTasks}/{updatedProject.tasks} tasks
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                        <span>Progress</span>
                        <span>{updatedProject.progress}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-primary-500 to-accent-purple"
                          initial={{ width: 0 }}
                          animate={{ width: `${updatedProject.progress}%` }}
                          transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(updatedProject)}
                    className="cursor-pointer"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleManageTasks(updatedProject)}
                    className="cursor-pointer"
                  >
                    <CheckSquare className="mr-2 h-4 w-4" />
                    Manage Tasks
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
        })}
      </div>

      {/* Project Details Modal */}
      <AnimatePresence>
        {showProjectDetails && selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-2xl text-gray-900">{selectedProject.name}</CardTitle>
                      <Badge
                        variant={selectedProject.status === "active" ? "success" : "default"}
                        size="sm"
                      >
                        {selectedProject.status}
                      </Badge>
                    </div>
                    <CardDescription className="text-base">
                      Complete project information and overview
                    </CardDescription>
                  </div>
                  <button
                    onClick={() => {
                      setShowProjectDetails(false);
                      setSelectedProject(null);
                    }}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-600" />
                  </button>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  {/* Project Overview */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Overview</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                        <div className="p-2 rounded-lg bg-[#0a9396]/10">
                          <Users className="h-5 w-5 text-[#0a9396]" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Client</p>
                          <p className="text-sm font-medium text-gray-900">{selectedProject.client}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                        <div className="p-2 rounded-lg bg-[#0a9396]/10">
                          <DollarSign className="h-5 w-5 text-[#0a9396]" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Budget</p>
                          <p className="text-sm font-medium text-gray-900">
                            {formatCurrency(selectedProject.budget)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                        <div className="p-2 rounded-lg bg-[#0a9396]/10">
                          <Calendar className="h-5 w-5 text-[#0a9396]" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Deadline</p>
                          <p className="text-sm font-medium text-gray-900">{selectedProject.deadline}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                        <div className="p-2 rounded-lg bg-[#0a9396]/10">
                          <CheckSquare className="h-5 w-5 text-[#0a9396]" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Tasks</p>
                          <p className="text-sm font-medium text-gray-900">
                            {selectedProject.completedTasks}/{selectedProject.tasks} completed
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress</h3>
                    <div className="p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600">Overall Progress</span>
                        <span className="font-semibold text-gray-900">{selectedProject.progress}%</span>
                      </div>
                      <div className="h-3 rounded-full bg-gray-200 overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-[#0a9396] to-[#087579]"
                          initial={{ width: 0 }}
                          animate={{ width: `${selectedProject.progress}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowProjectDetails(false);
                        handleManageTasks(selectedProject);
                      }}
                      className="flex-1 border-gray-200 hover:border-[#0a9396]/50 hover:bg-[#0a9396]/5 hover:text-[#0a9396]"
                    >
                      <CheckSquare className="mr-2 h-4 w-4" />
                      Manage Tasks
                    </Button>
                    <Button className="flex-1 bg-[#0a9396] hover:bg-[#087579] text-white">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      View Reports
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Task Management Modal */}
      <AnimatePresence>
        {showTaskManagement && selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
                  <div>
                    <CardTitle className="text-2xl text-gray-900">Manage Tasks</CardTitle>
                    <CardDescription className="text-base">
                      {selectedProject.name} - Task Management
                    </CardDescription>
                  </div>
                  <button
                    onClick={() => {
                      setShowTaskManagement(false);
                      setShowAddTaskForm(false);
                      setNewTaskTitle("");
                      setSelectedProject(null);
                    }}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-600" />
                  </button>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-600">
                        {selectedProject.completedTasks} of {selectedProject.tasks} tasks completed
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => setShowAddTaskForm(true)}
                      className="bg-[#0a9396] hover:bg-[#087579] text-white"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Task
                    </Button>
                  </div>

                  {/* Add Task Form */}
                  {showAddTaskForm && (
                    <div className="p-4 rounded-lg border border-[#0a9396]/30 bg-[#0a9396]/5 mb-4">
                      <div className="space-y-3">
                        <Input
                          label="Task Title"
                          placeholder="Enter task title..."
                          value={newTaskTitle}
                          onChange={(e) => setNewTaskTitle(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && handleAddTask()}
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={handleAddTask}
                            disabled={!newTaskTitle.trim()}
                            className="bg-[#0a9396] hover:bg-[#087579] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Task
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setShowAddTaskForm(false);
                              setNewTaskTitle("");
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Task List */}
                  <div className="space-y-3">
                    {(selectedProject.tasksList || Array.from({ length: selectedProject.tasks }).map((_, i) => ({
                      id: i + 1,
                      title: `Task ${i + 1}`,
                      completed: i < selectedProject.completedTasks,
                    }))).map((task: any) => {
                      const isCompleted = task.completed;
                      return (
                        <div
                          key={task.id}
                          className={`p-4 rounded-lg border ${
                            isCompleted
                              ? "bg-green-50 border-green-200"
                              : "bg-gray-50 border-gray-200"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`h-5 w-5 rounded border-2 flex items-center justify-center ${
                                isCompleted
                                  ? "bg-[#0a9396] border-[#0a9396]"
                                  : "border-gray-300"
                              }`}
                            >
                              {isCompleted && (
                                <CheckSquare className="h-3 w-3 text-white" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p
                                className={`text-sm font-medium ${
                                  isCompleted ? "text-gray-600 line-through" : "text-gray-900"
                                }`}
                              >
                                {task.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {isCompleted ? "Completed" : "In progress"}
                              </p>
                            </div>
                            {!isCompleted && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleMarkTaskComplete(task.id)}
                                className="border-[#0a9396] text-[#0a9396] hover:bg-[#0a9396] hover:text-white transition-all"
                              >
                                Mark Complete
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Progress Summary */}
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">Overall Progress</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {selectedProject.progress}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#0a9396] to-[#087579] transition-all duration-300"
                        style={{ width: `${selectedProject.progress}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* New Project Modal */}
      <AnimatePresence>
        {showNewProjectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
                  <div>
                    <CardTitle className="text-2xl text-gray-900">Create New Project</CardTitle>
                    <CardDescription className="text-base">
                      Add a new project to your portfolio
                    </CardDescription>
                  </div>
                  <button
                    onClick={() => {
                      setShowNewProjectModal(false);
                      setNewProject({
                        name: "",
                        client: "",
                        budget: "",
                        deadline: "",
                        status: "active",
                      });
                    }}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-600" />
                  </button>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Project Name *"
                      placeholder="e.g., SEO Optimization Campaign"
                      value={newProject.name}
                      onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                      required
                    />
                    <Input
                      label="Client Name *"
                      placeholder="e.g., TechStart Inc."
                      value={newProject.client}
                      onChange={(e) => setNewProject({ ...newProject, client: e.target.value })}
                      required
                    />
                    <Input
                      label="Budget (£) *"
                      type="number"
                      placeholder="5000"
                      value={newProject.budget}
                      onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
                      required
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Deadline *</label>
                      <input
                        type="date"
                        value={newProject.deadline}
                        onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:border-[#0a9396] focus:outline-none focus:ring-2 focus:ring-[#0a9396]/20"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Status</label>
                      <select
                        value={newProject.status}
                        onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:border-[#0a9396] focus:outline-none focus:ring-2 focus:ring-[#0a9396]/20"
                      >
                        <option value="active">Active</option>
                        <option value="planning">Planning</option>
                        <option value="on-hold">On Hold</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={handleAddNewProject}
                      disabled={!newProject.name || !newProject.client || !newProject.budget || !newProject.deadline}
                      className="flex-1 bg-[#0a9396] hover:bg-[#087579] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create Project
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowNewProjectModal(false);
                        setNewProject({
                          name: "",
                          client: "",
                          budget: "",
                          deadline: "",
                          status: "active",
                        });
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

