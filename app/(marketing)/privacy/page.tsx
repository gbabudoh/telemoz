import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";

const sections = [
  {
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
        text: "We analyze usage data to improve our platform, develop new features, and enhance user experience.",
      },
      {
        subtitle: "2.4 Legal Compliance",
        text: "We may use your information to comply with legal obligations, resolve disputes, and enforce our agreements.",
      },
    ],
  },
  {
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
    title: "7. Children's Privacy",
    content: [
      {
        subtitle: "7.1 Age Requirement",
        text: "Our platform is not intended for users under the age of 18. We do not knowingly collect personal information from children.",
      },
    ],
  },
  {
    title: "8. International Data Transfers",
    content: [
      {
        subtitle: "8.1 Data Location",
        text: "Your information may be stored and processed in countries other than your country of residence. We ensure appropriate safeguards are in place.",
      },
    ],
  },
  {
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
    title: "10. Contact Us",
    content: [
      {
        subtitle: "10.1 Privacy Inquiries",
        text: "If you have questions or concerns about this Privacy Policy or our data practices, please contact us at privacy@telemoz.com or through our support center.",
      },
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#94d2bd]/10 via-[#e0e1dd]/30 to-white">
      <div className="container mx-auto max-w-4xl px-6 py-12">
        <Link
          href="/"
          className="text-[#0a9396] hover:text-[#087579] mb-6 inline-flex items-center gap-2 font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-lg bg-gradient-to-br from-[#0a9396] to-[#94d2bd] p-3">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
          </div>
          <p className="text-gray-600 mb-2">
            <strong>Last Updated:</strong> January 2025
          </p>
          <p className="text-lg text-gray-600">
            At Telemoz, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
          </p>
        </div>

        <div className="space-y-8">
          {sections.map((section, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{section.title}</h2>
                <div className="space-y-6">
                  {section.content.map((item, itemIndex) => (
                    <div key={itemIndex}>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.subtitle}</h3>
                      <p className="text-gray-700 leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Section */}
        <Card className="mt-8 bg-gradient-to-br from-[#0a9396]/10 to-[#94d2bd]/10 border-[#0a9396]/30">
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Questions About Privacy?</h3>
            <p className="text-gray-700 mb-4">
              If you have any questions or concerns about our Privacy Policy or how we handle your personal information, please don't hesitate to contact us.
            </p>
            <div className="space-y-2 text-gray-700">
              <p><strong>Email:</strong> privacy@telemoz.com</p>
              <p><strong>Support:</strong> <Link href="/support" className="text-[#0a9396] hover:underline">Visit Support Center</Link></p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

