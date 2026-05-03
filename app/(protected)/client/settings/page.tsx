"use client";

import { Badge } from "@/components/ui/Badge";
import {
  Settings,
  User,
  Bell,
  Shield,
  CreditCard,
  Mail,
  Eye,
  EyeOff,
  Save,
  Trash2,
  LogOut,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { countriesByRegion, regions } from "@/lib/countries";
import { DeleteAccountModal } from "@/components/settings/DeleteAccountModal";

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

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch("/api/user/delete", { method: "DELETE" });
      if (response.ok) {
        await signOut({ callbackUrl: "/" });
      }
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

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
          setNotifications({
            emailNotifications: data.user.emailNotifications ?? true,
            projectUpdates: data.user.projectUpdates ?? true,
            reportReady: data.user.reportReady ?? true,
            proMessages: data.user.proMessages ?? true,
            marketingEmails: data.user.marketingEmails ?? false,
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

  const showFeedback = (success: boolean, error?: string) => {
    setSaveSuccess(false);
    setSaveError("");
    if (success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } else {
      setSaveError(error ?? "Something went wrong. Please try again.");
    }
  };

  const handleSaveAccountInfo = async () => {
    if (!formData.name || !formData.email) {
      setSaveError("Name and email are required.");
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
        showFeedback(true);
      } else {
        const data = await response.json();
        showFeedback(false, data.error || "Failed to update account information.");
      }
    } catch {
      showFeedback(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    setIsLoading(true);
    setSaveError("");
    setSaveSuccess(false);
    try {
      const response = await fetch("/api/user/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...notifications
        }),
      });

      if (response.ok) {
        showFeedback(true);
      } else {
        const data = await response.json();
        showFeedback(false, data.error || "Failed to save notification preferences.");
      }
    } catch {
      showFeedback(false, "Failed to save notification preferences.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePassword = async () => {
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setSaveError("All password fields are required.");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setSaveError("New passwords do not match.");
      return;
    }
    if (formData.newPassword.length < 8) {
      setSaveError("Password must be at least 8 characters.");
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
        setFormData({ ...formData, currentPassword: "", newPassword: "", confirmPassword: "" });
        showFeedback(true);
      } else {
        const data = await response.json();
        showFeedback(false, data.error || "Failed to update password.");
      }
    } catch {
      showFeedback(false);
    } finally {
      setIsLoading(false);
    }
  };

  const panelClass = "bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl shadow-sm";

  const FeedbackBanner = ({ success, error }: { success: boolean; error: string }) => (
    <AnimatePresence>
      {success && (
        <motion.div
          key="success"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="flex items-center gap-2.5 p-3.5 bg-[#6ece39]/10 border border-[#6ece39]/20 rounded-xl text-[#5ab830] text-sm"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Saved successfully.
        </motion.div>
      )}
      {error && (
        <motion.div
          key="error"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="flex items-center gap-2.5 p-3.5 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </motion.div>
      )}
    </AnimatePresence>
  );

  const SaveButton = ({ onClick, label }: { onClick: () => void; label: string }) => (
    <div className="flex justify-end pt-2">
      <button
        onClick={onClick}
        disabled={isLoading}
        className="h-11 px-8 rounded-xl bg-[#0a9396] hover:bg-[#087579] text-white font-semibold text-sm shadow-sm transition-all cursor-pointer flex items-center gap-2 disabled:opacity-60"
      >
        {isLoading ? (
          <><Loader2 className="h-4 w-4 animate-spin" />Saving...</>
        ) : (
          <><Save className="h-4 w-4" />{label}</>
        )}
      </button>
    </div>
  );

  const inputClass = "w-full bg-white border border-gray-200 px-4 py-3 rounded-xl text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#0a9396]/20 focus:border-[#0a9396]/40 transition-all placeholder:text-gray-300";
  const labelClass = "block text-xs font-medium text-gray-600 mb-1.5";

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-7 w-7 animate-spin text-[#0a9396]" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-transparent">
      {/* Ambient orbs */}
      <div className="fixed top-[-5%] left-[-10%] w-[45%] h-[45%] rounded-full bg-[#0a9396]/10 blur-[130px] pointer-events-none mix-blend-multiply animate-pulse z-0" />
      <div className="fixed top-[15%] right-[-5%] w-[40%] h-[40%] rounded-full bg-[#6ece39]/8 blur-[140px] pointer-events-none mix-blend-multiply z-0" />
      <div className="fixed bottom-[-5%] left-[15%] w-[50%] h-[40%] rounded-full bg-[#0a9396]/8 blur-[130px] pointer-events-none mix-blend-multiply opacity-60 animate-pulse z-0" />

      <div className="space-y-6 relative z-10 max-w-[1200px] mx-auto pb-16 pt-2">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={panelClass}
        >
          <div className="p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                <div className="p-3.5 rounded-2xl bg-[#0a9396]/10 border border-[#0a9396]/20 shrink-0">
                  <Settings className="h-7 w-7 text-[#0a9396]" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Account Settings</h1>
                  <p className="text-sm text-gray-500 mt-0.5">Manage your profile, notifications, and billing.</p>
                </div>
              </div>
              <button
                onClick={() => signOut()}
                className="h-10 px-5 rounded-xl border border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-900 font-medium text-sm transition-all cursor-pointer flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tab nav */}
        <div className={`${panelClass} p-1.5 max-w-fit`}>
          <div className="flex flex-wrap items-center gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setSaveSuccess(false); setSaveError(""); }}
                  className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all text-sm font-medium cursor-pointer overflow-hidden ${
                    isActive ? "text-white" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabBg"
                      className="absolute inset-0 bg-[#0a9396] z-0"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <Icon className="relative z-10 h-4 w-4" />
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18 }}
        >

          {/* Account */}
          {activeTab === "account" && (
            <div className={`${panelClass} p-6 lg:p-8`}>
              <div className="flex items-center gap-3 mb-7">
                <div className="p-2.5 rounded-xl bg-[#0a9396]/10 border border-[#0a9396]/20">
                  <User className="h-5 w-5 text-[#0a9396]" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">Profile Information</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Update your personal details and location.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                {[
                  { label: "Full Name", value: formData.name, key: "name", type: "text", placeholder: "Your full name" },
                  { label: "Email Address", value: formData.email, key: "email", type: "email", placeholder: "you@example.com" },
                  { label: "Phone Number", value: formData.phone, key: "phone", type: "tel", placeholder: "+44 000 000 000" },
                  { label: "Company", value: formData.company, key: "company", type: "text", placeholder: "Your company name" },
                ].map((field) => (
                  <div key={field.key}>
                    <label className={labelClass}>{field.label}</label>
                    <input
                      type={field.type}
                      value={field.value}
                      onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                      placeholder={field.placeholder}
                      className={inputClass}
                    />
                  </div>
                ))}

                <div>
                  <label className={labelClass}>Country</label>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className={`${inputClass} appearance-none cursor-pointer`}
                  >
                    <option value="">Select country</option>
                    {regions.map((region) => (
                      <optgroup key={region} label={region}>
                        {countriesByRegion[region].map((country) => (
                          <option key={country.id} value={country.name}>{country.name}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>City</label>
                  <input
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Your city"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Timezone</label>
                  <select
                    value={formData.timezone}
                    onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                    className={`${inputClass} appearance-none cursor-pointer`}
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

              <FeedbackBanner success={saveSuccess} error={saveError} />
              <SaveButton onClick={handleSaveAccountInfo} label="Save Changes" />
            </div>
          )}

          {/* Notifications */}
          {activeTab === "notifications" && (
            <div className={`${panelClass} p-6 lg:p-8`}>
              <div className="flex items-center gap-3 mb-7">
                <div className="p-2.5 rounded-xl bg-[#0a9396]/10 border border-[#0a9396]/20">
                  <Bell className="h-5 w-5 text-[#0a9396]" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">Notification Preferences</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Choose what you want to be notified about.</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {[
                  { id: "emailNotifications", label: "Email Notifications", desc: "Receive important account updates by email" },
                  { id: "projectUpdates", label: "Project Updates", desc: "Get notified when your projects are updated" },
                  { id: "reportReady", label: "Report Ready", desc: "Notify me when a new report is available" },
                  { id: "proMessages", label: "Messages from Pros", desc: "Receive messages from your marketing professionals" },
                  { id: "marketingEmails", label: "Marketing Emails", desc: "Occasional updates about Telemoz features and news" },
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50/80 border border-gray-100 hover:bg-white transition-all">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4">
                      <input
                        type="checkbox"
                        checked={notifications[item.id as keyof typeof notifications]}
                        onChange={(e) => setNotifications({ ...notifications, [item.id]: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#0a9396]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0a9396]" />
                    </label>
                  </div>
                ))}
              </div>

              <FeedbackBanner success={saveSuccess} error={saveError} />
              <SaveButton onClick={handleSaveNotifications} label="Save Preferences" />
            </div>
          )}

          {/* Security */}
          {activeTab === "security" && (
            <div className={`${panelClass} p-6 lg:p-8`}>
              <div className="flex items-center gap-3 mb-7">
                <div className="p-2.5 rounded-xl bg-[#0a9396]/10 border border-[#0a9396]/20">
                  <Shield className="h-5 w-5 text-[#0a9396]" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">Change Password</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Update your account password.</p>
                </div>
              </div>

              <div className="space-y-5 mb-6">
                <div>
                  <label className={labelClass}>Current Password <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.currentPassword}
                      onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                      placeholder="Enter your current password"
                      className={`${inputClass} pr-11`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>New Password <span className="text-red-400">*</span></label>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.newPassword}
                      onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                      placeholder="At least 8 characters"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Confirm New Password <span className="text-red-400">*</span></label>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="Repeat new password"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              <FeedbackBanner success={saveSuccess} error={saveError} />
              <SaveButton onClick={handleSavePassword} label="Update Password" />
            </div>
          )}

          {/* Billing */}
          {activeTab === "billing" && (
            <div className={`${panelClass} p-6 lg:p-8`}>
              <div className="flex items-center gap-3 mb-7">
                <div className="p-2.5 rounded-xl bg-[#0a9396]/10 border border-[#0a9396]/20">
                  <CreditCard className="h-5 w-5 text-[#0a9396]" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">Billing</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Manage your payment methods and billing history.</p>
                </div>
              </div>

              {/* Plan info */}
              <div className="p-6 bg-linear-to-br from-[#0a9396]/8 to-[#6ece39]/8 border border-[#0a9396]/20 rounded-2xl mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-white rounded-xl border border-gray-100 shadow-sm">
                      <CreditCard className="h-5 w-5 text-[#0a9396]" />
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-gray-900">Telemoz Marketplace</h4>
                      <p className="text-xs text-[#0a9396] mt-0.5">Free client access</p>
                    </div>
                  </div>
                  <Badge className="bg-[#6ece39] text-white border-none text-[10px] font-medium px-2.5">Active</Badge>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed mb-5">
                  As a client, you don&apos;t pay a subscription fee. Telemoz charges a <span className="text-[#0a9396] font-medium">10% commission</span> on payments to professionals, deducted before funds are released.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {["No Subscription Fee", "Secure Escrow", "Payment Protection"].map((benefit) => (
                    <div key={benefit} className="flex items-center gap-2.5 p-3 bg-white/70 rounded-xl border border-white shadow-sm">
                      <CheckCircle2 className="h-4 w-4 text-[#0a9396] shrink-0" />
                      <span className="text-xs font-medium text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Methods</h4>
                  <div className="p-8 bg-gray-50/80 border border-gray-100 rounded-xl flex flex-col items-center justify-center text-center gap-4">
                    <p className="text-sm text-gray-400">No payment methods added</p>
                    <button className="h-10 px-5 rounded-xl bg-[#0a9396] hover:bg-[#087579] text-white font-medium text-sm shadow-sm border-none transition-all flex items-center gap-2 cursor-pointer">
                      <CreditCard className="h-4 w-4" />
                      Add Payment Method
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction History</h4>
                  <div className="p-8 bg-gray-50/80 border border-gray-100 rounded-xl flex flex-col items-center justify-center text-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-400">No transactions yet</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </motion.div>

        {/* Danger zone */}
        <div className="bg-white/60 backdrop-blur-xl border border-red-200/60 rounded-2xl shadow-sm">
          <div className="p-6 lg:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-50 rounded-xl border border-red-100 shrink-0">
                <Trash2 className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">Delete Account</h3>
                <p className="text-xs text-red-500 font-medium mt-0.5">Danger Zone</p>
                <p className="text-sm text-gray-500 mt-1 max-w-md">
                  Permanently delete your account and all associated data. This cannot be undone.
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsDeleteModalOpen(true)}
              className="h-11 px-6 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium text-sm shadow-sm border-none transition-all cursor-pointer flex items-center gap-2 shrink-0"
            >
              <Trash2 className="h-4 w-4" />
              Delete Account
            </button>
          </div>
        </div>

        <DeleteAccountModal 
          isOpen={isDeleteModalOpen} 
          onClose={() => setIsDeleteModalOpen(false)} 
          onConfirm={handleDeleteAccount}
        />

      </div>
    </div>
  );
}
