"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Chart } from "@/components/ui/Chart";
import {
  TrendingUp,
  Download,
  Calendar,
  Search,
  Filter,
  FileText,
  Eye,
  BarChart3,
  ArrowRight,
  Users,
  DollarSign,
  Target,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { formatCurrency } from "@/lib/utils";

const reports = [
  {
    id: 1,
    projectId: 1,
    projectName: "Q4 Social Media Campaign",
    pro: "Digital Marketing Pro",
    period: "October - December 2024",
    generatedDate: "2024-12-10",
    status: "active",
    metrics: {
      traffic: 45000,
      leads: 1570,
      conversions: 445,
      revenue: 12500,
      roas: 4.2,
    },
  },
  {
    id: 2,
    projectId: 2,
    projectName: "SEO Optimization",
    pro: "SEO Experts Ltd",
    period: "November - December 2024",
    generatedDate: "2024-12-05",
    status: "active",
    metrics: {
      traffic: 32000,
      leads: 980,
      conversions: 245,
      revenue: 8500,
      roas: 3.8,
    },
  },
  {
    id: 3,
    projectId: 3,
    projectName: "Email Marketing Campaign",
    pro: "Digital Marketing Pro",
    period: "September - November 2024",
    generatedDate: "2024-11-30",
    status: "completed",
    metrics: {
      traffic: 28000,
      leads: 1200,
      conversions: 380,
      revenue: 9500,
      roas: 4.5,
    },
  },
];

const overallStats = {
  totalTraffic: 105000,
  totalLeads: 3750,
  totalConversions: 1070,
  totalRevenue: 30500,
  avgROAS: 4.2,
  activeProjects: 2,
};

const chartData = [
  { month: "Oct", traffic: 12000, leads: 380, conversions: 120 },
  { month: "Nov", traffic: 15000, leads: 520, conversions: 145 },
  { month: "Dec", traffic: 18000, leads: 600, conversions: 180 },
];

export default function ClientReportsPage() {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.pro.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">View performance reports and analytics for all your projects</p>
        </div>
        <Button className="bg-[#0a9396] hover:bg-[#087579] text-white">
          <Download className="mr-2 h-4 w-4" />
          Export All Reports
        </Button>
      </motion.div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Total Traffic</p>
                <p className="text-xl font-bold text-gray-900">{overallStats.totalTraffic.toLocaleString()}</p>
              </div>
              <div className="rounded-lg bg-blue-500/10 p-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Total Leads</p>
                <p className="text-xl font-bold text-gray-900">{overallStats.totalLeads.toLocaleString()}</p>
              </div>
              <div className="rounded-lg bg-emerald-500/10 p-2">
                <Users className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Conversions</p>
                <p className="text-xl font-bold text-gray-900">{overallStats.totalConversions.toLocaleString()}</p>
              </div>
              <div className="rounded-lg bg-purple-500/10 p-2">
                <Target className="h-5 w-5 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Total Revenue</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(overallStats.totalRevenue)}</p>
              </div>
              <div className="rounded-lg bg-amber-500/10 p-2">
                <DollarSign className="h-5 w-5 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Avg ROAS</p>
                <p className="text-xl font-bold text-gray-900">{overallStats.avgROAS}x</p>
              </div>
              <div className="rounded-lg bg-[#0a9396]/10 p-2">
                <BarChart3 className="h-5 w-5 text-[#0a9396]" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Active Projects</p>
                <p className="text-xl font-bold text-gray-900">{overallStats.activeProjects}</p>
              </div>
              <div className="rounded-lg bg-indigo-500/10 p-2">
                <FileText className="h-5 w-5 text-indigo-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overall Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[#0a9396]" />
            Overall Performance Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Chart
            data={chartData}
            type="line"
            dataKey="month"
            dataKeys={["traffic", "leads", "conversions"]}
            title="Monthly Performance Overview"
            colors={["#0a9396", "#10b981", "#6366f1"]}
          />
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search reports by project or pro..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {["all", "active", "completed"].map((status) => (
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

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reports Found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredReports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left Section - Report Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold text-gray-900">{report.projectName}</h3>
                            <Badge variant={report.status === "active" ? "success" : "default"}>
                              {report.status === "active" ? "Active" : "Completed"}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-2">{report.pro}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{report.period}</span>
                            </div>
                            <span>Generated: {new Date(report.generatedDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Metrics Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                          <p className="text-xs text-gray-600 mb-1">Traffic</p>
                          <p className="text-lg font-bold text-gray-900">{report.metrics.traffic.toLocaleString()}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                          <p className="text-xs text-gray-600 mb-1">Leads</p>
                          <p className="text-lg font-bold text-gray-900">{report.metrics.leads.toLocaleString()}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                          <p className="text-xs text-gray-600 mb-1">Conversions</p>
                          <p className="text-lg font-bold text-gray-900">{report.metrics.conversions.toLocaleString()}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                          <p className="text-xs text-gray-600 mb-1">Revenue</p>
                          <p className="text-lg font-bold text-gray-900">{formatCurrency(report.metrics.revenue)}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                          <p className="text-xs text-gray-600 mb-1">ROAS</p>
                          <p className="text-lg font-bold text-gray-900">{report.metrics.roas}x</p>
                        </div>
                      </div>
                    </div>

                    {/* Right Section - Actions */}
                    <div className="lg:w-48 flex-shrink-0 flex flex-col gap-2">
                      <Link href={`/client/reports/${report.projectId}`}>
                        <Button variant="outline" className="w-full">
                          <Eye className="mr-2 h-4 w-4" />
                          View Full Report
                        </Button>
                      </Link>
                      <Button variant="outline" className="w-full">
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                      </Button>
                      <Link href={`/client/projects`}>
                        <Button variant="ghost" size="sm" className="w-full">
                          <ArrowRight className="mr-2 h-4 w-4" />
                          View Project
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

