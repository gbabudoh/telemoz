import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, CheckCircle2, ArrowRight, User, Mail, Lock, Shield } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    number: 1,
    title: "Choose Your Account Type",
    description: "Select whether you're a digital marketing professional (Pro) or a client looking for services.",
    details: [
      "Pro Account: For digital marketing professionals offering services",
      "Client Account: For businesses seeking digital marketing services",
      "You can change your account type later in settings",
    ],
  },
  {
    number: 2,
    title: "Fill in Your Information",
    description: "Provide your name, email, password, and location details.",
    details: [
      "Name: Your full name or business name",
      "Email: A valid email address for account verification",
      "Password: At least 8 characters long",
      "Location: Country, city, and timezone for better matching",
    ],
  },
  {
    number: 3,
    title: "Verify Your Email",
    description: "Check your email inbox for a verification link.",
    details: [
      "Click the verification link in the email",
      "If you don't receive it, check your spam folder",
      "You can request a new verification email if needed",
    ],
  },
  {
    number: 4,
    title: "Complete Your Profile",
    description: "Add details to your profile to get started.",
    details: [
      "Upload a profile picture",
      "Add your bio and specialties (for Pros)",
      "Set your availability and rates",
      "Add certifications and skills",
    ],
  },
];

export default function AccountSetupPage() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Account Setup Guide</h1>
          <p className="text-lg text-gray-600">
            Follow these steps to create and set up your Telemoz account successfully.
          </p>
        </div>

        <div className="space-y-6 mb-8">
          {steps.map((step) => (
            <Card key={step.number}>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-[#0a9396]/10 flex items-center justify-center">
                      <span className="text-xl font-bold text-[#0a9396]">{step.number}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600 mb-4">{step.description}</p>
                    <ul className="space-y-2">
                      {step.details.map((detail, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-[#0a9396] flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Tips */}
        <Card className="bg-gradient-to-br from-[#0a9396]/10 to-[#94d2bd]/10 border-[#0a9396]/30">
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-[#0a9396] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900 mb-1">Secure Account</p>
                  <p className="text-sm text-gray-600">Use a strong, unique password</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-[#0a9396] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900 mb-1">Verify Email</p>
                  <p className="text-sm text-gray-600">Check your inbox after signup</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-[#0a9396] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900 mb-1">Complete Profile</p>
                  <p className="text-sm text-gray-600">Add details for better visibility</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <div className="mt-8 flex gap-4">
          <Link href="/documentation/getting-started/first-steps" className="flex-1">
            <Button className="w-full bg-[#0a9396] hover:bg-[#087579] text-white">
              Next: First Steps After Signing Up
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

