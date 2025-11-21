import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, CheckCircle2, ArrowRight, Users, Store, Settings } from "lucide-react";
import Link from "next/link";

const firstSteps = [
  {
    title: "Explore the Marketplace",
    description: "Browse the marketplace to see available professionals or client requests.",
    icon: Store,
    action: "Visit Marketplace",
    href: "/marketplace",
  },
  {
    title: "Complete Your Profile",
    description: "Add your bio, skills, certifications, and portfolio to stand out.",
    icon: Users,
    action: "Go to Profile",
    href: "/pro/profile",
  },
  {
    title: "Configure Settings",
    description: "Set your preferences, notification settings, and account details.",
    icon: Settings,
    action: "Open Settings",
    href: "/pro/settings",
  },
];

export default function FirstStepsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#94d2bd]/10 via-[#e0e1dd]/30 to-white">
      <div className="container mx-auto max-w-4xl px-6 py-12">
        <Link
          href="/documentation/getting-started"
          className="text-[#0a9396] hover:text-[#087579] mb-6 inline-flex items-center gap-2 font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Getting Started
        </Link>

        <div className="mb-8">
          <Badge variant="primary" className="mb-4">Getting Started</Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">First Steps After Signing Up</h1>
          <p className="text-lg text-gray-600">
            Now that you've created your account, here's what to do next to get the most out of Telemoz.
          </p>
        </div>

        <div className="space-y-6 mb-8">
          {firstSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="rounded-lg bg-[#0a9396]/10 p-3">
                        <Icon className="h-6 w-6 text-[#0a9396]" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                      <p className="text-gray-600 mb-4">{step.description}</p>
                      <Link href={step.href}>
                        <Button variant="outline" size="sm">
                          {step.action}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Resources */}
        <Card className="bg-gradient-to-br from-[#0a9396]/10 to-[#94d2bd]/10 border-[#0a9396]/30">
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Additional Resources</h3>
            <div className="space-y-3">
              <Link href="/documentation/getting-started/profile-completion" className="flex items-center justify-between p-3 rounded-lg bg-white hover:bg-[#0a9396]/5 transition-colors">
                <span className="text-gray-900">Completing Your Profile</span>
                <ArrowRight className="h-4 w-4 text-[#0a9396]" />
              </Link>
              <Link href="/documentation/marketplace/finding-pros" className="flex items-center justify-between p-3 rounded-lg bg-white hover:bg-[#0a9396]/5 transition-colors">
                <span className="text-gray-900">Finding Professionals</span>
                <ArrowRight className="h-4 w-4 text-[#0a9396]" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

