import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, ArrowRight, Search, Users, MessageSquare } from "lucide-react";
import Link from "next/link";

const articles = [
  {
    id: "finding-pros",
    title: "Finding Digital Marketing Professionals",
    description: "Learn how to search and filter professionals in the marketplace",
  },
  {
    id: "posting-requests",
    title: "Posting Client Requests",
    description: "How to create and manage client request postings",
  },
  {
    id: "contacting-pros",
    title: "Contacting Professionals",
    description: "Guide to the internal messaging and communication system",
  },
];

export default function MarketplacePage() {
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
          <Badge variant="primary" className="mb-4">Marketplace</Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Marketplace Documentation</h1>
          <p className="text-lg text-gray-600">
            Learn how to use the Telemoz marketplace to find professionals or post your project requests.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((article) => (
            <Link key={article.id} href={`/documentation/marketplace/${article.id}`}>
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

