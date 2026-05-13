"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Clock,
  Shield,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  Users,
  Handshake,
  Sparkles,
  Lock,
  Star,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    icon: Handshake,
    title: "Agree on Terms",
    description:
      "Client and digital marketing professional connect and agree on contract terms, scope of work, and pricing. Both parties have full transparency and control.",
    tag: "Both Parties",
  },
  {
    number: "02",
    icon: Clock,
    title: "Set Project Timeline",
    description:
      "The professional uses the timeline bar to set the project duration — one-off task, continuous engagement, or a fixed date period.",
    tag: "Professional",
  },
  {
    number: "03",
    icon: Shield,
    title: "Secure Payment",
    description:
      "All payments are held securely by Telemoz until the work is completed and approved. Client funds are fully protected and professionals are guaranteed payment.",
    tag: "Both Parties",
  },
  {
    number: "04",
    icon: CheckCircle2,
    title: "Job Completion & Release",
    description:
      "Once the client approves the work, Telemoz releases payment to the professional. Telemoz retains a 10% commission — only from the professional's side.",
    tag: "Both Parties",
  },
];

const reasons = [
  {
    icon: Shield,
    stat: "100%",
    title: "Secure Payments",
    description: "Funds are held in escrow until work is approved. Zero payment disputes between clients and professionals.",
  },
  {
    icon: Users,
    stat: "Vetted",
    title: "Verified Professionals",
    description: "Every professional is reviewed and verified before joining the platform. Quality you can trust.",
  },
  {
    icon: DollarSign,
    stat: "10%",
    title: "Transparent Pricing",
    description: "No hidden fees. Clients pay nothing, professionals keep 90% of every payment upon completion.",
  },
];

