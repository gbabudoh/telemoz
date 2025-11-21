"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  MessageSquare,
  Search,
  Filter,
  Building2,
  DollarSign,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { formatCurrency } from "@/lib/utils";

const inquiries = [
  {
    id: 1,
    client: "TechStart Inc.",
    company: "TechStart Inc.",
    email: "contact@techstart.com",
    phone: "+44 20 1234 5678",
    project: "SEO Optimization Campaign",
    budget: 2500,
    status: "new",
    time: "2 hours ago",
    receivedDate: "2024-01-20",
    description: "Looking for an SEO specialist to optimize our website and improve search rankings. We need someone with experience in technical SEO and content strategy.",
    requirements: ["Technical SEO", "Content Strategy", "Analytics"],
  },
  {
    id: 2,
    client: "E-Commerce Pro",
    company: "E-Commerce Pro Ltd",
    email: "hello@ecommercepro.co.uk",
    phone: "+44 20 2345 6789",
    project: "PPC Management",
    budget: 1800,
    status: "reviewed",
    time: "5 hours ago",
    receivedDate: "2024-01-20",
    description: "Need a PPC expert to manage our Google Ads and Facebook Ads campaigns. Looking for someone who can optimize ROAS and reduce cost per acquisition.",
    requirements: ["Google Ads", "Facebook Ads", "Conversion Optimization"],
  },
  {
    id: 3,
    client: "Local Business Hub",
    company: "Local Business Hub",
    email: "info@localbusinesshub.com",
    phone: "+44 20 3456 7890",
    project: "Social Media Strategy",
    budget: 1200,
    status: "new",
    time: "1 day ago",
    receivedDate: "2024-01-19",
    description: "Seeking a social media strategist to develop and execute a comprehensive social media strategy across multiple platforms.",
    requirements: ["Social Media Management", "Content Creation", "Community Management"],
  },
  {
    id: 4,
    client: "Digital Solutions",
    company: "Digital Solutions Ltd",
    email: "contact@digitalsolutions.uk",
    phone: "+44 20 4567 8901",
    project: "Content Marketing Campaign",
    budget: 2200,
    status: "responded",
    time: "2 days ago",
    receivedDate: "2024-01-18",
    description: "Looking for a content marketing expert to create and distribute high-quality content that drives engagement and leads.",
    requirements: ["Content Creation", "Content Strategy", "SEO"],
  },
  {
    id: 5,
    client: "Startup Ventures",
    company: "Startup Ventures",
    email: "hello@startupventures.com",
    phone: "+44 20 5678 9012",
    project: "Email Marketing Automation",
    budget: 1500,
    status: "accepted",
    time: "3 days ago",
    receivedDate: "2024-01-17",
    description: "Need help setting up email marketing automation sequences and optimizing our email campaigns for better conversion rates.",
    requirements: ["Email Marketing", "Marketing Automation", "A/B Testing"],
  },
];

const statusConfig = {
  new: { label: "New", color: "primary", icon: AlertCircle },
  reviewed: { label: "Reviewed", color: "info", icon: Clock },
  responded: { label: "Responded", color: "default", icon: Mail },
  accepted: { label: "Accepted", color: "success", icon: CheckCircle2 },
  declined: { label: "Declined", color: "default", icon: XCircle },
};

const stats = [
  { label: "New Inquiries", value: "2", color: "from-blue-500 to-cyan-500" },
  { label: "Total Inquiries", value: "5", color: "from-purple-500 to-pink-500" },
  { label: "Response Rate", value: "60%", color: "from-emerald-500 to-teal-500" },
  { label: "Avg. Response Time", value: "4.2h", color: "from-amber-500 to-orange-500" },
];

export default function MarketplaceInquiriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesSearch =
      inquiry.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || inquiry.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare className="h-6 w-6 text-[#0a9396]" />
          <h1 className="text-3xl font-bold text-gray-900">Marketplace Inquiries</h1>
        </div>
        <p className="text-gray-600">
          Manage and respond to inquiries from potential clients on the marketplace
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = index === 0 ? MessageSquare : index === 1 ? Building2 : index === 2 ? CheckCircle2 : Clock;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`rounded-lg bg-gradient-to-br ${stat.color} p-3`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Search inquiries by client, project, or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:border-[#0a9396] focus:outline-none focus:ring-2 focus:ring-[#0a9396]/20"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="reviewed">Reviewed</option>
            <option value="responded">Responded</option>
            <option value="accepted">Accepted</option>
            <option value="declined">Declined</option>
          </select>
        </div>
      </div>

      {/* Inquiries List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredInquiries.map((inquiry, index) => {
          const statusInfo = statusConfig[inquiry.status as keyof typeof statusConfig];
          const StatusIcon = statusInfo.icon;

          return (
            <motion.div
              key={inquiry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:border-[#0a9396]/50 transition-colors">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-semibold text-gray-900">{inquiry.client}</h3>
                              <Badge variant={statusInfo.color as any} size="sm">
                                {statusInfo.label}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 flex items-center gap-1 mb-2">
                              <Building2 className="h-3 w-3" />
                              {inquiry.company}
                            </p>
                            <h4 className="text-base font-medium text-gray-900 mb-2">{inquiry.project}</h4>
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 mb-4">{inquiry.description}</p>

                        {/* Requirements */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {inquiry.requirements.map((req, idx) => (
                            <Badge key={idx} variant="default" size="sm">
                              {req}
                            </Badge>
                          ))}
                        </div>

                        {/* Contact Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="h-4 w-4 text-[#0a9396]" />
                            <span>{inquiry.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="h-4 w-4 text-[#0a9396]" />
                            <span>{inquiry.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <DollarSign className="h-4 w-4 text-[#0a9396]" />
                            <span>{formatCurrency(inquiry.budget)}/month</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4 text-[#0a9396]" />
                            <span>Received {inquiry.time}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 lg:ml-4">
                        {inquiry.status === "new" && (
                          <>
                            <Button size="sm" className="bg-[#0a9396] hover:bg-[#087579] text-white">
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Accept Inquiry
                            </Button>
                            <Button variant="outline" size="sm">
                              <Mail className="mr-2 h-4 w-4" />
                              Respond
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                              <XCircle className="mr-2 h-4 w-4" />
                              Decline
                            </Button>
                          </>
                        )}
                        {inquiry.status === "reviewed" && (
                          <>
                            <Button size="sm" className="bg-[#0a9396] hover:bg-[#087579] text-white">
                              <Mail className="mr-2 h-4 w-4" />
                              Send Response
                            </Button>
                            <Button variant="outline" size="sm">View Details</Button>
                          </>
                        )}
                        {inquiry.status === "responded" && (
                          <>
                            <Button variant="outline" size="sm">View Conversation</Button>
                            <Button variant="ghost" size="sm">View Details</Button>
                          </>
                        )}
                        {inquiry.status === "accepted" && (
                          <>
                            <Button size="sm" className="bg-[#0a9396] hover:bg-[#087579] text-white">
                              Create Project
                            </Button>
                            <Button variant="outline" size="sm">View Details</Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filteredInquiries.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No inquiries found</h3>
            <p className="text-gray-600">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "You don't have any inquiries yet. Keep your profile updated to attract more clients!"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

