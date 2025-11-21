"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  Users,
  Search,
  Plus,
  Mail,
  Phone,
  Building2,
  Calendar,
  DollarSign,
  TrendingUp,
  Filter,
  MoreVertical,
  Eye,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

const clients = [
  {
    id: 1,
    clientId: "client-1",
    name: "TechStart Inc.",
    email: "contact@techstart.com",
    phone: "+44 20 1234 5678",
    company: "TechStart Inc.",
    status: "active",
    value: 2500,
    projects: 3,
    lastContact: "2 days ago",
    nextFollowUp: "2024-01-15",
  },
  {
    id: 2,
    clientId: "client-2",
    name: "E-Commerce Pro",
    email: "hello@ecommercepro.co.uk",
    phone: "+44 20 2345 6789",
    company: "E-Commerce Pro Ltd",
    status: "active",
    value: 1800,
    projects: 2,
    lastContact: "1 week ago",
    nextFollowUp: "2024-01-20",
  },
  {
    id: 3,
    clientId: "client-3",
    name: "Local Business Hub",
    email: "info@localbusinesshub.com",
    phone: "+44 20 3456 7890",
    company: "Local Business Hub",
    status: "lead",
    value: 1200,
    projects: 0,
    lastContact: "3 days ago",
    nextFollowUp: "2024-01-18",
  },
  {
    id: 4,
    clientId: "client-4",
    name: "Digital Solutions",
    email: "contact@digitalsolutions.uk",
    phone: "+44 20 4567 8901",
    company: "Digital Solutions Ltd",
    status: "active",
    value: 3200,
    projects: 4,
    lastContact: "5 days ago",
    nextFollowUp: "2024-01-22",
  },
];

const stats = [
  { label: "Total Clients", value: "12", icon: Users, color: "from-blue-500 to-cyan-500" },
  { label: "Active Projects", value: "9", icon: TrendingUp, color: "from-emerald-500 to-teal-500" },
  { label: "Monthly Revenue", value: "£8,700", icon: DollarSign, color: "from-purple-500 to-pink-500" },
  { label: "Follow-ups Due", value: "5", icon: Calendar, color: "from-amber-500 to-orange-500" },
];

