"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";

export function MarketingHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session } = useSession();
  const userType = session?.user?.userType as string;
  const logoHref = userType ? `/${userType}` : "/";

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Benefits", href: "/benefits" },
    { label: "How it Works", href: "/how-it-works" },
    { label: "Marketplace", href: "/marketplace" },
    { label: "About", href: "/about" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[#a8a9ad]/20 bg-white/80 backdrop-blur-xl shadow-sm">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src="/logos/telemoz.png" 
              alt="Telemoz" 
              width={120}
              height={40}
              priority
              quality={100}
              className="h-10 w-auto object-contain"
              style={{ imageRendering: 'crisp-edges' }}
            />
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className="text-gray-700 hover:text-[#0a9396] transition-colors font-semibold tracking-tight"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 sm:gap-4 ml-auto sm:ml-0">
            <div className="flex items-center gap-1 sm:gap-4">
              {session ? (
                <Link href={logoHref}>
                  <Button size="sm" className="bg-[#0a9396] font-extrabold text-[13px] uppercase tracking-wider px-4 sm:px-6 shadow-lg shadow-[#0a9396]/20 transition-all hover:scale-105 active:scale-95">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/login" className="flex items-center">
                    <Button variant="ghost" size="sm" className="text-[#0a9396] font-extrabold text-[13px] uppercase tracking-wider px-2 sm:px-4">
                      Log in
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm" className="bg-[#0a9396] font-extrabold text-[13px] uppercase tracking-wider px-4 sm:px-6 shadow-lg shadow-[#0a9396]/20 transition-all hover:scale-105 active:scale-95">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>

              {/* Mobile Menu Toggle - Simplified */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-1.5 ml-2 text-gray-700 hover:text-[#0a9396] transition-all"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden border-t border-gray-100 bg-white overflow-hidden"
          >
            <nav className="flex flex-col p-4 space-y-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-bold text-gray-800 hover:text-[#0a9396] transition-colors px-2 py-1"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full font-bold">Login</Button>
                </Link>
                <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full font-bold bg-[#0a9396]">Sign Up</Button>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
