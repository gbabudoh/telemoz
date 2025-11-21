"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Star, MapPin, Mail, Calendar, CheckCircle2, Shield, DollarSign, Award } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

// Mock data - replace with real data from API
const proData = {
  id: "1",
  name: "Sarah Johnson",
  title: "SEO Specialist",
  location: "London, UK",
  rating: 4.9,
  reviews: 127,
  specialties: ["SEO", "Content Marketing", "Analytics", "Technical SEO"],
  price: "£500-£2000/month",
  bio: "With over 8 years of experience in digital marketing, I specialize in helping businesses improve their search engine visibility and drive organic traffic. I've worked with startups to enterprise-level companies across various industries.",
  experience: "8+ years",
  clients: "50+",
  availability: "Available",
  certifications: [
    { name: "Google Ads Certification", issuer: "Google", issueDate: "2023-01-15", expiryDate: "2025-01-15", credentialId: "GADS-123456" },
    { name: "Meta (Facebook) Certified", issuer: "Meta", issueDate: "2023-03-20", expiryDate: "2024-03-20", credentialId: "META-789012" },
    { name: "Google Analytics Certification", issuer: "Google", issueDate: "2022-11-10", expiryDate: "2024-11-10", credentialId: "GA-456789" },
  ],
};

export default function ProProfilePage({ params }: { params: { proId: string } }) {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#94d2bd]/10 via-[#e0e1dd]/30 to-white py-20">
      <div className="container mx-auto max-w-7xl px-6">
        <Link href="/marketplace" className="text-[#0a9396] hover:text-[#087579] mb-6 inline-block font-medium">
          ← Back to Marketplace
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <div className="text-center mb-6">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-[#0a9396] to-[#94d2bd] mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-white">
                  {proData.name.charAt(0)}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{proData.name}</h2>
                <p className="text-gray-700 mb-2 font-medium">{proData.title}</p>
                <div className="flex items-center justify-center gap-1 mb-4">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-gray-900 font-semibold">{proData.rating}</span>
                  <span className="text-gray-700">({proData.reviews} reviews)</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-700 mb-4">
                  <MapPin className="h-4 w-4 text-[#0a9396]" />
                  <span>{proData.location}</span>
                </div>
                <Badge variant="success" className="mb-6">{proData.availability}</Badge>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700 font-medium">Experience</span>
                  <span className="text-gray-900 font-semibold">{proData.experience}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700 font-medium">Clients</span>
                  <span className="text-gray-900 font-semibold">{proData.clients}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700 font-medium">Starting at</span>
                  <span className="text-[#0a9396] font-semibold">{proData.price}</span>
                </div>
              </div>

              <div className="space-y-2">
                {session?.user ? (
                  <>
                    <Link href={`/messaging?proId=${proData.id}`} className="block">
                      <Button className="w-full bg-[#0a9396] hover:bg-[#087579] text-white" size="lg">
                        <Mail className="mr-2 h-4 w-4" />
                        Contact Pro
                      </Button>
                    </Link>
                    <Link href={`/messaging?proId=${proData.id}&action=schedule-call`} className="block">
                      <Button variant="outline" className="w-full border-2 border-[#0a9396] text-[#0a9396] hover:bg-[#0a9396]/10">
                        <Calendar className="mr-2 h-4 w-4" />
                        Schedule Consultation
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Link href="/login" className="block">
                    <Button className="w-full bg-[#0a9396] hover:bg-[#087579] text-white" size="lg">
                      Sign In to Contact
                    </Button>
                  </Link>
                )}
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Free to Use & Payment Info */}
            <Card variant="gradient" className="border-2 border-[#0a9396]/30">
              <div className="flex items-start gap-4">
                <Shield className="h-6 w-6 text-[#0a9396] flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Secure & Free Marketplace</h3>
                  <p className="text-gray-700 mb-4">
                    The Telemoz marketplace is <strong>completely free to use</strong>. All payments are held securely 
                    by Telemoz to protect both parties. Once work is completed and approved, payment is released to 
                    the professional. Telemoz charges a <strong className="text-[#0a9396]">13% commission</strong> from 
                    the professional's payment.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <DollarSign className="h-4 w-4 text-[#0a9396]" />
                    <span>No fees for clients • 13% commission on professional payments only</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">About</h3>
              <p className="text-gray-700 leading-relaxed">{proData.bio}</p>
            </Card>

            <Card>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {proData.specialties.map((specialty) => (
                  <Badge key={specialty} variant="primary" size="lg">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </Card>

            {proData.certifications && proData.certifications.length > 0 && (
              <Card>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="h-6 w-6 text-[#0a9396]" />
                  Certifications & Badges
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {proData.certifications.map((cert, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg border border-gray-200 bg-gradient-to-br from-white to-gray-50"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-[#0a9396]/10">
                          <Award className="h-5 w-5 text-[#0a9396]" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{cert.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">Issued by: {cert.issuer}</p>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span>Issued: {new Date(cert.issueDate).toLocaleDateString()}</span>
                            {cert.expiryDate && (
                              <span>Expires: {new Date(cert.expiryDate).toLocaleDateString()}</span>
                            )}
                          </div>
                          {cert.credentialId && (
                            <p className="text-xs text-gray-500 mt-1">ID: {cert.credentialId}</p>
                          )}
                        </div>
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            <Card>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">What's Included</h3>
              <ul className="space-y-2">
                {[
                  "Monthly SEO audit and reporting",
                  "Keyword research and optimization",
                  "On-page and technical SEO",
                  "Content strategy and optimization",
                  "Link building outreach",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-[#0a9396] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

