"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  Search,
  Star,
  MapPin,
  Filter,
  Users,
  Briefcase,
  CheckCircle2,
  X,
  TrendingUp,
  DollarSign,
  Clock,
  Mail,
  Phone,
  Award,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { allCountries, regions, countriesByRegion } from "@/lib/countries";

// Categories for filtering
const categories = [
  { id: "all", name: "All Categories", icon: Briefcase },
  { id: "seo", name: "SEO", icon: TrendingUp },
  { id: "ppc", name: "PPC & Ads", icon: DollarSign },
  { id: "social", name: "Social Media", icon: Users },
  { id: "content", name: "Content Marketing", icon: Mail },
  { id: "email", name: "Email Marketing", icon: Mail },
  { id: "analytics", name: "Analytics", icon: TrendingUp },
];

// Helper to get countries for filter
const getCountriesForFilter = () => {
  const result: Array<{ id: string; name: string; region: string }> = [];
  regions.forEach((region) => {
    countriesByRegion[region].forEach((country) => {
      result.push({
        id: country.name,
        name: country.name,
        region: country.region,
      });
    });
  });
  return result;
};

// Mock data - replace with real data from API
const pros = [
  {
    id: "1",
    name: "Sarah Johnson",
    title: "SEO Specialist",
    location: "London, UK",
    country: "United Kingdom",
    city: "London",
    timezone: "Europe/London",
    rating: 4.9,
    reviews: 127,
    specialties: ["SEO", "Content Marketing", "Analytics"],
    price: "£500-£2000/month",
    category: "seo",
    verified: true,
    availability: "available",
    certifications: [
      { name: "Google Ads Certification", issuer: "Google", issueDate: "2023-01-15", expiryDate: "2025-01-15" },
      { name: "Meta (Facebook) Certified", issuer: "Meta", issueDate: "2023-03-20", expiryDate: "2024-03-20" },
    ],
  },
  {
    id: "2",
    name: "Michael Chen",
    title: "PPC Expert",
    location: "Manchester, UK",
    country: "United Kingdom",
    city: "Manchester",
    timezone: "Europe/London",
    rating: 4.8,
    reviews: 89,
    specialties: ["Google Ads", "Facebook Ads", "Conversion Optimization"],
    price: "£800-£3000/month",
    category: "ppc",
    verified: true,
    availability: "available",
    certifications: [
      { name: "Google Ads Certification", issuer: "Google", issueDate: "2023-01-15" },
    ],
  },
  {
    id: "3",
    name: "Emma Williams",
    title: "Social Media Strategist",
    location: "Birmingham, UK",
    country: "United Kingdom",
    city: "Birmingham",
    timezone: "Europe/London",
    rating: 4.7,
    reviews: 156,
    specialties: ["Social Media", "Content Creation", "Community Management"],
    price: "£400-£1500/month",
    category: "social",
    verified: true,
    availability: "available",
    certifications: [
      { name: "HubSpot Content Marketing", issuer: "HubSpot", issueDate: "2023-05-10" },
    ],
  },
  {
    id: "4",
    name: "David Thompson",
    title: "Content Marketing Expert",
    location: "Edinburgh, UK",
    country: "United Kingdom",
    city: "Edinburgh",
    timezone: "Europe/London",
    rating: 4.9,
    reviews: 203,
    specialties: ["Content Strategy", "Blog Writing", "SEO Content"],
    price: "£600-£2500/month",
    category: "content",
    verified: true,
    availability: "busy",
    certifications: [
      { name: "Google Analytics Certification", issuer: "Google", issueDate: "2022-11-10" },
      { name: "SEMrush SEO Toolkit", issuer: "SEMrush", issueDate: "2023-02-15" },
    ],
  },
];