const heroStats = [
  { label: "Free to Join", icon: Sparkles },
  { label: "10% Commission", icon: DollarSign },
  { label: "Payment Protected", icon: Lock },
  { label: "Verified Pros", icon: Star },
];

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } },
};

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen overflow-hidden">

      {/* Hero */}
      <section className="relative pt-24 pb-16 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#0a9396]/8 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute top-[10%] right-[-5%] w-[500px] h-[500px] bg-[#6ece39]/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-[30%] left-[-5%] w-[400px] h-[400px] bg-[#005f73]/6 rounded-full blur-[110px] pointer-events-none" />

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
          >
            <motion.div variants={itemVariants}>
              <Badge variant="success" size="lg" className="bg-[#0a9396] text-white mb-6 inline-flex items-center gap-2 px-4 py-2">
                <Sparkles className="h-4 w-4" />
                Free to Use
              </Badge>
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-5xl lg:text-7xl font-black tracking-tighter mb-6 leading-none">
              How{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-[#0a9396] to-[#6ece39]">
                Telemoz
              </span>{" "}
              Works
            </motion.h1>

            <motion.p variants={itemVariants} className="text-gray-600 text-xl max-w-2xl mx-auto font-medium leading-relaxed mb-14">
              A free, transparent marketplace connecting digital marketing professionals
              with clients. No sign-up fees. No hidden costs.
            </motion.p>

            {/* Stat strip */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
              {heroStats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.08, type: "spring", stiffness: 100 }}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/80 shadow-sm"
                  >
                    <div className="h-8 w-8 rounded-xl bg-[#0a9396]/10 flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4 text-[#0a9396]" />
                    </div>
                    <span className="text-[13px] font-black text-gray-700 tracking-tight">{stat.label}</span>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Commission callout */}
      <section className="px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 100 }}
          className="container mx-auto max-w-3xl"
        >
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#0a9396]/8 via-white/60 to-[#6ece39]/8 border border-[#0a9396]/15 backdrop-blur-xl shadow-[inset_0_2px_15px_rgb(255,255,255,0.8),0_8px_30px_rgb(0,0,0,0.04)] p-8">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#6ece39]/10 rounded-full blur-[60px] pointer-events-none" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-white border border-[#0a9396]/10 shadow-sm flex items-center justify-center shrink-0">
                  <DollarSign className="h-7 w-7 text-[#0a9396]" />
                </div>
                <div>
                  <div className="text-3xl font-black text-gray-900 tracking-tighter">$0</div>
                  <div className="text-sm font-bold text-gray-500">Clients pay nothing</div>
                </div>
              </div>
              <div className="flex items-center gap-4 sm:border-l sm:border-[#0a9396]/10 sm:pl-6">
                <div className="h-14 w-14 rounded-2xl bg-white border border-[#6ece39]/20 shadow-sm flex items-center justify-center shrink-0">
                  <Zap className="h-7 w-7 text-[#6ece39]" />
                </div>
                <div>
                  <div className="text-3xl font-black text-gray-900 tracking-tighter">90%</div>
                  <div className="text-sm font-bold text-gray-500">Professionals keep per job</div>
                </div>
              </div>
            </div>
            <p className="text-[13px] font-bold text-gray-400 mt-5 relative z-10">
              Telemoz charges a flat 10% commission from the professional&apos;s payout — only upon successful job completion.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Steps */}
      <section className="relative px-6 pb-24">
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-[#0a9396]/3 to-transparent pointer-events-none" />

        <div className="container mx-auto max-w-3xl relative z-10">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black text-gray-900 mb-3 tracking-tighter">The Process</h2>
            <p className="text-gray-500 font-medium text-base max-w-lg mx-auto">
              How every project flows between you and your client — transparent from start to finish.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-9 top-10 bottom-10 w-0.5 bg-linear-to-b from-[#0a9396] via-[#6ece39] to-[#0a9396] opacity-30 hidden sm:block" />

            <div className="space-y-5">
              {steps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.number}
                    initial={{ opacity: 0, x: -24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ delay: i * 0.1, type: "spring", stiffness: 90 }}
                    className="relative flex items-start gap-5 group"
                  >
                    <div className="relative z-10 flex flex-col items-center shrink-0">
                      <div className="flex items-center justify-center w-[72px] h-[72px] rounded-2xl bg-white/80 backdrop-blur-xl border border-white/80 shadow-[0_4px_20px_rgb(0,0,0,0.06)] group-hover:shadow-[0_0_24px_rgba(10,147,150,0.2)] group-hover:border-[#0a9396]/30 transition-all">
                        <Icon className="h-7 w-7 text-[#0a9396] group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <div className="mt-1.5 h-5 w-5 rounded-full bg-linear-to-br from-[#0a9396] to-[#005f73] flex items-center justify-center shadow-sm">
                        <span className="text-[9px] font-black text-white">{i + 1}</span>
                      </div>
                    </div>

                    <div className="flex-1 bg-white/60 backdrop-blur-xl rounded-2xl border border-white/80 shadow-[inset_0_2px_10px_rgb(255,255,255,0.8),0_4px_20px_rgb(0,0,0,0.04)] p-6 group-hover:shadow-[inset_0_2px_10px_rgb(255,255,255,0.8),0_8px_30px_rgba(10,147,150,0.08)] group-hover:border-[#0a9396]/20 group-hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-[#0a9396]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <h3 className="text-lg font-black text-gray-900 tracking-tight group-hover:text-[#0a9396] transition-colors">
                              {step.title}
                            </h3>
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#0a9396] bg-[#0a9396]/8 px-2 py-0.5 rounded-full border border-[#0a9396]/10">
                              {step.tag}
                            </span>
                          </div>
                          <p className="text-gray-500 text-sm leading-relaxed font-medium">{step.description}</p>
                        </div>
                        <span className="text-4xl font-black text-gray-100 group-hover:text-[#6ece39]/25 transition-colors shrink-0 leading-none select-none">
                          {step.number}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Telemoz */}
      <section className="relative px-6 pb-24">
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-[#6ece39]/4 to-transparent pointer-events-none" />

        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black text-gray-900 mb-3 tracking-tighter">Why Choose Telemoz?</h2>
            <p className="text-gray-500 font-medium text-base max-w-lg mx-auto">
              Built from the ground up for digital marketing professionals and the clients who hire them.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {reasons.map((reason, i) => {
              const Icon = reason.icon;
              return (
                <motion.div
                  key={reason.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
                  className="relative group bg-white/60 backdrop-blur-xl rounded-2xl border border-white/80 shadow-[inset_0_2px_10px_rgb(255,255,255,0.8),0_4px_20px_rgb(0,0,0,0.04)] p-7 hover:shadow-[inset_0_2px_10px_rgb(255,255,255,0.8),0_8px_30px_rgba(10,147,150,0.1)] hover:border-[#0a9396]/20 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-[#0a9396] to-[#6ece39] opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="flex items-start justify-between gap-3 mb-5">
                    <div className="h-14 w-14 rounded-2xl bg-linear-to-br from-[#0a9396]/10 to-[#6ece39]/10 border border-[#0a9396]/10 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:from-[#0a9396]/20 group-hover:to-[#6ece39]/20 transition-all duration-300">
                      <Icon className="h-7 w-7 text-[#0a9396]" />
                    </div>
                    <span className="text-3xl font-black text-[#0a9396] tracking-tighter leading-none pt-1">{reason.stat}</span>
                  </div>

                  <h3 className="text-lg font-black text-gray-900 mb-2 tracking-tight">{reason.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed font-medium">{reason.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-20">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#0a9396] to-[#005f73] p-12 text-center shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#6ece39]/15 rounded-full blur-[100px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-white/3 rounded-full blur-[80px]" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 border border-white/20 text-white/90 text-sm font-bold mb-6">
                <Sparkles className="h-4 w-4" />
                No credit card required
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tighter">
                Ready to Get Started?
              </h2>
              <p className="text-white/75 text-lg mb-10 font-medium max-w-md mx-auto">
                Join thousands of professionals and businesses already using Telemoz.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-white text-[#005f73] hover:bg-gray-50 shadow-xl hover:-translate-y-0.5 transition-all rounded-full px-10 h-14 font-black text-base"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/marketplace">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto border-2 border-white/40 text-white hover:bg-white/10 hover:border-white rounded-full px-10 h-14 font-bold"
                  >
                    Browse Marketplace
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
