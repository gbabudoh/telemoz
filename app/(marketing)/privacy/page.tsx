import { Shield, ArrowLeft, Mail, LifeBuoy } from "lucide-react";
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
    id: "information-collected",
    title: "1. Information We Collect",
    content: [
      {
        subtitle: "1.1 Personal Information",
        text: "When you register for an account, we collect information such as your name, email address, password, location (country, city, timezone), and account type (Pro, Client, or Admin).",
      },
      {
        subtitle: "1.2 Profile Information",
        text: "For professionals, we collect additional information including bio, specialties, skills, certifications, rates, portfolio links, and availability status.",
      },
      {
        subtitle: "1.3 Usage Data",
        text: "We automatically collect information about how you use our platform, including pages visited, features used, and interactions with other users.",
      },
      {
        subtitle: "1.4 Payment Information",
        text: "Payment processing is handled securely through third-party payment processors. We do not store your full payment card details on our servers.",
      },
    ],
  },
  {
    id: "how-we-use",
    title: "2. How We Use Your Information",
    content: [
      {
        subtitle: "2.1 Service Provision",
        text: "We use your information to provide, maintain, and improve our services, including matching professionals with clients, facilitating communications, and processing payments.",
      },
      {
        subtitle: "2.2 Communication",
        text: "We use your email address to send you important updates, notifications, and marketing communications (you can opt-out at any time).",
      },
      {
        subtitle: "2.3 Platform Improvement",
        text: "We analyse usage data to improve our platform, develop new features, and enhance user experience.",
      },
      {
        subtitle: "2.4 Legal Compliance",
        text: "We may use your information to comply with legal obligations, resolve disputes, and enforce our agreements.",
      },
    ],
  },
  {
    id: "sharing",
    title: "3. Information Sharing and Disclosure",
    content: [
      {
        subtitle: "3.1 Public Profile Information",
        text: "Your public profile information (name, bio, specialties, certifications, rates) is visible to other users on the marketplace to facilitate connections.",
      },
      {
        subtitle: "3.2 Service Providers",
        text: "We may share your information with third-party service providers who assist us in operating our platform, such as payment processors, hosting providers, and analytics services.",
      },
      {
        subtitle: "3.3 Legal Requirements",
        text: "We may disclose your information if required by law, court order, or government regulation, or to protect our rights and the safety of our users.",
      },
      {
        subtitle: "3.4 Business Transfers",
        text: "In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity.",
      },
    ],
  },
  {
    id: "security",
    title: "4. Data Security",
    content: [
      {
        subtitle: "4.1 Security Measures",
        text: "We implement industry-standard security measures to protect your personal information, including encryption, secure servers, and access controls.",
      },
      {
        subtitle: "4.2 Password Security",
        text: "Passwords are hashed using secure algorithms. You are responsible for maintaining the confidentiality of your account credentials.",
      },
      {
        subtitle: "4.3 Data Breach",
        text: "In the event of a data breach, we will notify affected users and relevant authorities as required by applicable law.",
      },
    ],
  },
  {
    id: "your-rights",
    title: "5. Your Rights and Choices",
    content: [
      {
        subtitle: "5.1 Access and Correction",
        text: "You can access and update your personal information at any time through your account settings.",
      },
      {
        subtitle: "5.2 Data Deletion",
        text: "You can request deletion of your account and associated data by contacting us. Some information may be retained for legal or business purposes.",
      },
      {
        subtitle: "5.3 Marketing Communications",
        text: "You can opt-out of marketing emails by clicking the unsubscribe link in any marketing email or updating your notification preferences.",
      },
      {
        subtitle: "5.4 Cookies",
        text: "You can control cookies through your browser settings. However, disabling cookies may affect your ability to use certain features of our platform.",
      },
    ],
  },
  {
    id: "cookies",
    title: "6. Cookies and Tracking Technologies",
    content: [
      {
        subtitle: "6.1 Types of Cookies",
        text: "We use essential cookies for platform functionality, analytics cookies to understand usage patterns, and marketing cookies for advertising purposes.",
      },
      {
        subtitle: "6.2 Third-Party Cookies",
        text: "We may use third-party services that set their own cookies, such as Google Analytics and payment processors.",
      },
    ],
  },
  {
    id: "children",
    title: "7. Children's Privacy",
    content: [
      {
        subtitle: "7.1 Age Requirement",
        text: "Our platform is not intended for users under the age of 18. We do not knowingly collect personal information from children.",
      },
    ],
  },
  {
    id: "international",
    title: "8. International Data Transfers",
    content: [
      {
        subtitle: "8.1 Data Location",
        text: "Your information may be stored and processed in countries other than your country of residence. We ensure appropriate safeguards are in place.",
      },
    ],
  },
  {
    id: "changes",
    title: "9. Changes to This Privacy Policy",
    content: [
      {
        subtitle: "9.1 Updates",
        text: "We may update this Privacy Policy from time to time. We will notify you of significant changes by email or through a notice on our platform.",
      },
      {
        subtitle: "9.2 Effective Date",
        text: "This Privacy Policy is effective as of January 2025. Your continued use of our platform after changes constitutes acceptance of the updated policy.",
      },
    ],
  },
  {
    id: "contact",
    title: "10. Contact Us",
    content: [
      {
        subtitle: "10.1 Privacy Inquiries",
        text: "If you have questions or concerns about this Privacy Policy or our data practices, please contact us at privacy@telemoz.com or through our support centre.",
      },
    ],
  },
];

export default function PrivacyPolicyPage() {
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
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
                  <p className="text-sm text-gray-500 mt-0.5">Last updated: January 2025</p>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">
                At Telemoz, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
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
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Contact card */}
            <div className="mt-6 bg-linear-to-br from-[#0a9396]/8 to-[#6ece39]/8 border border-[#0a9396]/20 rounded-2xl p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Questions about your privacy?</h3>
              <p className="text-gray-600 text-sm mb-5">
                If you have any questions or concerns about how we handle your personal information, don&apos;t hesitate to reach out.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="mailto:privacy@telemoz.com"
                  className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 hover:border-[#0a9396] hover:text-[#0a9396] transition-all"
                >
                  <Mail className="h-4 w-4 text-[#0a9396]" />
                  privacy@telemoz.com
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
