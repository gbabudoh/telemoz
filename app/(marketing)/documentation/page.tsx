import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  BookOpen,
  FileText,
  Video,
  Code,
  Zap,
  Users,
  Settings,
  Search,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

const categories = [
  {
    id: "getting-started",
    name: "Getting Started",
    icon: Zap,
    color: "from-blue-500 to-cyan-500",
    description: "New to Telemoz? Start here",
    articles: 8,
  },
  {
    id: "marketplace",
    name: "Marketplace",
    icon: Users,
    color: "from-emerald-500 to-teal-500",
    description: "Find and connect with professionals",
    articles: 12,
  },
  {
    id: "digitalbox",
    name: "DigitalBOX",
    icon: Settings,
    color: "from-purple-500 to-pink-500",
    description: "CRM, invoicing, and AI tools",
    articles: 25,
  },
  {
    id: "api",
    name: "API & Integrations",
    icon: Code,
    color: "from-amber-500 to-orange-500",
    description: "Developer resources and APIs",
    articles: 15,
  },
];

const popularArticles = [
  {
    id: 1,
    title: "Getting Started with Telemoz Marketplace",
    category: "Getting Started",
    readTime: "5 min read",
    views: "12.5k",
  },
  {
    id: 2,
    title: "How to Use DigitalBOX CRM",
    category: "DigitalBOX",
    readTime: "8 min read",
    views: "8.9k",
  },
  {
    id: 3,
    title: "AI Tools Guide: Content Generation",
    category: "DigitalBOX",
    readTime: "6 min read",
    views: "7.2k",
  },
  {
    id: 4,
    title: "Setting Up Your Professional Profile",
    category: "Marketplace",
    readTime: "4 min read",
    views: "6.5k",
  },
  {
    id: 5,
    title: "Payment and Commission Structure",
    category: "Getting Started",
    readTime: "3 min read",
    views: "5.8k",
  },
];

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#94d2bd]/10 via-[#e0e1dd]/30 to-white">
      <div className="container mx-auto max-w-7xl px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="rounded-lg bg-gradient-to-br from-[#0a9396] to-[#94d2bd] p-3">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Documentation</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about using Telemoz to grow your digital marketing business
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Search documentation..."
              className="w-full pl-12 pr-4 py-4 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder-gray-500 focus:border-[#0a9396] focus:outline-none focus:ring-2 focus:ring-[#0a9396]/20"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {categories.map((category) => {
            const Icon = category.icon;
            const categoryPath = category.id === "api" ? "/documentation/api" : `/documentation/${category.id}`;
            return (
              <Link key={category.id} href={categoryPath}>
                <Card className="h-full hover:border-[#0a9396]/50 hover:shadow-md transition-all cursor-pointer">
                  <CardContent className="pt-6">
                    <div className={`rounded-lg bg-gradient-to-br ${category.color} p-4 w-fit mb-4`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{category.articles} articles</span>
                      <ArrowRight className="h-4 w-4 text-[#0a9396]" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Popular Articles */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {popularArticles.map((article) => (
              <Link key={article.id} href={`/documentation/article/${article.id}`}>
                <Card className="hover:border-[#0a9396]/50 hover:shadow-md transition-all cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{article.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <Badge variant="info" size="sm">
                            {article.category}
                          </Badge>
                          <span>{article.readTime}</span>
                          <span>{article.views} views</span>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-[#0a9396] flex-shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <Card className="bg-gradient-to-br from-[#0a9396]/10 to-[#94d2bd]/10 border-[#0a9396]/30">
          <CardContent className="pt-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/documentation/getting-started/account-setup" className="flex items-center gap-3 p-3 rounded-lg bg-white hover:bg-[#0a9396]/5 transition-colors">
                <CheckCircle2 className="h-5 w-5 text-[#0a9396]" />
                <span className="text-sm font-medium text-gray-900">Account Setup Guide</span>
              </Link>
              <Link href="/documentation/marketplace/finding-pros" className="flex items-center gap-3 p-3 rounded-lg bg-white hover:bg-[#0a9396]/5 transition-colors">
                <CheckCircle2 className="h-5 w-5 text-[#0a9396]" />
                <span className="text-sm font-medium text-gray-900">Finding Professionals</span>
              </Link>
              <Link href="/documentation/digitalbox/ai-tools" className="flex items-center gap-3 p-3 rounded-lg bg-white hover:bg-[#0a9396]/5 transition-colors">
                <CheckCircle2 className="h-5 w-5 text-[#0a9396]" />
                <span className="text-sm font-medium text-gray-900">AI Tools Tutorial</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

