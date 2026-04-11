"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Settings,
  User,
  Bell,
  Shield,
  CreditCard,
  Eye,
  EyeOff,
  Save,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Lock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { countriesByRegion, regions } from "@/lib/countries";

// Custom Frosted Glass Input matching digitalbox suite
const GlassInput = (props: React.InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }) => {
  const { label, error, className, ...rest } = props;
  return (
    <div className="space-y-1.5">
      {label && <label className="text-[13px] font-bold text-gray-700 tracking-wide">{label}</label>}
      <input
        {...rest}
        className={`w-full bg-white/40 border border-white/60 focus:bg-white/90 focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 rounded-xl px-4 py-2.5 outline-none transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] text-gray-900 placeholder-gray-400 font-medium ${className || ""} ${error ? "border-red-400 focus:border-red-500 focus:ring-red-500/10" : ""}`}
      />
      {error && <p className="text-red-500 text-xs font-semibold mt-1">{error}</p>}
    </div>
  );
};

const GlassSelect = (props: React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string; error?: string; children: React.ReactNode }) => {
  const { label, error, className, children, ...rest } = props;
  return (
    <div className="space-y-1.5">
      {label && <label className="text-[13px] font-bold text-gray-700 tracking-wide">{label}</label>}
      <select
        {...rest}
        className={`w-full bg-white/40 border border-white/60 focus:bg-white/90 focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 rounded-xl px-4 py-2.5 outline-none transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] text-gray-900 placeholder-gray-400 font-medium appearance-none ${className || ""} ${error ? "border-red-400 focus:border-red-500 focus:ring-red-500/10" : ""}`}
      >
        {children}
      </select>
      {error && <p className="text-red-500 text-xs font-semibold mt-1">{error}</p>}
    </div>
  );
};

// Custom Glass Switch Toggle
const GlassSwitch = ({ checked, onChange, disabled = false }: { checked: boolean, onChange: (chk: boolean) => void, disabled?: boolean }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-[#0a9396]/20 disabled:cursor-not-allowed disabled:opacity-50
        ${checked ? 'bg-gradient-to-r from-teal-400 to-[#0a9396] shadow-inner' : 'bg-gray-200/60 backdrop-blur-sm border-white/40 shadow-inner'}
      `}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-[0_2px_5px_rgba(0,0,0,0.2)] ring-0 transition duration-300 ease-in-out
          ${checked ? 'translate-x-5' : 'translate-x-0 border border-gray-100'}
        `}
      />
    </button>
  );
};


