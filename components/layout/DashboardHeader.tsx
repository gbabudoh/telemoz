"use client";

import { Bell, Search, User } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";

export function DashboardHeader() {
  const { data: session } = useSession();
  const userName = session?.user?.name || "User";
  const userType = session?.user?.userType || "pro";
  const userTypeLabel = userType === "pro" ? "Pro Account" : userType === "client" ? "Client Account" : "Admin Account";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-gray-200 bg-white/95 backdrop-blur-lg px-6 shadow-sm">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Search projects, clients..."
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 focus:border-[#0a9396] focus:outline-none focus:ring-2 focus:ring-[#0a9396]/20 transition-all"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="relative rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#0a9396] to-[#94d2bd] flex items-center justify-center">
            {session?.user?.image ? (
              <Image
                src={session.user.image}
                alt={userName}
                width={32}
                height={32}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <User className="h-4 w-4 text-white" />
            )}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium text-gray-900">{userName}</p>
            <p className="text-xs text-gray-600">{userTypeLabel}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

