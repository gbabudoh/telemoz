"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Chart } from "@/components/ui/Chart";
import { Badge } from "@/components/ui/Badge";
import {
  BarChart3,
  Download,
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { formatCurrency } from "@/lib/utils";

export default function AdminReportsPage() {
  const { data: session } = useSession();
  const [dateRange, setDateRange] = useState("6months");

  const chartData = [
    { month: "Oct", users: 120, projects: 45, revenue: 12500, commission: 1625 },
    { month: "Nov", users: 180, projects: 62, revenue: 18500, commission: 2405 },
    { month: "Dec", users: 250, projects: 89, revenue: 24500, commission: 3185 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Platform Reports</h1>
          <p className="text-gray-600 mt-1">Comprehensive analytics and reporting for the platform</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Select Range
          </Button>
          <Button className="bg-[#0a9396] hover:bg-[#087579] text-white">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">550</p>
                <p className="text-xs text-emerald-600 mt-1">+25% from last month</p>
              </div>
              <div className="rounded-lg bg-blue-500/10 p-3">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Projects</p>
                <p className="text-2xl font-bold text-gray-900">196</p>
                <p className="text-xs text-emerald-600 mt-1">+18% from last month</p>
              </div>
              <div className="rounded-lg bg-purple-500/10 p-3">
                <FileText className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(55500)}</p>
                <p className="text-xs text-emerald-600 mt-1">+22% from last month</p>
              </div>
              <div className="rounded-lg bg-emerald-500/10 p-3">
                <DollarSign className="h-6 w-6 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Platform Commission</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(7215)}</p>
                <p className="text-xs text-emerald-600 mt-1">+22% from last month</p>
              </div>
              <div className="rounded-lg bg-[#0a9396]/10 p-3">
                <TrendingUp className="h-6 w-6 text-[#0a9396]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Platform Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              data={chartData}
              type="line"
              dataKey="month"
              dataKeys={["users", "projects", "revenue"]}
              title="Monthly Growth Trends"
              colors={["#6366f1", "#10b981", "#06b6d4"]}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Revenue & Commission</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              data={chartData}
              type="bar"
              dataKey="month"
              dataKeys={["revenue", "commission"]}
              title="Revenue vs Commission"
              colors={["#10b981", "#0a9396"]}
            />
          </CardContent>
        </Card>
      </div>

      {/* User Growth Chart */}
      <Card>
        <CardHeader>
          <CardTitle>User Growth Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <Chart
            data={chartData}
            type="area"
            dataKey="month"
            dataKeys={["users"]}
            title="New User Registrations"
            colors={["#6366f1"]}
          />
        </CardContent>
      </Card>
    </div>
  );
}

