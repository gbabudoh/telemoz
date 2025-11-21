import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, CheckCircle2, ArrowRight, User, Award, MapPin } from "lucide-react";
import Link from "next/link";

const profileSections = [
  {
    title: "Basic Information",
    items: [
      "Add your full name or business name",
      "Upload a professional profile picture",
      "Write a compelling bio (150-300 words)",
      "Add your location (city and country)",
    ],
  },
  {
    title: "For Professionals",
    items: [
      "List your specialties and services",
      "Add your hourly or monthly rates",
      "Upload portfolio samples or case studies",
      "Add certifications and credentials",
      "Set your availability status",
      "Link your website, LinkedIn, or portfolio",
    ],
  },
  {
    title: "For Clients",
    items: [
      "Add your company information",
      "Describe your business needs",
      "Set your preferred budget range",
      "Specify your project requirements",
    ],
  },
];

export default function ProfileCompletionPage() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Completing Your Profile</h1>
          <p className="text-lg text-gray-600">
            A complete profile helps you stand out and connect with the right people. Follow this guide to optimize your profile.
          </p>
        </div>

        <div className="space-y-6 mb-8">
          {profileSections.map((section, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{section.title}</h3>
                <ul className="space-y-3">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-[#0a9396] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tips */}
        <Card className="bg-gradient-to-br from-[#0a9396]/10 to-[#94d2bd]/10 border-[#0a9396]/30 mb-8">
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Profile Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-[#0a9396] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900 mb-1">Be Authentic</p>
                  <p className="text-sm text-gray-600">Use real photos and honest descriptions</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Award className="h-5 w-5 text-[#0a9396] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900 mb-1">Showcase Skills</p>
                  <p className="text-sm text-gray-600">Highlight your expertise and achievements</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#0a9396] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900 mb-1">Update Regularly</p>
                  <p className="text-sm text-gray-600">Keep your profile current and relevant</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <div className="flex gap-4">
          <Link href="/documentation/getting-started/verification" className="flex-1">
            <Button className="w-full bg-[#0a9396] hover:bg-[#087579] text-white">
              Next: Account Verification
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

