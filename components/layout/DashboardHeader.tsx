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
        <div className="flex items-center gap-3 rounded-[1.2rem] border border-gray-200 bg-white/60 backdrop-blur-md px-3 py-2 shadow-sm cursor-pointer hover:shadow-md hover:bg-white hover:border-gray-200/80 transition-all group overflow-hidden relative">
          
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

          {/* Avatar with Status Ring */}
          <div className="relative shrink-0">
             <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#0a9396] to-[#94d2bd] flex items-center justify-center relative z-10 shadow-sm">
               {session?.user?.image ? (
                 <Image
                   src={session.user.image}
                   alt={userName}
                   width={36}
                   height={36}
                   className="h-9 w-9 rounded-full object-cover border-2 border-white"
                 />
               ) : (
                 <User className="h-4 w-4 text-white" />
               )}
             </div>
             {/* Glowing Online Ring */}
             <div className="absolute -inset-1 bg-emerald-400 rounded-full blur opacity-20 animate-pulse pointer-events-none" />
             <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white z-20 shadow-sm" />
          </div>

          <div className="hidden md:flex flex-col text-left relative z-10 pr-2">
            <p className="text-sm font-black text-gray-900 tracking-tight leading-none mb-1 group-hover:text-[#0a9396] transition-colors">{userName}</p>
            <div className="flex items-center gap-1.5">
               <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest leading-none">{userTypeLabel}</p>
               <div className="h-1 w-1 bg-gray-300 rounded-full" />
               <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest leading-none flex items-center gap-1">
                  Online
               </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

