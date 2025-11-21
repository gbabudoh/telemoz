import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  HelpCircle,
  MessageSquare,
  Mail,
  Phone,
  Search,
  BookOpen,
  Video,
  FileText,
  ArrowRight,
  CheckCircle2,
  Clock,
} from "lucide-react";
import Link from "next/link";

const supportOptions = [
  {
    id: "email",
    title: "Email Support",
    description: "Get help via email. We typically respond within 24 hours.",
    icon: Mail,
    color: "from-blue-500 to-cyan-500",
    action: "Send Email",
  },
  {
    id: "chat",
    title: "Live Chat",
    description: "Chat with our support team in real-time.",
    icon: MessageSquare,
    color: "from-emerald-500 to-teal-500",
    action: "Start Chat",
  },
  {
    id: "docs",
    title: "Documentation",
    description: "Browse our comprehensive documentation library.",
    icon: BookOpen,
    color: "from-purple-500 to-pink-500",
    action: "View Docs",
    href: "/documentation",
  },
  {
    id: "video",
    title: "Video Tutorials",
    description: "Watch step-by-step video guides.",
    icon: Video,
    color: "from-amber-500 to-orange-500",
    action: "Watch Videos",
  },
];

const faqCategories = [
  {
    category: "Getting Started",
    questions: [
      {
        q: "How do I create an account?",
        a: "Click the 'Sign Up' button in the top right corner, choose your account type (Pro or Client), fill in your details, and verify your email.",
      },
      {
        q: "Is Telemoz free to use?",
        a: "Yes! Telemoz is completely free for clients. Digital marketing professionals pay a 13% commission only on completed jobs.",
      },
      {
        q: "How do I find a digital marketing professional?",
        a: "Browse the marketplace, use filters to find professionals by category, location, or expertise, and view their profiles to see reviews and portfolios.",
      },
    ],
  },
  {
    category: "Payments & Billing",
    questions: [
      {
        q: "How does payment work?",
        a: "Payments are held securely by Telemoz until work is completed and approved. Once approved, payment is released to the professional minus our 13% commission.",
      },
      {
        q: "What payment methods are accepted?",
        a: "We accept all major credit cards, debit cards, and bank transfers. All payments are processed securely.",
      },
      {
        q: "When do I get paid as a professional?",
        a: "Payment is released within 24-48 hours after the client approves the completed work.",
      },
    ],
  },
  {
    category: "DigitalBOX",
    questions: [
      {
        q: "What is DigitalBOX?",
        a: "DigitalBOX is a suite of professional tools including CRM, invoicing, AI-powered marketing tools, and reporting features.",
      },
      {
        q: "How do I access AI tools?",
        a: "AI tools are available in the DigitalBOX section of your pro dashboard. Navigate to 'AI Tools' to access content generation, SEO optimization, and more.",
      },
      {
        q: "Can I export my invoices?",
        a: "Yes, you can export invoices as PDF from the invoicing section of DigitalBOX.",
      },
    ],
  },
];

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#94d2bd]/10 via-[#e0e1dd]/30 to-white">
      <div className="container mx-auto max-w-7xl px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="rounded-lg bg-gradient-to-br from-[#0a9396] to-[#94d2bd] p-3">
              <HelpCircle className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Support Center</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We're here to help! Get answers to your questions or contact our support team
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Search for help articles..."
              className="w-full pl-12 pr-4 py-4 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder-gray-500 focus:border-[#0a9396] focus:outline-none focus:ring-2 focus:ring-[#0a9396]/20"
            />
          </div>
        </div>

        {/* Support Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {supportOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Card key={option.id} className="hover:border-[#0a9396]/50 hover:shadow-md transition-all">
                <CardContent className="pt-6">
                  <div className={`rounded-lg bg-gradient-to-br ${option.color} p-4 w-fit mb-4`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{option.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{option.description}</p>
                  {option.href ? (
                    <Link href={option.href}>
                      <Button variant="outline" size="sm" className="w-full">
                        {option.action}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  ) : (
                    <Button variant="outline" size="sm" className="w-full">
                      {option.action}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqCategories.map((category, catIndex) => (
              <Card key={catIndex}>
                <CardHeader>
                  <CardTitle className="text-xl">{category.category}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {category.questions.map((faq, index) => (
                    <div key={index} className="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
                      <h4 className="font-semibold text-gray-900 mb-2">{faq.q}</h4>
                      <p className="text-sm text-gray-600">{faq.a}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <Card className="bg-gradient-to-br from-[#0a9396]/10 to-[#94d2bd]/10 border-[#0a9396]/30">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-900">Still Need Help?</CardTitle>
            <CardDescription className="text-base">
              Can't find what you're looking for? Send us a message and we'll get back to you as soon as possible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Your Name" placeholder="John Doe" required />
                <Input label="Email Address" type="email" placeholder="john@example.com" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Subject</label>
                <select className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:border-[#0a9396] focus:outline-none focus:ring-2 focus:ring-[#0a9396]/20">
                  <option>General Inquiry</option>
                  <option>Technical Support</option>
                  <option>Billing Question</option>
                  <option>Feature Request</option>
                  <option>Bug Report</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Message</label>
                <textarea
                  rows={5}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-500 focus:border-[#0a9396] focus:outline-none focus:ring-2 focus:ring-[#0a9396]/20"
                  placeholder="Describe your issue or question..."
                  required
                />
              </div>
              <Button type="submit" className="bg-[#0a9396] hover:bg-[#087579] text-white">
                <Mail className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Response Time Info */}
        <div className="mt-8 p-4 rounded-lg bg-gray-50 border border-gray-200">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-[#0a9396]" />
            <div>
              <p className="text-sm font-medium text-gray-900">Average Response Time</p>
              <p className="text-xs text-gray-600">We typically respond within 24 hours during business days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

