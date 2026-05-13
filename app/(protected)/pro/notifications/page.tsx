"use client";

import { useState, useEffect } from "react";
import { 
  Bell, 
  MessageSquare, 
  Briefcase, 
  Info, 
  Check, 
  Trash2, 
  Search,
  ChevronRight,
  Clock,
  Settings
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow, format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
      }
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ readAll: true }),
      });
      if (res.ok) {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
      }
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const deleteNotification = (id: string) => {
    // Note: The API doesn't have a delete method yet, so we'll just remove it from state for now
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "message": return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case "project": return <Briefcase className="h-5 w-5 text-emerald-500" />;
      case "system": return <Info className="h-5 w-5 text-orange-500" />;
      default: return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const filteredNotifications = notifications.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         n.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "all" || n.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            Notifications
            {unreadCount > 0 && (
              <Badge variant="primary" className="h-7 px-3 bg-[#0a9396] text-white border-none shadow-lg shadow-[#0a9396]/20">
                {unreadCount} NEW
              </Badge>
            )}
          </h1>
          <p className="text-gray-500 font-bold tracking-wide mt-1 text-[15px]">
            Manage your activity and important platform updates.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="rounded-xl font-bold tracking-wide text-sm border-gray-200 bg-white/60 backdrop-blur-sm"
          >
            <Check className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
        </div>
      </div>

      {/* Filters & Search Row */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-[#0a9396] transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-11 pr-4 py-3 bg-white/60 backdrop-blur-md border border-gray-200/60 rounded-2xl text-[15px] font-bold text-gray-900 placeholder-gray-400 focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 outline-none transition-all shadow-inner"
          />
        </div>
        <div className="flex items-center gap-2 bg-white/40 backdrop-blur-md border border-gray-200/60 p-1.5 rounded-2xl shadow-sm">
          {(["all", "message", "project", "system"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                filterType === type 
                  ? "bg-white text-gray-900 shadow-md border border-gray-100" 
                  : "text-gray-500 hover:text-gray-900 hover:bg-white/40"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white/40 backdrop-blur-3xl border border-white rounded-[2.5rem] shadow-[inset_0_2px_15px_rgb(255,255,255,0.7),0_10px_30px_rgb(0,0,0,0.03)] overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#0a9396] border-t-transparent" />
            <p className="text-xs font-black uppercase tracking-widest text-gray-400">Loading Alerts...</p>
          </div>
        ) : filteredNotifications.length > 0 ? (
          <div className="divide-y divide-gray-100/50">
            <AnimatePresence mode="popLayout">
              {filteredNotifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className={`group relative flex items-start gap-5 p-6 sm:p-8 transition-all hover:bg-white/60 ${
                    !notification.read ? "bg-[#0a9396]/5" : ""
                  }`}
                >
                  {/* Status Indicator Bar */}
                  {!notification.read && (
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-linear-to-b from-[#0a9396] to-teal-400 rounded-r-full shadow-[0_0_15px_rgba(10,147,150,0.3)]" />
                  )}

                  {/* Icon */}
                  <div className={`mt-0.5 flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.25rem] border transition-all ${
                    !notification.read 
                      ? "bg-white border-[#0a9396]/20 shadow-lg shadow-[#0a9396]/5 scale-105" 
                      : "bg-gray-50/50 border-gray-100"
                  }`}>
                    {getIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h3 className={`text-lg font-black tracking-tight leading-none ${!notification.read ? "text-gray-900" : "text-gray-600"}`}>
                        {notification.title}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Clock className="h-3.5 w-3.5" />
                        <span className="text-[11px] font-bold uppercase tracking-widest">
                          {format(new Date(notification.createdAt), "HH:mm")} • {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                    <p className={`text-[15px] font-medium leading-relaxed max-w-3xl ${!notification.read ? "text-gray-700" : "text-gray-500"}`}>
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center gap-4 pt-2">
                      {notification.link && (
                        <Link
                          href={notification.link}
                          className="px-4 py-2 rounded-xl bg-[#0a9396]/10 text-[#0a9396] text-[13px] font-black uppercase tracking-wider hover:bg-[#0a9396] hover:text-white transition-all flex items-center gap-2 group/link shadow-sm active:scale-95"
                          onClick={() => markAsRead(notification.id)}
                        >
                          View Details
                          <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
                        </Link>
                      )}
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-[12px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors"
                        >
                          Mark Read
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Actions Dropdown / Trash */}
                  <div className="flex flex-col gap-2">
                     <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-2.5 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                        title="Delete notification"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 px-8 text-center bg-linear-to-b from-white/40 to-transparent">
            <div className="mb-6 rounded-full bg-white p-6 shadow-xl shadow-gray-100 border border-gray-50">
              <Bell className="h-12 w-12 text-gray-200" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">You&apos;re all caught up!</h3>
            <p className="mt-2 text-gray-500 font-bold max-w-sm mx-auto">
              No notifications found matching your search criteria. Check back later for system updates.
            </p>
            {(searchQuery || filterType !== "all") && (
              <Button 
                variant="ghost" 
                onClick={() => { setSearchQuery(""); setFilterType("all"); }}
                className="mt-6 text-[#0a9396] font-bold"
              >
                Clear all filters
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Subscription Settings Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[#0a9396] to-[#005f73] p-8 text-white shadow-2xl shadow-[#0a9396]/20"
      >
        <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[150%] rounded-full bg-white/10 blur-[80px] pointer-events-none transform -rotate-45" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
              <Settings className="h-7 w-7 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight">Notification Settings</h3>
              <p className="text-white/80 font-medium text-sm mt-0.5">Customize how and when you receive platform alerts.</p>
            </div>
          </div>
          <Link href="/pro/settings">
            <Button className="bg-white text-[#0a9396] hover:bg-white/90 font-black px-6 h-12 rounded-xl shadow-lg shadow-black/10 border-none active:scale-95 transition-all">
              Manage Preferences
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