export default function SettingsPage() {
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
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    projectUpdates: true,
    newInquiries: true,
    paymentReceived: true,
    marketingEmails: false,
  });

  const [preferences, setPreferences] = useState({
    timezone: "Europe/London",
    dateFormat: "DD/MM/YYYY",
    currency: "GBP",
    language: "en",
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
          setFormData(prev => ({
            ...prev,
            name: data.user.name || "",
            email: data.user.email || "",
            country: data.user.country || "",
            city: data.user.city || "",
          }));
          setPreferences((prev) => ({
            ...prev,
            timezone: data.user.timezone || "Europe/London",
          }));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchUserData();
  }, [session]);

  const tabs = [
    { id: "account", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "billing", label: "Billing", icon: CreditCard },
  ];

  const handleSaveAccountInfo = async () => {
    setIsLoading(true);
    setSaveSuccess(false);
    setSaveError("");

    try {
      const response = await fetch("/api/user/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          country: formData.country,
          city: formData.city,
          timezone: preferences.timezone,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setSaveError(data.error || "Failed to update account information");
        setTimeout(() => setSaveError(""), 5000);
      }
    } catch (error) {
      console.error("Error saving account info:", error);
      setSaveError("An unexpected error occurred. Please try again.");
      setTimeout(() => setSaveError(""), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    setIsLoading(true);
    setSaveSuccess(false);
    setSaveError("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving notification settings:", error);
      setSaveError("Failed to save notification settings");
      setTimeout(() => setSaveError(""), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePassword = async () => {
    setIsLoading(true);
    setSaveSuccess(false);
    setSaveError("");

    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setSaveError("All password fields are required");
      setTimeout(() => setSaveError(""), 5000);
      setIsLoading(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setSaveError("New passwords do not match");
      setTimeout(() => setSaveError(""), 5000);
      setIsLoading(false);
      return;
    }

    if (formData.newPassword.length < 8) {
      setSaveError("New password must be at least 8 characters long");
      setTimeout(() => setSaveError(""), 5000);
      setIsLoading(false);
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      setFormData({
        ...formData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error changing password:", error);
      setSaveError("Failed to change password. Please try again.");
      setTimeout(() => setSaveError(""), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120 } }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-gray-50 overflow-hidden pb-12 pt-4 px-4 sm:px-6 lg:px-8">
      {/* Ambient Lighting Background */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-cyan-400/10 blur-[120px] pointer-events-none mix-blend-multiply animate-pulse" />
      <div className="absolute bottom-[20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[130px] pointer-events-none mix-blend-multiply animate-pulse-slow" />

      <div className="relative z-10 max-w-6xl mx-auto space-y-6">
        
        {/* Header Section */}
        <motion.div
           initial={{ opacity: 0, scale: 0.98 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ type: "spring", stiffness: 100, damping: 20 }}
           className="relative overflow-hidden rounded-[2rem] bg-white/40 p-1 backdrop-blur-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 group"
        >
           <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 via-blue-500/5 to-indigo-500/5 opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
           <div className="relative bg-white/60 rounded-[1.8rem] p-6 lg:p-8 flex items-center justify-between gap-6 shadow-inner border border-white">
             <div className="flex items-center gap-5">
               <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-[#0a9396] p-0.5 shadow-lg shadow-[#0a9396]/20 relative overflow-hidden hidden sm:flex shrink-0">
                  <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                  <div className="h-full w-full rounded-[14px] bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                     <Settings className="h-8 w-8 text-white rotate-0 group-hover:rotate-90 transition-transform duration-700" />
                  </div>
               </div>
               <div>
                  <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tighter drop-shadow-sm flex items-center gap-3">
                    Settings
                  </h1>
                  <p className="text-gray-500 font-bold tracking-wide mt-1 flex items-center gap-2 text-[15px]">
                    <Sparkles className="h-4 w-4 text-emerald-500" />
                    Manage your account, notifications, security, and billing.
                  </p>
               </div>
             </div>
           </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Glassmorphic Sidebar Navigation */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/40 backdrop-blur-2xl rounded-[2rem] border border-white/60 p-3 shadow-[inset_0_2px_15px_rgb(255,255,255,0.7),0_10px_30px_rgb(0,0,0,0.03)] sticky top-24"
            >
              <nav className="space-y-1.5 flex flex-col">
                <AnimatePresence>
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`group relative w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl font-bold tracking-wide transition-all duration-300 overflow-hidden ${
                          isActive
                            ? "text-teal-900 shadow-sm"
                            : "text-gray-600 hover:text-gray-900 hover:bg-white/60"
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeTabBadge"
                            className="absolute inset-0 bg-gradient-to-r from-teal-50 to-emerald-50/20 border border-teal-200/50 rounded-xl"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          >
                             <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-gradient-to-b from-[#0a9396] to-teal-400 rounded-r-md" />
                          </motion.div>
                        )}
                        <Icon className={`h-5 w-5 relative z-10 transition-colors ${isActive ? "text-[#0a9396]" : "text-gray-400 group-hover:text-[#0a9396]"}`} />
                        <span className="relative z-10 text-[14px]">{tab.label}</span>
                      </button>
                    );
                  })}
                </AnimatePresence>
              </nav>
            </motion.div>
          </div>

          {/* Glassmorphic Content Area */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* 1. Account / Identity */}
            {activeTab === "account" && (
              <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
                <motion.div variants={itemVariants} className="bg-white/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/60 shadow-[inset_0_2px_15px_rgb(255,255,255,0.7),0_10px_30px_rgb(0,0,0,0.03)] overflow-hidden">
                   <div className="p-6 sm:p-8 md:p-10 border-b border-gray-100/50 bg-gradient-to-br from-white/40 to-transparent">
                     <h2 className="text-2xl font-black text-gray-900 tracking-tight">Profile Information</h2>
                     <p className="text-gray-500 font-medium text-[14px] mt-1">Update your name, email address, and location.</p>
                   </div>
                   
                   <div className="p-6 sm:p-8 md:p-10 bg-white/20">
                     {isFetching ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-4">
                          <Loader2 className="h-8 w-8 animate-spin text-[#0a9396]" />
                          <span className="text-gray-500 font-bold tracking-wide">Loading your profile...</span>
                        </div>
                      ) : (
                        <div className="space-y-8">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <GlassInput
                              label="Full Name"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              disabled={isLoading}
                            />
                            <GlassInput
                              label="Email Address"
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              disabled={isLoading}
                            />
                            <GlassInput
                              label="Phone Number"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              placeholder="+1 (555) 000-0000"
                              disabled={isLoading}
                            />
                            <GlassInput
                              label="Company"
                              value={formData.company}
                              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                              placeholder="Your company name"
                              disabled={isLoading}
                            />
                            <GlassSelect
                               label="Country"
                               value={formData.country}
                               onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                               disabled={isLoading}
                            >
                                <option value="">Select Country</option>
                                {regions.map((region) => (
                                  <optgroup key={region} label={region}>
                                    {countriesByRegion[region].map((country) => (
                                      <option key={country.id} value={country.name}>{country.name}</option>
                                    ))}
                                  </optgroup>
                                ))}
                            </GlassSelect>
                            <GlassInput
                              label="City"
                              value={formData.city}
                              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                              placeholder="Your city"
                              disabled={isLoading}
                            />
                          </div>

                          {/* Success/Error Alerts inside forms */}
                          <AnimatePresence>
                             {saveSuccess && (
                               <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200">
                                 <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                 <span className="text-sm font-bold text-emerald-900 tracking-wide">Profile updated successfully.</span>
                               </motion.div>
                             )}
                             {saveError && (
                               <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-red-50 to-rose-50 border border-red-200">
                                 <AlertCircle className="h-5 w-5 text-red-600" />
                                 <span className="text-sm font-bold text-red-900 tracking-wide">{saveError}</span>
                               </motion.div>
                             )}
                          </AnimatePresence>

                          <div className="flex gap-3 pt-6 border-t border-gray-200/50">
                            <Button
                              onClick={handleSaveAccountInfo}
                              disabled={isLoading || isFetching}
                              className="bg-gray-900 hover:bg-black text-white hover:shadow-lg hover:shadow-gray-900/20 rounded-xl px-6 h-12 border-none transition-all disabled:opacity-50"
                            >
                              {isLoading ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                              ) : (
                                <><Save className="mr-2 h-4 w-4 text-teal-400" /> Save Changes</>
                              )}
                            </Button>
                            <Button variant="ghost" className="rounded-xl px-6 h-12 font-bold tracking-wide hover:bg-white/60" onClick={() => { setSaveSuccess(false); setSaveError(""); }}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                   </div>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-white/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/60 shadow-[inset_0_2px_15px_rgb(255,255,255,0.7),0_10px_30px_rgb(0,0,0,0.03)] overflow-hidden">
                   <div className="p-6 sm:p-8 md:p-10 border-b border-gray-100/50 bg-gradient-to-br from-white/40 to-transparent">
                     <h2 className="text-2xl font-black text-gray-900 tracking-tight">Preferences</h2>
                     <p className="text-gray-500 font-medium text-[14px] mt-1">Set your timezone, date format, currency, and language.</p>
                   </div>
                   
                   <div className="p-6 sm:p-8 md:p-10 bg-white/20">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
                         <GlassSelect
                           label="Timezone"
                           value={preferences.timezone}
                           onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
                         >
                            <option value="Europe/London">Europe/London (GMT)</option>
                            <option value="Europe/Paris">Europe/Paris (CET)</option>
                            <option value="America/New_York">America/New_York (EST)</option>
                            <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
                         </GlassSelect>
                         <GlassSelect
                           label="Date Format"
                           value={preferences.dateFormat}
                           onChange={(e) => setPreferences({ ...preferences, dateFormat: e.target.value })}
                         >
                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                         </GlassSelect>
                         <GlassSelect
                           label="Currency"
                           value={preferences.currency}
                           onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
                         >
                            <option value="GBP">GBP (£)</option>
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                         </GlassSelect>
                         <GlassSelect
                           label="Language"
                           value={preferences.language}
                           onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                         >
                            <option value="en">English (US/UK)</option>
                            <option value="es">Español</option>
                            <option value="fr">Français</option>
                         </GlassSelect>
                      </div>

                      <div className="flex gap-3 pt-6 border-t border-gray-200/50">
                        <Button
                          onClick={handleSaveAccountInfo}
                          disabled={isLoading}
                          className="bg-gray-900 hover:bg-black text-white hover:shadow-lg hover:shadow-gray-900/20 rounded-xl px-6 h-12 border-none transition-all"
                        >
                          {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : <><Save className="mr-2 h-4 w-4 text-teal-400" /> Save Preferences</>}
                        </Button>
                      </div>
                   </div>
                </motion.div>
              </motion.div>
            )}

            {/* 2. Notifications Config */}
            {activeTab === "notifications" && (
               <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
                 <motion.div variants={itemVariants} className="bg-white/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/60 shadow-[inset_0_2px_15px_rgb(255,255,255,0.7),0_10px_30px_rgb(0,0,0,0.03)] overflow-hidden">
                   <div className="p-6 sm:p-8 md:p-10 border-b border-gray-100/50 bg-gradient-to-br from-white/40 to-transparent flex items-center gap-4">
                     <div className="p-3.5 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl shadow-lg shadow-blue-500/20 text-white shrink-0">
                       <Bell className="h-6 w-6" />
                     </div>
                     <div>
                       <h2 className="text-2xl font-black text-gray-900 tracking-tight">Notifications</h2>
                       <p className="text-gray-500 font-medium text-[14px] mt-1">Choose what you want to be notified about.</p>
                     </div>
                   </div>
                   
                   <div className="p-6 sm:p-8 md:p-10 bg-white/20">
                     <div className="space-y-4">
                        {[
                          { id: "emailNotifications", title: "Email Notifications", desc: "Receive important notifications directly to your email address." },
                          { id: "projectUpdates", title: "Project Updates", desc: "Get notified when a project status changes or is updated." },
                          { id: "newInquiries", title: "New Inquiries", desc: "Instant alerts when a new lead or inquiry arrives in the marketplace." },
                          { id: "paymentReceived", title: "Payment Received", desc: "Notifications when a client payment is confirmed." },
                          { id: "marketingEmails", title: "Telemoz Updates", desc: "Product news, feature releases, and tips from Telemoz." }
                        ].map((setting, idx) => (
                          <div key={idx} className="flex items-center justify-between p-5 rounded-2xl bg-white/60 border border-white hover:bg-white hover:shadow-md transition-all">
                             <div className="pr-4">
                               <h4 className="font-bold text-gray-900 text-[15px]">{setting.title}</h4>
                               <p className="text-sm font-semibold text-gray-500 mt-0.5">{setting.desc}</p>
                             </div>
                             <GlassSwitch 
                               checked={notifications[setting.id as keyof typeof notifications]} 
                               onChange={(val) => setNotifications({...notifications, [setting.id]: val})} 
                             />
                          </div>
                        ))}
                     </div>

                     <AnimatePresence>
                         {saveSuccess && (
                           <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex items-center gap-3 p-4 mt-6 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200">
                             <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                             <span className="text-sm font-bold text-emerald-900 tracking-wide">Notification preferences saved.</span>
                           </motion.div>
                         )}
                         {saveError && (
                           <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex items-center gap-3 p-4 mt-6 rounded-xl bg-gradient-to-r from-red-50 to-rose-50 border border-red-200">
                             <AlertCircle className="h-5 w-5 text-red-600" />
                             <span className="text-sm font-bold text-red-900 tracking-wide">{saveError}</span>
                           </motion.div>
                         )}
                      </AnimatePresence>

                     <div className="flex gap-3 pt-8">
                        <Button
                          onClick={handleSaveNotifications}
                          disabled={isLoading}
                          className="bg-gray-900 hover:bg-black text-white hover:shadow-lg hover:shadow-gray-900/20 rounded-xl px-6 h-12 border-none transition-all w-full sm:w-auto"
                        >
                          {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : <><Save className="mr-2 h-4 w-4 text-blue-400" /> Save Preferences</>}
                        </Button>
                      </div>
                   </div>
                 </motion.div>
               </motion.div>
            )}

            {/* 3. Security */}
            {activeTab === "security" && (
               <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
                 
                 {/* Password Reset */}
                 <motion.div variants={itemVariants} className="bg-white/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/60 shadow-[inset_0_2px_15px_rgb(255,255,255,0.7),0_10px_30px_rgb(0,0,0,0.03)] overflow-hidden">
                   <div className="p-6 sm:p-8 md:p-10 border-b border-gray-100/50 bg-gradient-to-br from-white/40 to-transparent flex items-center gap-4">
                     <div className="p-3.5 bg-gradient-to-br from-gray-800 to-black rounded-2xl shadow-lg shadow-black/20 text-white shrink-0">
                       <Shield className="h-6 w-6" />
                     </div>
                     <div>
                       <h2 className="text-2xl font-black text-gray-900 tracking-tight">Change Password</h2>
                       <p className="text-gray-500 font-medium text-[14px] mt-1">Update your account password to keep your account secure.</p>
                     </div>
                   </div>

                   <div className="p-6 sm:p-8 md:p-10 bg-white/20">
                     <div className="space-y-6 mb-8 max-w-lg">
                       <GlassInput
                         label="Current Password"
                         type={showPassword ? "text" : "password"}
                         value={formData.currentPassword}
                         onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                       />
                       
                       <div className="relative">
                         <GlassInput
                           label="New Password"
                           type={showPassword ? "text" : "password"}
                           value={formData.newPassword}
                           onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                         />
                         <button
                           type="button"
                           onClick={() => setShowPassword(!showPassword)}
                           className="absolute right-4 top-10 text-gray-400 hover:text-gray-900 transition-colors"
                         >
                           {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                         </button>
                       </div>

                       <GlassInput
                         label="Confirm New Password"
                         type={showPassword ? "text" : "password"}
                         value={formData.confirmPassword}
                         onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                       />
                     </div>

                     <div className="flex gap-3 pt-6 border-t border-gray-200/50">
                        <Button
                          onClick={handleSavePassword}
                          disabled={isLoading}
                          className="bg-gray-900 hover:bg-black text-white hover:shadow-lg hover:shadow-gray-900/20 rounded-xl px-6 h-12 border-none transition-all"
                        >
                          {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</> : <><Lock className="mr-2 h-4 w-4 text-gray-400" /> Update Password</>}
                        </Button>
                      </div>
                   </div>
                 </motion.div>

                 {/* Two Factor */}
                 <motion.div variants={itemVariants} className="bg-white/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/60 shadow-[inset_0_2px_15px_rgb(255,255,255,0.7),0_10px_30px_rgb(0,0,0,0.03)] overflow-hidden">
                   <div className="p-6 sm:p-8 md:p-10 flex items-center justify-between gap-6 md:flex-row flex-col text-left w-full md:items-center">
                     <div>
                       <h2 className="text-xl font-black text-gray-900 tracking-tight">Two-Factor Authentication (2FA)</h2>
                       <p className="text-gray-500 font-medium text-[14px] mt-1 max-w-xl">Add an extra layer of security by requiring a verification code alongside your password when signing in.</p>
                     </div>
                     <Button className="shrink-0 bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 hover:shadow-sm rounded-xl px-6 h-11 w-full md:w-auto font-bold tracking-wide">
                        Enable 2FA
                     </Button>
                   </div>
                 </motion.div>

                 {/* Danger Zone */}
                 <motion.div variants={itemVariants} className="relative group/danger">
                   <div className="absolute -inset-1 bg-gradient-to-br from-red-500/20 to-transparent rounded-[2.5rem] blur opacity-0 group-hover/danger:opacity-100 transition-opacity duration-1000" />
                   <div className="relative bg-white/40 backdrop-blur-2xl rounded-[2.5rem] border border-red-200 shadow-[inset_0_2px_15px_rgb(255,255,255,0.7),0_10px_30px_rgb(0,0,0,0.03)] overflow-hidden group-hover/danger:border-red-300 transition-colors">
                     <div className="p-6 sm:p-8 md:p-10 border-b border-red-100/50 bg-gradient-to-br from-red-50/50 to-transparent">
                       <h2 className="text-xl font-black text-red-600 tracking-tight flex items-center gap-2">
                         <AlertCircle className="h-5 w-5" /> Danger Zone
                       </h2>
                       <p className="text-red-900/60 font-semibold text-[13px] mt-1">Proceed with caution — these actions cannot be undone.</p>
                     </div>
                     <div className="p-6 sm:p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-red-50/20">
                       <div className="max-w-xl">
                         <h4 className="font-bold text-red-900 text-[15px]">Delete Account</h4>
                         <p className="text-sm font-semibold text-red-800/70 mt-1">Permanently delete your account and all associated data. This action cannot be undone.</p>
                       </div>
                       <Button variant="outline" className="shrink-0 group/del border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-xl px-6 h-11 w-full md:w-auto font-bold tracking-wide">
                         <Trash2 className="mr-2 h-4 w-4 group-hover/del:scale-110 transition-transform" />
                         Delete Account
                       </Button>
                     </div>
                   </div>
                 </motion.div>

               </motion.div>
            )}

            {/* 4. Billing */}
            {activeTab === "billing" && (
               <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
                 
                 <motion.div variants={itemVariants} className="bg-white/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/60 shadow-[inset_0_2px_15px_rgb(255,255,255,0.7),0_10px_30px_rgb(0,0,0,0.03)] overflow-hidden">
                   <div className="p-6 sm:p-8 md:p-10 border-b border-gray-100/50 bg-gradient-to-br from-white/40 to-transparent flex items-center gap-4">
                     <div className="p-3.5 bg-gradient-to-br from-emerald-400 to-[#0a9396] rounded-2xl shadow-lg shadow-teal-500/20 text-white shrink-0">
                       <CreditCard className="h-6 w-6" />
                     </div>
                     <div>
                       <h2 className="text-2xl font-black text-gray-900 tracking-tight">Licensing</h2>
                       <p className="text-gray-500 font-medium text-[14px] mt-1">Current plan and limits.</p>
                     </div>
                   </div>

                   <div className="p-6 sm:p-8 md:p-10 bg-white/20">
                     <div className="p-6 rounded-2xl border border-teal-200 bg-gradient-to-r from-teal-50/50 to-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                       <div>
                          <div className="flex items-center gap-3 mb-1">
                             <h4 className="font-black text-gray-900 text-xl tracking-tight">DigitalBOX Core</h4>
                             <Badge variant="primary" className="bg-gradient-to-r from-[#0a9396] to-teal-500 border-none font-bold text-[10px] uppercase tracking-wide px-2 shadow-sm pointer-events-none">Live</Badge>
                          </div>
                          <p className="text-[14px] font-semibold text-gray-500">Free starter plan.</p>
                          <p className="text-xs font-bold text-gray-400 mt-3 pt-3 border-t border-teal-100/50">Upgrade to unlock the full CRM, AI tools, and advanced reporting.</p>
                       </div>
                       <div className="flex gap-3 w-full md:w-auto">
                          <Button className="flex-1 md:flex-none h-11 px-6 rounded-xl bg-gradient-to-r from-[#0a9396] to-teal-500 hover:from-teal-500 hover:to-[#0a9396] text-white border-none shadow-lg shadow-teal-500/30 font-bold tracking-wide">
                            Upgrade Plan
                          </Button>
                       </div>
                     </div>
                   </div>
                 </motion.div>

                 <motion.div variants={itemVariants} className="bg-white/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/60 shadow-[inset_0_2px_15px_rgb(255,255,255,0.7),0_10px_30px_rgb(0,0,0,0.03)] overflow-hidden">
                   <div className="p-6 sm:p-8 md:p-10 border-b border-gray-100/50 bg-gradient-to-br from-white/40 to-transparent">
                     <h2 className="text-xl font-black text-gray-900 tracking-tight">Billing History</h2>
                     <p className="text-gray-500 font-medium text-[14px] mt-1">View your past payments and invoices.</p>
                   </div>
                   <div className="p-12 text-center bg-white/20">
                      <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-50 border border-gray-100 shadow-inner mb-4">
                        <CreditCard className="h-6 w-6 text-gray-300" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 tracking-tight mb-1">No Billing History</h3>
                      <p className="text-[14px] font-semibold text-gray-500 mb-6">No payments have been made yet.</p>
                      <Button variant="outline" className="rounded-xl h-11 px-6 font-bold tracking-wide border-gray-200">
                        Add Payment Method
                      </Button>
                   </div>
                 </motion.div>

               </motion.div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
