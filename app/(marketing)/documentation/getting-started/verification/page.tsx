import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, CheckCircle2, Shield, Mail, UserCheck } from "lucide-react";
import Link from "next/link";

const verificationSteps = [
  {
    title: "Email Verification",
    description: "Verify your email address to activate your account.",
    steps: [
      "Check your email inbox for a verification email from Telemoz",
      "Click the 'Verify Email' button in the email",
      "You'll be redirected back to Telemoz with a verified account",
      "If you didn't receive the email, check your spam folder",
    ],
    icon: Mail,
  },
  {
    title: "Profile Verification",
    description: "Get verified badge by completing your profile and meeting requirements.",
    steps: [
      "Complete at least 80% of your profile",
      "Add professional certifications (for Pros)",
      "Link your social media profiles",
      "Submit verification request from your profile page",
    ],
    icon: UserCheck,
  },
];

const benefits = [
  "Increased trust and credibility",
  "Higher visibility in search results",
  "Priority support",
  "Access to exclusive features",
];

export default function VerificationPage() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Account Verification</h1>
          <p className="text-lg text-gray-600">
            Learn how to verify your account and get the verified badge for increased trust and visibility.
          </p>
        </div>

        <div className="space-y-6 mb-8">
          {verificationSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex gap-4 mb-4">
                    <div className="flex-shrink-0">
                      <div className="rounded-lg bg-[#0a9396]/10 p-3">
                        <Icon className="h-6 w-6 text-[#0a9396]" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                      <p className="text-gray-600 mb-4">{step.description}</p>
                    </div>
                  </div>
                  <ul className="space-y-2 ml-16">
                    {step.steps.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-[#0a9396] flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Benefits */}
        <Card className="bg-gradient-to-br from-[#0a9396]/10 to-[#94d2bd]/10 border-[#0a9396]/30 mb-8">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3 mb-4">
              <Shield className="h-6 w-6 text-[#0a9396] flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Benefits of Verification</h3>
                <p className="text-gray-600 mb-4">
                  Verified accounts enjoy several advantages on the Telemoz platform:
                </p>
              </div>
            </div>
            <ul className="space-y-2">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-[#0a9396] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Troubleshooting */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Troubleshooting</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Didn't receive verification email?</h4>
                <p className="text-sm text-gray-600">
                  Check your spam folder, ensure your email address is correct, and try requesting a new verification email from your account settings.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Verification request denied?</h4>
                <p className="text-sm text-gray-600">
                  Make sure your profile is complete, all information is accurate, and you meet the verification requirements. You can reapply after 30 days.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

