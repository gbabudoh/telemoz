"use client";


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
  MoreVertical,
  Eye,
  X,
  LayoutGrid,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Client {
  id: number;
  clientId: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: string;
  value: number;
  projects: number;
  lastContact: string;
  nextFollowUp: string;
}

const clients: Client[] = [
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
  { label: "Total Clients", value: "12", icon: Users, color: "from-[#0a9396] to-[#015f63]", glow:"shadow-[#0a9396]/40 text-[#0a9396]" },
  { label: "Active Projects", value: "9", icon: TrendingUp, color: "from-[#4B70F5] to-[#3651B3]", glow:"shadow-[#4B70F5]/40 text-[#4B70F5]" },
  { label: "Monthly Revenue", value: "£8,700", icon: DollarSign, color: "from-[#7C3AED] to-[#5B21B6]", glow:"shadow-[#7C3AED]/40 text-[#7C3AED]" },
  { label: "Follow-ups Due", value: "5", icon: Calendar, color: "from-[#F97316] to-[#C2410C]", glow:"shadow-[#F97316]/40 text-[#F97316]" },
];

export default function CRMPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [showClientDetailsModal, setShowClientDetailsModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    status: "lead",
  });

  const handleViewDetails = (client: Client) => {
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
    if (!newClient.name || !newClient.email) {
      alert("Please fill in at least name and email");
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setNewClient({
        name: "",
        email: "",
        phone: "",
        company: "",
        status: "lead",
      });
      setShowAddClientModal(false);
      alert("Client added successfully!");
    } catch (error) {
      console.error("Error adding client:", error);
      alert("Failed to add client. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Framer Motion Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  return (
    <div className="relative min-h-screen max-w-7xl mx-auto pb-12 space-y-8 overflow-hidden">
      {/* Dynamic Ambient Background Orbs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
         <motion.div 
            animate={{ 
              x: ["-10%", "100%", "-10%"],
              y: ["-20%", "50%", "-20%"],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-r from-teal-200/40 to-cyan-300/40 blur-[120px] mix-blend-multiply" 
          />
         <motion.div 
            animate={{ 
              x: ["100%", "-20%", "100%"],
              y: ["80%", "-10%", "80%"],
              scale: [1, 1.3, 1],
            }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-l from-indigo-200/30 to-purple-300/30 blur-[120px] mix-blend-multiply" 
          />
      </div>

      <div className="relative z-10 space-y-8">
        
        {/* Ultra-Premium Hero Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/40 p-6 lg:p-8 rounded-[2rem] border border-white/60 shadow-[0_8px_32px_rgb(0,0,0,0.04)] backdrop-blur-xl">
          <div>
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-white to-gray-50/50 rounded-2xl shadow-[inset_0_2px_10px_rgb(255,255,255,0.8),0_4px_15px_rgb(0,0,0,0.05)] border border-white/80">
                  <Users className="h-7 w-7 text-[#0a9396]" />
              </div>
              <div>
                  <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 flex items-center gap-3">
                    CRM Master Database
                    <Badge variant="primary" size="sm" className="hidden sm:inline-flex bg-[#0a9396]/10 text-[#0a9396] border-[#0a9396]/20 py-1.5 px-3 rounded-xl shadow-inner font-bold tracking-wider text-[11px] uppercase">
                      DigitalBOX Core
                    </Badge>
                  </h1>
                  <p className="text-gray-500 mt-2 font-medium text-lg">
                    Manage relationships, track client interactions, and accelerate growth.
                  </p>
              </div>
            </div>
          </div>
          <button
             onClick={() => setShowAddClientModal(true)}
             className="relative group h-14 px-8 rounded-2xl overflow-hidden font-bold tracking-wide shadow-xl shadow-[#0a9396]/20 transition-all hover:scale-[1.03] active:scale-[0.98] w-full sm:w-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a9396] via-[#057a7d] to-[#0a9396] bg-[length:200%_auto] group-hover:animate-gradient" />
            <div className="absolute inset-[1px] rounded-[15px] bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
            <span className="relative z-10 flex items-center justify-center text-white text-[16px]">
              <Plus className="mr-2 h-5 w-5" />
              Register Client Let
            </span>
          </button>
        </div>

        {/* Deep Glass Stats Module */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div key={stat.label} variants={itemVariants}>
                <div className="relative group p-1 rounded-[2rem] bg-gradient-to-b from-white/60 to-white/20 hover:from-white/80 hover:to-white/40 transition-all duration-500 shadow-[0_8px_32px_rgb(0,0,0,0.04)] backdrop-blur-xl border border-white/50 hover:-translate-y-2">
                  <div className="absolute inset-x-4 -top-0.5 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-50" />
                  
                  <div className="bg-white/40 h-full rounded-[1.75rem] p-6 lg:p-8 shadow-[inset_0_2px_15px_rgb(255,255,255,0.5)] flex flex-col justify-between overflow-hidden relative">
                     {/* Heavy Glow Background Effect */}
                     <div className={`absolute -right-12 -bottom-12 w-40 h-40 rounded-full blur-[50px] opacity-15 bg-gradient-to-br ${stat.color} group-hover:scale-150 group-hover:opacity-25 transition-all duration-700`} />
                     
                     <div className="flex items-start justify-between relative z-10 w-full mb-6">
                        <div className={`p-3 rounded-2xl bg-white shadow-lg ${stat.glow} border border-white/60 group-hover:-translate-y-1 transition-transform duration-500`}>
                          <Icon className={`h-6 w-6 ${stat.glow.split(' ')[1]}`} />
                        </div>
                     </div>
                     <div className="relative z-10">
                        <motion.h3 
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ duration: 0.8, delay: 0.2 + (i * 0.1) }}
                           className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tighter mb-2"
                        >
                           {stat.value}
                        </motion.h3>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
                     </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* High-Contrast Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/50 p-4 rounded-3xl border border-white/80 shadow-[0_8px_32px_rgb(0,0,0,0.04)] backdrop-blur-xl relative z-20">
          <div className="relative flex-1 w-full md:max-w-xl group">
            <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0a9396] transition-colors" />
            <Input
              type="search"
              placeholder="Search clients by name, email, or exact corporate entity..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-14 border-white shadow-[inset_0_2px_8px_rgb(0,0,0,0.02)] bg-white/80 h-14 rounded-2xl text-[15px] font-medium focus-visible:ring-[#0a9396]/30 focus-visible:border-[#0a9396]/50 transition-all placeholder:text-gray-400"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto hidden">
            {/* Extended filtering layout placeholder for when the user adds it */}
          </div>
        </div>

        {/* Ultra-Premium Glass Tickets ListView */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          <AnimatePresence>
            {filteredClients.map((client) => {
              const isActive = client.status === "active";
              
              return (
                <motion.div
                  layout
                  key={client.id}
                  variants={itemVariants}
                  className="group relative"
                >
                  <div className="border-white/80 bg-white/60 shadow-[0_8px_32px_rgb(0,0,0,0.04)] rounded-[2.5rem] border backdrop-blur-xl relative overflow-hidden transition-all duration-500 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1">
                    
                    {/* Glossy top edge highlight */}
                    <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />

                    <div className="flex flex-col sm:flex-row h-full">
                      {/* Left: Main Client Context Area */}
                      <div className="p-8 lg:p-10 flex-1 relative z-10 flex flex-col justify-between">
                         <div>
                            <div className="flex items-start justify-between mb-2">
                               <div>
                                  <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-2xl font-black text-gray-900 tracking-tight group-hover:text-[#0a9396] transition-colors">{client.name}</h3>
                                    <Badge 
                                       variant={isActive ? "success" : "info"} 
                                       size="md" 
                                       className="flex items-center gap-1.5 uppercase font-black tracking-widest text-[10px] px-3 py-1 shadow-sm"
                                    >
                                       {client.status}
                                    </Badge>
                                  </div>
                                  <p className="text-[14px] font-bold text-gray-500 flex items-center gap-2 mb-6 bg-white/50 px-3 py-1.5 rounded-lg border border-white/80 shadow-sm w-max">
                                    <Building2 className="h-4 w-4 text-[#0a9396]" />
                                    {client.company}
                                  </p>
                               </div>
                               
                               {/* Context Menu Icon */}
                               <button className="text-gray-400 hover:text-gray-900 transition-colors bg-white/50 hover:bg-white shadow-sm border border-gray-200/50 rounded-xl p-2.5 shrink-0 hidden sm:block">
                                 <MoreVertical className="h-5 w-5" />
                               </button>
                            </div>

                            {/* Essential Data Grid */}
                            <div className="grid grid-cols-2 gap-x-6 gap-y-5 rounded-2xl bg-white/40 border border-white/60 p-5 shadow-[inset_0_2px_10px_rgb(255,255,255,0.5)]">
                              <div>
                                 <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5 mb-1"><Mail className="w-3.5 h-3.5" /> Email</p>
                                 <p className="text-[14px] font-bold text-gray-700 truncate">{client.email}</p>
                              </div>
                              <div>
                                 <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5 mb-1"><Phone className="w-3.5 h-3.5" /> Direct</p>
                                 <p className="text-[14px] font-bold text-gray-700">{client.phone}</p>
                              </div>
                              <div>
                                 <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-500/70 flex items-center gap-1.5 mb-1"><DollarSign className="w-3.5 h-3.5" /> Rev/Mo</p>
                                 <p className="text-[16px] font-black text-gray-900">£{client.value.toLocaleString()}</p>
                              </div>
                              <div>
                                 <p className="text-[11px] font-bold uppercase tracking-widest text-blue-500/70 flex items-center gap-1.5 mb-1"><TrendingUp className="w-3.5 h-3.5" /> Projects</p>
                                 <p className="text-[16px] font-black text-gray-900">{client.projects} <span className="text-sm font-bold text-gray-500 tracking-normal">Active</span></p>
                              </div>
                            </div>
                         </div>
                      </div>

                      {/* Right: Floating Actions Detached Panel */}
                      <div className="p-6 lg:p-8 flex flex-col justify-center sm:w-[220px] bg-gray-50/60 backdrop-blur-md border-t sm:border-t-0 sm:border-l border-white shadow-[inset_1px_0_0_rgb(0,0,0,0.02)] relative z-20 gap-3">
                         
                         <button 
                           onClick={() => router.push(`/pro/messaging?clientId=${client.clientId || client.id}`)}
                           className="w-full relative group h-12 rounded-xl overflow-hidden font-bold tracking-wide shadow-md shadow-[#0a9396]/10 transition-all hover:scale-[1.03] active:scale-[0.98]"
                         >
                           <div className="absolute inset-0 bg-white/80 backdrop-blur border border-white/60 group-hover:bg-[#0a9396]/5 transition-colors" />
                           <span className="relative z-10 flex items-center justify-center text-gray-700 group-hover:text-[#0a9396] text-[15px]">
                             <Mail className="mr-2 h-4 w-4" />
                             Contact Lead
                           </span>
                         </button>

                         <button 
                           onClick={() => handleViewDetails(client)}
                           className="w-full relative group h-12 rounded-xl overflow-hidden font-bold tracking-wide shadow-lg shadow-gray-900/10 transition-all hover:scale-[1.03] active:scale-[0.98]"
                         >
                           <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-[length:200%_auto] group-hover:animate-gradient" />
                           <div className="absolute inset-[1px] rounded-[11px] bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                           <span className="relative z-10 flex items-center justify-center text-white text-[15px]">
                             <Eye className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                             Full Details
                           </span>
                         </button>

                         <div className="mt-4 pt-4 border-t border-gray-200/60 text-center">
                           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1.5 flex justify-center items-center gap-1.5"><Calendar className="h-3 w-3" /> Last Ping</p>
                           <p className="text-[13px] text-gray-700 font-bold bg-white/50 border border-white py-1 rounded-lg">{client.lastContact}</p>
                         </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Empty State Focus View */}
        {filteredClients.length === 0 && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}}>
            <div className="border border-white/60 bg-white/40 backdrop-blur-md rounded-[3rem] shadow-[inset_0_2px_15px_rgb(255,255,255,0.7)] p-16 text-center mt-12">
                <div className="mx-auto w-24 h-24 bg-white/80 shadow-[0_8px_32px_rgb(0,0,0,0.06)] rounded-full flex items-center justify-center mb-6 relative">
                   <div className="absolute inset-0 bg-gradient-to-br from-[#0a9396]/10 to-teal-400/10 rounded-full animate-ping" />
                   <Users className="h-10 w-10 text-gray-400 relative z-10" />
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">No Clients Registered</h3>
                <p className="text-gray-500 text-lg max-w-md mx-auto font-medium leading-relaxed mb-8">
                  {searchQuery
                    ? "We couldn't find any CRM records matching your search query. Try reverting the text field."
                    : "The master database is currently unpopulated. Grow your business by capturing your first lead!"}
                </p>
                <button 
                   onClick={() => setShowAddClientModal(true)}
                   className="relative inline-flex group h-14 px-8 rounded-2xl overflow-hidden font-bold tracking-wide shadow-xl shadow-[#0a9396]/20 transition-all hover:-translate-y-1 active:scale-[0.98]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0a9396] via-[#057a7d] to-[#0a9396] bg-[length:200%_auto] group-hover:animate-gradient" />
                  <div className="absolute inset-[1px] rounded-[15px] bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                  <span className="relative z-10 flex items-center justify-center text-white text-[16px]">
                    <Plus className="mr-2 h-5 w-5" />
                    Register Your First Client
                  </span>
                </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Ultra-Premium Fluid Add Client Modal */}
      <AnimatePresence>
        {showAddClientModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-gray-900/40 backdrop-blur-xl"
               onClick={() => setShowAddClientModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="bg-white/90 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl border border-white max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-10"
            >
              <div className="p-8 pb-0 flex flex-row items-center justify-between border-b border-gray-100/50 bg-white/50 pt-10 px-10">
                <div className="mb-8">
                  <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3 tracking-tight">
                     <div className="p-3 bg-gradient-to-br from-white to-gray-50/50 rounded-2xl shadow-[inset_0_2px_10px_rgb(255,255,255,0.8),0_4px_15px_rgb(0,0,0,0.05)] border border-white/80">
                         <Plus className="text-[#0a9396] w-6 h-6" />
                     </div>
                     Register New Client
                  </h2>
                  <p className="text-lg font-medium text-gray-500 mt-2">
                    Inject a fresh CRM record securely into your master database.
                  </p>
                </div>
                <button
                  onClick={() => {
                      setShowAddClientModal(false);
                      setNewClient({ name: "", email: "", phone: "", company: "", status: "lead" });
                  }}
                  className="p-3 rounded-full bg-white border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all shadow-sm mb-6"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-10 space-y-8 bg-gray-50/30">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Client Contact Name <span className="text-red-500">*</span></label>
                    <Input
                      placeholder="John Doe"
                      value={newClient.name}
                      onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                      className="bg-white border-white shadow-[0_4px_15px_rgb(0,0,0,0.03)] h-14 rounded-2xl text-[15px] focus:ring-[#0a9396]/20 font-medium"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Email Address <span className="text-red-500">*</span></label>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      value={newClient.email}
                      onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                      className="bg-white border-white shadow-[0_4px_15px_rgb(0,0,0,0.03)] h-14 rounded-2xl text-[15px] focus:ring-[#0a9396]/20 font-medium"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Phone Number</label>
                    <Input
                      placeholder="+44 20 1234 5678"
                      value={newClient.phone}
                      onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                      className="bg-white border-white shadow-[0_4px_15px_rgb(0,0,0,0.03)] h-14 rounded-2xl text-[15px] focus:ring-[#0a9396]/20 font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Corporation Entity</label>
                    <Input
                      placeholder="Company Ltd"
                      value={newClient.company}
                      onChange={(e) => setNewClient({ ...newClient, company: e.target.value })}
                      className="bg-white border-white shadow-[0_4px_15px_rgb(0,0,0,0.03)] h-14 rounded-2xl text-[15px] focus:ring-[#0a9396]/20 font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">CRM Status Level</label>
                  <select
                    value={newClient.status}
                    onChange={(e) => setNewClient({ ...newClient, status: e.target.value })}
                    className="w-full h-14 px-5 rounded-2xl border border-white shadow-[0_4px_15px_rgb(0,0,0,0.03)] bg-white text-[15px] text-gray-900 focus:border-[#0a9396] focus:outline-none focus:ring-4 focus:ring-[#0a9396]/10 transition-all font-bold appearance-none"
                  >
                    <option value="lead">Sales Lead</option>
                    <option value="active">Active Client</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                
                <div className="flex gap-4 pt-10 mt-6 border-t border-gray-200/50">
                  <button
                    onClick={handleAddClient}
                    disabled={isLoading || !newClient.name || !newClient.email}
                    className="w-full relative group h-14 rounded-2xl overflow-hidden font-bold tracking-wide shadow-xl shadow-[#0a9396]/20 transition-all hover:-translate-y-1 active:scale-[0.98] disabled:opacity-50 disabled:hover:translate-y-0"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0a9396] via-[#057a7d] to-[#0a9396] bg-[length:200%_auto] group-hover:animate-gradient" />
                    <div className="absolute inset-[1px] rounded-[15px] bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                    <span className="relative z-10 flex items-center justify-center text-white text-[16px]">
                       {isLoading ? (
                        <>
                          <div className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Processing Record...
                        </>
                      ) : (
                        <>
                          <Plus className="mr-2 h-5 w-5" />
                          Register Client Record
                        </>
                      )}
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Ultra-Premium Client Details Modal */}
      <AnimatePresence>
        {showClientDetailsModal && selectedClient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-gray-900/40 backdrop-blur-xl"
               onClick={() => setShowClientDetailsModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="bg-white/90 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl border border-white max-w-4xl w-full max-h-[90vh] overflow-y-auto relative z-10"
            >
              <div className="flex flex-row items-start justify-between pb-8 border-b border-gray-100 bg-white/50 pt-10 px-10">
                <div>
                  <div className="flex items-center gap-4 mb-3">
                     <div className="p-4 bg-gradient-to-br from-white to-gray-50/50 rounded-2xl shadow-[inset_0_2px_10px_rgb(255,255,255,0.8),0_4px_15px_rgb(0,0,0,0.05)] border border-white/80">
                        <Building2 className="h-7 w-7 text-[#0a9396]" />
                     </div>
                     <div>
                        <h2 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight flex items-center gap-4">
                          {selectedClient.name}
                          <Badge
                            variant={selectedClient.status === "active" ? "success" : "info"}
                            size="md"
                            className="uppercase font-black text-[11px] tracking-widest px-3 py-1 shadow-sm"
                          >
                            {selectedClient.status}
                          </Badge>
                        </h2>
                        <p className="text-lg font-bold text-gray-500 mt-2">
                          {selectedClient.company}
                        </p>
                     </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowClientDetailsModal(false);
                    setSelectedClient(null);
                  }}
                  className="p-3 rounded-full bg-white border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all shadow-sm"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-10 space-y-10 bg-gray-50/30">
                {/* Contact Information Grid */}
                <div>
                  <h3 className="text-[17px] font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                    <LayoutGrid className="w-5 h-5 text-[#0a9396]" />
                    Direct Pipeline Data
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    
                    <div className="flex items-center gap-5 p-6 rounded-2xl border border-white shadow-[0_4px_20px_rgb(0,0,0,0.03)] bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all group cursor-pointer hover:-translate-y-1">
                      <div className="p-4 rounded-xl bg-blue-50 text-blue-600 transition-transform shadow-[inset_0_2px_10px_rgb(255,255,255,1)]">
                        <Mail className="h-7 w-7" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Registered Email</p>
                        <button
                          onClick={() => {
                            router.push(`/pro/messaging?clientId=${selectedClient.clientId || selectedClient.id}`);
                            setShowClientDetailsModal(false);
                          }}
                          className="text-[17px] font-black text-[#0a9396] hover:text-[#087579] truncate w-full text-left"
                        >
                          {selectedClient.email}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-5 p-6 rounded-2xl border border-white shadow-[0_4px_20px_rgb(0,0,0,0.03)] bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all group cursor-pointer hover:-translate-y-1">
                      <div className="p-4 rounded-xl bg-green-50 text-green-600 transition-transform shadow-[inset_0_2px_10px_rgb(255,255,255,1)]">
                        <Phone className="h-7 w-7" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Direct Phone</p>
                        <p className="text-[17px] font-black text-gray-900">{selectedClient.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-5 p-6 rounded-2xl border border-white shadow-[0_4px_20px_rgb(0,0,0,0.03)] bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all group cursor-pointer hover:-translate-y-1">
                      <div className="p-4 rounded-xl bg-purple-50 text-purple-600 transition-transform shadow-[inset_0_2px_10px_rgb(255,255,255,1)]">
                        <DollarSign className="h-7 w-7" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Monthly Value</p>
                        <p className="text-[20px] font-black text-gray-900">£{selectedClient.value.toLocaleString()} <span className="font-bold text-gray-400 text-sm tracking-normal">/mo</span></p>
                      </div>
                    </div>

                    <div className="flex items-center gap-5 p-6 rounded-2xl border border-white shadow-[0_4px_20px_rgb(0,0,0,0.03)] bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all group cursor-pointer hover:-translate-y-1">
                      <div className="p-4 rounded-xl bg-teal-50 text-[#0a9396] transition-transform shadow-[inset_0_2px_10px_rgb(255,255,255,1)]">
                        <TrendingUp className="h-7 w-7" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Active Scope</p>
                        <p className="text-[20px] font-black text-gray-900">{selectedClient.projects} <span className="font-bold text-gray-400 text-sm tracking-normal">Projects</span></p>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Activity Timeline Mini */}
                <div className="bg-white p-8 rounded-[2rem] border border-white shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
                  <h3 className="text-[17px] font-black uppercase tracking-widest text-gray-400 mb-8 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                       <Calendar className="w-5 h-5 text-[#0a9396]" />
                       Communication Timeline
                    </span>
                  </h3>
                  <div className="flex flex-col md:flex-row gap-8 md:gap-16 relative before:absolute before:inset-0 before:top-1/2 before:-translate-y-1/2 before:h-1 before:w-[80%] before:bg-gray-100 before:z-0 hidden md:flex before:left-[10%]">
                      
                      <div className="relative z-10 flex-1 pl-4 text-center">
                         <div className="absolute left-1/2 -translate-x-1/2 -translate-y-[calc(50%+4px)] top-1/2 w-4 h-4 bg-gray-300 rounded-full ring-8 ring-white" />
                         <p className="text-[12px] font-black tracking-widest uppercase text-gray-400 mb-1 mt-6">Last Contact</p>
                         <p className="text-xl text-gray-900 font-bold">{selectedClient.lastContact}</p>
                      </div>

                      <div className="relative z-10 flex-1 pl-4 text-center">
                         <div className="absolute left-1/2 -translate-x-1/2 -translate-y-[calc(50%+4px)] top-1/2 w-4 h-4 bg-[#0a9396] rounded-full ring-8 ring-white shadow-[0_0_15px_rgb(10,147,150,0.6)] animate-pulse" />
                         <p className="text-[12px] font-black tracking-widest uppercase text-[#0a9396] mb-1 mt-6">Next Follow Up</p>
                         <p className="text-xl text-gray-900 font-black">{selectedClient.nextFollowUp}</p>
                      </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-6 border-t border-gray-100/50">
                  <button
                    onClick={() => {
                      router.push(`/pro/messaging?clientId=${selectedClient.clientId || selectedClient.id}`);
                      setShowClientDetailsModal(false);
                    }}
                    className="flex-1 relative group h-14 rounded-2xl overflow-hidden font-bold tracking-wide shadow-xl shadow-gray-900/10 transition-all hover:-translate-y-1 active:scale-[0.98]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-[length:200%_auto] group-hover:animate-gradient" />
                    <div className="absolute inset-[1px] rounded-[15px] bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                    <span className="relative z-10 flex items-center justify-center text-white text-[16px]">
                      <Mail className="mr-2 h-5 w-5" />
                      Draft Communications
                    </span>
                  </button>

                  <button 
                    className="flex-1 bg-white border-2 border-[#0a9396] text-[#0a9396] hover:bg-[#0a9396] hover:text-white rounded-2xl h-14 shadow-sm hover:shadow-xl hover:shadow-[#0a9396]/20 transition-all text-[16px] font-bold flex items-center justify-center"
                  >
                    <Calendar className="mr-2 h-5 w-5" />
                    Book Meeting Link
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
