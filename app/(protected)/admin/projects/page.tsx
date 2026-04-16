"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import {
  FolderKanban,
  Search,
  Eye,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  Download,
  AlertCircle,
  PauseCircle,
  CalendarDays,
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

const STATUS_CONFIG: Record<
  string,
  {
    label: string;
    dot: string;
    tabColor: string;
    activeBg: string;
    activeText: string;
  }
> = {
  all: {
    label: "All",
    dot: "bg-gray-400",
    tabColor: "",
    activeBg: "",
    activeText: "",
  },
  active: {
    label: "Active",
    dot: "bg-emerald-500",
    tabColor: "text-emerald-700",
    activeBg: "bg-emerald-50",
    activeText: "text-emerald-700",
  },
  planning: {
    label: "Planning",
    dot: "bg-amber-500",
    tabColor: "text-amber-700",
    activeBg: "bg-amber-50",
    activeText: "text-amber-700",
  },
  completed: {
    label: "Completed",
    dot: "bg-gray-400",
    tabColor: "text-gray-600",
    activeBg: "bg-gray-100",
    activeText: "text-gray-700",
  },
  "on-hold": {
    label: "On Hold",
    dot: "bg-red-500",
    tabColor: "text-red-700",
    activeBg: "bg-red-50",
    activeText: "text-red-700",
  },
};

const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.35, ease: "easeOut" },
  }),
};

