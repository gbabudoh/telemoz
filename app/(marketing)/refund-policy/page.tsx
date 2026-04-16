import { CreditCard, ArrowLeft, Mail, LifeBuoy } from "lucide-react";
import Link from "next/link";

type SectionContent = {
  subtitle?: string;
  text: string;
};

type Section = {
  id: string;
  title: string;
  content: SectionContent[];
};

const sections: Section[] = [
  {
    id: "general-principles",
    title: "1. General Principles",
    content: [
      {
        text: "Telemoz is a marketplace facilitating connections between Clients and Professionals. While we provide the tools for secure payments, the specific terms of work are generally agreed upon between the Client and the Professional through Proposals and Contracts.",
      },
      {
        text: "All payments made through the platform are held in a secure state until milestones are approved by the Client or a predetermined time period has elapsed.",
      },
    ],
  },
  {
    id: "refund-eligibility",
    title: "2. Refund Eligibility",
    content: [
      {
        subtitle: "2.1 Unstarted Milestones",
        text: "Clients are eligible for a full refund of funds held for milestones that have not yet been started by the Professional, subject to the terms of the specific contract.",
      },
      {
        subtitle: "2.2 Dissatisfaction with Work",
        text: "If a Client is dissatisfied with the work delivered, they should first request revisions through the platform tools. If a resolution cannot be reached, a dispute can be opened.",
      },
      {
        subtitle: "2.3 Transaction Fees",
        text: "Please note that Telemoz platform commissions and payment processing fees may be non-refundable depending on the stage of the transaction.",
      },
    ],
  },
  {
    id: "dispute-resolution",
    title: "3. Dispute Resolution Process",
    content: [
      {
        subtitle: "3.1 Direct Negotiation",
        text: "In the event of a disagreement, Clients and Professionals are encouraged to attempt to resolve the issue directly through the platform's messaging system.",
      },
      {
        subtitle: "3.2 Telemoz Mediation",
        text: "If direct negotiation fails, either party can escalate the matter to Telemoz Support for mediation. We will review the contract, milestones, and communications to reach a fair decision.",
      },
      {
        subtitle: "3.3 Final Decision",
        text: "Telemoz reserves the right to make the final decision on any disputed funds held in our system. Once funds are released to a Professional, Telemoz may no longer be able to facilitate a refund.",
      },
    ],
  },
  {
    id: "cancellation",
    title: "4. Cancellation",
    content: [
      {
        subtitle: "4.1 Retainer Agreements",
        text: "Retainer agreements can be cancelled according to the notice period specified in the agreement. Refunds for partial months are generally not provided unless specified in the contract.",
      },
      {
        subtitle: "4.2 Project Cancellation",
        text: "If a project is cancelled mid-milestone, the Professional may be entitled to payment for the portion of work completed up to that point.",
      },
    ],
  },
  {
    id: "chargebacks",
    title: "5. Chargebacks",
    content: [
      {
        text: "Initiating a chargeback with your bank or credit card provider without first attempting to resolve the issue through Telemoz is a violation of our Terms of Service and may result in account suspension.",
      },
    ],
  },
];

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto max-w-6xl px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-xl border border-white/80 rounded-xl px-4 py-2.5 shadow-sm hover:shadow-md hover:bg-white/80 transition-all group text-sm font-medium text-gray-700 mb-10"
        >
          <ArrowLeft className="h-4 w-4 text-gray-400 group-hover:text-[#0a9396] group-hover:-translate-x-0.5 transition-all" />
          Back to Home
        </Link>

        <div className="flex flex-col lg:flex-row gap-10 items-start">
          <aside className="hidden lg:block w-64 shrink-0 sticky top-6">
            <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl shadow-sm p-5">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Contents</p>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block text-sm text-gray-500 hover:text-[#0a9396] hover:translate-x-0.5 transition-all py-1 leading-snug"
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl shadow-sm p-8 mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-xl bg-linear-to-br from-[#0a9396] to-[#6ece39] flex items-center justify-center shrink-0">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Refund & Dispute Policy</h1>
                  <p className="text-sm text-gray-500 mt-0.5">Last updated: January 2025</p>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Telemoz aims to provide a fair and transparent payment ecosystem. This policy outlines when refunds are eligible and how we handle disputes between Clients and Professionals.
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl shadow-sm divide-y divide-gray-100">
              {sections.map((section) => (
                <div key={section.id} id={section.id} className="p-8 scroll-mt-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-5">{section.title}</h2>
                  <div className="space-y-5">
                    {section.content.map((item, itemIndex) => (
                      <div key={itemIndex}>
                        {item.subtitle && (
                          <h3 className="text-base font-semibold text-gray-800 mb-2">{item.subtitle}</h3>
                        )}
                        <p className="text-gray-600 leading-relaxed text-sm">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-linear-to-br from-[#0a9396]/8 to-[#6ece39]/8 border border-[#0a9396]/20 rounded-2xl p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Need to open a dispute?</h3>
              <p className="text-gray-600 text-sm mb-5">
                Our support team is here to help resolve any payment or performance issues fairly.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="mailto:support@telemoz.com"
                  className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 hover:border-[#0a9396] hover:text-[#0a9396] transition-all"
                >
                  <Mail className="h-4 w-4 text-[#0a9396]" />
                  support@telemoz.com
                </a>
                <Link
                  href="/support"
                  className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 hover:border-[#0a9396] hover:text-[#0a9396] transition-all"
                >
                  <LifeBuoy className="h-4 w-4 text-[#0a9396]" />
                  Visit Support Centre
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
