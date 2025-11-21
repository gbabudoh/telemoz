"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  Zap,
  BarChart3,
  Users,
  Shield,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

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
    <div className="min-h-screen">
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
    </div>
  );
}
