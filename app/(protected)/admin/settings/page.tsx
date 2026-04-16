"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Settings,
  Shield,
  Database,
  AlertTriangle,
  Save,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

interface SettingsState {
  commissionRate: number;
  platformName: string;
  supportEmail: string;
  maxFileSize: number;
  enableRegistration: boolean;
  requireEmailVerification: boolean;
}

function Toggle({
  checked,
  onChange,
  id,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  id: string;
}) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#0a9396]/40 focus:ring-offset-2 ${
        checked ? "bg-[#0a9396]" : "bg-gray-200"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-200 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export default function AdminSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [settings, setSettings] = useState<SettingsState>({
    commissionRate: 13,
    platformName: "Telemoz",
    supportEmail: "support@telemoz.com",
    maxFileSize: 10,
    enableRegistration: true,
    requireEmailVerification: true,
  });

  const update = <K extends keyof SettingsState>(
    key: K,
    value: SettingsState[K]
  ) => setSettings((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus("idle");
    try {
      // Replace with real API call when ready
      await new Promise((resolve) => setTimeout(resolve, 600));
      setSaveStatus("success");
    } catch {
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus("idle"), 4000);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          System Settings
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">
          Configure platform-wide settings and preferences
        </p>
      </motion.div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="rounded-lg bg-[#0a9396]/10 p-1.5">
              <Settings className="h-4 w-4 text-[#0a9396]" />
            </div>
            General Settings
          </CardTitle>
          <CardDescription>Basic platform configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="platformName"
                className="block text-sm font-medium text-gray-900 mb-1.5"
              >
                Platform Name
              </label>
              <Input
                id="platformName"
                value={settings.platformName}
                onChange={(e) => update("platformName", e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="supportEmail"
                className="block text-sm font-medium text-gray-900 mb-1.5"
              >
                Support Email
              </label>
              <Input
                id="supportEmail"
                type="email"
                value={settings.supportEmail}
                onChange={(e) => update("supportEmail", e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="commissionRate"
                className="block text-sm font-medium text-gray-900 mb-1.5"
              >
                Commission Rate (%)
              </label>
              <Input
                id="commissionRate"
                type="number"
                value={settings.commissionRate}
                onChange={(e) =>
                  update("commissionRate", parseFloat(e.target.value) || 0)
                }
                min={0}
                max={100}
              />
              <p className="text-xs text-gray-400 mt-1">
                Applied to all completed payments
              </p>
            </div>
            <div>
              <label
                htmlFor="maxFileSize"
                className="block text-sm font-medium text-gray-900 mb-1.5"
              >
                Max File Upload Size (MB)
              </label>
              <Input
                id="maxFileSize"
                type="number"
                value={settings.maxFileSize}
                onChange={(e) =>
                  update("maxFileSize", parseFloat(e.target.value) || 0)
                }
                min={1}
                max={100}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="rounded-lg bg-[#0a9396]/10 p-1.5">
              <Shield className="h-4 w-4 text-[#0a9396]" />
            </div>
            Security Settings
          </CardTitle>
          <CardDescription>Platform access and account controls</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              id: "enableRegistration",
              key: "enableRegistration" as const,
              title: "Enable User Registration",
              description: "Allow new users to register accounts on the platform",
            },
            {
              id: "requireEmailVerification",
              key: "requireEmailVerification" as const,
              title: "Require Email Verification",
              description:
                "Users must verify their email before accessing the platform",
            },
          ].map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 rounded-lg border border-gray-100 bg-gray-50/50"
            >
              <div className="flex-1 mr-4">
                <p className="text-sm font-medium text-gray-900">{item.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
              </div>
              <Toggle
                id={item.id}
                checked={settings[item.key]}
                onChange={(v) => update(item.key, v)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="rounded-lg bg-[#0a9396]/10 p-1.5">
              <Database className="h-4 w-4 text-[#0a9396]" />
            </div>
            System Status
          </CardTitle>
          <CardDescription>Live platform health indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: "Database", status: "Connected", ok: true },
              { label: "Platform", status: "Operational", ok: true },
              { label: "API Server", status: "Running", ok: true },
              { label: "Email Service", status: "Active", ok: true },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50/50"
              >
                <span className="text-sm font-medium text-gray-700">
                  {item.label}
                </span>
                <span
                  className={`flex items-center gap-1.5 text-xs font-semibold ${
                    item.ok ? "text-emerald-700" : "text-red-600"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      item.ok ? "bg-emerald-500 animate-pulse" : "bg-red-500"
                    }`}
                  />
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Save Controls */}
      <div className="flex items-center justify-between">
        {saveStatus === "success" && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-sm font-medium text-emerald-700"
          >
            <CheckCircle2 className="h-4 w-4" />
            Settings saved successfully
          </motion.div>
        )}
        {saveStatus === "error" && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-sm font-medium text-red-600"
          >
            <XCircle className="h-4 w-4" />
            Failed to save — please try again
          </motion.div>
        )}
        {saveStatus === "idle" && <div />}

        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[#0a9396] hover:bg-[#087579] text-white"
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </>
          )}
        </Button>
      </div>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base text-red-700">
            <AlertTriangle className="h-4 w-4" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible and destructive actions — use with extreme caution
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            {
              title: "Clear All Data",
              description:
                "Permanently delete all users, projects, and transactions",
            },
            {
              title: "Reset Platform",
              description: "Restore all settings to factory defaults",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-center justify-between p-4 rounded-lg bg-red-50 border border-red-100"
            >
              <div>
                <p className="text-sm font-semibold text-red-900">
                  {item.title}
                </p>
                <p className="text-xs text-red-600 mt-0.5">{item.description}</p>
              </div>
              <Button
                size="sm"
                disabled
                className="bg-red-600 hover:bg-red-700 text-white opacity-50 cursor-not-allowed"
              >
                {item.title.split(" ")[0]}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
