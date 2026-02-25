"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  FileText,
  BarChart3,
  Settings,
  Zap,
  MessageSquare,
  Briefcase,
  TrendingUp,
  Menu,
  X,
  LogOut,
  Store,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

interface DashboardSidebarProps {
  userType?: "pro" | "client" | "admin";
}

const proNavItems: NavItem[] = [
  { title: "Overview", href: "/pro", icon: LayoutDashboard },
  { title: "Projects", href: "/pro/projects", icon: FolderKanban },
  { title: "CRM", href: "/pro/digitalbox/crm", icon: Users },
  { title: "Invoicing", href: "/pro/digitalbox/invoicing", icon: FileText },
  { title: "AI Tools", href: "/pro/digitalbox/ai-tools", icon: Zap, badge: "New" },
  { title: "Reporting", href: "/pro/digitalbox/reporting", icon: BarChart3 },
  { title: "Marketplace", href: "/marketplace", icon: Store },
  { title: "Inquiries", href: "/pro/marketplace/inquiries", icon: MessageSquare },
  { title: "Settings", href: "/pro/settings", icon: Settings },
];

const clientNavItems: NavItem[] = [
  { title: "Dashboard", href: "/client", icon: LayoutDashboard },
  { title: "My Pros", href: "/client/my-pros", icon: Briefcase },
  { title: "Projects", href: "/client/projects", icon: FolderKanban },
  { title: "Reports", href: "/client/reports", icon: TrendingUp },
  { title: "Marketplace", href: "/marketplace", icon: Store },
  { title: "Messages", href: "/messaging", icon: MessageSquare },
  { title: "Settings", href: "/client/settings", icon: Settings },
];

const adminNavItems: NavItem[] = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Users", href: "/admin/users", icon: Users },
  { title: "Projects", href: "/admin/projects", icon: FolderKanban },
  { title: "Transactions", href: "/admin/transactions", icon: CreditCard },
  { title: "Reports", href: "/admin/reports", icon: BarChart3 },
  { title: "Settings", href: "/admin/settings", icon: Settings },
];

export function DashboardSidebar({ userType = "pro" }: DashboardSidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const navItems =
    userType === "pro"
      ? proNavItems
      : userType === "client"
        ? clientNavItems
        : adminNavItems;

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/login");
    router.refresh();
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 rounded-lg bg-white border border-gray-200 text-gray-900 shadow-sm cursor-pointer"
        >
          {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 backdrop-blur-lg border-r shadow-sm transition-transform duration-300",
          "bg-gradient-to-br from-gray-50 via-white to-gray-50/50 border-gray-200",
          "lg:translate-x-0 lg:static lg:z-auto lg:block",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          !isMobileOpen && "hidden lg:block"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b border-gray-200 px-6">
            <Link href="/" className="flex items-center gap-2">
              <Image 
                src="/logos/telemoz.png" 
                alt="Telemoz" 
                width={120}
                height={40}
                priority
                quality={100}
                className="h-10 w-auto object-contain cursor-pointer"
                style={{ imageRendering: 'crisp-edges' }}
              />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => {
              const isRootPath = item.href === `/${userType}` || item.href === `/${userType === 'admin' ? 'admin' : userType === 'client' ? 'client' : 'pro'}`;
              const isActive = isRootPath
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = item.icon;

              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all cursor-pointer",
                      isActive
                        ? "bg-[#0a9396]/10 text-[#0a9396] border border-[#0a9396]/30"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="flex-1">{item.title}</span>
                    {item.badge && (
                      <span className="rounded-full bg-[#0a9396]/20 px-2 py-0.5 text-xs text-[#0a9396]">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4">
            <button 
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
        />
      )}
    </>
  );
}

