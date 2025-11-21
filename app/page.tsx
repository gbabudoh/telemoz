"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  Zap,
  BarChart3,
  Users,
  Shield,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Clock,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Marketing Header Component
function MarketingHeader() {
  return (
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
  );
}

// Marketing Footer Component
function MarketingFooter() {
  return (
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
  );
}

const features = [
  {
    icon: Zap,
    title: "AI-Powered Tools",
    description: "Leverage cutting-edge AI for SEO analysis, ad copy generation, and content optimization.",
  },
  {
    icon: BarChart3,
    title: "White-Label Reporting",
    description: "Automated, branded reports that showcase your value with aggregated analytics from all channels.",
  },
  {
    icon: Users,
    title: "Client Management",
    description: "Complete CRM, invoicing, and project management tools built specifically for digital marketers.",
  },
  {
    icon: Shield,
    title: "Trusted Marketplace",
    description: "Connect with verified professionals and clients in a secure, transparent environment.",
  },
];


export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-[#94d2bd]/10 via-[#a8a9ad]/5 to-[#e0e1dd]">
      <MarketingHeader />
      
      <main className="flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a9396]/5 via-[#94d2bd]/5 to-[#a8a9ad]/5" />
        <div className="container mx-auto max-w-7xl">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-4 py-2 mb-8">
              <Sparkles className="h-4 w-4 text-primary-400" />
              <span className="text-sm text-primary-400">Enterprise-Grade Digital Marketing Platform</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-[#0a9396]">Your Digital Marketing Hub</span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              The All-in-One Professional Hub for Digital Marketing Success and Seamless Client-Agency Collaboration
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto bg-[#0a9396] hover:bg-[#087579] text-white">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-2 border-[#0a9396] text-[#0a9396] hover:bg-[#0a9396]/10">
                  Browse Marketplace
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-gray-600 text-lg">
              Powerful tools and features designed for modern digital marketing professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title}>
                  <Card className="h-full">
                    <div className="rounded-lg bg-primary-500/10 p-3 w-fit mb-4">
                      <Icon className="h-6 w-6 text-primary-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Marketplace Section */}
      <section className="px-6 py-20 bg-white/50">
        <div className="container mx-auto max-w-7xl">
          <div className="max-w-4xl mx-auto">
            <Card className="p-8">
              <div className="text-center mb-8">
                <Badge variant="success" size="lg" className="bg-[#0a9396] text-white mb-4">
                  FREE TO USE
                </Badge>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Digital Marketplace - Completely Free
                </h2>
                <p className="text-gray-700 text-lg mb-6">
                  The digital marketplace is completely free to use for digital marketing professionals 
                  and clients/businesses looking for digital marketing services.
                </p>
                <p className="text-gray-700 font-semibold">
                  No sign-up fees, no hidden costs. Telemoz charges a <span className="text-[#0a9396]">10% commission</span> only 
                  from the payment the digital marketing professional receives upon job completion.
                </p>
              </div>

              <div className="border-t border-[#a8a9ad]/20 pt-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">How It Works</h3>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-[#0a9396]/10 flex items-center justify-center">
                        <span className="text-[#0a9396] font-bold text-lg">1</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">Agree on Terms</h4>
                      <p className="text-gray-700">
                        Client and digital marketing professional agree on contract terms, scope of work, and pricing.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-[#0a9396]/10 flex items-center justify-center">
                        <Clock className="h-6 w-6 text-[#0a9396]" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">Set Project Timeline</h4>
                      <p className="text-gray-700">
                        The digital marketing professional uses the timeline/project feature bar to set the duration: 
                        one-off task, continuous task, or for a set date period.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-[#0a9396]/10 flex items-center justify-center">
                        <Shield className="h-6 w-6 text-[#0a9396]" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">Secure Payment</h4>
                      <p className="text-gray-700">
                        All payments are held securely by Telemoz to protect both parties. 
                        Your funds are safe until the work is completed to your satisfaction.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-[#0a9396]/10 flex items-center justify-center">
                        <CheckCircle2 className="h-6 w-6 text-[#0a9396]" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">Job Completion & Payment</h4>
                      <p className="text-gray-700">
                        Once the task/job is completed and approved, Telemoz releases payment to the digital marketing professional. 
                        Telemoz charges a <strong className="text-[#0a9396]">10% commission</strong> from the professional's payment.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-[#0a9396]/5 rounded-lg border border-[#0a9396]/20">
                  <div className="flex items-start gap-3">
                    <DollarSign className="h-5 w-5 text-[#0a9396] flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Commission Structure</h4>
                      <p className="text-sm text-gray-700">
                        The marketplace is <strong>completely free</strong> for clients. Telemoz charges a 
                        <strong className="text-[#0a9396]"> 10% commission</strong> only from the payment 
                        the digital marketing professional receives upon successful job completion.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <Link href="/marketplace">
                    <Button size="lg" className="bg-[#0a9396] hover:bg-[#087579] text-white">
                      Browse Marketplace
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="container mx-auto max-w-4xl">
          <Card variant="gradient" className="text-center p-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Ready to Transform Your Digital Marketing?
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Join thousands of professionals already using Telemoz to grow their business
            </p>
            <Link href="/register">
              <Button size="lg" className="bg-[#0a9396] hover:bg-[#087579] text-white">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </Card>
        </div>
      </section>
      </main>
      
      <MarketingFooter />
    </div>
  );
}
