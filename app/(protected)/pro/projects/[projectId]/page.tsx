"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, Clock, Calendar } from "lucide-react";
import { use } from "react";

export default function ProjectDetailPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);

  // Mock project data
  const project = {
    id: projectId,
    title: "SEO Optimization Campaign",
    description: "Comprehensive SEO audit and optimization for client website",
    client: "Acme Corporation",
    status: "active",
    startDate: "2024-01-15",
    endDate: "2024-04-15",
    budget: 5000,
    milestones: [
      { id: "1", title: "Initial Audit", status: "completed", dueDate: "2024-01-30" },
      { id: "2", title: "Keyword Research", status: "completed", dueDate: "2024-02-15" },
      { id: "3", title: "On-Page Optimization", status: "in-progress", dueDate: "2024-03-01" },
      { id: "4", title: "Link Building", status: "pending", dueDate: "2024-03-15" },
      { id: "5", title: "Final Report", status: "pending", dueDate: "2024-04-15" },
    ],
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "success";
      case "in-progress":
        return "primary";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{project.title}</h1>
          <p className="text-gray-400">Client: {project.client}</p>
        </div>
        <Badge variant={project.status === "active" ? "success" : "default"}>
          {project.status}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-300">{project.description}</p>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Start Date</p>
              <p className="text-white">{project.startDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">End Date</p>
              <p className="text-white">{project.endDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Budget</p>
              <p className="text-white">£{project.budget.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Milestones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {project.milestones.map((milestone) => (
              <div
                key={milestone.id}
                className="flex items-start gap-4 p-4 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors"
              >
                <div className="mt-1">
                  {milestone.status === "completed" ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  ) : milestone.status === "in-progress" ? (
                    <Clock className="h-5 w-5 text-primary-400" />
                  ) : (
                    <Calendar className="h-5 w-5 text-gray-500" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-white">{milestone.title}</h3>
                    <Badge variant={getStatusColor(milestone.status)} size="sm">
                      {milestone.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400">Due: {milestone.dueDate}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

