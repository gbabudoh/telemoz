"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, LayoutDashboard, LogIn } from "lucide-react";

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  
  // Determine if user is logged in and what type they are
  const isAuth = status === "authenticated";
  const userType = session?.user?.userType as "pro" | "client" | "admin" | undefined;
  
  // Build dynamic dashboard Return URL
  const dashboardUrl = userType ? `/${userType}` : "/";

  return (
    <div className="flex flex-col min-h-screen">
      {/* Sticky Frosted Marketplace Header */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <Image 
                src="/logos/telemoz.png" 
                alt="Telemoz" 
                width={120}
                height={40}
                priority
                className="h-9 w-auto object-contain"
              />
            </Link>
            <div className="h-6 w-px bg-gray-200 hidden sm:block" />
            <h2 className="hidden sm:block text-gray-700 font-bold tracking-tight">Marketplace</h2>
          </div>

          <div className="flex items-center gap-4">
             {isAuth ? (
               <Link href={dashboardUrl}>
                 <Button variant="outline" className="h-10 px-4 rounded-xl border-gray-300 font-bold tracking-wide hover:bg-gray-50 flex items-center gap-2">
                   <ArrowLeft className="h-4 w-4 text-gray-500" />
                   <span className="hidden sm:inline">Back to</span> Dashboard
                   <LayoutDashboard className="h-4 w-4 ml-1 text-[#0a9396]" />
                 </Button>
               </Link>
             ) : (
               <Link href="/login">
                 <Button className="h-10 px-6 rounded-xl bg-gray-900 hover:bg-black text-white font-bold tracking-wide shadow-md">
                   <LogIn className="h-4 w-4 mr-2" /> Sign In
                 </Button>
               </Link>
             )}
          </div>
          
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col">
        {children}
      </main>
    </div>
  );
}
