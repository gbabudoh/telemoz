import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, CheckCircle2, Search, Filter, MapPin, Award } from "lucide-react";
import Link from "next/link";

const searchTips = [
  {
    title: "Use Search Bar",
    description: "Type keywords related to the service you need, such as 'SEO', 'Social Media', or 'PPC'.",
  },
  {
    title: "Filter by Category",
    description: "Browse professionals by service categories like SEO, Content Marketing, PPC, Social Media, etc.",
  },
  {
    title: "Filter by Location",
    description: "Use the country filter to find professionals in your region or timezone for better collaboration.",
  },
  {
    title: "Check Certifications",
    description: "Look for verified professionals with certifications from Google, Meta, HubSpot, and others.",
  },
  {
    title: "Review Profiles",
    description: "Read professional profiles, reviews, portfolios, and ratings before making contact.",
  },
];

export default function FindingProsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#94d2bd]/10 via-[#e0e1dd]/30 to-white">
      <div className="container mx-auto max-w-4xl px-6 py-12">
        <Link
          href="/documentation/marketplace"
          className="text-[#0a9396] hover:text-[#087579] mb-6 inline-flex items-center gap-2 font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Marketplace Documentation
        </Link>

        <div className="mb-8">
          <Badge variant="primary" className="mb-4">Marketplace</Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Finding Digital Marketing Professionals</h1>
          <p className="text-lg text-gray-600">
            Learn how to effectively search and filter professionals in the Telemoz marketplace.
          </p>
        </div>

        <div className="space-y-6 mb-8">
          {searchTips.map((tip, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="rounded-lg bg-[#0a9396]/10 p-3">
                      {index === 0 && <Search className="h-6 w-6 text-[#0a9396]" />}
                      {index === 1 && <Filter className="h-6 w-6 text-[#0a9396]" />}
                      {index === 2 && <MapPin className="h-6 w-6 text-[#0a9396]" />}
                      {index === 3 && <Award className="h-6 w-6 text-[#0a9396]" />}
                      {index === 4 && <CheckCircle2 className="h-6 w-6 text-[#0a9396]" />}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{tip.title}</h3>
                    <p className="text-gray-600">{tip.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Best Practices */}
        <Card className="bg-gradient-to-br from-[#0a9396]/10 to-[#94d2bd]/10 border-[#0a9396]/30">
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Best Practices</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-[#0a9396] flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">
                  <strong>Be Specific:</strong> Use detailed search terms to find professionals with the exact skills you need.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-[#0a9396] flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">
                  <strong>Check Reviews:</strong> Read client reviews and ratings to gauge professional quality.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-[#0a9396] flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">
                  <strong>Compare Rates:</strong> Review hourly and monthly rates to find professionals within your budget.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-[#0a9396] flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">
                  <strong>Verify Availability:</strong> Check if professionals are currently available or have capacity for new projects.
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

