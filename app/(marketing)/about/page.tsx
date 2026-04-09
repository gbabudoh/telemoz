"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Zap, Users, Target, Shield, ArrowRight, Globe, TrendingUp, Award } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const values = [
  {
    icon: Zap,
    title: "Innovation",
    description:
      "We leverage cutting-edge AI and technology to give digital marketing professionals a genuine competitive edge.",
  },
  {
    icon: Users,
    title: "Community",
    description:
      "Building a trusted marketplace where professionals and clients connect, collaborate, and grow together.",
  },
  {
    icon: Target,
    title: "Excellence",
    description:
      "Committed to delivering enterprise-grade solutions that drive measurable, real-world business results.",
  },
  {
    icon: Shield,
    title: "Security",
    description:
      "Your data, client information, and payments are protected with industry-leading security measures.",
  },
];

const stats = [
  { icon: Globe, value: "50+", label: "Countries" },
  { icon: Users, value: "10k+", label: "Professionals" },
  { icon: TrendingUp, value: "£2M+", label: "Paid Out" },
  { icon: Award, value: "98%", label: "Satisfaction" },
];

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto max-w-6xl px-6">

        {/* Hero */}
        <motion.div
          className="text-center mb-20"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.12 } },
          }}
        >
          <motion.p
            variants={itemVariants}
            className="text-sm font-semibold tracking-widest text-[#0a9396] uppercase mb-4"
          >
            Our Story
          </motion.p>
          <motion.h1
            variants={itemVariants}
            className="text-5xl lg:text-6xl font-bold tracking-tight mb-6"
          >
            Built for{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#0a9396] to-[#6ece39]">
              Digital Marketers
            </span>
            ,<br className="hidden sm:block" /> by Digital Marketers
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-gray-600 text-xl max-w-2xl mx-auto font-light leading-relaxed"
          >
            We&apos;re building the future of digital marketing collaboration — empowering
            professionals and agencies with powerful tools and seamless client connections.
          </motion.p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, type: "spring" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24"
        >
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.08 }}
              >
                <Card className="p-6 text-center border border-white/50 bg-white/70 backdrop-blur-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                  <div className="h-10 w-10 rounded-xl bg-linear-to-br from-[#0a9396]/10 to-[#6ece39]/10 flex items-center justify-center mx-auto mb-3">
                    <Icon className="h-5 w-5 text-[#0a9396]" />
                  </div>
                  <p className="text-3xl font-black text-gray-900 tracking-tight">{stat.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80 }}
          className="mb-24"
        >
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#0a9396] to-[#005f73] p-12 md:p-16 text-center shadow-xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#6ece39]/10 rounded-full blur-[80px]" />
            <div className="relative z-10 max-w-3xl mx-auto">
              <p className="text-white/60 text-sm font-semibold tracking-widest uppercase mb-4">
                Our Mission
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-snug">
                Making professional-grade marketing tools accessible to everyone
              </h2>
              <p className="text-white/75 text-lg font-light leading-relaxed">
                To empower digital marketing professionals and agencies with the tools they
                need to succeed, while creating a trusted marketplace that connects them with
                clients who need their expertise — regardless of business size.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Values */}
        <div className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-3">
              What We Stand For
            </h2>
            <p className="text-gray-500 text-lg font-light">
              The principles that guide every decision we make
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
                >
                  <Card className="h-full p-6 text-center border border-white/50 bg-white/70 backdrop-blur-sm hover:shadow-md hover:-translate-y-1 hover:border-[#0a9396]/20 transition-all duration-300 group">
                    <div className="h-12 w-12 rounded-2xl bg-linear-to-br from-[#0a9396]/10 to-[#6ece39]/10 flex items-center justify-center mx-auto mb-4 group-hover:from-[#0a9396]/20 group-hover:to-[#6ece39]/20 transition-all">
                      <Icon className="h-6 w-6 text-[#0a9396]" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#0a9396] transition-colors">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
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
          className="text-center"
        >
          <Card className="p-12 border border-white/50 bg-white/70 backdrop-blur-sm">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">
              Ready to join Telemoz?
            </h2>
            <p className="text-gray-500 text-lg font-light mb-8">
              Sign up free and start connecting with top digital marketing talent today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-[#0a9396] hover:bg-[#087579] text-white shadow-lg shadow-[#0a9396]/20 hover:shadow-[#0a9396]/40 hover:-translate-y-0.5 transition-all rounded-full px-8 font-semibold"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-2 border-gray-200 text-gray-700 hover:border-[#0a9396] hover:text-[#0a9396] hover:bg-transparent transition-all rounded-full px-8 font-semibold"
                >
                  Browse Marketplace
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>

      </div>
    </div>
  );
}
