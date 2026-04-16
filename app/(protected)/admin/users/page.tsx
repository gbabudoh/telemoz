"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import {
  Search,
  Users,
  Eye,
  Trash2,
  Shield,
  UserCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  UserPlus,
  Download,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface User {
  _id: string;
  name: string;
  email: string;
  userType: "pro" | "client" | "admin";
  country?: string;
  city?: string;
  createdAt: string;
  subscriptionStatus?: string;
}

const USER_TYPE_CONFIG = {
  pro: {
    label: "Professional",
    badgeVariant: "info" as const,
    avatarBg: "from-[#0a9396] to-cyan-400",
  },
  client: {
    label: "Client",
    badgeVariant: "success" as const,
    avatarBg: "from-emerald-500 to-green-400",
  },
  admin: {
    label: "Admin",
    badgeVariant: "primary" as const,
    avatarBg: "from-indigo-500 to-violet-400",
  },
};

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState<string>("all");
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/admin/users");
        if (response.ok) {
          const data = await response.json();
          setUsers(data.users || []);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user?.userType === "admin") {
      fetchUsers();
    }
  }, [session]);

  const counts = {
    all: users.length,
    pro: users.filter((u) => u.userType === "pro").length,
    client: users.filter((u) => u.userType === "client").length,
    admin: users.filter((u) => u.userType === "admin").length,
    active: users.filter((u) => u.subscriptionStatus === "active").length,
  };

  const filteredUsers = users.filter((user) => {
    const name = user.name ?? "";
    const email = user.email ?? "";
    const matchesSearch =
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      userTypeFilter === "all" || user.userType === userTypeFilter;
    return matchesSearch && matchesType;
  });

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/users/${deleteTarget._id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setUsers((prev) => prev.filter((u) => u._id !== deleteTarget._id));
        showNotification("success", `${deleteTarget.name} has been deleted.`);
      } else {
        showNotification("error", "Failed to delete user. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      showNotification("error", "An error occurred. Please try again.");
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const filterTabs = [
    { key: "all", label: "All", count: counts.all },
    { key: "pro", label: "Pros", count: counts.pro },
    { key: "client", label: "Clients", count: counts.client },
    { key: "admin", label: "Admins", count: counts.admin },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a9396] mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => !isDeleting && setDeleteTarget(null)}
        title="Delete User"
        size="sm"
        variant="light"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-100 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-900">
                This action cannot be undone.
              </p>
              <p className="text-xs text-red-700 mt-0.5">
                All data for <strong>{deleteTarget?.name}</strong> will be
                permanently removed from the platform.
              </p>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteTarget(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white border-red-600"
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white mr-2" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                  Delete User
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Inline Notification */}
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-2 p-3 rounded-lg text-sm font-medium border ${
            notification.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <XCircle className="h-4 w-4 shrink-0" />
          )}
          {notification.message}
        </motion.div>
      )}

      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            User Management
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Manage all platform users — Pros, Clients, and Admins
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm">
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Export
          </Button>
          <Button
            size="sm"
            className="bg-[#0a9396] hover:bg-[#087579] text-white"
          >
            <UserPlus className="h-3.5 w-3.5 mr-1.5" />
            Invite User
          </Button>
        </div>
      </motion.div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Users",
            value: counts.all,
            sub: `${counts.active} active`,
            icon: Users,
            iconBg: "bg-[#0a9396]/10",
            iconColor: "text-[#0a9396]",
            accent: "border-l-[#0a9396]",
          },
          {
            label: "Professionals",
            value: counts.pro,
            sub: "Registered pros",
            icon: UserCheck,
            iconBg: "bg-cyan-100",
            iconColor: "text-cyan-600",
            accent: "border-l-cyan-500",
          },
          {
            label: "Clients",
            value: counts.client,
            sub: "Platform clients",
            icon: Users,
            iconBg: "bg-emerald-100",
            iconColor: "text-emerald-600",
            accent: "border-l-emerald-500",
          },
          {
            label: "Admins",
            value: counts.admin,
            sub: "Admin accounts",
            icon: Shield,
            iconBg: "bg-indigo-100",
            iconColor: "text-indigo-600",
            accent: "border-l-indigo-500",
          },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <Card className={`border-l-4 ${stat.accent}`}>
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 tabular-nums">
                        {stat.value}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
                    </div>
                    <div className={`rounded-xl ${stat.iconBg} p-2.5`}>
                      <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Table Card — search + filter + table unified */}
      <Card>
        {/* Card toolbar */}
        <CardHeader className="border-b border-gray-100 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Filter tabs with counts */}
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1 shrink-0">
              {filterTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setUserTypeFilter(tab.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    userTypeFilter === tab.key
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                  <span
                    className={`tabular-nums rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                      userTypeFilter === tab.key
                        ? "bg-[#0a9396]/10 text-[#0a9396]"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Result count */}
            <p className="text-xs text-gray-400 whitespace-nowrap shrink-0">
              {filteredUsers.length}{" "}
              {filteredUsers.length === 1 ? "result" : "results"}
            </p>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-16">
              <div className="rounded-full bg-gray-100 p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-7 w-7 text-gray-400" />
              </div>
              <p className="text-gray-700 font-medium">No users found</p>
              <p className="text-gray-400 text-xs mt-1">
                Try adjusting your search or selecting a different filter
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wide text-left">
                      User
                    </th>
                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide text-left">
                      Type
                    </th>
                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide text-left hidden md:table-cell">
                      Location
                    </th>
                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide text-left hidden sm:table-cell">
                      Joined
                    </th>
                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide text-left">
                      Status
                    </th>
                    <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredUsers.map((user, index) => {
                    const config =
                      USER_TYPE_CONFIG[user.userType] ||
                      USER_TYPE_CONFIG.client;
                    const name = user.name || "Unknown";
                    const isActive = user.subscriptionStatus === "active";

                    return (
                      <motion.tr
                        key={user._id ?? index}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.035 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        {/* User */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div
                              className={`h-9 w-9 rounded-full bg-gradient-to-br ${config.avatarBg} flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm`}
                            >
                              {name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-900 text-sm truncate">
                                {name}
                              </p>
                              <p className="text-xs text-gray-400 truncate">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Type */}
                        <td className="py-4 px-4">
                          <Badge variant={config.badgeVariant} size="sm">
                            {config.label}
                          </Badge>
                        </td>

                        {/* Location */}
                        <td className="py-4 px-4 hidden md:table-cell">
                          <p className="text-sm text-gray-500">
                            {user.city && user.country
                              ? `${user.city}, ${user.country}`
                              : "—"}
                          </p>
                        </td>

                        {/* Joined */}
                        <td className="py-4 px-4 hidden sm:table-cell">
                          <p className="text-sm text-gray-500">
                            {user.createdAt
                              ? new Date(user.createdAt).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )
                              : "—"}
                          </p>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                              isActive
                                ? "text-emerald-700"
                                : "text-gray-500"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                                isActive
                                  ? "bg-emerald-500"
                                  : "bg-gray-300"
                              }`}
                            />
                            {isActive ? "Active" : "Inactive"}
                          </span>
                        </td>

                        {/* Actions — always visible */}
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2.5 text-xs text-gray-500 hover:text-gray-900 hover:bg-gray-100 gap-1.5"
                              title="View user"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">View</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2.5 text-xs text-red-400 hover:text-red-600 hover:bg-red-50 gap-1.5"
                              onClick={() => setDeleteTarget(user)}
                              title="Delete user"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">Delete</span>
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>

        {/* Table footer */}
        {filteredUsers.length > 0 && (
          <div className="border-t border-gray-100 px-6 py-3 flex items-center justify-between bg-gray-50/50">
            <p className="text-xs text-gray-400">
              Showing{" "}
              <span className="font-semibold text-gray-700">
                {filteredUsers.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-700">{users.length}</span>{" "}
              users
            </p>
            <p className="text-xs text-gray-400">
              {counts.active} active ·{" "}
              {users.length - counts.active} inactive
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
