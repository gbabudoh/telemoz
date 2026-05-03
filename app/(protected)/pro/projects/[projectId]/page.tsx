"use client";

import { Badge } from "@/components/ui/Badge";
import { CheckCircle2, Clock, Calendar, ArrowLeft, FolderKanban } from "lucide-react";
import { use, useState, useEffect } from "react";
import Link from "next/link";

interface Milestone {
  id: string;
  title: string;
  status: string;
  dueDate: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  client: string;
  status: string;
  startDate: string;
  endDate: string;
  budget: number;
  milestones: Milestone[];
}

export default function ProjectDetailPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  const [project] = useState<Project | null>(null);
  const [isLoading] = useState(false);

  useEffect(() => {
    // In a real app, we would fetch project data here using projectId
    // For now, we'll keep it null and avoid synchronous state updates in the effect
  }, [projectId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "success";
      case "in-progress": return "primary";
      default: return "default";
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[60vh] text-gray-400">Loading project details...</div>;
  }

  if (!project) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="h-20 w-20 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-6 shadow-sm">
          <FolderKanban className="h-9 w-9 text-gray-300" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-2">Project not found</h2>
        <p className="text-gray-500 font-medium mb-6 max-w-sm">
          The project <span className="font-bold text-gray-700">{projectId}</span> could not be found or has not been loaded yet.
        </p>
        <Link href="/pro/projects" className="inline-flex items-center h-11 px-6 rounded-xl bg-gray-900 text-white hover:bg-black font-bold text-sm transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.title}</h1>
          <p className="text-gray-500">Client: {project.client}</p>
        </div>
        <Badge variant={project.status === "active" ? "success" : "default"}>
          {project.status}
        </Badge>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-black text-gray-900">Project Overview</h2>
        <p className="text-gray-600">{project.description}</p>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-400 mb-1">Start Date</p>
            <p className="text-gray-900 font-medium">{project.startDate}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">End Date</p>
            <p className="text-gray-900 font-medium">{project.endDate}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Budget</p>
            <p className="text-gray-900 font-medium">£{project.budget.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-black text-gray-900 mb-4">Milestones</h2>
        <div className="space-y-4">
          {project.milestones.map((milestone) => (
            <div key={milestone.id} className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
              <div className="mt-0.5">
                {milestone.status === "completed" ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                ) : milestone.status === "in-progress" ? (
                  <Clock className="h-5 w-5 text-blue-500" />
                ) : (
                  <Calendar className="h-5 w-5 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-gray-900">{milestone.title}</h3>
                  <Badge variant={getStatusColor(milestone.status)} size="sm">
                    {milestone.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">Due: {milestone.dueDate}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
