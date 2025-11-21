"use client";

import { StatCard } from "@/components/ui/StatCard";
import { Chart } from "@/components/ui/Chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  TrendingUp,
  Users,
  Eye,
  DollarSign,
  MessageSquare,
  Briefcase,
  CheckCircle2,
  Clock,
  ArrowRight,
} from "lucide-react";
import { formatCurrency, formatNumber, formatPercentage } from "@/lib/utils";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";

// Mock data
const kpiData = [
  { date: "Week 1", traffic: 12000, leads: 380, cost: 450 },
  { date: "Week 2", traffic: 13500, leads: 420, cost: 480 },
  { date: "Week 3", traffic: 15000, leads: 450, cost: 510 },
  { date: "Week 4", traffic: 16500, leads: 480, cost: 540 },
];

const activeProjects = [
  {
    id: 1,
    name: "Q4 Social Media Campaign",
    pro: "Digital Marketing Pro",
    progress: 80,
    status: "on-track",
    nextMilestone: "Milestone 3 Due Friday",
  },
  {
    id: 2,
    name: "SEO Optimization",
    pro: "SEO Experts Ltd",
    progress: 45,
    status: "on-track",
    nextMilestone: "Content Audit Complete",
  },
];

const recentMessages = [
  {
    id: 1,
    from: "Digital Marketing Pro",
    subject: "Campaign Performance Update",
    preview: "Great news! Your campaign is performing 15% above target...",
    time: "2 hours ago",
    unread: true,
  },
  {
    id: 2,
    from: "SEO Experts Ltd",
    subject: "Technical SEO Fixes Completed",
    preview: "We've completed all the technical fixes we discussed...",
    time: "1 day ago",
    unread: false,
  },
];

export default function ClientDashboard() {
  const { data: session } = useSession();
  const userName = session?.user?.name || "there";

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Welcome, {userName}</h1>
          <p className="text-gray-400 mt-1">Track your campaigns and connect with your Pros</p>
        </div>
        <Button>
          Post New Project
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>

      {/* Your Digital Pro */}
      <Card variant="gradient">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary-500 to-accent-purple flex items-center justify-center">
                <Briefcase className="h-8 w-8 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-semibold text-white">Digital Marketing Pro</h3>
                  <Badge variant="success" size="sm">
                    Online
                  </Badge>
                </div>
                <p className="text-gray-400">Your trusted marketing partner</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <MessageSquare className="mr-2 h-4 w-4" />
                Message
              </Button>
              <Button variant="ghost">View Profile</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatCard
            title="Traffic (MoM)"
            value={formatNumber(16500)}
            change={12}
            trend="up"
            icon={Eye}
            gradient="linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatCard
            title="Leads (WoW)"
            value={formatNumber(480)}
            change={5}
            trend="up"
            icon={Users}
            gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatCard
            title="Cost per Lead"
            value={formatCurrency(12.5)}
            change={-8}
            trend="up"
            icon={DollarSign}
            gradient="linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatCard
            title="ROAS"
            value="4.2x"
            change={15}
            trend="up"
            icon={TrendingUp}
            gradient="linear-gradient(135deg, #ec4899 0%, #db2777 100%)"
          />
        </motion.div>
      </div>

      {/* Performance Chart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Chart
          title="Performance Overview"
          description="Traffic, leads, and cost trends over the last 4 weeks"
          data={kpiData}
          type="line"
          dataKey="date"
          dataKeys={["traffic", "leads", "cost"]}
          colors={["#6366f1", "#10b981", "#f59e0b"]}
        />
      </motion.div>

      {/* Current Projects & Messages */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Current Projects */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary-400" />
              Active Projects
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="rounded-lg border border-gray-200 bg-white p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{project.name}</h4>
                    <p className="text-sm text-gray-600">{project.pro}</p>
                  </div>
                  <Badge
                    variant={project.status === "on-track" ? "success" : "warning"}
                    size="sm"
                  >
                    {project.status === "on-track" ? "On Track" : "Needs Attention"}
                  </Badge>
                </div>
                <div className="mb-2">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                    <span className="font-medium">Progress</span>
                    <span className="font-semibold text-[#0a9396]">{project.progress}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-gray-200 overflow-hidden border border-gray-300 shadow-inner relative">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#0a9396] via-[#0a9396] to-[#94d2bd] rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${project.progress}%` }}
                      transition={{ delay: 0.8 + index * 0.1, duration: 0.8, ease: "easeOut" }}
                    />
                    {/* Progress indicator line */}
                    <div 
                      className="absolute top-0 bottom-0 w-0.5 bg-gray-400"
                      style={{ left: `${project.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500">0%</span>
                    <span className="text-xs text-gray-500">100%</span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  <Clock className="inline h-3 w-3 mr-1" />
                  {project.nextMilestone}
                </p>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Messages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary-400" />
              Recent Messages
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentMessages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className={`rounded-lg border p-4 cursor-pointer transition-all ${
                  message.unread
                    ? "border-primary-500/50 bg-primary-500/5"
                    : "border-gray-200 bg-white"
                } hover:border-primary-500/50`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-gray-900">{message.from}</p>
                      {message.unread && (
                        <span className="h-2 w-2 rounded-full bg-[#0a9396]" />
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      {message.subject}
                    </p>
                    <p className="text-sm text-gray-600 line-clamp-2">{message.preview}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-600">{message.time}</p>
              </motion.div>
            ))}
            <Button variant="ghost" className="w-full">
              View All Messages
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card variant="glass" className="cursor-pointer hover:border-primary-500/50 transition-colors">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">View Detailed Report</p>
                <p className="text-lg font-semibold text-white">Performance Dashboard</p>
              </div>
              <ArrowRight className="h-5 w-5 text-primary-400" />
            </div>
          </CardContent>
        </Card>
        <Card variant="glass" className="cursor-pointer hover:border-primary-500/50 transition-colors">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Next Steps</p>
                <p className="text-lg font-semibold text-white">Ad Copy Testing</p>
              </div>
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            </div>
          </CardContent>
        </Card>
        <Card variant="glass" className="cursor-pointer hover:border-primary-500/50 transition-colors">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Upcoming</p>
                <p className="text-lg font-semibold text-white">Email Campaign Launch</p>
              </div>
              <Clock className="h-5 w-5 text-amber-400" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

