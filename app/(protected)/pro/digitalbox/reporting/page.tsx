"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";
import { Chart } from "@/components/ui/Chart";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  FolderKanban,
  Download,
  Calendar,
  FileText,
  PieChart,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface ReportingStats {
  totalRevenue: number;
  revenueChange: number;
  activeClients: number;
  clientsChange: number;
  completedProjects: number;
  projectsChange: number;
  avgProjectValue: number;
  avgProjectValueChange: number;
}

interface ChartData {
  revenueData: Array<{ month: string; revenue: number; profit: number }>;
  clientGrowthData: Array<{ month: string; clients: number }>;
  projectStatusData: Array<{ name: string; value: number; color: string }>;
}

export default function ReportingPage() {
  const { data: session } = useSession();
  const [dateRange] = useState("6months");
  const [stats, setStats] = useState<ReportingStats>({
    totalRevenue: 0,
    revenueChange: 0,
    activeClients: 0,
    clientsChange: 0,
    completedProjects: 0,
    projectsChange: 0,
    avgProjectValue: 0,
    avgProjectValueChange: 0,
  });
  const [chartData, setChartData] = useState<ChartData>({
    revenueData: [],
    clientGrowthData: [],
    projectStatusData: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/pro/reporting-stats?period=${dateRange}`);
        if (response.ok) {
          const data = await response.json();
          setStats(data.stats);
          setChartData(data.charts);
        }
      } catch (error) {
        console.error("Error fetching reporting stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user) {
      fetchStats();
    }
  }, [session, dateRange]);

  const statsConfig = [
    {
      label: "Total Revenue",
      value: stats.totalRevenue,
      change: stats.revenueChange,
      trend: stats.revenueChange >= 0 ? ("up" as const) : ("down" as const),
      icon: DollarSign,
      gradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
      format: "currency" as const,
    },
    {
      label: "Active Clients",
      value: stats.activeClients,
      change: stats.clientsChange,
      trend: stats.clientsChange >= 0 ? ("up" as const) : ("down" as const),
      icon: Users,
      gradient: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
      format: "number" as const,
    },
    {
      label: "Completed Projects",
      value: stats.completedProjects,
      change: stats.projectsChange,
      trend: stats.projectsChange >= 0 ? ("up" as const) : ("down" as const),
      icon: FolderKanban,
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      format: "number" as const,
    },
    {
      label: "Avg. Project Value",
      value: stats.avgProjectValue,
      change: stats.avgProjectValueChange,
      trend: stats.avgProjectValueChange >= 0 ? ("up" as const) : ("down" as const),
      icon: TrendingUp,
      gradient: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
      format: "currency" as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-[#0a9396]" />
            <h1 className="text-3xl font-bold text-gray-900">Reporting & Analytics</h1>
            <Badge variant="primary" size="sm">DigitalBOX</Badge>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="cursor-pointer">
              <Calendar className="mr-2 h-4 w-4" />
              Select Date Range
            </Button>
            <Button size="sm" className="bg-[#0a9396] hover:bg-[#087579] text-white cursor-pointer">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>
        <p className="text-gray-600">
          Comprehensive analytics and insights for your digital marketing business
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsConfig.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatCard
              title={stat.label}
              value={isLoading ? 0 : stat.value}
              change={stat.change !== 0 ? stat.change : undefined}
              trend={stat.trend}
              icon={stat.icon}
              gradient={stat.gradient}
              format={stat.format}
              animate={!isLoading}
            />
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          {chartData.revenueData.length > 0 ? (
            <Chart
              title="Revenue & Profit Trends"
              description="Last 6 months performance"
              data={chartData.revenueData}
              type="area"
              dataKey="month"
              dataKeys={["revenue", "profit"]}
              colors={["#6366f1", "#10b981"]}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Revenue & Profit Trends</CardTitle>
                <CardDescription>No data available</CardDescription>
              </CardHeader>
            </Card>
          )}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          {chartData.clientGrowthData.length > 0 ? (
            <Chart
              title="Client Growth"
              description="Active clients over time"
              data={chartData.clientGrowthData}
              type="line"
              dataKey="month"
              dataKeys={["clients"]}
              colors={["#06b6d4"]}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Client Growth</CardTitle>
                <CardDescription>No data available</CardDescription>
              </CardHeader>
            </Card>
          )}
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
        >
          {chartData.projectStatusData.length > 0 ? (
            <Chart
              title="Project Status Distribution"
              description="Current project breakdown"
              data={chartData.projectStatusData}
              type="pie"
              dataKey="name"
              dataKeys={["value"]}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Project Status Distribution</CardTitle>
                <CardDescription>No data available</CardDescription>
              </CardHeader>
            </Card>
          )}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Coming soon - Track traffic, leads, and conversions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Performance metrics tracking will be available once you integrate analytics tools.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Report Generation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#0a9396]" />
            Generate Custom Reports
          </CardTitle>
          <CardDescription>
            Create detailed reports for clients or internal analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto py-4 flex flex-col items-start cursor-pointer">
              <div className="flex items-center gap-2 mb-2">
                <PieChart className="h-5 w-5 text-[#0a9396]" />
                <span className="font-semibold text-gray-900">Performance Report</span>
              </div>
              <span className="text-sm text-gray-600 text-left">
                Traffic, leads, and conversion analytics
              </span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col items-start cursor-pointer">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-[#0a9396]" />
                <span className="font-semibold text-gray-900">Financial Report</span>
              </div>
              <span className="text-sm text-gray-600 text-left">
                Revenue, profit, and billing summary
              </span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col items-start cursor-pointer">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-[#0a9396]" />
                <span className="font-semibold text-gray-900">Client Report</span>
              </div>
              <span className="text-sm text-gray-600 text-left">
                Client engagement and project status
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#0a9396]" />
            Key Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.revenueChange !== 0 && (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                <div className="p-2 rounded-full bg-emerald-100">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">Revenue Growth</h4>
                  <p className="text-sm text-gray-600">
                    Your revenue has {stats.revenueChange > 0 ? "increased" : "decreased"} by{" "}
                    {Math.abs(stats.revenueChange)}% compared to the previous period.
                    {stats.revenueChange > 0
                      ? " This is primarily driven by new client acquisitions and project completions."
                      : " Consider reviewing your pricing strategy and client acquisition efforts."}
                  </p>
                </div>
              </div>
            )}
            {stats.activeClients > 0 && (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 border border-blue-200">
                <div className="p-2 rounded-full bg-blue-100">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">Client Retention</h4>
                  <p className="text-sm text-gray-600">
                    You have {stats.activeClients} active client{stats.activeClients !== 1 ? "s" : ""}
                    {stats.avgProjectValue > 0 && (
                      <> with an average project value of £{stats.avgProjectValue.toFixed(2)}.</>
                    )}
                    {stats.clientsChange > 0 && (
                      <> Client growth is positive at {stats.clientsChange}%.</>
                    )}
                  </p>
                </div>
              </div>
            )}
            {stats.completedProjects > 0 && (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 border border-amber-200">
                <div className="p-2 rounded-full bg-amber-100">
                  <FolderKanban className="h-5 w-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">Project Pipeline</h4>
                  <p className="text-sm text-gray-600">
                    You have completed {stats.completedProjects} project{stats.completedProjects !== 1 ? "s" : ""}
                    {stats.projectsChange > 0 && (
                      <> with a {stats.projectsChange}% increase in completion rate.</>
                    )}
                    {chartData.projectStatusData.length > 0 && (
                      <> Review your project status distribution to optimize workflow efficiency.</>
                    )}
                  </p>
                </div>
              </div>
            )}
            {!isLoading && stats.totalRevenue === 0 && stats.activeClients === 0 && stats.completedProjects === 0 && (
              <div className="flex items-center justify-center p-8 rounded-lg bg-gray-50 border border-gray-200">
                <p className="text-sm text-gray-600">
                  No data available yet. Start creating projects and invoices to see your analytics here.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

