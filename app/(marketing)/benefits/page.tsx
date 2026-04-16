"use client";

import { Card } from "@/components/ui/Card";
import { 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  BarChart3, 
  Users, 
  Lock, 
  TrendingUp,
  Cpu,
  Layers,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const painPoints = [
  {
    point: "Tool Fragmentation",
    issue: "Teams waste 40% of their time switching between SEO tools, Bill.com, Slack, and spreadsheets.",
    solution: "Unified Hub: Combines AI tools, CRM, project management, and invoicing in one window."
  },
  {
    point: "Black Box Marketing",
    issue: "Clients often pay for SEO or Ads without understanding the actual work or results.",
    solution: "Transparent White-Labelling: Automated reporting that pulls data directly into client-facing dashboards."
  },
  {
    point: "Payment Insecurity",
    issue: "60% of freelancers face late or non-payment; clients worry about paying for poor quality.",
    solution: "Milestone Escrow: Secure payment holding with 10% commission only upon successful completion."
  },
  {
    point: "Manual Reporting",
    issue: "Account managers spend 5-10 hours/month per client manually building reports.",
    solution: "n8n Automation: Real-time background data aggregation and automated reporting triggers."
  },
  {
    point: "Expert Verification",
    issue: "General marketplaces are flooded with low-quality bids, making quality hard to find.",
    solution: "Verified Marketplace: A curated space specifically for digital marketing specialists."
  }
];

const proBenefits = [
  {
    title: "Operational Efficiency",
    desc: "Eliminates the need for multiple subscriptions. No separate billing, AI tools, or dashboards.",
    icon: Layers
  },
  {
    title: "Extreme Scalability",
    desc: "Manage 3x the workload without adding headcount using integrated AI-Powered tools.",
    icon: TrendingUp
  },
  {
    title: "Financial Reliability",
    desc: "The escrow system ensures 'work done = payment liquid'. No more chasing late invoices.",
    icon: ShieldCheck
  },
  {
    title: "Premium Positioning",
    desc: "A specialized platform allows for higher billable rates than generic freelance sites.",
    icon: CheckCircle2
  },
  {
    title: "Workflow Automation",
    desc: "Automate client onboarding and social media triggers directly through n8n integration.",
    icon: Cpu
  }
];

const clientBenefits = [
  {
    title: "Verified Expertise",
    desc: "Reduces the 'Risk of Hire'. Interact with professionals vetted for the marketing domain.",
    icon: Users
  },
  {
    title: "Transparency & Control",
    desc: "See project timelines and milestone progress in real-time through the Client Hub.",
    icon: BarChart3
  },
  {
    title: "Cost-Effectiveness",
    desc: "Industry-leading 10% commission model only deducted from the professional's side.",
    icon: Zap
  },
  {
    title: "Data-Driven ROI",
    desc: "Access automated reports ensuring ROI is always visible and backed by raw data.",
    icon: BarChart3
  },
  {
    title: "Secure Infrastructure",
    desc: "Enterprise-grade security and GDPR compliance for sensitive marketing data.",
    icon: Lock
  }
];

export default function BenefitsPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-gray-50/50">
      {/* Hero Header */}
      <section className="relative py-20 overflow-hidden border-b border-gray-100">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#0a9396]/5 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto max-w-7xl px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl sm:text-6xl font-black mb-6 tracking-tight text-gray-900 leading-[1.1]">
              The Telemoz <span className="text-[#0a9396]">Advantage</span>
            </h1>
            <p className="text-xl text-gray-500 max-w-3xl mx-auto font-medium leading-relaxed">
              We aren&apos;t just a marketplace; we are a vertically integrated ecosystem designed to solve the trust and fragmentation crisis in modern agency-client relationships.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pain Points Table */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-2">Addressing the &quot;Gap&quot; in the Market</h2>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Precise Industry Standard Solutions</p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-gray-100 shadow-2xl shadow-gray-200/50 bg-white">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="p-6 font-black text-gray-900 uppercase tracking-wider text-sm">Pain Point</th>
                  <th className="p-6 font-black text-gray-500 uppercase tracking-wider text-sm">Typical Industry Issue</th>
                  <th className="p-6 font-black text-[#0a9396] uppercase tracking-wider text-sm">The Telemoz Solution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {painPoints.map((row, idx) => (
                  <motion.tr 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <td className="p-6 font-extrabold text-gray-900">{row.point}</td>
                    <td className="p-6 text-gray-500 font-medium">{row.issue}</td>
                    <td className="p-6 text-gray-900 font-bold bg-[#0a9396]/5 leading-relaxed">{row.solution}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Dual Benefits Section */}
      <section className="py-20 bg-gray-50/30">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* For Professionals */}
            <div>
              <div className="mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-4">
                  Professionals
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-4">Elevate Your Agency</h3>
                <p className="text-gray-500 font-medium leading-relaxed">
                  Focus on delivering results, not managing tools. Telemoz scales with your ambition.
                </p>
              </div>

              <motion.div 
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="space-y-4"
              >
                {proBenefits.map((benefit, i) => (
                  <motion.div key={i} variants={item}>
                    <Card className="p-6 border-white bg-white/60 hover:bg-white transition-all group">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                          <benefit.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-gray-900 mb-1">{benefit.title}</h4>
                          <p className="text-sm text-gray-500 font-medium leading-relaxed">{benefit.desc}</p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* For Clients */}
            <div>
              <div className="mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-600 text-[10px] font-black uppercase tracking-widest mb-4">
                  Businesses & Individuals
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-4">Transparency & ROI</h3>
                <p className="text-gray-500 font-medium leading-relaxed">
                  Access verified experts with full visibility into where every dollar of your budget is going.
                </p>
              </div>

              <motion.div 
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="space-y-4"
              >
                {clientBenefits.map((benefit, i) => (
                  <motion.div key={i} variants={item}>
                    <Card className="p-6 border-white bg-white/60 hover:bg-white transition-all group">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 group-hover:scale-110 transition-transform">
                          <benefit.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-gray-900 mb-1">{benefit.title}</h4>
                          <p className="text-sm text-gray-500 font-medium leading-relaxed">{benefit.desc}</p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 pb-32">
        <div className="container mx-auto max-w-4xl px-6">
          <Card className="p-12 text-center bg-gray-900 text-white rounded-[3rem] overflow-hidden relative shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0a9396]/40 via-transparent to-blue-500/20 pointer-events-none" />
            <h2 className="text-3xl sm:text-5xl font-black mb-6 tracking-tight leading-tight relative z-10">
              Ready to Join the Standard for <br className="hidden sm:block" /> Digital Marketing Excellence?
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center relative z-10 group">
              <Link href="/register">
                <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 rounded-2xl h-16 px-12 font-black text-lg transition-transform hover:scale-105 active:scale-95 shadow-xl shadow-black/20">
                  Start Your Free Trial
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
