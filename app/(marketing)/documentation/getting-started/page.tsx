import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

const articles = [
  {
    id: "account-setup",
    title: "Account Setup Guide",
    description: "Learn how to create and configure your Telemoz account",
  },
  {
    id: "first-steps",
    title: "First Steps After Signing Up",
    description: "What to do after creating your account",
  },
  {
    id: "profile-completion",
    title: "Completing Your Profile",
    description: "How to set up your professional or client profile",
  },
  {
    id: "verification",
    title: "Account Verification",
    description: "Verify your account and get verified badge",
  },
];

export default function GettingStartedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#94d2bd]/10 via-[#e0e1dd]/30 to-white">
      <div className="container mx-auto max-w-4xl px-6 py-12">
        <Link
          href="/documentation"
          className="text-[#0a9396] hover:text-[#087579] mb-6 inline-flex items-center gap-2 font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Documentation
        </Link>

        <div className="mb-8">
          <Badge variant="primary" className="mb-4">Getting Started</Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Getting Started</h1>
          <p className="text-lg text-gray-600">
            New to Telemoz? Start here to learn the basics and get up and running quickly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((article) => (
            <Link key={article.id} href={`/documentation/getting-started/${article.id}`}>
              <Card className="h-full hover:border-[#0a9396]/50 hover:shadow-md transition-all cursor-pointer">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{article.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{article.description}</p>
                  <div className="flex items-center text-[#0a9396] font-medium text-sm">
                    Read Article
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

