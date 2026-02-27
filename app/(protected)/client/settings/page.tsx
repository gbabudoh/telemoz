"use client";

import { Badge } from "@/components/ui/Badge";
import {
  Settings,
  User,
  Bell,
  Shield,
  CreditCard,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Save,
  Trash2,
  LogOut,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { countriesByRegion, regions } from "@/lib/countries";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function ClientSettingsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("account");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    country: "",
    city: "",
    timezone: "Europe/London",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?.id) return;

      try {
        setIsFetching(true);
        const response = await fetch("/api/user/profile");
        if (response.ok) {
          const data = await response.json();
          setFormData({
            name: data.user.name || "",
            email: data.user.email || "",
            phone: "",
            company: "",
            country: data.user.country || "",
            city: data.user.city || "",
            timezone: data.user.timezone || "Europe/London",
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchUserData();
  }, [session]);

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    projectUpdates: true,
    reportReady: true,
    proMessages: true,
    marketingEmails: false,
  });

  const tabs = [
    { id: "account", label: "Account", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "billing", label: "Billing", icon: CreditCard },
  ];

  const handleSaveAccountInfo = async () => {
    if (!formData.name || !formData.email) {
      setSaveError("Name and email are required");
      return;
    }

    setIsLoading(true);
    setSaveError("");
    setSaveSuccess(false);

    try {
      const response = await fetch("/api/user/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          country: formData.country,
          city: formData.city,
          timezone: formData.timezone,
        }),
      });

      if (response.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        const data = await response.json();
        setSaveError(data.error || "Failed to update account information");
      }
    } catch (error) {
      console.error("Error updating account:", error);
      setSaveError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    setIsLoading(true);
    setSaveError("");
    setSaveSuccess(false);

    try {
      // In a real app, you would make an API call here
      await new Promise((resolve) => setTimeout(resolve, 500));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      setSaveError("Failed to save notification preferences");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePassword = async () => {
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setSaveError("All password fields are required");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setSaveError("New passwords do not match");
      return;
    }

    if (formData.newPassword.length < 8) {
      setSaveError("Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);
    setSaveError("");
    setSaveSuccess(false);

    try {
      const response = await fetch("/api/user/update-password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      if (response.ok) {
        setSaveSuccess(true);
        setFormData({ ...formData, currentPassword: "", newPassword: "", confirmPassword: "" });
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        const data = await response.json();
        setSaveError(data.error || "Failed to update password");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      setSaveError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#0a9396]" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-transparent">
      {/* Ambient Animated Orbs */}
      <div className="fixed top-[-5%] left-[-10%] w-[45%] h-[45%] rounded-full bg-[#0a9396]/10 blur-[130px] pointer-events-none mix-blend-multiply animate-pulse z-0" />
      <div className="fixed top-[15%] right-[-5%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[140px] pointer-events-none mix-blend-multiply animate-pulse-slow z-0" />
      <div className="fixed bottom-[-5%] left-[15%] w-[50%] h-[40%] rounded-full bg-teal-400/10 blur-[130px] pointer-events-none mix-blend-multiply opacity-60 animate-pulse z-0" />

      <div className="space-y-10 relative z-10 max-w-[1200px] mx-auto pb-20 pt-4">
        {/* Sleek Intelligence Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/40 backdrop-blur-2xl border border-white rounded-[2rem] p-6 lg:p-10 shadow-[inset_0_2px_15px_rgb(255,255,255,0.7),0_10px_30px_rgb(0,0,0,0.03)] overflow-hidden relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a9396]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-5">
              <div className="p-4 rounded-3xl bg-white/50 border border-white shadow-sm transition-transform group-hover:scale-105 duration-500">
                <Settings className="h-8 w-8 text-[#0a9396]" />
              </div>
              <div>
                <div className="text-[10px] font-black text-[#0a9396] uppercase tracking-[0.4em] mb-1.5 flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#0a9396] animate-pulse" />
                  CONTROL SYSTEM ENABLED
                </div>
                <h1 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight leading-none uppercase">
                  Terminal <span className="bg-gradient-to-r from-[#0a9396] to-indigo-600 bg-clip-text text-transparent">Preferences</span>
                </h1>
              </div>
            </div>
            
            <button 
              onClick={() => signOut()}
              className="h-12 px-6 rounded-xl bg-gray-900 hover:bg-black text-white font-bold tracking-wide text-[13px] shadow-lg shadow-gray-900/10 border-none transition-all cursor-pointer flex items-center justify-center gap-2 group/btn active:scale-95"
            >
              Terminate Session
              <LogOut className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>

        {/* High-Fidelity Navigation Deck */}
        <div className="bg-white/30 backdrop-blur-3xl border border-white/50 rounded-2xl p-1.5 shadow-sm max-w-fit mx-auto lg:mx-0">
          <div className="flex flex-wrap items-center gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2.5 px-6 py-3 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest cursor-pointer overflow-hidden group/tab ${
                    isActive 
                      ? "text-white" 
                      : "text-gray-500 hover:text-gray-900 hover:bg-white/50"
                  }`}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="activeTabBg"
                      className="absolute inset-0 bg-gray-950 shadow-lg z-0"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <Icon className={`relative z-10 h-4 w-4 ${isActive ? "text-[#0a9396]" : "group-hover/tab:scale-110 transition-transform"}`} />
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Account Tab */}
        {activeTab === "account" && (
          <div className="bg-white/40 backdrop-blur-2xl border border-white rounded-[2.5rem] p-8 lg:p-10 shadow-[inset_0_2px_15px_rgb(255,255,255,0.7),0_10px_30px_rgb(0,0,0,0.03)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0a9396]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            
            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-gray-950 rounded-2xl shadow-lg shadow-gray-900/10">
                  <User className="h-5 w-5 text-[#0a9396]" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase">Identity Protocol</h3>
                  <p className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase">Security Vector & Profile Sync</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: "Designation (Full Name)", value: formData.name, key: "name", type: "text", placeholder: "Identity descriptor" },
                  { label: "Neural Link (Email)", value: formData.email, key: "email", type: "email", placeholder: "link@telemoz.com" },
                  { label: "Transmission Line (Phone)", value: formData.phone, key: "phone", type: "tel", placeholder: "+44 000 000 000" },
                  { label: "Corporate Entity", value: formData.company, key: "company", type: "text", placeholder: "HQ Designation" },
                ].map((field) => (
                  <div key={field.key} className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{field.label}</label>
                    <input
                      type={field.type}
                      value={field.value}
                      onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                      placeholder={field.placeholder}
                      className="w-full bg-white/50 border border-gray-100 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-[#0a9396]/10 focus:border-[#0a9396]/20 font-bold transition-all placeholder:text-gray-300 shadow-sm"
                    />
                  </div>
                ))}
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Geographic Sector (Country)</label>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full bg-white/50 border border-gray-100 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-[#0a9396]/10 focus:border-[#0a9396]/20 font-bold transition-all shadow-sm appearance-none cursor-pointer"
                  >
                    <option value="">Select Sector</option>
                    {regions.map((region) => (
                      <optgroup key={region} label={region}>
                        {countriesByRegion[region].map((country) => (
                          <option key={country.id} value={country.name}>
                            {country.name}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Localized Node (City)</label>
                  <input
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Sector coordinate"
                    className="w-full bg-white/50 border border-gray-100 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-[#0a9396]/10 focus:border-[#0a9396]/20 font-bold transition-all placeholder:text-gray-300 shadow-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Temporal Alignment (Timezone)</label>
                  <select
                    value={formData.timezone}
                    onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                    className="w-full bg-white/50 border border-gray-100 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-[#0a9396]/10 focus:border-[#0a9396]/20 font-bold transition-all shadow-sm appearance-none cursor-pointer"
                  >
                    <option value="Europe/London">Europe/London (GMT)</option>
                    <option value="America/New_York">America/New_York (EST)</option>
                    <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
                    <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                    <option value="Australia/Sydney">Australia/Sydney (AEDT)</option>
                    <option value="Europe/Paris">Europe/Paris (CET)</option>
                  </select>
                </div>
              </div>

              {saveSuccess && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-700 font-bold text-sm shadow-sm"
                >
                  <CheckCircle2 className="h-5 w-5" />
                  <span>IDENTITY SCAN SYNCHRONIZED SUCCESSFULY</span>
                </motion.div>
              )}

              {saveError && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-700 font-bold text-sm shadow-sm"
                >
                  <AlertCircle className="h-5 w-5" />
                  <span>{saveError.toUpperCase()}</span>
                </motion.div>
              )}

              <div className="flex justify-end pt-4">
                <button
                  onClick={handleSaveAccountInfo}
                  disabled={isLoading}
                  className="h-14 px-10 rounded-2xl bg-gray-950 hover:bg-black text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-gray-900/10 border-none transition-all cursor-pointer flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95 group/save"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-[#0a9396]" />
                      Synchronizing...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 group-hover/save:scale-125 transition-transform" />
                      Commit Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <div className="bg-white/40 backdrop-blur-2xl border border-white rounded-[2.5rem] p-8 lg:p-10 shadow-[inset_0_2px_15px_rgb(255,255,255,0.7),0_10px_30px_rgb(0,0,0,0.03)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            
            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-gray-950 rounded-2xl shadow-lg shadow-gray-900/10">
                  <Bell className="h-5 w-5 text-[#0a9396]" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase">Alert Matrix</h3>
                  <p className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase">Notification Routing & Temporal Pings</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { id: "emailNotifications", label: "Email Notifications", desc: "Primary intelligence routing via SMTP" },
                  { id: "projectUpdates", label: "Project Updates", desc: "Telemetry pings for mission vector changes" },
                  { id: "reportReady", label: "Report Ready", desc: "Alerts for synchronized analytical archives" },
                  { id: "proMessages", label: "Professional Messages", desc: "Encrypted link pings from assigned specialists" },
                  { id: "marketingEmails", label: "Marketing Emails", desc: "Periodic broadcast of system evolutions" },
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/50 border border-white/80 hover:bg-white transition-all shadow-sm group/notif">
                    <div>
                      <p className="font-black text-gray-900 text-sm tracking-tight">{item.label}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications[item.id as keyof typeof notifications]}
                        onChange={(e) =>
                          setNotifications({ ...notifications, [item.id]: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0a9396]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0a9396] shadow-inner"></div>
                    </label>
                  </div>
                ))}
              </div>

              {saveSuccess && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-700 font-bold text-sm shadow-sm"
                >
                  <CheckCircle2 className="h-5 w-5" />
                  <span>PREFERENCES SYNCHRONIZED ACROSS ARCHIVE</span>
                </motion.div>
              )}

              {saveError && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-700 font-bold text-sm shadow-sm"
                >
                  <AlertCircle className="h-5 w-5" />
                  <span>{saveError.toUpperCase()}</span>
                </motion.div>
              )}

              <div className="flex justify-end pt-4">
                <button
                  onClick={handleSaveNotifications}
                  disabled={isLoading}
                  className="h-14 px-10 rounded-2xl bg-gray-950 hover:bg-black text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-gray-900/10 border-none transition-all cursor-pointer flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95 group/save"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-[#0a9396]" />
                      Synchronizing...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 group-hover/save:scale-125 transition-transform" />
                      Commit Preferences
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <div className="bg-white/40 backdrop-blur-2xl border border-white rounded-[2.5rem] p-8 lg:p-10 shadow-[inset_0_2px_15px_rgb(255,255,255,0.7),0_10px_30px_rgb(0,0,0,0.03)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            
            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-gray-950 rounded-2xl shadow-lg shadow-gray-900/10">
                  <Shield className="h-5 w-5 text-[#0a9396]" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase">Security Wall</h3>
                  <p className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase">Encryption Bounds & Access Flux</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Current Authorization Key (Password) *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.currentPassword}
                      onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                      placeholder="Enter active secret"
                      className="w-full bg-white/50 border border-gray-100 p-4 pr-12 rounded-2xl outline-none focus:ring-4 focus:ring-[#0a9396]/10 focus:border-[#0a9396]/20 font-bold transition-all placeholder:text-gray-300 shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">New Vector Key *</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.newPassword}
                      onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                      placeholder="New secret sequence"
                      className="w-full bg-white/50 border border-gray-100 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-[#0a9396]/10 focus:border-[#0a9396]/20 font-bold transition-all placeholder:text-gray-300 shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirm New Key *</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="Re-enter sequence"
                      className="w-full bg-white/50 border border-gray-100 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-[#0a9396]/10 focus:border-[#0a9396]/20 font-bold transition-all placeholder:text-gray-300 shadow-sm"
                    />
                  </div>
                </div>
              </div>

              {saveSuccess && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-700 font-bold text-sm shadow-sm"
                >
                  <CheckCircle2 className="h-5 w-5" />
                  <span>ENCRYPTION KEYS SYNCHRONIZED ACROSS SYSTEM</span>
                </motion.div>
              )}

              {saveError && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-700 font-bold text-sm shadow-sm"
                >
                  <AlertCircle className="h-5 w-5" />
                  <span>{saveError.toUpperCase()}</span>
                </motion.div>
              )}

              <div className="flex justify-end pt-4">
                <button
                  onClick={handleSavePassword}
                  disabled={isLoading}
                  className="h-14 px-10 rounded-2xl bg-gray-950 hover:bg-black text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-gray-900/10 border-none transition-all cursor-pointer flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95 group/save"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-[#0a9396]" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 group-hover/save:scale-125 transition-transform" />
                      Update Matrix Key
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Billing Tab */}
        {activeTab === "billing" && (
          <div className="bg-white/40 backdrop-blur-2xl border border-white rounded-[2.5rem] p-8 lg:p-10 shadow-[inset_0_2px_15px_rgb(255,255,255,0.7),0_10px_30px_rgb(0,0,0,0.03)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            
            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-gray-950 rounded-2xl shadow-lg shadow-gray-900/10">
                  <CreditCard className="h-5 w-5 text-[#0a9396]" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase">Capital Ledger</h3>
                  <p className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase">Financial Protocol & Transaction Sync</p>
                </div>
              </div>

              <div className="p-8 bg-gradient-to-br from-[#0a9396]/10 to-indigo-600/5 border border-[#0a9396]/20 rounded-3xl relative overflow-hidden group/card shadow-sm transition-all hover:scale-[1.01]">
                <div className="absolute top-0 right-0 p-4">
                  <Badge className="bg-emerald-500 text-white border-none font-black text-[9px] uppercase tracking-widest px-3">ACTIVE LINK</Badge>
                </div>
                <div className="flex items-start gap-5 mb-6">
                  <div className="p-4 bg-white/50 rounded-2xl border border-white shadow-sm">
                    <CreditCard className="h-6 w-6 text-[#0a9396]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase">Telemoz Marketplace</h3>
                    <p className="text-[10px] font-black text-[#0a9396] uppercase tracking-[0.2em] mt-1">Free Tier Access Enabled</p>
                  </div>
                </div>
                
                <p className="text-sm font-bold text-gray-700 leading-relaxed mb-8 max-w-2xl">
                  As a client, you operate on a <span className="text-[#0a9396]">Zero-Subscription</span> model. No recruitment fees are levied upon your entity. Professionals manage commission logs independently (13% per payload).
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    "Zero Subscription Fees",
                    "Secure Escrow Buffer",
                    "Protected Payload Sync",
                  ].map((benefit) => (
                    <div key={benefit} className="flex items-center gap-3 p-3 bg-white/40 rounded-xl border border-white shadow-sm transition-transform hover:-translate-y-1">
                      <div className="h-5 w-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                      </div>
                      <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest leading-none">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">Payment Sources</h4>
                  <div className="p-6 bg-white/30 border border-white rounded-[2rem] shadow-sm flex flex-col items-center justify-center text-center gap-4 py-10 group/sub">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.1em]">No secure sources on record</p>
                    <button className="h-12 px-8 rounded-xl bg-gray-950 hover:bg-black text-white font-black uppercase tracking-widest text-[11px] shadow-lg shadow-gray-900/10 border-none transition-all flex items-center gap-3 active:scale-95">
                      <CreditCard className="h-4 w-4" />
                      Initialize Source
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">Archive History</h4>
                  <div className="p-6 bg-white/30 border border-white rounded-[2rem] shadow-sm flex flex-col items-center justify-center text-center gap-4 py-10">
                    <div className="h-12 w-12 rounded-full border border-gray-100 flex items-center justify-center opacity-40">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.1em]">Ledger is currently empty</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Danger Zone */}
      <div className="bg-white/40 backdrop-blur-2xl border border-red-500/20 rounded-[2.5rem] p-8 lg:p-10 shadow-[0_10px_40px_rgba(239,68,68,0.05)] relative overflow-hidden group/danger">
        <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover/danger:opacity-100 transition-opacity duration-700" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-red-500/10 rounded-2xl border border-red-500/20 shadow-sm">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase">Termination Protocol</h3>
              <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] mt-1">Danger Zone • Permanent Erasure</p>
              <p className="text-xs font-bold text-gray-500 mt-2 max-w-md">Irreversible destruction of all identity data and project archives associated with this node.</p>
            </div>
          </div>
          <button className="h-14 px-8 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-red-600/20 border-none transition-all cursor-pointer flex items-center justify-center gap-3 active:scale-95 group/del">
            <Trash2 className="h-4 w-4 group-hover/del:scale-125 transition-transform" />
            Vaporize Account
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}

