"use client";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  Star,
  MapPin,
  Mail,
  Calendar,
  CheckCircle2,
  Shield,
  DollarSign,
  Clock,
  Building2,
  Phone,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

// Mock data - replace with real data from API
const requestData = {
  id: "1",
  client: "Local Business Hub",
  company: "Local Business Hub",
  clientId: "client-123", // Internal client ID for messaging
  project: "Social Media Strategy",
  budget: 1200,
  category: "social",
  location: "Birmingham, UK",
  country: "United Kingdom",
  city: "Birmingham",
  timezone: "Europe/London",
  posted: "1 day ago",
  postedDate: "2024-01-20",
  description:
    "Seeking a social media strategist to help grow our online presence. We need someone with experience in content creation, community management, and social media advertising. Looking for a professional who can help us build brand awareness and engage with our target audience effectively.",
  requirements: ["Social Media", "Content Creation", "Community Management", "Social Media Advertising"],
  status: "open",
  timeline: "3-6 months",
  deliverables: [
    "Social media content calendar",
    "Monthly performance reports",
    "Community engagement strategy",
    "Paid advertising campaigns",
  ],
};

export default function RequestDetailPage({ params }: { params: { requestId: string } }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isInterested, setIsInterested] = useState(false);

  const handleContactClient = () => {
    // Navigate to internal messaging system with client ID
    router.push(`/messaging?clientId=${requestData.clientId}&requestId=${requestData.id}`);
  };

  const handleExpressInterest = () => {
    // Navigate to messaging to express interest
    router.push(`/messaging?clientId=${requestData.clientId}&requestId=${requestData.id}&action=express-interest`);
  };

  const handleScheduleCall = () => {
    // Navigate to internal call scheduling system
    router.push(`/messaging?clientId=${requestData.clientId}&requestId=${requestData.id}&action=schedule-call`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#94d2bd]/10 via-[#e0e1dd]/30 to-white py-12">
      <div className="container mx-auto max-w-5xl px-6">
        <Link
          href="/marketplace"
          className="text-[#0a9396] hover:text-[#087579] mb-6 inline-flex items-center gap-2 font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Marketplace
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[#0a9396] to-[#94d2bd] mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-white">
                    {requestData.company.charAt(0)}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">{requestData.company}</h2>
                  <p className="text-gray-600 text-sm mb-4">{requestData.client}</p>
                  <Badge variant="success" className="mb-4">{requestData.status}</Badge>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 text-[#0a9396]" />
                    <span>
                      {requestData.city && requestData.country
                        ? `${requestData.city}, ${requestData.country}`
                        : requestData.location}
                    </span>
                    {requestData.timezone && (
                      <span className="text-xs text-gray-500">
                        ({requestData.timezone.split("/")[1]})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4 text-[#0a9396]" />
                    <span>Posted {requestData.posted}</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Budget</span>
                    <span className="text-2xl font-bold text-[#0a9396]">
                      £{requestData.budget.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Timeline</span>
                    <span className="text-gray-900 font-medium">{requestData.timeline}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {session?.user ? (
                    <>
                      <Button
                        onClick={handleExpressInterest}
                        className="w-full bg-[#0a9396] hover:bg-[#087579] text-white"
                        size="lg"
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        Express Interest
                      </Button>
                      <Button
                        onClick={handleContactClient}
                        variant="outline"
                        className="w-full border-2 border-[#0a9396] text-[#0a9396] hover:bg-[#0a9396]/10"
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        Contact Client
                      </Button>
                      <Button
                        onClick={handleScheduleCall}
                        variant="outline"
                        className="w-full border-2 border-[#0a9396] text-[#0a9396] hover:bg-[#0a9396]/10"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        Schedule Call
                      </Button>
                    </>
                  ) : (
                    <Link href="/login" className="block">
                      <Button className="w-full bg-[#0a9396] hover:bg-[#087579] text-white" size="lg">
                        <Mail className="mr-2 h-4 w-4" />
                        Sign In to Contact
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Free to Use & Payment Info */}
            <Card className="border-2 border-[#0a9396]/30">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Shield className="h-6 w-6 text-[#0a9396] flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Secure & Free Marketplace</h3>
                    <p className="text-gray-700 mb-4">
                      The Telemoz marketplace is <strong>completely free to use</strong>. All payments are held securely
                      by Telemoz to protect both parties. Once work is completed and approved, payment is released to
                      the professional. Telemoz charges a <strong className="text-[#0a9396]">13% commission</strong>{" "}
                      from the professional's payment.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <DollarSign className="h-4 w-4 text-[#0a9396]" />
                      <span>No fees for clients • 13% commission on professional payments only</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Project Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed mb-6">{requestData.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                    <p className="text-sm font-medium text-gray-600 mb-1">Category</p>
                    <Badge variant="primary" size="lg">
                      {requestData.category.charAt(0).toUpperCase() + requestData.category.slice(1)}
                    </Badge>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                    <p className="text-sm font-medium text-gray-600 mb-1">Timeline</p>
                    <p className="text-lg font-semibold text-gray-900">{requestData.timeline}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {requestData.requirements.map((req) => (
                    <Badge key={req} variant="primary" size="lg">
                      {req}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Expected Deliverables</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {requestData.deliverables.map((deliverable, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-[#0a9396] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{deliverable}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">About the Client</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-[#0a9396]" />
                    <div>
                      <p className="font-semibold text-gray-900">{requestData.company}</p>
                      <p className="text-sm text-gray-600">{requestData.client}</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    {session?.user ? (
                      <Button
                        onClick={handleContactClient}
                        className="w-full bg-[#0a9396] hover:bg-[#087579] text-white"
                        size="lg"
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        Contact Client via Internal Messaging
                      </Button>
                    ) : (
                      <div className="text-center space-y-3">
                        <p className="text-sm text-gray-600">
                          Sign in to contact this client through our secure internal messaging system
                        </p>
                        <Link href="/login" className="block">
                          <Button className="w-full bg-[#0a9396] hover:bg-[#087579] text-white">
                            Sign In to Contact
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