export default function AdminProjectsPage() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewProject, setViewProject] = useState<Project | null>(null);

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

  const counts = {
    all: projects.length,
    active: projects.filter((p) => p.status === "active").length,
    planning: projects.filter((p) => p.status === "planning").length,
    completed: projects.filter((p) => p.status === "completed").length,
    "on-hold": projects.filter((p) => p.status === "on-hold").length,
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = (project.name ?? "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredBudget = filteredProjects.reduce(
    (sum, p) => sum + (p.budget || 0),
    0
  );
  const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);

  const filterTabs = [
    { key: "all", label: "All", count: counts.all },
    { key: "active", label: "Active", count: counts.active },
    { key: "planning", label: "Planning", count: counts.planning },
    { key: "completed", label: "Completed", count: counts.completed },
    { key: "on-hold", label: "On Hold", count: counts["on-hold"] },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a9396] mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Project Detail Modal */}
      {viewProject && (() => {
        const p = viewProject;
        const statusCfg = STATUS_CONFIG[p.status] || STATUS_CONFIG.planning;
        const proName = typeof p.proId === "object" ? p.proId?.name || "—" : "—";
        const proEmail = typeof p.proId === "object" ? p.proId?.email || "" : "";
        const clientName = typeof p.clientId === "object" ? p.clientId?.name || "—" : "—";
        const clientEmail = typeof p.clientId === "object" ? p.clientId?.email || "" : "";

        return (
          <Modal
            isOpen
            onClose={() => setViewProject(null)}
            title={p.name || "Untitled Project"}
            size="md"
            variant="light"
          >
            <div className="space-y-5">
              {/* Status + Budget hero row */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  <span className={`inline-flex items-center gap-1.5 text-sm font-semibold ${statusCfg.tabColor || "text-gray-600"}`}>
                    <span className={`h-2 w-2 rounded-full ${statusCfg.dot}`} />
                    {statusCfg.label}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-1">Budget</p>
                  <p className="text-xl font-bold text-gray-900 tabular-nums">
                    {formatCurrency(p.budget || 0)}
                  </p>
                </div>
              </div>

              {/* People */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border border-gray-100 bg-white">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Professional</p>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-linear-to-br from-[#0a9396] to-cyan-400 flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {proName !== "—" ? proName.charAt(0).toUpperCase() : "?"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{proName}</p>
                      {proEmail && <p className="text-xs text-gray-400 truncate">{proEmail}</p>}
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-lg border border-gray-100 bg-white">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Client</p>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-linear-to-br from-emerald-500 to-green-400 flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {clientName !== "—" ? clientName.charAt(0).toUpperCase() : "?"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{clientName}</p>
                      {clientEmail && <p className="text-xs text-gray-400 truncate">{clientEmail}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border border-gray-100 bg-white">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Start Date</p>
                  <div className="flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5 text-gray-400" />
                    <p className="text-sm text-gray-700">
                      {p.startDate
                        ? new Date(p.startDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                        : "—"}
                    </p>
                  </div>
                </div>
                <div className="p-3 rounded-lg border border-gray-100 bg-white">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">End Date</p>
                  <div className="flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5 text-gray-400" />
                    <p className="text-sm text-gray-700">
                      {p.endDate
                        ? new Date(p.endDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                        : "Not set"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Meta */}
              <div className="flex items-center justify-between pt-1 text-xs text-gray-400 border-t border-gray-100">
                <span>
                  Created{" "}
                  {p.createdAt
                    ? new Date(p.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                    : "—"}
                </span>
                <span className="font-mono">{p._id}</span>
              </div>
            </div>
          </Modal>
        );
      })()}

      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Project Management
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Monitor and oversee all platform projects
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm">
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Export
          </Button>
        </div>
      </motion.div>

      {/* On-hold alert — shown at top so it's not missed */}
      {counts["on-hold"] > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-3.5 bg-red-50 border border-red-200 rounded-lg"
        >
          <PauseCircle className="h-4 w-4 text-red-600 shrink-0" />
          <p className="text-sm text-red-800">
            <span className="font-semibold">{counts["on-hold"]}</span>{" "}
            project{counts["on-hold"] === 1 ? " is" : "s are"} currently on
            hold and may require attention.
          </p>
          <button
            onClick={() => setStatusFilter("on-hold")}
            className="ml-auto text-xs font-semibold text-red-700 hover:text-red-900 underline-offset-2 hover:underline shrink-0"
          >
            View →
          </button>
        </motion.div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Projects",
            value: counts.all,
            sub: `${counts["on-hold"]} on hold`,
            icon: FolderKanban,
            iconBg: "bg-[#0a9396]/10",
            iconColor: "text-[#0a9396]",
            accent: "border-l-[#0a9396]",
          },
          {
            label: "Active",
            value: counts.active,
            sub: "In progress now",
            icon: TrendingUp,
            iconBg: "bg-emerald-100",
            iconColor: "text-emerald-600",
            accent: "border-l-emerald-500",
          },
          {
            label: "Completed",
            value: counts.completed,
            sub: `${counts.planning} in planning`,
            icon: CheckCircle2,
            iconBg: "bg-indigo-100",
            iconColor: "text-indigo-600",
            accent: "border-l-indigo-500",
          },
          {
            label: "Total Budget",
            value: formatCurrency(totalBudget),
            sub: "Across all projects",
            icon: DollarSign,
            iconBg: "bg-amber-100",
            iconColor: "text-amber-600",
            accent: "border-l-amber-500",
          },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={CARD_VARIANTS}
            >
              <Card className={`border-l-4 ${stat.accent}`}>
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 tabular-nums">
                        {stat.value}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
                    </div>
                    <div className={`rounded-xl ${stat.iconBg} p-2.5`}>
                      <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Table Card — toolbar + table unified */}
      <Card>
        {/* Toolbar */}
        <CardHeader className="border-b border-gray-100 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Status filter tabs with counts */}
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1 shrink-0 overflow-x-auto">
              {filterTabs.map((tab) => {
                const cfg = STATUS_CONFIG[tab.key];
                const isSelected = statusFilter === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setStatusFilter(tab.key)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all whitespace-nowrap ${
                      isSelected
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab.key !== "all" && (
                      <span
                        className={`h-1.5 w-1.5 rounded-full shrink-0 ${cfg.dot}`}
                      />
                    )}
                    {tab.label}
                    <span
                      className={`tabular-nums rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                        isSelected
                          ? "bg-[#0a9396]/10 text-[#0a9396]"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by project name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Result count */}
            <p className="text-xs text-gray-400 whitespace-nowrap shrink-0">
              {filteredProjects.length}{" "}
              {filteredProjects.length === 1 ? "result" : "results"}
            </p>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-16">
              <div className="rounded-full bg-gray-100 p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                {searchQuery ? (
                  <Search className="h-7 w-7 text-gray-400" />
                ) : (
                  <FolderKanban className="h-7 w-7 text-gray-400" />
                )}
              </div>
              <p className="text-gray-700 font-medium">No projects found</p>
              <p className="text-gray-400 text-xs mt-1">
                {searchQuery
                  ? `No results for "${searchQuery}"`
                  : "Try selecting a different status filter"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wide text-left">
                      Project
                    </th>
                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide text-left hidden md:table-cell">
                      Professional
                    </th>
                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide text-left hidden md:table-cell">
                      Client
                    </th>
                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">
                      Budget
                    </th>
                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide text-left">
                      Status
                    </th>
                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide text-left hidden lg:table-cell">
                      Created
                    </th>
                    <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredProjects.map((project, index) => {
                    const statusCfg =
                      STATUS_CONFIG[project.status] || STATUS_CONFIG.planning;
                    const proName =
                      typeof project.proId === "object"
                        ? project.proId?.name || "—"
                        : "—";
                    const proInitial =
                      proName !== "—" ? proName.charAt(0).toUpperCase() : "?";
                    const clientName =
                      typeof project.clientId === "object"
                        ? project.clientId?.name || "—"
                        : "—";
                    const clientInitial =
                      clientName !== "—"
                        ? clientName.charAt(0).toUpperCase()
                        : "?";
                    const projectName = project.name || "Untitled Project";

                    return (
                      <motion.tr
                        key={project._id ?? index}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.035 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        {/* Project name */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-linear-to-br from-[#0a9396]/20 to-cyan-100 flex items-center justify-center shrink-0">
                              <FolderKanban className="h-4 w-4 text-[#0a9396]" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-900 text-sm truncate">
                                {projectName}
                              </p>
                              {/* Show pro + client on small screens inline */}
                              <p className="text-xs text-gray-400 md:hidden truncate">
                                {proName} → {clientName}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Professional */}
                        <td className="py-4 px-4 hidden md:table-cell">
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-linear-to-br from-[#0a9396] to-cyan-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
                              {proInitial}
                            </div>
                            <p className="text-sm text-gray-700 truncate max-w-[120px]">
                              {proName}
                            </p>
                          </div>
                        </td>

                        {/* Client */}
                        <td className="py-4 px-4 hidden md:table-cell">
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-linear-to-br from-emerald-500 to-green-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
                              {clientInitial}
                            </div>
                            <p className="text-sm text-gray-700 truncate max-w-[120px]">
                              {clientName}
                            </p>
                          </div>
                        </td>

                        {/* Budget */}
                        <td className="py-4 px-4 text-right">
                          <p className="text-sm font-semibold text-gray-900 tabular-nums">
                            {formatCurrency(project.budget || 0)}
                          </p>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-semibold ${statusCfg.tabColor || "text-gray-600"}`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full shrink-0 ${statusCfg.dot}`}
                            />
                            {statusCfg.label}
                          </span>
                        </td>

                        {/* Created */}
                        <td className="py-4 px-4 hidden lg:table-cell">
                          <p className="text-sm text-gray-400">
                            {project.createdAt
                              ? new Date(project.createdAt).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )
                              : "—"}
                          </p>
                        </td>

                        {/* Actions — always visible */}
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2.5 text-xs text-gray-500 hover:text-gray-900 hover:bg-gray-100 gap-1.5"
                              title="View project"
                              onClick={() => setViewProject(project)}
                            >
                              <Eye className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">View</span>
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>

        {/* Table footer */}
        {filteredProjects.length > 0 && (
          <div className="border-t border-gray-100 px-6 py-3 flex items-center justify-between bg-gray-50/50">
            <p className="text-xs text-gray-400">
              Showing{" "}
              <span className="font-semibold text-gray-700">
                {filteredProjects.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-700">
                {projects.length}
              </span>{" "}
              projects
            </p>
            <p className="text-xs text-gray-500">
              Budget:{" "}
              <span className="font-semibold text-gray-700 tabular-nums">
                {formatCurrency(filteredBudget)}
              </span>
              {statusFilter !== "all" && (
                <span className="text-gray-400">
                  {" "}
                  of {formatCurrency(totalBudget)} total
                </span>
              )}
            </p>
          </div>
        )}
      </Card>

      {/* Planning reminder */}
      {counts.planning > 0 && statusFilter === "all" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>
            <span className="font-semibold">{counts.planning}</span>{" "}
            project{counts.planning === 1 ? " is" : "s are"} still in planning
            — check if they need to be activated.
          </span>
          <button
            onClick={() => setStatusFilter("planning")}
            className="ml-auto text-xs font-semibold text-amber-700 hover:text-amber-900 underline-offset-2 hover:underline shrink-0"
          >
            View →
          </button>
        </motion.div>
      )}
    </div>
  );
}
