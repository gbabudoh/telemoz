"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  MessageSquare,
  Star,
  CheckCircle2,
  TrendingUp,
  Search,
  MapPin,
  Clock,
  Briefcase,
  Users,
  Filter,
  Phone,
  Mail,
  ExternalLink,
  Award,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

const pros = [
  {
    id: 1,
    name: "Digital Marketing Pro",
    company: "Digital Solutions Ltd",
    type: "Agency",
    rating: 4.8,
    reviews: 127,
    status: "active",
    projects: 2,
    verified: true,
    specialties: ["SEO", "PPC", "Social Media"],
    location: "London, UK",
    availability: "Available",
    responseTime: "Usually responds within 2 hours",
    totalSpent: 12500,
    completedProjects: 5,
    certifications: ["Google Ads", "Meta Certified"],
  },
  {
    id: 2,
    name: "SEO Experts Ltd",
    company: "SEO Experts Ltd",
    type: "Company",
    rating: 4.9,
    reviews: 89,
    status: "active",
    projects: 1,
    verified: true,
    specialties: ["SEO", "Content Marketing"],
    location: "Manchester, UK",
    availability: "Available",
    responseTime: "Usually responds within 4 hours",
    totalSpent: 8500,
    completedProjects: 3,
    certifications: ["Google Analytics", "HubSpot"],
  },
];

export default function MyProsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPros = pros.filter(
    (pro) =>
      pro.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pro.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pro.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalProjects = pros.reduce((sum, pro) => sum + pro.projects, 0);
  const totalSpent = pros.reduce((sum, pro) => sum + pro.totalSpent, 0);
  const avgRating = pros.reduce((sum, pro) => sum + pro.rating, 0) / pros.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Digital Marketing Pros</h1>
          <p className="text-gray-600 mt-1">Manage your relationships with your marketing professionals</p>
        </div>
        <Link href="/marketplace">
          <Button className="bg-[#0a9396] hover:bg-[#087579] text-white">
            <Users className="mr-2 h-4 w-4" />
            Find More Pros
          </Button>
        </Link>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Pros</p>
                <p className="text-2xl font-bold text-gray-900">{pros.length}</p>
              </div>
              <div className="rounded-lg bg-[#0a9396]/10 p-3">
                <Users className="h-6 w-6 text-[#0a9396]" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Projects</p>
                <p className="text-2xl font-bold text-gray-900">{totalProjects}</p>
              </div>
              <div className="rounded-lg bg-emerald-500/10 p-3">
                <Briefcase className="h-6 w-6 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Average Rating</p>
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                  <p className="text-2xl font-bold text-gray-900">{avgRating.toFixed(1)}</p>
                </div>
              </div>
              <div className="rounded-lg bg-amber-500/10 p-3">
                <Star className="h-6 w-6 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by name, company, or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pros List */}
      {filteredPros.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pros Found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search criteria</p>
            <Link href="/marketplace">
              <Button variant="outline">Browse Marketplace</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredPros.map((pro, index) => (
            <motion.div
              key={pro.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left Section - Profile Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[#0a9396] to-[#94d2bd] flex items-center justify-center flex-shrink-0">
                        <span className="text-3xl font-bold text-white">
                          {pro.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">{pro.name}</h3>
                          {pro.verified && (
                            <Badge variant="success" size="sm" className="flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 mb-3">{pro.company} • {pro.type}</p>
                        
                        {/* Rating and Reviews */}
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            <span className="text-sm font-semibold text-gray-900">{pro.rating}</span>
                            <span className="text-sm text-gray-600">({pro.reviews} reviews)</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <MapPin className="h-4 w-4" />
                            {pro.location}
                          </div>
                        </div>

                        {/* Specialties */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {pro.specialties.map((specialty) => (
                            <Badge key={specialty} variant="info" size="sm">
                              {specialty}
                            </Badge>
                          ))}
                        </div>

                        {/* Additional Info */}
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{pro.responseTime}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Badge variant="success" size="sm">{pro.availability}</Badge>
                          </div>
                        </div>

                        {/* Certifications */}
                        {pro.certifications && pro.certifications.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {pro.certifications.map((cert, idx) => (
                              <Badge key={idx} variant="default" size="sm" className="flex items-center gap-1">
                                <Award className="h-3 w-3" />
                                {cert}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Section - Stats and Actions */}
                    <div className="lg:w-64 flex-shrink-0">
                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                          <p className="text-xs text-gray-600 mb-1">Projects</p>
                          <p className="text-lg font-bold text-gray-900">{pro.projects}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                          <p className="text-xs text-gray-600 mb-1">Completed</p>
                          <p className="text-lg font-bold text-gray-900">{pro.completedProjects}</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        <Link href={`/messaging?proId=${pro.id}`}>
                          <Button className="w-full bg-[#0a9396] hover:bg-[#087579] text-white">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Message
                          </Button>
                        </Link>
                        <Link href={`/marketplace/${pro.id}`}>
                          <Button variant="outline" className="w-full">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Profile
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm" className="w-full">
                          <TrendingUp className="mr-2 h-4 w-4" />
                          View Reports
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