const clientRequests = [
  {
    id: "1",
    client: "TechStart Inc.",
    company: "TechStart Inc.",
    project: "SEO Optimization Campaign",
    budget: 2500,
    category: "seo",
    location: "London, UK",
    country: "United Kingdom",
    city: "London",
    timezone: "Europe/London",
    posted: "2 hours ago",
    description: "Looking for an SEO specialist to optimize our website and improve search rankings.",
    requirements: ["Technical SEO", "Content Strategy", "Analytics"],
    status: "open",
  },
  {
    id: "2",
    client: "E-Commerce Pro",
    company: "E-Commerce Pro Ltd",
    project: "PPC Management",
    budget: 1800,
    category: "ppc",
    location: "Manchester, UK",
    country: "United Kingdom",
    city: "Manchester",
    timezone: "Europe/London",
    posted: "5 hours ago",
    description: "Need a PPC expert to manage our Google Ads and Facebook Ads campaigns.",
    requirements: ["Google Ads", "Facebook Ads", "Conversion Optimization"],
    status: "open",
  },
  {
    id: "3",
    client: "Local Business Hub",
    company: "Local Business Hub",
    project: "Social Media Strategy",
    budget: 1200,
    category: "social",
    location: "Birmingham, UK",
    country: "United Kingdom",
    city: "Birmingham",
    timezone: "Europe/London",
    posted: "1 day ago",
    description: "Seeking a social media strategist to help grow our online presence.",
    requirements: ["Social Media", "Content Creation", "Community Management"],
    status: "open",
  },
];

