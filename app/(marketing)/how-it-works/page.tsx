"use client";

import { Card } from "@/components/ui/Card";
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
  },
  {
    number: "02",
    icon: Clock,
    title: "Set Project Timeline",
    description:
      "The professional uses the timeline bar to set the project duration — one-off task, continuous engagement, or a fixed date period.",
  },
  {
    number: "03",
    icon: Shield,
    title: "Secure Payment",
    description:
      "All payments are held securely by Telemoz until the work is completed and approved. Client funds are fully protected and professionals are guaranteed payment.",
  },
  {
    number: "04",
    icon: CheckCircle2,
    title: "Job Completion & Release",
    description:
      "Once the client approves the work, Telemoz releases payment to the professional. Telemoz retains a 10% commission — only from the professional's side.",
  },
];

const reasons = [
  {
    icon: Shield,
    title: "Secure Payments",
    description: "Funds are held in escrow until work is approved by the client.",
  },
  {
    icon: Users,
    title: "Verified Professionals",
    description: "Connect with trusted, vetted digital marketing experts.",
  },
  {
    icon: DollarSign,
    title: "Transparent Pricing",
    description: "No hidden fees — clients pay nothing, pros keep 90%.",
  },
];

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } },
};

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto max-w-6xl px-6">

        {/* Hero */}
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.12 } },
          }}
        >
          <motion.div variants={itemVariants}>
            <Badge variant="success" size="lg" className="bg-[#0a9396] text-white mb-5 inline-flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Free to Use
            </Badge>
          </motion.div>
          <motion.h1 variants={itemVariants} className="text-5xl lg:text-6xl font-bold tracking-tight mb-5">
            How{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#0a9396] to-[#6ece39]">
              Telemoz
            </span>{" "}
            Works
          </motion.h1>
          <motion.p variants={itemVariants} className="text-gray-600 text-xl max-w-2xl mx-auto font-light leading-relaxed">
            A free, transparent marketplace connecting digital marketing professionals
            with clients. No sign-up fees. No hidden costs.
          </motion.p>
        </motion.div>

        {/* Commission callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-3xl mx-auto mb-20"
        >
          <div className="rounded-2xl border border-[#0a9396]/20 bg-linear-to-r from-[#0a9396]/5 via-[#6ece39]/5 to-[#0a9396]/5 p-6 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="h-12 w-12 rounded-full bg-[#0a9396]/10 flex items-center justify-center shrink-0">
              <DollarSign className="h-6 w-6 text-[#0a9396]" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                Clients pay <span className="text-[#0a9396]">nothing</span>. Professionals keep{" "}
                <span className="text-[#0a9396]">90%</span> of every payment.
              </p>
              <p className="text-gray-600 text-sm mt-1">
                Telemoz charges a 10% commission only from the professional's payout upon successful job completion.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Timeline Steps */}
        <div className="max-w-3xl mx-auto mb-24">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center tracking-tight">
            The Process
          </h2>

          <div className="relative">
            {/* Vertical connector line */}
            <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-linear-to-b from-[#0a9396] via-[#6ece39] to-[#0a9396] opacity-20 hidden sm:block" />

            <div className="space-y-6">
              {steps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.number}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ delay: i * 0.1, type: "spring", stiffness: 90 }}
                    className="relative flex items-start gap-6 group"
                  >
                    {/* Step icon */}
                    <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-2xl bg-white border-2 border-gray-100 shadow-sm group-hover:border-[#0a9396]/40 group-hover:shadow-[0_0_20px_rgba(10,147,150,0.15)] transition-all shrink-0">
                      <Icon className="h-6 w-6 text-[#0a9396]" />
                      <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-[#0a9396] text-white text-[10px] font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                    </div>

                    {/* Content */}
                    <Card className="flex-1 p-6 border border-white/50 bg-white/70 backdrop-blur-sm shadow-sm group-hover:shadow-md group-hover:border-[#0a9396]/20 group-hover:-translate-y-0.5 transition-all duration-300">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-[#0a9396] transition-colors">
                            {step.title}
                          </h3>
                          <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                        </div>
                        <span className="text-3xl font-black text-gray-100 group-hover:text-[#6ece39]/30 transition-colors shrink-0">
                          {step.number}
                        </span>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Why Choose Telemoz */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center tracking-tight">
            Why Choose Telemoz?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reasons.map((reason, i) => {
              const Icon = reason.icon;
              return (
                <motion.div
                  key={reason.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
                >
                  <Card className="p-6 text-center h-full border border-white/50 bg-white/70 backdrop-blur-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                    <div className="h-12 w-12 rounded-2xl bg-linear-to-br from-[#0a9396]/10 to-[#6ece39]/10 flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-6 w-6 text-[#0a9396]" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{reason.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{reason.description}</p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#0a9396] to-[#005f73] p-12 text-center shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#6ece39]/10 rounded-full blur-[80px]" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-white/75 text-lg mb-8 font-light">
              Join thousands of professionals and businesses using Telemoz
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-white text-[#005f73] hover:bg-gray-50 shadow-xl hover:-translate-y-0.5 transition-all rounded-full px-8 h-13 font-bold"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-2 border-white/40 text-white hover:bg-white/10 hover:border-white rounded-full px-8 h-13 font-semibold"
                >
                  Browse Marketplace
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
