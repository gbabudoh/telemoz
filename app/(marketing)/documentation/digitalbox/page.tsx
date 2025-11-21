import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, ArrowRight, Zap, Users, FileText, BarChart3 } from "lucide-react";
import Link from "next/link";

const digitalboxTools = [
  {
    id: "crm",
    title: "CRM - Client Management",
    description: "Manage your clients, track interactions, and grow relationships",
    icon: Users,
  },
  {
    id: "invoicing",
    title: "Invoicing",
    description: "Create, send, and track invoices for your projects",
    icon: FileText,
  },
  {
    id: "ai-tools",
    title: "AI Tools",
    description: "Leverage AI-powered tools for content generation and optimization",
    icon: Zap,
  },
  {
    id: "reporting",
    title: "Reporting & Analytics",
    description: "Generate reports and analyze your business performance",
    icon: BarChart3,
  },
];

export default function DigitalBOXPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#94d2bd]/10 via-[#e0e1dd]/30 to-white">
      <div className="container mx-auto max-w-4xl px-6 py-12">
        <Link
          href="/documentation"
          className="text-[#0a9396] hover:text-[#087579] mb-6 inline-flex items-center gap-2 font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Documentation
        </Link>

        <div className="mb-8">
          <Badge variant="primary" className="mb-4">DigitalBOX</Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">DigitalBOX Documentation</h1>
          <p className="text-lg text-gray-600">
            Learn how to use DigitalBOX tools to manage your digital marketing business efficiently.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {digitalboxTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link key={tool.id} href={`/documentation/digitalbox/${tool.id}`}>
                <Card className="h-full hover:border-[#0a9396]/50 hover:shadow-md transition-all cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="rounded-lg bg-[#0a9396]/10 p-3">
                        <Icon className="h-6 w-6 text-[#0a9396]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{tool.title}</h3>
                        <p className="text-sm text-gray-600 mb-4">{tool.description}</p>
                        <div className="flex items-center text-[#0a9396] font-medium text-sm">
                          Learn More
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

