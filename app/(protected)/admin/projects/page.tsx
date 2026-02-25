"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  FolderKanban,
  Search,
  Eye,
  Edit,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { formatCurrency } from "@/lib/utils";

interface Project {
  _id: string;
  name: string;
  proId: { _id: string; name: string; email: string };
  clientId: { _id: string; name: string; email: string };
  status: string;
  budget: number;
  startDate: string;
  endDate?: string;
  createdAt: string;
}

export default function AdminProjectsPage() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/admin/projects");
        if (response.ok) {
          const data = await response.json();
          setProjects(data.projects || []);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user?.userType === "admin") {
      fetchProjects();
    }
  }, [session]);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a9396] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Project Management</h1>
          <p className="text-gray-600 mt-1">View and manage all platform projects</p>
        </div>
        <Badge variant="info">{projects.length} Total Projects</Badge>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Projects</p>
                <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
              </div>
              <div className="rounded-lg bg-blue-500/10 p-3">
                <FolderKanban className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active</p>
                <p className="text-2xl font-bold text-gray-900">
                  {projects.filter((p) => p.status === "active").length}
                </p>
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
                <p className="text-2xl font-bold text-gray-900">
                  {projects.filter((p) => p.status === "completed").length}
                </p>
              </div>
              <div className="rounded-lg bg-purple-500/10 p-3">
                <FolderKanban className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Budget</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(projects.reduce((sum, p) => sum + (p.budget || 0), 0))}
                </p>
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
                placeholder="Search projects by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {["all", "active", "planning", "completed", "on-hold"].map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? "primary" : "outline"}
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

      {/* Projects Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Projects ({filteredProjects.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <FolderKanban className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No projects found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Project</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Professional</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Client</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Budget</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Created</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map((project, index) => (
                    <motion.tr
                      key={project._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-4 px-4">
                        <p className="font-medium text-gray-900">{project.name}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-gray-900">
                          {typeof project.proId === "object" ? project.proId?.name || "N/A" : "N/A"}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-gray-900">
                          {typeof project.clientId === "object" ? project.clientId?.name || "N/A" : "N/A"}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm font-semibold text-gray-900">{formatCurrency(project.budget || 0)}</p>
                      </td>
                      <td className="py-4 px-4">{getStatusBadge(project.status)}</td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-gray-600">
                          {new Date(project.createdAt).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

