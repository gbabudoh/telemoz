import { FileText, ArrowLeft, Mail, LifeBuoy } from "lucide-react";
import Link from "next/link";

type SectionContent = {
  subtitle?: string;
  text: string;
  list?: string[];
};

type Section = {
  id: string;
  title: string;
  content: SectionContent[];
};

const sections: Section[] = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    content: [
      {
        text: "By accessing or using the Telemoz platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this platform.",
      },
    ],
  },
  {
    id: "description",
    title: "2. Description of Service",
    content: [
      {
        text: "Telemoz is a digital marketing marketplace platform that connects digital marketing professionals (Pros) with clients seeking marketing services. The platform provides tools including CRM, invoicing, AI-powered marketing tools, and communication features.",
      },
    ],
  },
  {
    id: "accounts",
    title: "3. User Accounts",
    content: [
      {
        subtitle: "3.1 Account Creation",
        text: "You must create an account to use certain features of the platform. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.",
      },
      {
        subtitle: "3.2 Account Security",
        text: "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorised use of your account.",
      },
      {
        subtitle: "3.3 Account Types",
        text: "You may register as a Pro (digital marketing professional), Client (business seeking services), or Admin. You may only maintain one account per email address.",
      },
    ],
  },
  {
    id: "conduct",
    title: "4. User Conduct",
    content: [
      {
        subtitle: "4.1 Acceptable Use",
        text: "You agree to use the platform only for lawful purposes and in accordance with these Terms. You agree not to:",
        list: [
          "Violate any applicable laws or regulations",
          "Infringe upon the rights of others",
          "Transmit any harmful, offensive, or inappropriate content",
          "Impersonate any person or entity",
          "Interfere with or disrupt the platform or servers",
          "Attempt to gain unauthorised access to any part of the platform",
          "Use automated systems to access the platform without permission",
        ],
      },
      {
        subtitle: "4.2 Content Standards",
        text: "All content you post, upload, or share must be accurate, lawful, and not infringe on any third-party rights. You retain ownership of your content but grant Telemoz a licence to use, display, and distribute it on the platform.",
      },
    ],
  },
  {
    id: "marketplace",
    title: "5. Marketplace and Transactions",
    content: [
      {
        subtitle: "5.1 Professional Services",
        text: "Pros are independent contractors, not employees of Telemoz. Telemoz is not responsible for the quality, timeliness, or delivery of services provided by Pros.",
      },
      {
        subtitle: "5.2 Client Responsibilities",
        text: "Clients are responsible for clearly communicating project requirements, providing necessary information, and approving completed work in a timely manner.",
      },
      {
        subtitle: "5.3 Payment Terms",
        text: "Payments are held securely by Telemoz until work is completed and approved by the client. Once approved, payment is released to the Pro minus our 10% commission. All payments are final unless there is a dispute.",
      },
      {
        subtitle: "5.4 Disputes",
        text: "In case of disputes between Pros and Clients, Telemoz may facilitate resolution but is not obligated to resolve disputes. Both parties agree to attempt good faith resolution before escalating.",
      },
    ],
  },
  {
    id: "commission",
    title: "6. Commission and Fees",
    content: [
      {
        subtitle: "6.1 Commission Structure",
        text: "Telemoz charges a 10% commission on completed payments to Pros. This commission is deducted before payment is released to the Pro. There are no fees for Clients.",
      },
      {
        subtitle: "6.2 Payment Processing",
        text: "Payment processing fees may apply and are separate from our commission. These fees are determined by our payment processors.",
      },
    ],
  },
  {
    id: "ip",
    title: "7. Intellectual Property",
    content: [
      {
        subtitle: "7.1 Platform Ownership",
        text: "The Telemoz platform, including its design, features, and content, is owned by Telemoz and protected by intellectual property laws.",
      },
      {
        subtitle: "7.2 User Content",
        text: "You retain ownership of content you create and post on the platform. By posting content, you grant Telemoz a worldwide, non-exclusive, royalty-free licence to use, display, and distribute your content on the platform.",
      },
      {
        subtitle: "7.3 Trademarks",
        text: "Telemoz trademarks, logos, and service marks are the property of Telemoz. You may not use them without our prior written permission.",
      },
    ],
  },
  {
    id: "disclaimers",
    title: "8. Disclaimers and Limitations of Liability",
    content: [
      {
        subtitle: "8.1 Service Availability",
        text: "Telemoz provides the platform 'as is' and 'as available' without warranties of any kind. We do not guarantee that the platform will be uninterrupted, secure, or error-free.",
      },
      {
        subtitle: "8.2 Professional Services",
        text: "Telemoz does not endorse, guarantee, or assume responsibility for any services provided by Pros. Clients are responsible for evaluating Pros and their services.",
      },
      {
        subtitle: "8.3 Limitation of Liability",
        text: "To the maximum extent permitted by law, Telemoz shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues.",
      },
    ],
  },
  {
    id: "indemnification",
    title: "9. Indemnification",
    content: [
      {
        text: "You agree to indemnify, defend, and hold harmless Telemoz and its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising out of your use of the platform, violation of these Terms, or infringement of any rights of another.",
      },
    ],
  },
  {
    id: "termination",
    title: "10. Termination",
    content: [
      {
        subtitle: "10.1 Termination by You",
        text: "You may terminate your account at any time by contacting us or using the account deletion feature in settings.",
      },
      {
        subtitle: "10.2 Termination by Us",
        text: "We may suspend or terminate your account if you violate these Terms, engage in fraudulent activity, or for any other reason we deem necessary to protect the platform and its users.",
      },
      {
        subtitle: "10.3 Effect of Termination",
        text: "Upon termination, your right to use the platform will immediately cease. We may delete your account and associated data, subject to legal retention requirements.",
      },
    ],
  },
  {
    id: "modifications",
    title: "11. Modifications to Terms",
    content: [
      {
        text: "We reserve the right to modify these Terms at any time. We will notify users of significant changes via email or through a notice on the platform. Your continued use of the platform after changes constitutes acceptance of the modified Terms.",
      },
    ],
  },
  {
    id: "governing-law",
    title: "12. Governing Law and Dispute Resolution",
    content: [
      {
        subtitle: "12.1 Governing Law",
        text: "These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Telemoz operates, without regard to its conflict of law provisions.",
      },
      {
        subtitle: "12.2 Dispute Resolution",
        text: "Any disputes arising out of or relating to these Terms or the platform shall be resolved through binding arbitration, except where prohibited by law.",
      },
    ],
  },
  {
    id: "general",
    title: "13. General Provisions",
    content: [
      {
        subtitle: "13.1 Entire Agreement",
        text: "These Terms constitute the entire agreement between you and Telemoz regarding the use of the platform.",
      },
      {
        subtitle: "13.2 Severability",
        text: "If any provision of these Terms is found to be unenforceable, the remaining provisions shall remain in full effect.",
      },
      {
        subtitle: "13.3 Waiver",
        text: "No waiver of any term of these Terms shall be deemed a further or continuing waiver of such term or any other term.",
      },
    ],
  },
  {
    id: "contact",
    title: "14. Contact Information",
    content: [
      {
        text: "If you have any questions about these Terms of Service, please contact us at legal@telemoz.com or through our support centre.",
      },
    ],
  },
];

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto max-w-6xl px-6">

        {/* Back nav */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-xl border border-white/80 rounded-xl px-4 py-2.5 shadow-sm hover:shadow-md hover:bg-white/80 transition-all group text-sm font-medium text-gray-700 mb-10"
        >
          <ArrowLeft className="h-4 w-4 text-gray-400 group-hover:text-[#0a9396] group-hover:-translate-x-0.5 transition-all" />
          Back to Home
        </Link>

        <div className="flex flex-col lg:flex-row gap-10 items-start">

          {/* Sticky Table of Contents */}
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

          {/* Document */}
          <div className="flex-1 min-w-0">

            {/* Header */}
            <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl shadow-sm p-8 mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-xl bg-linear-to-br from-[#0a9396] to-[#6ece39] flex items-center justify-center shrink-0">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
                  <p className="text-sm text-gray-500 mt-0.5">Last updated: January 2025</p>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Please read these Terms of Service carefully before using the Telemoz platform. By using our platform, you agree to be bound by these terms.
              </p>
            </div>

            {/* Sections as a flowing document */}
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
                        {item.list && (
                          <ul className="mt-3 space-y-2">
                            {item.list.map((listItem, listIndex) => (
                              <li key={listIndex} className="flex items-start gap-2.5 text-sm text-gray-600">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#0a9396] mt-2 shrink-0" />
                                {listItem}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Contact card */}
            <div className="mt-6 bg-linear-to-br from-[#0a9396]/8 to-[#6ece39]/8 border border-[#0a9396]/20 rounded-2xl p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Questions about these Terms?</h3>
              <p className="text-gray-600 text-sm mb-5">
                If you have any questions or concerns, don&apos;t hesitate to reach out.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="mailto:legal@telemoz.com"
                  className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 hover:border-[#0a9396] hover:text-[#0a9396] transition-all"
                >
                  <Mail className="h-4 w-4 text-[#0a9396]" />
                  legal@telemoz.com
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
