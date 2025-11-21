import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, CheckCircle2, Zap, Sparkles, FileText, MessageSquare } from "lucide-react";
import Link from "next/link";

const aiTools = [
  {
    name: "Topic Gap Analyzer",
    description: "Analyze top-ranking pages and generate comprehensive content outlines",
    icon: FileText,
  },
  {
    name: "On-Page Optimization Assistant",
    description: "Get real-time SEO optimizations for your content",
    icon: FileText,
  },
  {
    name: "Ad Copy Generator",
    description: "Generate 10 variations of ad copy for Google/Facebook/LinkedIn",
    icon: Sparkles,
  },
  {
    name: "Email Sequence Creator",
    description: "Generate full automation sequences with multiple email drafts",
    icon: MessageSquare,
  },
  {
    name: "Keyword Research Tool",
    description: "Find keywords, search volume, difficulty, and related keywords",
    icon: Zap,
  },
  {
    name: "Content Generator",
    description: "Generate blog posts, articles, and social media content",
    icon: FileText,
  },
];

const usageSteps = [
  "Navigate to DigitalBOX → AI Tools in your pro dashboard",
  "Click on any tool card to expand it",
  "Fill in the required information",
  "Click 'Generate' and wait for results",
  "Copy the generated content to use in your projects",
];

export default function AIToolsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#94d2bd]/10 via-[#e0e1dd]/30 to-white">
      <div className="container mx-auto max-w-4xl px-6 py-12">
        <Link
          href="/documentation/digitalbox"
          className="text-[#0a9396] hover:text-[#087579] mb-6 inline-flex items-center gap-2 font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to DigitalBOX Documentation
        </Link>

        <div className="mb-8">
          <Badge variant="primary" className="mb-4">DigitalBOX</Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Tools Tutorial</h1>
          <p className="text-lg text-gray-600">
            Learn how to use Telemoz AI-powered tools to enhance your digital marketing workflows.
          </p>
        </div>

        {/* Available Tools */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available AI Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiTools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-[#0a9396]/10 p-2">
                        <Icon className="h-5 w-5 text-[#0a9396]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{tool.name}</h3>
                        <p className="text-sm text-gray-600">{tool.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* How to Use */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">How to Use AI Tools</h3>
            <ol className="space-y-3">
              {usageSteps.map((step, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 h-6 w-6 rounded-full bg-[#0a9396] text-white text-sm font-semibold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{step}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="bg-gradient-to-br from-[#0a9396]/10 to-[#94d2bd]/10 border-[#0a9396]/30">
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Tips for Best Results</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-[#0a9396] flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Be specific with your inputs for more accurate results</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-[#0a9396] flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Review and edit generated content to match your brand voice</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-[#0a9396] flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Use multiple tools together for comprehensive marketing campaigns</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-[#0a9396] flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Save frequently used prompts for quick access</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

