import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { MarketingHeader } from "@/components/layout/MarketingHeader";

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
    <div className="min-h-screen flex flex-col bg-linear-to-br from-white via-[#6ece39]/8 to-[#e0e1dd]">
      <MarketingHeader />

      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-[#a8a9ad]/20 bg-white/50">
        <div className="container mx-auto max-w-7xl px-6 py-12 text-center md:text-left">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center gap-2 mb-6">
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
              </div>
              <p className="text-gray-700 text-[15px] font-medium leading-relaxed max-w-xs">
                The All-in-One Professional Hub for Digital Marketing Success and Seamless Collaboration.
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-gray-900 font-extrabold uppercase tracking-widest text-xs">Product</h3>
              <ul className="space-y-3 text-[14px] font-semibold">
                <li><Link href="/benefits" className="text-gray-600 hover:text-[#0a9396] transition-colors">Benefits</Link></li>
                <li><Link href="/how-it-works" className="text-gray-600 hover:text-[#0a9396] transition-colors">How it Works</Link></li>
                <li><Link href="/marketplace" className="text-gray-600 hover:text-[#0a9396] transition-colors">Marketplace</Link></li>
                <li><Link href="/about" className="text-gray-600 hover:text-[#0a9396] transition-colors">About</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-gray-900 font-extrabold uppercase tracking-widest text-xs">Resources</h3>
              <ul className="space-y-3 text-[14px] font-semibold">
                <li><Link href="/documentation" className="text-gray-600 hover:text-[#0a9396] transition-colors">Documentation</Link></li>
                <li><Link href="/support" className="text-gray-600 hover:text-[#0a9396] transition-colors">Support</Link></li>
                <li><Link href="/blog" className="text-gray-600 hover:text-[#0a9396] transition-colors">Blog</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-gray-900 font-extrabold uppercase tracking-widest text-xs">Legal</h3>
              <ul className="space-y-3 text-[14px] font-semibold">
                <li><Link href="/privacy" className="text-gray-600 hover:text-[#0a9396] transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-gray-600 hover:text-[#0a9396] transition-colors">Terms of Service</Link></li>
                <li><Link href="/cookie-policy" className="text-gray-600 hover:text-[#0a9396] transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-[#a8a9ad]/10">
            <p className="text-[13px] font-bold text-gray-400">
              &copy; {new Date().getFullYear()} Telemoz. Built with Excellence.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

