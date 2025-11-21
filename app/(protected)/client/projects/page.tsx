"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  FolderKanban,
  Clock,
  DollarSign,
  Users,
  Eye,
  MessageSquare,
  TrendingUp,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Calendar,
  ArrowRight,
  X,
  Plus,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

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
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
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

  const handleViewDetails = (project: any) => {
    setSelectedProject(project);
    setShowProjectDetails(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="success">Active</Badge>;
      case "completed":
        return <Badge variant="default">Completed</Badge>;
      case "planning":
        return <Badge variant="warning">Planning</Badge>;
      case "on-hold":
        return <Badge variant="danger">On Hold</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
          <p className="text-gray-600 mt-1">Track and manage all your marketing projects</p>
        </div>
        <Button
          onClick={() => setShowNewProjectModal(true)}
          className="bg-[#0a9396] hover:bg-[#087579] text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Start New Project
        </Button>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Projects</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="rounded-lg bg-[#0a9396]/10 p-3">
                <FolderKanban className="h-6 w-6 text-[#0a9396]" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              </div>
              <div className="rounded-lg bg-emerald-500/10 p-3">
                <TrendingUp className="h-6 w-6 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
              </div>
              <div className="rounded-lg bg-blue-500/10 p-3">
                <CheckCircle2 className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Budget</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalBudget)}</p>
              </div>
              <div className="rounded-lg bg-amber-500/10 p-3">
                <DollarSign className="h-6 w-6 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search projects by name or pro..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {["all", "active", "planning", "completed", "on-hold"].map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                  className={statusFilter === status ? "bg-[#0a9396] hover:bg-[#087579] text-white" : ""}
                >
                  {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects List */}
      {filteredProjects.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <FolderKanban className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Projects Found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
            <Link href="/marketplace">
              <Button variant="outline">Browse Marketplace</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredProjects.map((project, index) => {
            const daysUntilDeadline = getDaysUntilDeadline(project.deadline);
            const isOverdue = daysUntilDeadline < 0 && project.status !== "completed";
            
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Left Section - Project Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-semibold text-gray-900">{project.name}</h3>
                              {getStatusBadge(project.status)}
                            </div>
                            <p className="text-gray-600 mb-3">{project.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                <span>{project.pro}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  {isOverdue ? (
                                    <span className="text-red-600 font-medium">
                                      Overdue by {Math.abs(daysUntilDeadline)} days
                                    </span>
                                  ) : (
                                    `${daysUntilDeadline} days left`
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                            <span className="font-medium">Progress</span>
                            <span className="font-semibold text-[#0a9396]">{project.progress}%</span>
                          </div>
                          <div className="h-3 rounded-full bg-gray-200 overflow-hidden border border-gray-300 shadow-inner relative">
                            <motion.div
                              className="h-full bg-gradient-to-r from-[#0a9396] via-[#0a9396] to-[#94d2bd] rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${project.progress}%` }}
                              transition={{ delay: 0.3 + index * 0.1, duration: 0.8, ease: "easeOut" }}
                            />
                            <div
                              className="absolute top-0 bottom-0 w-0.5 bg-gray-400"
                              style={{ left: `${project.progress}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-gray-500">0%</span>
                            <span className="text-xs text-gray-500">{project.completedTasks}/{project.tasks} tasks</span>
                            <span className="text-xs text-gray-500">100%</span>
                          </div>
                        </div>

                        {/* Budget and Milestone */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                            <p className="text-xs text-gray-600 mb-1">Budget</p>
                            <p className="text-lg font-bold text-gray-900">{formatCurrency(project.budget)}</p>
                            <p className="text-xs text-gray-500">Spent: {formatCurrency(project.spent)}</p>
                          </div>
                          <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                            <p className="text-xs text-gray-600 mb-1">Next Milestone</p>
                            <p className="text-sm font-semibold text-gray-900">{project.nextMilestone}</p>
                          </div>
                        </div>
                      </div>

                      {/* Right Section - Actions */}
                      <div className="lg:w-48 flex-shrink-0 flex flex-col gap-2">
                        <Button
                          onClick={() => handleViewDetails(project)}
                          variant="outline"
                          className="w-full"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                        <Link href={`/messaging?proId=${project.proId}&projectId=${project.id}`}>
                          <Button variant="outline" className="w-full">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Message Pro
                          </Button>
                        </Link>
                        <Link href={`/client/reports/${project.id}`}>
                          <Button variant="ghost" size="sm" className="w-full">
                            <TrendingUp className="mr-2 h-4 w-4" />
                            View Reports
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Project Details Modal */}
      <AnimatePresence>
        {showProjectDetails && selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowProjectDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl">{selectedProject.name}</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setShowProjectDetails(false)}>
                      ×
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                    <p className="text-gray-600">{selectedProject.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Professional</p>
                      <p className="font-semibold text-gray-900">{selectedProject.pro}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Status</p>
                      {getStatusBadge(selectedProject.status)}
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Budget</p>
                      <p className="font-semibold text-gray-900">{formatCurrency(selectedProject.budget)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Deadline</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(selectedProject.deadline).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Progress</h4>
                    <div className="h-3 rounded-full bg-gray-200 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-[#0a9396] to-[#94d2bd]"
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedProject.progress}%` }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {selectedProject.completedTasks} of {selectedProject.tasks} tasks completed
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/messaging?proId=${selectedProject.proId}&projectId=${selectedProject.id}`} className="flex-1">
                      <Button className="w-full bg-[#0a9396] hover:bg-[#087579] text-white">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Message Pro
                      </Button>
                    </Link>
                    <Link href={`/client/reports/${selectedProject.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        <TrendingUp className="mr-2 h-4 w-4" />
                        View Reports
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
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
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowNewProjectModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl">Start New Project</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowNewProjectModal(false);
                        setNewProject({
                          name: "",
                          description: "",
                          budget: "",
                          deadline: "",
                          category: "",
                          requirements: "",
                        });
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Project Name *
                    </label>
                    <Input
                      placeholder="e.g., Social Media Marketing Campaign"
                      value={newProject.name}
                      onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Category *
                    </label>
                    <select
                      value={newProject.category}
                      onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:border-[#0a9396] focus:outline-none focus:ring-2 focus:ring-[#0a9396]/20"
                      required
                    >
                      <option value="">Select a category</option>
                      <option value="seo">SEO</option>
                      <option value="ppc">PPC / Paid Advertising</option>
                      <option value="social">Social Media Marketing</option>
                      <option value="content">Content Marketing</option>
                      <option value="email">Email Marketing</option>
                      <option value="analytics">Analytics & Reporting</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Description *
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Describe your project requirements, goals, and expectations..."
                      value={newProject.description}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-500 focus:border-[#0a9396] focus:outline-none focus:ring-2 focus:ring-[#0a9396]/20"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">
                        Budget (£) *
                      </label>
                      <Input
                        type="number"
                        placeholder="e.g., 5000"
                        value={newProject.budget}
                        onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">
                        Deadline *
                      </label>
                      <Input
                        type="date"
                        value={newProject.deadline}
                        onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
                        min={new Date().toISOString().split("T")[0]}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Specific Requirements (Optional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Any specific skills, tools, or requirements you're looking for..."
                      value={newProject.requirements}
                      onChange={(e) => setNewProject({ ...newProject, requirements: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-500 focus:border-[#0a9396] focus:outline-none focus:ring-2 focus:ring-[#0a9396]/20"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setShowNewProjectModal(false);
                        setNewProject({
                          name: "",
                          description: "",
                          budget: "",
                          deadline: "",
                          category: "",
                          requirements: "",
                        });
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1 bg-[#0a9396] hover:bg-[#087579] text-white"
                      onClick={async () => {
                        if (
                          !newProject.name ||
                          !newProject.description ||
                          !newProject.budget ||
                          !newProject.deadline ||
                          !newProject.category
                        ) {
                          alert("Please fill in all required fields");
                          return;
                        }

                        setIsSubmitting(true);
                        try {
                          // Here you would typically make an API call to create the project
                          // For now, we'll simulate it
                          await new Promise((resolve) => setTimeout(resolve, 1000));

                          // In a real app, you would:
                          // const response = await fetch('/api/projects', {
                          //   method: 'POST',
                          //   headers: { 'Content-Type': 'application/json' },
                          //   body: JSON.stringify({
                          //     ...newProject,
                          //     clientId: session?.user?.id,
                          //   }),
                          // });

                          alert("Project request created successfully! It will be posted to the marketplace.");
                          setShowNewProjectModal(false);
                          setNewProject({
                            name: "",
                            description: "",
                            budget: "",
                            deadline: "",
                            category: "",
                            requirements: "",
                          });
                          // Optionally refresh the projects list or redirect
                          // window.location.reload();
                        } catch (error) {
                          console.error("Error creating project:", error);
                          alert("Failed to create project. Please try again.");
                        } finally {
                          setIsSubmitting(false);
                        }
                      }}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Clock className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Post to Marketplace
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

