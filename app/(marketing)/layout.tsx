import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Telemoz - Professional Digital Marketing Platform",
  description: "The All-in-One Professional Hub for Digital Marketing Success",
  icons: {
    icon: "/favicon.png",
  },
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-[#94d2bd]/10 via-[#a8a9ad]/5 to-[#e0e1dd]">
      {/* Marketing Header */}
      <header className="sticky top-0 z-50 border-b border-[#a8a9ad]/20 bg-gradient-to-r from-white via-[#f8f9fa] to-[#e0e1dd] backdrop-blur-lg shadow-sm">
        <div className="container mx-auto max-w-7xl px-6">
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
            
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-gray-700 hover:text-[#0a9396] transition-colors font-medium">
                Home
              </Link>
              <Link href="/how-it-works" className="text-gray-700 hover:text-[#0a9396] transition-colors font-medium">
                How it Works
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-[#0a9396] transition-colors font-medium">
                About
              </Link>
              <Link href="/marketplace" className="text-gray-700 hover:text-[#0a9396] transition-colors font-medium">
                Marketplace
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-[#0a9396] hover:text-[#0a9396] hover:bg-[#0a9396]/10">Login</Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-[#0a9396] hover:bg-[#087579] text-white">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-[#a8a9ad]/20 bg-white/50">
        <div className="container mx-auto max-w-7xl px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Image 
                  src="/logos/telemoz.png" 
                  alt="Telemoz" 
                  width={120}
                  height={40}
                  quality={100}
                  className="h-10 w-auto object-contain"
                  style={{ imageRendering: 'crisp-edges' }}
                />
              </div>
              <p className="text-gray-700 text-sm">
                The All-in-One Professional Hub for Digital Marketing Success
              </p>
            </div>
            
            <div>
              <h3 className="text-gray-900 font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/how-it-works" className="text-gray-700 hover:text-[#0a9396] transition-colors">How it Works</Link></li>
                <li><Link href="/marketplace" className="text-gray-700 hover:text-[#0a9396] transition-colors">Marketplace</Link></li>
                <li><Link href="/about" className="text-gray-700 hover:text-[#0a9396] transition-colors">About</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-gray-900 font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/documentation" className="text-gray-700 hover:text-[#0a9396] transition-colors">Documentation</Link></li>
                <li><Link href="/support" className="text-gray-700 hover:text-[#0a9396] transition-colors">Support</Link></li>
                <li><Link href="/blog" className="text-gray-700 hover:text-[#0a9396] transition-colors">Blog</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-gray-900 font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="text-gray-700 hover:text-[#0a9396] transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-gray-700 hover:text-[#0a9396] transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-[#a8a9ad]/20 text-center text-sm text-gray-700">
            <p>&copy; 2025 Telemoz. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

