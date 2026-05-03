"use client";

import { Bell, Check, ExternalLink, MessageSquare, Briefcase, Info } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications);
        setUnreadCount(data.notifications.filter((n: Notification) => !n.read).length);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    // Refresh notifications every minute
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
        setUnreadCount(prev => Math.max(0, prev - 1));
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
        setUnreadCount(0);
      }
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "message": return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case "project": return <Briefcase className="h-4 w-4 text-emerald-500" />;
      case "system": return <Info className="h-4 w-4 text-orange-500" />;
      default: return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative rounded-xl p-2.5 transition-all duration-200 ${
          isOpen ? "bg-[#0a9396]/10 text-[#0a9396] shadow-inner" : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
        }`}
      >
        <Bell className={`h-5 w-5 ${unreadCount > 0 ? "animate-wiggle" : ""}`} />
        {unreadCount > 0 && (
          <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white shadow-sm">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 mt-3 w-80 sm:w-96 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-50 bg-gray-50/50 px-5 py-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
                <p className="text-[11px] text-gray-500 font-medium">You have {unreadCount} unread alerts</p>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-1.5 text-[11px] font-bold text-[#0a9396] hover:text-[#087579] transition-colors"
                >
                  <Check className="h-3 w-3" />
                  Mark all as read
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-[400px] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-200">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#0a9396] border-t-transparent" />
                </div>
              ) : notifications.length > 0 ? (
                <div className="divide-y divide-gray-50">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`group relative flex gap-4 px-5 py-4 transition-all hover:bg-gray-50/80 ${
                        !notification.read ? "bg-[#0a9396]/5" : ""
                      }`}
                    >
                      <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-all ${
                        !notification.read 
                          ? "bg-white border-[#0a9396]/20 shadow-sm scale-110" 
                          : "bg-gray-50 border-gray-100"
                      }`}>
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className={`text-sm font-bold leading-tight ${!notification.read ? "text-gray-900" : "text-gray-600"}`}>
                            {notification.title}
                          </h4>
                          <span className="text-[10px] font-medium text-gray-400 whitespace-nowrap">
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                        <p className={`text-xs leading-relaxed ${!notification.read ? "text-gray-700" : "text-gray-400"}`}>
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-3 pt-1">
                          {notification.link && (
                            <Link
                              href={notification.link}
                              className="text-[11px] font-bold text-[#0a9396] hover:underline flex items-center gap-1"
                              onClick={() => {
                                markAsRead(notification.id);
                                setIsOpen(false);
                              }}
                            >
                              View details
                              <ExternalLink className="h-2.5 w-2.5" />
                            </Link>
                          )}
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-[11px] font-bold text-gray-400 hover:text-gray-900 transition-colors"
                            >
                              Dismiss
                            </button>
                          )}
                        </div>
                      </div>
                      {!notification.read && (
                        <div className="absolute left-1.5 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-[#0a9396] shadow-[0_0_8px_rgba(10,147,150,0.5)]" />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
                  <div className="mb-4 rounded-full bg-gray-50 p-4">
                    <Bell className="h-8 w-8 text-gray-200" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-900">All caught up!</h4>
                  <p className="mt-1 text-xs text-gray-400">
                    No new notifications at the moment.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="border-t border-gray-50 bg-gray-50/50 p-3">
                <Link
                  href="/notifications"
                  onClick={() => setIsOpen(false)}
                  className="block w-full rounded-xl py-2 text-center text-xs font-bold text-gray-500 hover:bg-white hover:text-gray-900 transition-all border border-transparent hover:border-gray-100 hover:shadow-sm"
                >
                  View all notifications
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(0); }
          25% { transform: rotate(10deg); }
          75% { transform: rotate(-10deg); }
        }
        .animate-wiggle {
          animation: wiggle 0.5s ease-in-out infinite alternate;
          animation-iteration-count: 2;
        }
      `}</style>
    </div>
  );
}
