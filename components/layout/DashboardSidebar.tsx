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
  Mail,
  Briefcase,
  TrendingUp,
  Menu,
  X,
  LogOut,
  Store,
  CreditCard,
  FilePenLine,
  FileCheck2,
  RefreshCw,
  Clock,
  Megaphone,
  CalendarDays,
  FolderOpen,
  SendHorizonal,
  ClipboardList,
  ChevronDown,
  ChevronRight,
  Users2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

interface NavGroup {
  label: string;
  items: NavItem[];
  defaultOpen?: boolean;
}

interface DashboardSidebarProps {
  userType?: "pro" | "client" | "admin";
}

const proNavGroups: NavGroup[] = [
  {
    label: "Core",
    defaultOpen: true,
    items: [
      { title: "Overview", href: "/pro", icon: LayoutDashboard },
      { title: "Inquiries", href: "/pro/inquiries", icon: MessageSquare },
      { title: "Messaging", href: "/pro/messaging", icon: Mail },
    ],
  },
  {
    label: "Work",
    defaultOpen: true,
    items: [
      { title: "Projects", href: "/pro/projects", icon: FolderKanban },
      { title: "Proposals", href: "/pro/digitalbox/proposals", icon: FileText },
      { title: "Contracts", href: "/pro/digitalbox/contracts", icon: FilePenLine },
    ],
  },
  {
    label: "Clients & Finance",
    defaultOpen: false,
    items: [
      { title: "CRM", href: "/pro/digitalbox/crm", icon: Users },
      { title: "Invoicing", href: "/pro/digitalbox/invoicing", icon: FileCheck2 },
      { title: "Retainers", href: "/pro/digitalbox/retainers", icon: RefreshCw },
      { title: "Time Tracking", href: "/pro/digitalbox/time-tracking", icon: Clock },
    ],
  },
  {
    label: "Marketing",
    defaultOpen: false,
    items: [
      { title: "Campaigns", href: "/pro/digitalbox/campaigns", icon: Megaphone },
      { title: "Content Calendar", href: "/pro/digitalbox/content-calendar", icon: CalendarDays },
      { title: "Brand Assets", href: "/pro/digitalbox/assets", icon: FolderOpen },
    ],
  },
  {
    label: "Analytics & AI",
    defaultOpen: false,
    items: [
      { title: "AI Tools", href: "/pro/digitalbox/ai-tools", icon: Zap },
      { title: "Reporting", href: "/pro/digitalbox/reporting", icon: BarChart3 },
      { title: "Auto Reports", href: "/pro/digitalbox/reporting/scheduled", icon: SendHorizonal },
    ],
  },
  {
    label: "Agency",
    defaultOpen: false,
    items: [
      { title: "Team", href: "/pro/team", icon: Users2 },
    ],
  },
  {
    label: "Platform",
    defaultOpen: true,
    items: [
      { title: "Marketplace", href: "/marketplace", icon: Store },
      { title: "Settings", href: "/pro/settings", icon: Settings },
    ],
  },
];

const clientNavGroups: NavGroup[] = [
  {
    label: "Main",
    defaultOpen: true,
    items: [
      { title: "Dashboard", href: "/client", icon: LayoutDashboard },
      { title: "My Pros", href: "/client/my-pros", icon: Briefcase },
      { title: "Projects", href: "/client/projects", icon: FolderKanban },
      { title: "Project Brief", href: "/client/brief", icon: ClipboardList },
    ],
  },
  {
    label: "Reports & Comms",
    defaultOpen: true,
    items: [
      { title: "Reports", href: "/client/reports", icon: TrendingUp },
      { title: "Messages", href: "/messaging", icon: MessageSquare },
    ],
  },
  {
    label: "Platform",
    defaultOpen: true,
    items: [
      { title: "Marketplace", href: "/marketplace", icon: Store },
      { title: "Settings", href: "/client/settings", icon: Settings },
    ],
  },
];

const adminNavGroups: NavGroup[] = [
  {
    label: "Overview",
    defaultOpen: true,
    items: [
      { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { title: "Reports", href: "/admin/reports", icon: BarChart3 },
    ],
  },
  {
    label: "Management",
    defaultOpen: true,
    items: [
      { title: "Users", href: "/admin/users", icon: Users },
      { title: "Projects", href: "/admin/projects", icon: FolderKanban },
      { title: "Transactions", href: "/admin/transactions", icon: CreditCard },
    ],
  },
  {
    label: "System",
    defaultOpen: true,
    items: [
      { title: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

function NavGroupSection({ group, pathname }: { group: NavGroup; pathname: string }) {
  const [open, setOpen] = useState(group.defaultOpen ?? false);

  // Auto-open if any item in this group is active
  const hasActive = group.items.some(item => {
    const isRoot = item.href === "/pro" || item.href === "/client" || item.href === "/admin";
    return isRoot ? pathname === item.href : pathname === item.href || pathname.startsWith(item.href + "/");
  });

  const isOpen = open || hasActive;

  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-center justify-between px-3 py-1.5 text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
      >
        {group.label}
        {isOpen
          ? <ChevronDown className="h-3 w-3" />
          : <ChevronRight className="h-3 w-3" />}
      </button>

      {isOpen && (
        <div className="space-y-0.5 pb-2">
          {group.items.map(item => {
            const isRoot = item.href === "/pro" || item.href === "/client" || item.href === "/admin";
            const isActive = isRoot
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;

            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all cursor-pointer",
                    isActive
                      ? "bg-[#0a9396]/10 text-[#0a9396] border border-[#0a9396]/20"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="flex-1 truncate">{item.title}</span>
                  {item.badge && (
                    <span className="rounded-full bg-[#0a9396]/20 px-2 py-0.5 text-xs text-[#0a9396]">
                      {item.badge}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function DashboardSidebar({ userType = "pro" }: DashboardSidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const navGroups =
    userType === "pro"
      ? proNavGroups
      : userType === "client"
        ? clientNavGroups
        : adminNavGroups;

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/login");
    router.refresh();
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={cn(
          "h-screen w-64 backdrop-blur-lg border-r shadow-sm transition-transform duration-300",
          "bg-linear-to-br from-gray-50 via-white to-gray-50/50 border-gray-200",
          "hidden lg:block shrink-0",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b border-gray-200 px-6 shrink-0">
            <Link href={`/${userType}`} className="flex items-center gap-2">
              <Image
                src="/logos/telemoz.png"
                alt="Telemoz"
                width={120}
                height={40}
                priority
                quality={100}
                className="h-10 w-auto object-contain cursor-pointer"
                style={{ imageRendering: "crisp-edges" }}
              />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {navGroups.map(group => (
              <NavGroupSection key={group.label} group={group} pathname={pathname} />
            ))}
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4 shrink-0">
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
