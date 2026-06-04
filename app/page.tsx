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
  Briefcase,
  Globe,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { DashboardMockup } from "@/components/ui/DashboardMockup";

function MarketingFooter() {
  return (
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
                style={{ imageRendering: "crisp-edges" }}
              />
            </div>
            <p className="text-gray-700 text-[15px] font-medium leading-relaxed max-w-xs">
              The All-in-One Professional Hub for Digital Marketing Success and
              Seamless Collaboration.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-gray-900 font-extrabold uppercase tracking-widest text-xs">
              Product
            </h3>
            <ul className="space-y-3 text-[14px] font-semibold">
              <li>
                <Link
                  href="/benefits"
                  className="text-gray-600 hover:text-[#0a9396] transition-colors"
                >
                  Benefits
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="text-gray-600 hover:text-[#0a9396] transition-colors"
                >
                  How it Works
                </Link>
              </li>
              <li>
                <Link
                  href="/marketplace"
                  className="text-gray-600 hover:text-[#0a9396] transition-colors"
                >
                  Marketplace
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-[#0a9396] transition-colors"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-gray-900 font-extrabold uppercase tracking-widest text-xs">
              Resources
            </h3>
            <ul className="space-y-3 text-[14px] font-semibold">
              <li>
                <Link
                  href="/documentation"
                  className="text-gray-600 hover:text-[#0a9396] transition-colors"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="text-gray-600 hover:text-[#0a9396] transition-colors"
                >
                  Support
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-gray-600 hover:text-[#0a9396] transition-colors"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-gray-900 font-extrabold uppercase tracking-widest text-xs">
              Legal
            </h3>
            <ul className="space-y-3 text-[14px] font-semibold">
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-600 hover:text-[#0a9396] transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-600 hover:text-[#0a9396] transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-[#a8a9ad]/10">
          <p className="text-[13px] font-bold text-gray-400">
            &copy; {new Date().getFullYear()} Telemoz. Built with Excellence.
          </p>
        </div>
      </div>
    </footer>
  );
}

const features = [
  {
    icon: Zap,
    title: "AI-Powered Tools",
    description:
      "Leverage cutting-edge AI for SEO analysis, ad copy generation, and content optimization to outperform the competition.",
  },
  {
    icon: BarChart3,
    title: "White-Label Reporting",
    description:
      "Automated, branded reports that showcase your value with aggregated analytics from all channels.",
  },
  {
    icon: Users,
    title: "Client Management",
    description:
      "Complete CRM, invoicing, and project management tools built specifically for digital marketing professionals.",
  },
  {
    icon: Shield,
    title: "Trusted Marketplace",
    description:
      "Connect with verified professionals and clients in a secure, transparent environment with built-in payment protection.",
  },
];

const howItWorksSteps = [
  {
    icon: CheckCircle2,
    title: "Agree on Terms",
    desc: "Client and professional agree on contract terms, scope of work, and pricing.",
  },
  {
    icon: Clock,
    title: "Set Timeline",
    desc: "Set the project duration — one-off, continuous, or a fixed date range — using our timeline tools.",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    desc: "Funds are held securely in escrow by Telemoz, protecting both parties until work is approved.",
  },
  {
    icon: DollarSign,
    title: "Get Paid",
    desc: "Once approved, Telemoz releases payment to the professional. A 10% commission is charged from the professional's payout.",
  },
];

export default function HomePage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 120 } },
  };

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-br from-white via-[#6ece39]/8 to-[#e0e1dd]">
      <MarketingHeader />

      <main className="flex-1">
        {/* ── 1. Hero ─────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden px-6 pt-24 pb-20 lg:pt-32 lg:pb-32 flex items-center min-h-[90vh]">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#0a9396]/20 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#6ece39]/20 blur-[120px]" />

          <div className="container mx-auto max-w-7xl relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

              {/* Left: headline + CTAs */}
              <motion.div
                className="text-left"
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                <motion.div
                  variants={itemVariants}
                  className="inline-flex items-center gap-2 rounded-full border border-[#0a9396]/30 bg-[#0a9396]/10 px-4 py-2 mb-8 shadow-sm"
                >
                  <Sparkles className="h-4 w-4 text-[#0a9396]" />
                  <span className="text-sm text-[#0a9396] font-medium">
                    Enterprise-Grade Digital Marketing Platform
                  </span>
                </motion.div>

                <motion.h1
                  variants={itemVariants}
                  className="text-5xl lg:text-7xl font-bold mb-6 tracking-tight leading-[1.1]"
                >
                  The Platform Where{" "}
                  <br className="hidden lg:block" />
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-[#0a9396] to-[#005f73]">
                    Digital Marketers Thrive
                  </span>
                </motion.h1>

                <motion.p
                  variants={itemVariants}
                  className="text-xl text-gray-600 mb-10 leading-relaxed font-light max-w-xl"
                >
                  AI-powered tools, client management, white-label reporting, and a trusted
                  marketplace — everything you need to win more business and deliver better results.
                </motion.p>

                <motion.div
                  variants={itemVariants}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <Link className="cursor-pointer" href="/register">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto bg-[#0a9396] hover:bg-[#087579] text-white shadow-xl shadow-[#0a9396]/20 hover:shadow-[#0a9396]/40 hover:-translate-y-1 transition-all rounded-full px-8 h-14 text-base font-semibold cursor-pointer"
                    >
                      Get Started Free
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link className="cursor-pointer" href="/marketplace">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto border-2 border-gray-200 text-gray-700 hover:border-[#0a9396] hover:text-[#0a9396] hover:bg-transparent shadow-sm hover:shadow-md hover:-translate-y-1 transition-all rounded-full px-8 h-14 text-base font-semibold cursor-pointer"
                    >
                      Browse Marketplace
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>

              {/* Right: animated marketing dashboard mockup */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
                className="relative mt-12 lg:mt-0"
              >
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                  className="relative z-10 w-full rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/50 bg-white/50 backdrop-blur-sm p-3"
                >
                  <DashboardMockup />
                </motion.div>

                {/* Floating accent cards */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                  className="absolute left-0 top-[22%] bg-white rounded-2xl shadow-xl border border-gray-100 px-4 py-3 hidden lg:flex items-center gap-3 z-20 -translate-x-8"
                >
                  <div className="w-8 h-8 rounded-full bg-[#6ece39]/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-[#6ece39]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Payment Secured</p>
                    <p className="text-[10px] text-gray-500">$4,200 held in escrow</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.5, duration: 0.5 }}
                  className="absolute right-0 bottom-[22%] bg-white rounded-2xl shadow-xl border border-gray-100 px-4 py-3 hidden lg:flex items-center gap-3 z-20 translate-x-8"
                >
                  <div className="w-8 h-8 rounded-full bg-[#0a9396]/20 flex items-center justify-center shrink-0">
                    <BarChart3 className="w-4 h-4 text-[#0a9396]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Report Ready</p>
                    <p className="text-[10px] text-gray-500">White-label PDF generated</p>
                  </div>
                </motion.div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-linear-to-tr from-[#0a9396]/10 to-transparent rounded-full blur-3xl -z-10" />
              </motion.div>

            </div>
          </div>
        </section>

        {/* ── 2. Trust Strip ──────────────────────────────────────────── */}
        <section className="py-10 border-y border-[#0a9396]/10 bg-white/60 backdrop-blur-sm">
          <div className="container mx-auto max-w-7xl px-6">
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              {[
                { value: "4+", label: "Enterprise-Grade Tools" },
                { value: "Free", label: "To Join the Marketplace" },
                { value: "10%", label: "Commission on Completion" },
                { value: "100%", label: "Payment Protected" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <p className="text-3xl font-bold text-[#0a9396]">{stat.value}</p>
                  <p className="text-sm text-gray-500 font-medium mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 3. Built for Both Sides ─────────────────────────────────── */}
        <section className="px-6 py-20">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Built for Both Sides</h2>
              <p className="text-gray-600 text-lg">One platform. Two powerful experiences.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* For Digital Marketers */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 80 }}
              >
                <Card className="p-8 h-full bg-linear-to-br from-[#0a9396]/5 to-white border border-[#0a9396]/20">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-[#0a9396] flex items-center justify-center shrink-0">
                      <Briefcase className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <Badge variant="primary" size="sm" className="mb-1">
                        For Professionals
                      </Badge>
                      <h3 className="text-2xl font-bold text-gray-900">Digital Marketers</h3>
                    </div>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {[
                      "Find and manage clients in one place",
                      "AI tools for SEO, ad copy, and content creation",
                      "White-label reports that impress clients",
                      "Secure payment — always get paid on time",
                      "Build your reputation with client reviews",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#0a9396] shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/register">
                    <Button className="w-full bg-[#0a9396] hover:bg-[#087579] text-white rounded-full">
                      Join as a Professional{" "}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </Card>
              </motion.div>

              {/* For Clients / Businesses */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 80 }}
              >
                <Card className="p-8 h-full bg-linear-to-br from-[#6ece39]/5 to-white border border-[#6ece39]/30">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-[#6ece39] flex items-center justify-center shrink-0">
                      <Globe className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <Badge
                        size="sm"
                        className="mb-1 bg-[#6ece39]/15 text-green-700 border-[#6ece39]/30"
                      >
                        For Businesses
                      </Badge>
                      <h3 className="text-2xl font-bold text-gray-900">Clients & Businesses</h3>
                    </div>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {[
                      "Browse verified digital marketing professionals",
                      "Clear project scope & transparent pricing",
                      "Secure payments — only pay when satisfied",
                      "Real-time campaign visibility & reporting",
                      "Completely free to post projects and find talent",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#6ece39] shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/marketplace">
                    <Button className="w-full bg-[#6ece39] hover:bg-[#5bb82f] text-white rounded-full">
                      Browse Marketplace{" "}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── 4. Features ─────────────────────────────────────────────── */}
        <section className="px-6 py-20 bg-white/40">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Everything You Need to Succeed
              </h2>
              <p className="text-gray-600 text-lg">
                Powerful tools designed for modern digital marketing professionals
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: i * 0.1, type: "spring", stiffness: 80 }}
                  >
                    <Card className="h-full p-6 border border-white/40 bg-white/60 backdrop-blur-md shadow-sm group">
                      <div className="w-12 h-12 rounded-2xl bg-[#0a9396]/10 flex items-center justify-center mb-4 group-hover:bg-[#0a9396]/20 transition-colors">
                        <Icon className="h-6 w-6 text-[#0a9396]" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                      <p className="text-gray-600 leading-relaxed text-sm">{feature.description}</p>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 5. How It Works ─────────────────────────────────────────── */}
        <section className="px-6 py-20">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#0a9396]/30 bg-[#0a9396]/10 px-4 py-2 mb-6">
                <span className="text-sm text-[#0a9396] font-medium">Simple Process</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
              <p className="text-gray-600 text-lg">
                From agreement to payment — transparent and secure every step of the way.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              {/* Connector line (desktop only) */}
              <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-linear-to-r from-[#0a9396]/20 via-[#0a9396]/40 to-[#0a9396]/20 z-0" />

              {howItWorksSteps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15, type: "spring", stiffness: 80 }}
                    className="relative z-10"
                  >
                    <Card className="p-6 text-center bg-white/70 backdrop-blur-md border border-white/50 shadow-sm">
                      <div className="w-12 h-12 rounded-full bg-white border-2 border-[#0a9396]/20 flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:border-[#0a9396]/50 transition-all">
                        <span className="text-lg font-bold text-[#0a9396]">{i + 1}</span>
                      </div>
                      <Icon className="h-5 w-5 text-[#0a9396] mx-auto mb-3" />
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-10 text-center">
              <Link href="/marketplace">
                <Button
                  size="lg"
                  className="bg-[#0a9396] hover:bg-[#087579] text-white rounded-full px-8"
                >
                  Browse Marketplace <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ── 6. Marketplace Pricing ──────────────────────────────────── */}
        <section className="px-6 py-20 bg-white/50">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-10">
              <Badge variant="success" size="lg" className="bg-[#0a9396] text-white border-0 mb-4">
                FREE TO USE
              </Badge>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Digital Marketplace — Completely Free
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                No sign-up fees. No hidden costs. Connect with top digital marketing professionals
                or find your next client today.
              </p>
            </div>

            <Card className="p-8 bg-linear-to-br from-[#0a9396]/5 via-white to-[#6ece39]/5 border border-[#0a9396]/15">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-gray-100">
                <div className="p-4 pt-0 md:pt-4">
                  <div className="w-12 h-12 rounded-full bg-[#0a9396]/10 flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-[#0a9396]" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1">Free for Clients</h4>
                  <p className="text-gray-600 text-sm">
                    Post projects, browse professionals, and hire — at zero cost.
                  </p>
                </div>
                <div className="p-4">
                  <div className="w-12 h-12 rounded-full bg-[#0a9396]/10 flex items-center justify-center mx-auto mb-3">
                    <DollarSign className="w-6 h-6 text-[#0a9396]" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1">10% Commission</h4>
                  <p className="text-gray-600 text-sm">
                    Charged only from the professional&apos;s payment upon job completion.
                  </p>
                </div>
                <div className="p-4">
                  <div className="w-12 h-12 rounded-full bg-[#0a9396]/10 flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-6 h-6 text-[#0a9396]" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1">Payment Protected</h4>
                  <p className="text-gray-600 text-sm">
                    Funds held in escrow until work is completed and approved.
                  </p>
                </div>
              </div>

              <div className="mt-8 text-center">
                <Link href="/marketplace">
                  <Button
                    size="lg"
                    className="bg-[#0a9396] hover:bg-[#087579] text-white rounded-full px-10"
                  >
                    Browse Marketplace <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </section>

        {/* ── 7. CTA ──────────────────────────────────────────────────── */}
        <section className="px-6 py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-[#0a9396] to-[#005f73]" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#6ece39]/20 rounded-full blur-[100px]" />

          <div className="container mx-auto max-w-4xl relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-center p-12 bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Transform Your Digital Marketing?
              </h2>
              <p className="text-white/80 text-xl md:text-2xl mb-10 font-light">
                Join professionals already using Telemoz to win more business and deliver better
                results.
              </p>
              <Link className="cursor-pointer" href="/register">
                <Button
                  size="lg"
                  className="bg-white text-[#005f73] hover:bg-gray-50 shadow-xl shadow-black/10 hover:shadow-black/20 hover:-translate-y-1 transition-all rounded-full px-10 h-14 text-lg font-bold"
                >
                  Start Your Free Trial
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