export default function MarketplacePage() {
  const [activeTab, setActiveTab] = useState<"experts" | "requests">("experts");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPros = pros.filter((pro) => {
    const matchesCategory = selectedCategory === "all" || pro.category === selectedCategory;
    const matchesCountry = selectedCountry === "all" || pro.country === selectedCountry;
    const matchesSearch =
      searchQuery === "" ||
      pro.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pro.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pro.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      pro.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pro.country?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pro.city?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesCountry && matchesSearch;
  });

  const filteredRequests = clientRequests.filter((request) => {
    const matchesCategory = selectedCategory === "all" || request.category === selectedCategory;
    const matchesCountry = selectedCountry === "all" || request.country === selectedCountry;
    const matchesSearch =
      searchQuery === "" ||
      request.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.requirements.some((r) => r.toLowerCase().includes(searchQuery.toLowerCase())) ||
      request.country?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.city?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesCountry && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#94d2bd]/10 via-[#e0e1dd]/30 to-white py-12">
      <div className="container mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-[#0a9396] mb-4">
            Digital Marketing Marketplace
          </h1>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto font-medium">
            Connect with top professionals or find your next project opportunity
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <Button
            variant={activeTab === "experts" ? "primary" : "outline"}
            onClick={() => setActiveTab("experts")}
            className="px-6 py-3"
          >
            <Users className="mr-2 h-5 w-5" />
            Find Digital Marketing Experts
          </Button>
          <Button
            variant={activeTab === "requests" ? "primary" : "outline"}
            onClick={() => setActiveTab("requests")}
            className="px-6 py-3"
          >
            <Briefcase className="mr-2 h-5 w-5" />
            Find Client Request Postings
          </Button>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#0a9396]" />
            <Input
              type="search"
              placeholder={
                activeTab === "experts"
                  ? "Search by specialty, location, or name..."
                  : "Search by project, client, or requirements..."
              }
              className="pl-12 h-14 text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-6">
          {/* Category Filters */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-5 w-5 text-[#0a9396]" />
              <h3 className="text-lg font-semibold text-gray-900">Filter by Category</h3>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedCategory === category.id
                        ? "bg-[#0a9396] text-white shadow-md"
                        : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {category.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Country Filter */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-[#0a9396]" />
              <h3 className="text-lg font-semibold text-gray-900">Filter by Country</h3>
            </div>
            <div className="max-w-md mx-auto">
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:border-[#0a9396] focus:outline-none focus:ring-2 focus:ring-[#0a9396]/20 shadow-sm"
              >
                <option value="all">All Countries</option>
                {regions.map((region) => (
                  <optgroup key={region} label={region}>
                    {countriesByRegion[region].map((country, index) => (
                      <option key={`${region}-${country.id}-${index}`} value={country.name}>
                        {country.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        {activeTab === "experts" ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Digital Marketing Experts ({filteredPros.length})
              </h2>
            </div>

            {filteredPros.length === 0 ? (
              <Card className="p-12 text-center">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No experts found</h3>
                <p className="text-gray-600">
                  Try adjusting your search or filter criteria
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPros.map((pro, index) => (
                  <motion.div
                    key={pro.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link href={`/marketplace/${pro.id}`}>
                      <Card className="h-full hover:border-[#0a9396]/50 hover:shadow-lg transition-all cursor-pointer group">
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-xl font-semibold text-gray-900">{pro.name}</h3>
                                {pro.verified && (
                                  <CheckCircle2 className="h-5 w-5 text-[#0a9396]" />
                                )}
                              </div>
                              <p className="text-gray-700 font-medium">{pro.title}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-gray-900 font-semibold">{pro.rating}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-700 mb-4">
                            <MapPin className="h-4 w-4 text-[#0a9396]" />
                            <span>
                              {pro.city && pro.country ? `${pro.city}, ${pro.country}` : pro.location}
                            </span>
                            {pro.timezone && (
                              <span className="text-xs text-gray-500">
                                ({pro.timezone.split("/")[1]})
                              </span>
                            )}
                            {pro.availability === "available" && (
                              <Badge variant="success" size="sm" className="ml-auto">
                                Available
                              </Badge>
                            )}
                            {pro.availability === "busy" && (
                              <Badge variant="warning" size="sm" className="ml-auto">
                                Busy
                              </Badge>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {pro.specialties.slice(0, 3).map((specialty) => (
                              <Badge key={specialty} variant="primary" size="sm">
                                {specialty}
                              </Badge>
                            ))}
                            {pro.specialties.length > 3 && (
                              <Badge variant="secondary" size="sm">
                                +{pro.specialties.length - 3} more
                              </Badge>
                            )}
                          </div>

                          {/* Certifications Badge */}
                          {pro.certifications && pro.certifications.length > 0 && (
                            <div className="flex items-center gap-2 mb-4">
                              <Award className="h-4 w-4 text-[#0a9396]" />
                              <span className="text-xs text-gray-600 font-medium">
                                {pro.certifications.length} Certification{pro.certifications.length !== 1 ? "s" : ""}
                              </span>
                              <div className="flex gap-1">
                                {pro.certifications.slice(0, 3).map((cert: any, idx: number) => (
                                  <Badge key={idx} variant="success" size="sm" className="text-xs">
                                    {cert.issuer}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                            <span className="text-sm text-gray-700 font-medium">
                              {pro.reviews} reviews
                            </span>
                            <span className="text-[#0a9396] font-semibold text-lg">
                              {pro.price}
                            </span>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Client Request Postings ({filteredRequests.length})
              </h2>
            </div>

            {filteredRequests.length === 0 ? (
              <Card className="p-12 text-center">
                <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No requests found</h3>
                <p className="text-gray-600">
                  Try adjusting your search or filter criteria
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRequests.map((request, index) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:border-[#0a9396]/50 hover:shadow-lg transition-all group">
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 mb-1">
                              {request.project}
                            </h3>
                            <p className="text-gray-600 text-sm">{request.company}</p>
                          </div>
                          <Badge variant="success" size="sm">
                            {request.status}
                          </Badge>
                        </div>

                        <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                          {request.description}
                        </p>

                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                          <MapPin className="h-4 w-4 text-[#0a9396]" />
                          <span>
                            {request.city && request.country
                              ? `${request.city}, ${request.country}`
                              : request.location}
                          </span>
                          {request.timezone && (
                            <span className="text-xs text-gray-500">
                              ({request.timezone.split("/")[1]})
                            </span>
                          )}
                          <span className="mx-2">•</span>
                          <Clock className="h-4 w-4 text-[#0a9396]" />
                          <span>{request.posted}</span>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {request.requirements.slice(0, 2).map((req) => (
                            <Badge key={req} variant="primary" size="sm">
                              {req}
                            </Badge>
                          ))}
                          {request.requirements.length > 2 && (
                            <Badge variant="secondary" size="sm">
                              +{request.requirements.length - 2} more
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-[#0a9396]" />
                            <span className="text-gray-900 font-semibold text-lg">
                              £{request.budget.toLocaleString()}
                            </span>
                          </div>
                          <Link href={`/marketplace/requests/${request.id}`}>
                            <Button size="sm" className="bg-[#0a9396] hover:bg-[#087579] text-white">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