export default function CRMPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [showClientDetailsModal, setShowClientDetailsModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    status: "lead",
  });

  const handleViewDetails = (client: any) => {
    setSelectedClient(client);
    setShowClientDetailsModal(true);
  };

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddClient = async () => {
    // Validate required fields
    if (!newClient.name || !newClient.email) {
      alert("Please fill in at least name and email");
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement API call to add client
      // For now, just simulate success
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Reset form
      setNewClient({
        name: "",
        email: "",
        phone: "",
        company: "",
        status: "lead",
      });
      setShowAddClientModal(false);
      
      // Show success message (you can replace with toast notification)
      alert("Client added successfully!");
    } catch (error) {
      console.error("Error adding client:", error);
      alert("Failed to add client. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Users className="h-6 w-6 text-[#0a9396]" />
          <h1 className="text-3xl font-bold text-gray-900">CRM - Client Management</h1>
          <Badge variant="primary" size="sm">DigitalBOX</Badge>
        </div>
        <p className="text-gray-600">
          Manage your clients, track interactions, and grow your business relationships
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
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

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Search clients by name, email, or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button
            size="sm"
            onClick={() => setShowAddClientModal(true)}
            className="bg-[#0a9396] hover:bg-[#087579] text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Client
          </Button>
        </div>
      </div>

      {/* Clients List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredClients.map((client, index) => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="hover:border-[#0a9396]/50 hover:shadow-md transition-all duration-200">
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900">{client.name}</h3>
                          <Badge
                            variant={client.status === "active" ? "success" : "default"}
                            size="sm"
                          >
                            {client.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 flex items-center gap-1 mb-1">
                          <Building2 className="h-3 w-3" />
                          {client.company}
                        </p>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4 text-[#0a9396]" />
                        <span>{client.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4 text-[#0a9396]" />
                        <span>{client.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign className="h-4 w-4 text-[#0a9396]" />
                        <span>£{client.value.toLocaleString()}/month</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <TrendingUp className="h-4 w-4 text-[#0a9396]" />
                        <span>{client.projects} active project{client.projects !== 1 ? "s" : ""}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                      <span>Last contact: {client.lastContact}</span>
                      <span>•</span>
                      <span>Next follow-up: {client.nextFollowUp}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 lg:ml-4 lg:min-w-[200px]">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        router.push(`/messaging?clientId=${client.clientId || client.id}`);
                      }}
                      className="flex-1 border-gray-200 hover:border-[#0a9396]/50 hover:bg-[#0a9396]/5 hover:text-[#0a9396] transition-all cursor-pointer"
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Contact
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleViewDetails(client)}
                      className="flex-1 bg-gradient-to-r from-[#0a9396] to-[#087579] hover:from-[#087579] hover:to-[#065a5d] text-white shadow-md hover:shadow-lg transition-all duration-300 group font-medium relative overflow-hidden px-4 py-2.5 min-w-[140px] cursor-pointer"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-1.5 whitespace-nowrap">
                        <Eye className="h-3.5 w-3.5 transition-transform group-hover:scale-110 flex-shrink-0" />
                        <span className="text-sm">View Details</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-all group-hover:translate-x-1 group-hover:scale-110 flex-shrink-0" />
                      </span>
                      <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No clients found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery
                ? "Try adjusting your search terms"
                : "Get started by adding your first client"}
            </p>
            <Button
              onClick={() => setShowAddClientModal(true)}
              className="bg-[#0a9396] hover:bg-[#087579] text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Client
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Add Client Modal */}
      <AnimatePresence>
        {showAddClientModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <div>
                    <CardTitle>Add New Client</CardTitle>
                    <CardDescription>Enter client information to add them to your CRM</CardDescription>
                  </div>
                  <button
                    onClick={() => setShowAddClientModal(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-600" />
                  </button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Client Name *"
                      placeholder="John Doe"
                      value={newClient.name}
                      onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                      required
                    />
                    <Input
                      label="Email *"
                      type="email"
                      placeholder="john@example.com"
                      value={newClient.email}
                      onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                      required
                    />
                    <Input
                      label="Phone Number"
                      placeholder="+44 20 1234 5678"
                      value={newClient.phone}
                      onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                    />
                    <Input
                      label="Company Name"
                      placeholder="Company Ltd"
                      value={newClient.company}
                      onChange={(e) => setNewClient({ ...newClient, company: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Status</label>
                    <select
                      value={newClient.status}
                      onChange={(e) => setNewClient({ ...newClient, status: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:border-[#0a9396] focus:outline-none focus:ring-2 focus:ring-[#0a9396]/20"
                    >
                      <option value="lead">Lead</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={handleAddClient}
                      disabled={isLoading || !newClient.name || !newClient.email}
                      className="flex-1 bg-[#0a9396] hover:bg-[#087579] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Client
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowAddClientModal(false);
                        setNewClient({
                          name: "",
                          email: "",
                          phone: "",
                          company: "",
                          status: "lead",
                        });
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Client Details Modal */}
      <AnimatePresence>
        {showClientDetailsModal && selectedClient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-2xl">{selectedClient.name}</CardTitle>
                      <Badge
                        variant={selectedClient.status === "active" ? "success" : "default"}
                        size="sm"
                      >
                        {selectedClient.status}
                      </Badge>
                    </div>
                    <CardDescription className="text-base">
                      Complete client information and activity overview
                    </CardDescription>
                  </div>
                  <button
                    onClick={() => {
                      setShowClientDetailsModal(false);
                      setSelectedClient(null);
                    }}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-600" />
                  </button>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  {/* Contact Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                        <div className="p-2 rounded-lg bg-[#0a9396]/10">
                          <Mail className="h-5 w-5 text-[#0a9396]" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 mb-1">Email</p>
                          <button
                            onClick={() => {
                              router.push(`/messaging?clientId=${selectedClient.clientId || selectedClient.id}`);
                              setShowClientDetailsModal(false);
                            }}
                            className="text-sm font-medium text-[#0a9396] hover:text-[#087579] hover:underline transition-colors text-left"
                          >
                            {selectedClient.email}
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                        <div className="p-2 rounded-lg bg-[#0a9396]/10">
                          <Phone className="h-5 w-5 text-[#0a9396]" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Phone</p>
                          <p className="text-sm font-medium text-gray-900">{selectedClient.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                        <div className="p-2 rounded-lg bg-[#0a9396]/10">
                          <Building2 className="h-5 w-5 text-[#0a9396]" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Company</p>
                          <p className="text-sm font-medium text-gray-900">{selectedClient.company}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                        <div className="p-2 rounded-lg bg-[#0a9396]/10">
                          <DollarSign className="h-5 w-5 text-[#0a9396]" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Monthly Value</p>
                          <p className="text-sm font-medium text-gray-900">
                            £{selectedClient.value.toLocaleString()}/month
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Activity Summary */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 rounded-lg border border-gray-200">
                        <p className="text-xs text-gray-500 mb-1">Active Projects</p>
                        <p className="text-2xl font-bold text-gray-900">{selectedClient.projects}</p>
                      </div>
                      <div className="p-4 rounded-lg border border-gray-200">
                        <p className="text-xs text-gray-500 mb-1">Last Contact</p>
                        <p className="text-sm font-medium text-gray-900">{selectedClient.lastContact}</p>
                      </div>
                      <div className="p-4 rounded-lg border border-gray-200">
                        <p className="text-xs text-gray-500 mb-1">Next Follow-up</p>
                        <p className="text-sm font-medium text-gray-900">{selectedClient.nextFollowUp}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => {
                        router.push(`/messaging?clientId=${selectedClient.clientId || selectedClient.id}`);
                        setShowClientDetailsModal(false);
                      }}
                      className="flex-1 border-gray-200 hover:border-[#0a9396]/50 hover:bg-[#0a9396]/5 hover:text-[#0a9396]"
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Send Email
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-gray-200 hover:border-[#0a9396]/50 hover:bg-[#0a9396]/5 hover:text-[#0a9396]"
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      Call Client
                    </Button>
                    <Button className="flex-1 bg-[#0a9396] hover:bg-[#087579] text-white">
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule Meeting
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

