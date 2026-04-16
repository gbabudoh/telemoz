import { AlertCircle, ArrowLeft, Mail, LifeBuoy } from "lucide-react";
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
    id: "purpose",
    title: "1. Purpose of This Policy",
    content: [
      {
        text: "This Acceptable Use Policy (AUP) outlines the rules and guidelines for using the Telemoz platform. Our goal is to ensure a safe, professional, and productive environment for all users.",
      },
    ],
  },
  {
    id: "prohibited-activities",
    title: "2. Prohibited Activities",
    content: [
      {
        subtitle: "2.1 Illegal and Harmful Content",
        text: "You may not use Telemoz to create, store, or share content that is illegal, defamatory, obscene, or promotes violence or discrimination.",
      },
      {
        subtitle: "2.2 Fraud and Misrepresentation",
        text: "Users must provide accurate information. Creating fake profiles, misrepresenting skills or identity, or engaging in fraudulent Activities is strictly prohibited.",
      },
      {
        subtitle: "2.3 Spam and Unsolicited Outreach",
        text: "The platform's communication tools are for project-related discussion. Sending unsolicited marketing materials or spam to other users is not allowed.",
      },
      {
        subtitle: "2.4 Platform Circumvention",
        text: "Telemoz provides secure payment and communication tools. Attempting to move project payments or discussions 'off-platform' to avoid service fees is a violation of this policy.",
      },
    ],
  },
  {
    id: "professional-conduct",
    title: "3. Professional Conduct",
    content: [
      {
        subtitle: "3.1 Respectful Communication",
        text: "Users are expected to communicate professionally and respectfully at all times. Harassment, threats, or abusive language will not be tolerated.",
      },
      {
        subtitle: "3.2 Intellectual Property",
        text: "You must respect the intellectual property rights of others. Do not share copyrighted material without permission or misappropriate technical assets.",
      },
    ],
  },
  {
    id: "security-integrity",
    title: "4. System Security and Integrity",
    content: [
      {
        subtitle: "4.1 Unauthorised Access",
        text: "Attempting to gain unauthorised access to other user accounts or the Telemoz infrastructure is strictly prohibited.",
      },
      {
        subtitle: "4.2 Malware and Harmful Code",
        text: "Distributing viruses, malware, or any other code intended to damage or disrupt the platform is a serious violation.",
      },
    ],
  },
  {
    id: "enforcement",
    title: "5. Monitoring and Enforcement",
    content: [
      {
        text: "Telemoz reserves the right to monitor platform activity to ensure compliance with this policy. Violations may result in warnings, temporary suspension, or permanent termination of account access.",
      },
    ],
  },
];

export default function AcceptableUsePage() {
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
                  <AlertCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Acceptable Use Policy</h1>
                  <p className="text-sm text-gray-500 mt-0.5">Last updated: January 2025</p>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">
                We believe in a fair marketplace where professionals can grow and clients can thrive. This policy sets out the standard of behaviour we expect from everyone in the Telemoz community.
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
              <h3 className="text-lg font-bold text-gray-900 mb-2">Notice a violation?</h3>
              <p className="text-gray-600 text-sm mb-5">
                Our team takes platform integrity seriously. If you encounter behaviour that violates these rules, please let us know.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="mailto:trust@telemoz.com"
                  className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 hover:border-[#0f4c5c] hover:text-[#0f4c5c] transition-all"
                >
                  <Mail className="h-4 w-4 text-[#0a9396]" />
                  trust@telemoz.com
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
