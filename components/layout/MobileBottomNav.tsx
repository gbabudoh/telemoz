"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  FolderKanban, 
  MessageSquare, 
  Settings,
  TrendingUp,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileBottomNavProps {
  userType?: "pro" | "client" | "admin";
}

export function MobileBottomNav({ userType = "pro" }: MobileBottomNavProps) {
  const pathname = usePathname();

  const proTabs = [
    { label: "Home", href: "/pro", icon: LayoutDashboard },
    { label: "Work", href: "/pro/projects", icon: FolderKanban },
    { label: "Hub", href: "/pro/messaging", icon: MessageSquare },
    { label: "Inbox", href: "/pro/inbox", icon: Mail },
    { label: "Settings", href: "/pro/settings", icon: Settings },
  ];

  const clientTabs = [
    { label: "Home", href: "/client", icon: LayoutDashboard },
    { label: "Reports", href: "/client/reports", icon: TrendingUp },
    { label: "Hub", href: "/client/messaging", icon: MessageSquare },
    { label: "Inbox", href: "/client/inbox", icon: Mail },
    { label: "Settings", href: "/client/settings", icon: Settings },
  ];

  const tabs = userType === "client" ? clientTabs : proTabs;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-2 pointer-events-none">
      <nav className="mx-auto max-w-lg bg-white/80 backdrop-blur-2xl border border-white/40 shadow-[0_8px_32px_rgb(0,0,0,0.1)] rounded-4xl flex items-center justify-around p-2 pointer-events-auto relative overflow-hidden h-18">
        {/* Subtle internal glow */}
        <div className="absolute inset-0 bg-linear-to-t from-[#0a9396]/5 to-transparent pointer-events-none" />

        {tabs.map((tab) => {
          const isActive = tab.href === "/pro" || tab.href === "/client" 
            ? pathname === tab.href 
            : pathname.startsWith(tab.href);
          const Icon = tab.icon;

          return (
            <Link key={tab.href} href={tab.href} className="flex-1">
              <div className="relative flex flex-col items-center justify-center gap-1 transition-all">
                {isActive && (
                  <motion.div
                    layoutId="active-nav-pill"
                    className="absolute -top-1 w-12 h-1 bg-[#0a9396] rounded-full shadow-[0_0_8px_rgba(10,147,150,0.4)]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                
                <div className={cn(
                  "p-2 rounded-xl transition-all duration-300 relative",
                  isActive ? "text-[#0a9396] scale-110" : "text-gray-400"
                )}>
                  {isActive && (
                    <motion.div 
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute inset-0 bg-[#0a9396]/10 rounded-xl" 
                    />
                  )}
                  <Icon className="h-5 w-5 relative z-10" />
                </div>
                
                <span className={cn(
                  "text-[10px] font-bold tracking-tight transition-colors duration-300",
                  isActive ? "text-[#0a9396]" : "text-gray-400"
                )}>
                  {tab.label}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>
      
      {/* Safe Area Spacer for iOS/Android bottom indicators */}
      <div className="h-[safe-area-inset-bottom]" />
    </div>
  );
}
