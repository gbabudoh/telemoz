"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  Zap,
  Sparkles,
  FileText,
  MessageSquare,
  TrendingUp,
  Search,
  Loader2,
  Copy,
  CheckCircle2,
  Link2,
  Hash,
  PenTool,
  Target,
  BarChart3,
  Type,
  Mail,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const aiTools = [
  {
    id: 1,
    name: "Topic Gap Analyzer",
    description: "Analyze top-ranking pages and generate comprehensive content outlines",
    icon: Search,
    category: "SEO",
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: 2,
    name: "On-Page Optimization Assistant",
    description: "Get real-time SEO optimizations for your content",
    icon: FileText,
    category: "SEO",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 3,
    name: "Ad Copy Generator",
    description: "Generate 10 variations of ad copy for Google/Facebook/LinkedIn",
    icon: Sparkles,
    category: "PPC",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: 4,
    name: "Email Sequence Creator",
    description: "Generate full automation sequences with multiple email drafts",
    icon: MessageSquare,
    category: "Email Marketing",
    color: "from-amber-500 to-orange-500",
  },
  {
    id: 5,
    name: "Keyword Research Tool",
    description: "Find keywords, search volume, difficulty, and related keywords",
    icon: Hash,
    category: "SEO",
    color: "from-indigo-500 to-purple-500",
  },
  {
    id: 6,
    name: "Content Generator",
    description: "Generate blog posts, articles, and social media content",
    icon: PenTool,
    category: "Content Marketing",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: 7,
    name: "Link Building Outreach",
    description: "Generate personalized outreach emails for link building",
    icon: Link2,
    category: "SEO",
    color: "from-cyan-500 to-blue-500",
  },
  {
    id: 8,
    name: "Social Media Content Generator",
    description: "Create platform-specific content for Instagram, Twitter, LinkedIn",
    icon: MessageSquare,
    category: "Social Media",
    color: "from-pink-500 to-rose-500",
  },
  {
    id: 9,
    name: "Competitor Analysis Tool",
    description: "Analyze competitor keywords, content, and SEO strategies",
    icon: BarChart3,
    category: "SEO",
    color: "from-violet-500 to-purple-500",
  },
  {
    id: 10,
    name: "Headline Generator",
    description: "Generate multiple headline variations for A/B testing",
    icon: Type,
    category: "Content Marketing",
    color: "from-orange-500 to-red-500",
  },
  {
    id: 11,
    name: "Subject Line Generator",
    description: "Create high open-rate email subject lines",
    icon: Mail,
    category: "Email Marketing",
    color: "from-teal-500 to-cyan-500",
  },
  {
    id: 12,
    name: "Landing Page Copy Generator",
    description: "Generate conversion-focused landing page copy",
    icon: Target,
    category: "PPC",
    color: "from-red-500 to-pink-500",
  },
];

export default function AIToolsPage() {
  const [activeTool, setActiveTool] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<string>("");
  const [copied, setCopied] = useState(false);

  // Form states for each tool
  const [topicGapData, setTopicGapData] = useState({ url: "", keyword: "" });
  const [seoOptData, setSeoOptData] = useState({ url: "", content: "" });
  const [adCopyData, setAdCopyData] = useState({
    product: "",
    targetAudience: "",
    usp: "",
    platform: "Google",
  });
  const [emailData, setEmailData] = useState({
    purpose: "",
    audience: "",
    sequenceLength: "3",
  });
  const [keywordData, setKeywordData] = useState({
    seedKeyword: "",
    location: "United Kingdom",
    language: "English",
  });
  const [contentData, setContentData] = useState({
    topic: "",
    type: "blog-post",
    length: "1500",
    tone: "professional",
  });
  const [linkBuildingData, setLinkBuildingData] = useState({
    targetWebsite: "",
    targetPage: "",
    yourWebsite: "",
    approach: "guest-post",
  });
  const [socialMediaData, setSocialMediaData] = useState({
    topic: "",
    platform: "Instagram",
    postType: "caption",
    tone: "engaging",
  });
  const [competitorData, setCompetitorData] = useState({
    competitorUrl: "",
    yourUrl: "",
    analysisType: "keywords",
  });
  const [headlineData, setHeadlineData] = useState({
    topic: "",
    type: "blog",
    count: "10",
  });
  const [subjectLineData, setSubjectLineData] = useState({
    emailTopic: "",
    goal: "open-rate",
    count: "10",
  });
  const [landingPageData, setLandingPageData] = useState({
    product: "",
    targetAudience: "",
    valueProposition: "",
    cta: "Sign Up",
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTopicGapAnalysis = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/ai/topic-gap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(topicGapData),
      });
      const data = await response.json();
      setResults(data.analysis || data.error || "Analysis generated successfully!");
    } catch (error) {
      setResults(error instanceof Error ? error.message : "Error generating analysis. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSEOOptimization = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/ai/seo-optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(seoOptData),
      });
      const data = await response.json();
      setResults(data.optimizations || data.error || "Optimizations generated successfully!");
    } catch (error) {
      setResults(error instanceof Error ? error.message : "Error generating optimizations. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdCopyGeneration = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/ai/generate-copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: adCopyData.product,
          targetAudience: adCopyData.targetAudience,
          usp: adCopyData.usp,
          platform: adCopyData.platform,
        }),
      });
      const data = await response.json();
      setResults(data.adCopy || data.error || "Ad copy generated successfully!");
    } catch (error) {
      setResults(error instanceof Error ? error.message : "Error generating ad copy. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSequence = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/ai/email-sequence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailData),
      });
      const data = await response.json();
      setResults(data.sequence || data.error || "Email sequence generated successfully!");
    } catch (error) {
      setResults(error instanceof Error ? error.message : "Error generating email sequence. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeywordResearch = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/ai/keyword-research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(keywordData),
      });
      const data = await response.json();
      setResults(data.keywords || data.error || "Keywords generated successfully!");
    } catch (error) {
      setResults(error instanceof Error ? error.message : "Error generating keywords. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleContentGeneration = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/ai/content-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contentData),
      });
      const data = await response.json();
      setResults(data.content || data.error || "Content generated successfully!");
    } catch (error) {
      setResults(error instanceof Error ? error.message : "Error generating content. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkBuilding = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/ai/link-building", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(linkBuildingData),
      });
      const data = await response.json();
      setResults(data.outreach || data.error || "Outreach emails generated successfully!");
    } catch (error) {
      setResults(error instanceof Error ? error.message : "Error generating outreach emails. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialMediaGeneration = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/ai/social-media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(socialMediaData),
      });
      const data = await response.json();
      setResults(data.content || data.error || "Social media content generated successfully!");
    } catch (error) {
      setResults(error instanceof Error ? error.message : "Error generating social media content. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompetitorAnalysis = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/ai/competitor-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(competitorData),
      });
      const data = await response.json();
      setResults(data.analysis || data.error || "Competitor analysis generated successfully!");
    } catch (error) {
      setResults(error instanceof Error ? error.message : "Error generating competitor analysis. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleHeadlineGeneration = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/ai/headline-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(headlineData),
      });
      const data = await response.json();
      setResults(data.headlines || data.error || "Headlines generated successfully!");
    } catch (error) {
      setResults(error instanceof Error ? error.message : "Error generating headlines. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubjectLineGeneration = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/ai/subject-line-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subjectLineData),
      });
      const data = await response.json();
      setResults(data.subjectLines || data.error || "Subject lines generated successfully!");
    } catch (error) {
      setResults(error instanceof Error ? error.message : "Error generating subject lines. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLandingPageGeneration = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/ai/landing-page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(landingPageData),
      });
      const data = await response.json();
      setResults(data.copy || data.error || "Landing page copy generated successfully!");
    } catch (error) {
      setResults(error instanceof Error ? error.message : "Error generating landing page copy. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderToolInterface = () => {
    const tool = aiTools.find((t) => t.id === activeTool);
    if (!tool) {
      return (
        <div className="h-full flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-white/50 border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a9396]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-white to-[#0a9396]/5 flex items-center justify-center mb-8 shadow-xl shadow-[#0a9396]/10 border border-[#0a9396]/20 relative z-10 transition-transform duration-500 group-hover:scale-105">
            <Sparkles className="h-10 w-10 text-[#0a9396]" />
            <div className="absolute -inset-2 bg-[#0a9396]/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 mb-4 tracking-tight relative z-10">
            Welcome to Your AI Workspace
          </h2>
          <p className="text-gray-500 max-w-md mx-auto mb-10 text-base leading-relaxed relative z-10">
            Select an AI tool from the library to instantly generate content, optimize your SEO, or build high-converting marketing campaigns.
          </p>
          <div className="grid grid-cols-2 gap-4 w-full max-w-lg relative z-10">
            <div className="p-4 rounded-xl bg-white/80 border border-gray-100/80 shadow-sm flex items-center gap-3 backdrop-blur-sm hover:border-[#0a9396]/20 transition-colors">
              <div className="p-2 bg-amber-100/50 rounded-lg">
                <Zap className="h-5 w-5 text-amber-500" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900 text-sm">Instant Results</div>
                <div className="text-xs text-gray-500">Powered by latest models</div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white/80 border border-gray-100/80 shadow-sm flex items-center gap-3 backdrop-blur-sm hover:border-[#0a9396]/20 transition-colors">
              <div className="p-2 bg-teal-100/50 rounded-lg">
                <BarChart3 className="h-5 w-5 text-[#0a9396]" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900 text-sm">Data Driven</div>
                <div className="text-xs text-gray-500">Optimized for conversion</div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    const Icon = tool.icon;

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={tool.id}
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: -10 }}
          className="h-full"
        >
          <Card className="h-full border-none shadow-xl bg-white/80 backdrop-blur-xl overflow-hidden flex flex-col">
            <div className={`h-2 w-full bg-gradient-to-r ${tool.color}`} />
            <CardHeader className="pb-4 border-b border-gray-100/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`rounded-xl bg-gradient-to-br ${tool.color} p-3.5 shadow-sm`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900 mb-1">{tool.name}</CardTitle>
                    <CardDescription className="text-base text-gray-500">{tool.description}</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {/* Topic Gap Analyzer */}
              {activeTool === 1 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">Target URL</label>
                      <Input
                        placeholder="https://example.com/page"
                        value={topicGapData.url}
                        onChange={(e) => setTopicGapData({ ...topicGapData, url: e.target.value })}
                        className="bg-white/50 focus:bg-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">Target Keyword</label>
                      <Input
                        placeholder="e.g., digital marketing services"
                        value={topicGapData.keyword}
                        onChange={(e) => setTopicGapData({ ...topicGapData, keyword: e.target.value })}
                        className="bg-white/50 focus:bg-white"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleTopicGapAnalysis}
                    disabled={!topicGapData.url || !topicGapData.keyword || isLoading}
                    className="w-full bg-gradient-to-r from-[#0a9396] to-teal-500 hover:from-[#087579] hover:to-teal-600 text-white shadow-md shadow-[#0a9396]/20 transition-all cursor-pointer h-12 text-base font-medium mt-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Analyze Topic Gaps
                      </>
                    )}
                  </Button>
                </>
              )}

              {/* On-Page Optimization */}
              {activeTool === 2 && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Page URL</label>
                    <Input
                      placeholder="https://example.com/page"
                      value={seoOptData.url}
                      onChange={(e) => setSeoOptData({ ...seoOptData, url: e.target.value })}
                      className="bg-white/50 focus:bg-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Content</label>
                    <textarea
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/50 focus:bg-white text-sm text-gray-900 placeholder-gray-400 focus:border-[#0a9396] focus:outline-none focus:ring-2 focus:ring-[#0a9396]/20 transition-all min-h-[140px] resize-y"
                      placeholder="Paste your content here..."
                      value={seoOptData.content}
                      onChange={(e) => setSeoOptData({ ...seoOptData, content: e.target.value })}
                    />
                  </div>
                  <Button
                    onClick={handleSEOOptimization}
                    disabled={!seoOptData.url || !seoOptData.content || isLoading}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer h-12 text-base font-medium mt-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Optimizing...
                      </>
                    ) : (
                      <>
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Optimize Content
                      </>
                    )}
                  </Button>
                </>
              )}

              {/* Ad Copy Generator */}
              {activeTool === 3 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">Product/Service</label>
                      <Input
                        placeholder="e.g., digital marketing services"
                        value={adCopyData.product}
                        onChange={(e) => setAdCopyData({ ...adCopyData, product: e.target.value })}
                        className="bg-white/50 focus:bg-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">Target Audience</label>
                      <Input
                        placeholder="e.g., small business owners"
                        value={adCopyData.targetAudience}
                        onChange={(e) => setAdCopyData({ ...adCopyData, targetAudience: e.target.value })}
                        className="bg-white/50 focus:bg-white"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">Unique Selling Point</label>
                      <Input
                        placeholder="e.g., 24/7 support, proven results"
                        value={adCopyData.usp}
                        onChange={(e) => setAdCopyData({ ...adCopyData, usp: e.target.value })}
                        className="bg-white/50 focus:bg-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">Platform</label>
                      <select
                        value={adCopyData.platform}
                        onChange={(e) => setAdCopyData({ ...adCopyData, platform: e.target.value })}
                        className="w-full px-4 h-10 rounded-lg border border-gray-200 bg-white/50 focus:bg-white text-sm text-gray-900 focus:border-[#0a9396] focus:outline-none focus:ring-2 focus:ring-[#0a9396]/20"
                      >
                        <option value="Google">Google Ads</option>
                        <option value="Facebook">Facebook Ads</option>
                        <option value="LinkedIn">LinkedIn Ads</option>
                        <option value="Twitter">Twitter Ads</option>
                      </select>
                    </div>
                  </div>
                  <Button
                    onClick={handleAdCopyGeneration}
                    disabled={!adCopyData.product || !adCopyData.targetAudience || isLoading}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-md shadow-purple-500/20 transition-all cursor-pointer h-12 text-base font-medium mt-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Ad Copy
                      </>
                    )}
                  </Button>
                </>
              )}

              {/* Email Sequence Creator */}
              {activeTool === 4 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">Email Purpose</label>
                      <Input
                        placeholder="e.g., welcome series"
                        value={emailData.purpose}
                        onChange={(e) => setEmailData({ ...emailData, purpose: e.target.value })}
                        className="bg-white/50 focus:bg-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">Target Audience</label>
                      <Input
                        placeholder="e.g., new subscribers"
                        value={emailData.audience}
                        onChange={(e) => setEmailData({ ...emailData, audience: e.target.value })}
                        className="bg-white/50 focus:bg-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Sequence Length</label>
                    <select
                      value={emailData.sequenceLength}
                      onChange={(e) => setEmailData({ ...emailData, sequenceLength: e.target.value })}
                      className="w-full px-4 h-10 rounded-lg border border-gray-200 bg-white/50 focus:bg-white text-sm text-gray-900 focus:border-[#0a9396] focus:outline-none focus:ring-2 focus:ring-[#0a9396]/20"
                    >
                      <option value="3">3 emails</option>
                      <option value="5">5 emails</option>
                      <option value="7">7 emails</option>
                      <option value="10">10 emails</option>
                    </select>
                  </div>
                  <Button
                    onClick={handleEmailSequence}
                    disabled={!emailData.purpose || !emailData.audience || isLoading}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md shadow-amber-500/20 transition-all cursor-pointer h-12 text-base font-medium mt-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Generate Email Sequence
                      </>
                    )}
                  </Button>
                </>
              )}

              {/* Keyword Research Tool */}
              {activeTool === 5 && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Seed Keyword</label>
                    <Input
                      placeholder="e.g., digital marketing"
                      value={keywordData.seedKeyword}
                      onChange={(e) => setKeywordData({ ...keywordData, seedKeyword: e.target.value })}
                      className="bg-white/50 focus:bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">Location</label>
                      <select
                        value={keywordData.location}
                        onChange={(e) => setKeywordData({ ...keywordData, location: e.target.value })}
                        className="w-full px-4 h-10 rounded-lg border border-gray-200 bg-white/50 focus:bg-white text-sm text-gray-900 focus:border-[#0a9396] focus:outline-none focus:ring-2 focus:ring-[#0a9396]/20"
                      >
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="Australia">Australia</option>
                        <option value="Global">Global</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">Language</label>
                      <select
                        value={keywordData.language}
                        onChange={(e) => setKeywordData({ ...keywordData, language: e.target.value })}
                        className="w-full px-4 h-10 rounded-lg border border-gray-200 bg-white/50 focus:bg-white text-sm text-gray-900 focus:border-[#0a9396] focus:outline-none focus:ring-2 focus:ring-[#0a9396]/20"
                      >
                        <option value="English">English</option>
                        <option value="Spanish">Spanish</option>
                        <option value="French">French</option>
                        <option value="German">German</option>
                      </select>
                    </div>
                  </div>
                  <Button
                    onClick={handleKeywordResearch}
                    disabled={!keywordData.seedKeyword || isLoading}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-md shadow-indigo-500/20 transition-all cursor-pointer h-12 text-base font-medium mt-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Researching...
                      </>
                    ) : (
                      <>
                        <Hash className="mr-2 h-4 w-4" />
                        Research Keywords
                      </>
                    )}
                  </Button>
                </>
              )}

              {/* Content Generator */}
              {activeTool === 6 && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Topic</label>
                    <Input
                      placeholder="e.g., How to improve SEO in 2024"
                      value={contentData.topic}
                      onChange={(e) => setContentData({ ...contentData, topic: e.target.value })}
                      className="bg-white/50 focus:bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">Content Type</label>
                      <select
                        value={contentData.type}
                        onChange={(e) => setContentData({ ...contentData, type: e.target.value })}
                        className="w-full px-4 h-10 rounded-lg border border-gray-200 bg-white/50 focus:bg-white text-sm text-gray-900 focus:border-[#0a9396] focus:outline-none focus:ring-2 focus:ring-[#0a9396]/20"
                      >
                        <option value="blog-post">Blog Post</option>
                        <option value="article">Article</option>
                        <option value="guide">Guide</option>
                        <option value="how-to">How-To</option>
                        <option value="listicle">Listicle</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">Word Count</label>
                      <select
                        value={contentData.length}
                        onChange={(e) => setContentData({ ...contentData, length: e.target.value })}
                        className="w-full px-4 h-10 rounded-lg border border-gray-200 bg-white/50 focus:bg-white text-sm text-gray-900 focus:border-[#0a9396] focus:outline-none focus:ring-2 focus:ring-[#0a9396]/20"
                      >
                        <option value="1000">1,000 words</option>
                        <option value="1500">1,500 words</option>
                        <option value="2000">2,000 words</option>
                        <option value="2500">2,500 words</option>
                        <option value="3000">3,000+ words</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Tone</label>
                    <select
                      value={contentData.tone}
                      onChange={(e) => setContentData({ ...contentData, tone: e.target.value })}
                      className="w-full px-4 h-10 rounded-lg border border-gray-200 bg-white/50 focus:bg-white text-sm text-gray-900 focus:border-[#0a9396] focus:outline-none focus:ring-2 focus:ring-[#0a9396]/20"
                    >
                      <option value="professional">Professional</option>
                      <option value="casual">Casual</option>
                      <option value="friendly">Friendly</option>
                      <option value="authoritative">Authoritative</option>
                      <option value="conversational">Conversational</option>
                    </select>
                  </div>
                  <Button
                    onClick={handleContentGeneration}
                    disabled={!contentData.topic || isLoading}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-md shadow-green-500/20 transition-all cursor-pointer h-12 text-base font-medium mt-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <PenTool className="mr-2 h-4 w-4" />
                        Generate Content
                      </>
                    )}
                  </Button>
                </>
              )}

              {/* Link Building Outreach */}
              {activeTool === 7 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">Target Website</label>
                      <Input
                        placeholder="e.g., example.com"
                        value={linkBuildingData.targetWebsite}
                        onChange={(e) => setLinkBuildingData({ ...linkBuildingData, targetWebsite: e.target.value })}
                        className="bg-white/50 focus:bg-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">Your Website</label>
                      <Input
                        placeholder="https://yoursite.com"
                        value={linkBuildingData.yourWebsite}
                        onChange={(e) => setLinkBuildingData({ ...linkBuildingData, yourWebsite: e.target.value })}
                        className="bg-white/50 focus:bg-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Target Page URL</label>
                    <Input
                      placeholder="https://example.com/blog-post"
                      value={linkBuildingData.targetPage}
                      onChange={(e) => setLinkBuildingData({ ...linkBuildingData, targetPage: e.target.value })}
                      className="bg-white/50 focus:bg-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Outreach Approach</label>
                    <select
                      value={linkBuildingData.approach}
                      onChange={(e) => setLinkBuildingData({ ...linkBuildingData, approach: e.target.value })}
                      className="w-full px-4 h-10 rounded-lg border border-gray-200 bg-white/50 focus:bg-white text-sm text-gray-900 focus:border-[#0a9396] focus:outline-none focus:ring-2 focus:ring-[#0a9396]/20"
                    >
                      <option value="guest-post">Guest Post Pitch</option>
                      <option value="broken-link">Broken Link Building</option>
                      <option value="resource-page">Resource Page Link</option>
                      <option value="skyscraper">Skyscraper Technique</option>
                      <option value="general">General Outreach</option>
                    </select>
                  </div>
                  <Button
                    onClick={handleLinkBuilding}
                    disabled={!linkBuildingData.targetWebsite || !linkBuildingData.yourWebsite || isLoading}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-md shadow-cyan-500/20 transition-all cursor-pointer h-12 text-base font-medium mt-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Link2 className="mr-2 h-4 w-4" />
                        Generate Outreach Email
                      </>
                    )}
                  </Button>
                </>
              )}

              {/* Social Media Content Generator */}
              {activeTool === 8 && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Topic/Theme</label>
                    <Input
                      placeholder="e.g., Digital marketing tips"
                      value={socialMediaData.topic}
                      onChange={(e) => setSocialMediaData({ ...socialMediaData, topic: e.target.value })}
                      className="bg-white/50 focus:bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">Platform</label>
                      <select
                        value={socialMediaData.platform}
                        onChange={(e) => setSocialMediaData({ ...socialMediaData, platform: e.target.value })}
                        className="w-full px-4 h-10 rounded-lg border border-gray-200 bg-white/50 focus:bg-white text-sm text-gray-900 focus:border-[#0a9396] focus:outline-none focus:ring-2 focus:ring-[#0a9396]/20"
                      >
                        <option value="Instagram">Instagram</option>
                        <option value="Twitter">Twitter</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="Facebook">Facebook</option>
                        <option value="TikTok">TikTok</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">Post Type</label>
                      <select
                        value={socialMediaData.postType}
                        onChange={(e) => setSocialMediaData({ ...socialMediaData, postType: e.target.value })}
                        className="w-full px-4 h-10 rounded-lg border border-gray-200 bg-white/50 focus:bg-white text-sm text-gray-900 focus:border-[#0a9396] focus:outline-none focus:ring-2 focus:ring-[#0a9396]/20"
                      >
                        <option value="caption">Caption</option>
                        <option value="carousel">Carousel Post</option>
                        <option value="story">Story</option>
                        <option value="reel">Reel Script</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Tone</label>
                    <select
                      value={socialMediaData.tone}
                      onChange={(e) => setSocialMediaData({ ...socialMediaData, tone: e.target.value })}
                      className="w-full px-4 h-10 rounded-lg border border-gray-200 bg-white/50 focus:bg-white text-sm text-gray-900 focus:border-[#0a9396] focus:outline-none focus:ring-2 focus:ring-[#0a9396]/20"
                    >
                      <option value="engaging">Engaging</option>
                      <option value="professional">Professional</option>
                      <option value="funny">Funny</option>
                      <option value="inspirational">Inspirational</option>
                      <option value="educational">Educational</option>
                    </select>
                  </div>
                  <Button
                    onClick={handleSocialMediaGeneration}
                    disabled={!socialMediaData.topic || isLoading}
                    className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-md shadow-pink-500/20 transition-all cursor-pointer h-12 text-base font-medium mt-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Generate Content
                      </>
                    )}
                  </Button>
                </>
              )}

              {/* Competitor Analysis Tool */}
              {activeTool === 9 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">Competitor Website URL</label>
                      <Input
                        placeholder="https://competitor.com"
                        value={competitorData.competitorUrl}
                        onChange={(e) => setCompetitorData({ ...competitorData, competitorUrl: e.target.value })}
                        className="bg-white/50 focus:bg-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">Your Website URL</label>
                      <Input
                        placeholder="https://yoursite.com"
                        value={competitorData.yourUrl}
                        onChange={(e) => setCompetitorData({ ...competitorData, yourUrl: e.target.value })}
                        className="bg-white/50 focus:bg-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Analysis Type</label>
                    <select
                      value={competitorData.analysisType}
                      onChange={(e) => setCompetitorData({ ...competitorData, analysisType: e.target.value })}
                      className="w-full px-4 h-10 rounded-lg border border-gray-200 bg-white/50 focus:bg-white text-sm text-gray-900 focus:border-[#0a9396] focus:outline-none focus:ring-2 focus:ring-[#0a9396]/20"
                    >
                      <option value="keywords">Keywords</option>
                      <option value="content">Content Strategy</option>
                      <option value="backlinks">Backlinks</option>
                      <option value="full">Full Analysis</option>
                    </select>
                  </div>
                  <Button
                    onClick={handleCompetitorAnalysis}
                    disabled={!competitorData.competitorUrl || !competitorData.yourUrl || isLoading}
                    className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white shadow-md shadow-violet-500/20 transition-all cursor-pointer h-12 text-base font-medium mt-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Analyze Competitor
                      </>
                    )}
                  </Button>
                </>
              )}

              {/* Headline Generator */}
              {activeTool === 10 && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Topic/Article Title</label>
                    <Input
                      placeholder="e.g., Digital marketing strategies"
                      value={headlineData.topic}
                      onChange={(e) => setHeadlineData({ ...headlineData, topic: e.target.value })}
                      className="bg-white/50 focus:bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">Content Type</label>
                      <select
                        value={headlineData.type}
                        onChange={(e) => setHeadlineData({ ...headlineData, type: e.target.value })}
                        className="w-full px-4 h-10 rounded-lg border border-gray-200 bg-white/50 focus:bg-white text-sm text-gray-900 focus:border-[#0a9396] focus:outline-none focus:ring-2 focus:ring-[#0a9396]/20"
                      >
                        <option value="blog">Blog Post</option>
                        <option value="article">Article</option>
                        <option value="ad">Ad Copy</option>
                        <option value="email">Email Subject</option>
                        <option value="social">Social Media</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">Number of Headlines</label>
                      <select
                        value={headlineData.count}
                        onChange={(e) => setHeadlineData({ ...headlineData, count: e.target.value })}
                        className="w-full px-4 h-10 rounded-lg border border-gray-200 bg-white/50 focus:bg-white text-sm text-gray-900 focus:border-[#0a9396] focus:outline-none focus:ring-2 focus:ring-[#0a9396]/20"
                      >
                        <option value="5">5 headlines</option>
                        <option value="10">10 headlines</option>
                        <option value="15">15 headlines</option>
                        <option value="20">20 headlines</option>
                      </select>
                    </div>
                  </div>
                  <Button
                    onClick={handleHeadlineGeneration}
                    disabled={!headlineData.topic || isLoading}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-md shadow-orange-500/20 transition-all cursor-pointer h-12 text-base font-medium mt-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Type className="mr-2 h-4 w-4" />
                        Generate Headlines
                      </>
                    )}
                  </Button>
                </>
              )}

              {/* Subject Line Generator */}
              {activeTool === 11 && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Email Topic/Content</label>
                    <Input
                      placeholder="e.g., Product launch announcement"
                      value={subjectLineData.emailTopic}
                      onChange={(e) => setSubjectLineData({ ...subjectLineData, emailTopic: e.target.value })}
                      className="bg-white/50 focus:bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">Goal</label>
                      <select
                        value={subjectLineData.goal}
                        onChange={(e) => setSubjectLineData({ ...subjectLineData, goal: e.target.value })}
                        className="w-full px-4 h-10 rounded-lg border border-gray-200 bg-white/50 focus:bg-white text-sm text-gray-900 focus:border-[#0a9396] focus:outline-none focus:ring-2 focus:ring-[#0a9396]/20"
                      >
                        <option value="open-rate">High Open Rate</option>
                        <option value="click-rate">High Click Rate</option>
                        <option value="conversion">Conversion Focused</option>
                        <option value="engagement">Engagement</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">Number of Variations</label>
                      <select
                        value={subjectLineData.count}
                        onChange={(e) => setSubjectLineData({ ...subjectLineData, count: e.target.value })}
                        className="w-full px-4 h-10 rounded-lg border border-gray-200 bg-white/50 focus:bg-white text-sm text-gray-900 focus:border-[#0a9396] focus:outline-none focus:ring-2 focus:ring-[#0a9396]/20"
                      >
                        <option value="5">5 variations</option>
                        <option value="10">10 variations</option>
                        <option value="15">15 variations</option>
                        <option value="20">20 variations</option>
                      </select>
                    </div>
                  </div>
                  <Button
                    onClick={handleSubjectLineGeneration}
                    disabled={!subjectLineData.emailTopic || isLoading}
                    className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white shadow-md shadow-teal-500/20 transition-all cursor-pointer h-12 text-base font-medium mt-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Generate Subject Lines
                      </>
                    )}
                  </Button>
                </>
              )}

              {/* Landing Page Copy Generator */}
              {activeTool === 12 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">Product/Service</label>
                      <Input
                        placeholder="e.g., Digital marketing agency"
                        value={landingPageData.product}
                        onChange={(e) => setLandingPageData({ ...landingPageData, product: e.target.value })}
                        className="bg-white/50 focus:bg-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">Target Audience</label>
                      <Input
                        placeholder="e.g., Small business owners"
                        value={landingPageData.targetAudience}
                        onChange={(e) => setLandingPageData({ ...landingPageData, targetAudience: e.target.value })}
                        className="bg-white/50 focus:bg-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Value Proposition</label>
                    <textarea
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/50 focus:bg-white text-sm text-gray-900 placeholder-gray-400 focus:border-[#0a9396] focus:outline-none focus:ring-2 focus:ring-[#0a9396]/20 transition-all min-h-[90px] resize-y"
                      placeholder="What makes your product/service unique?"
                      value={landingPageData.valueProposition}
                      onChange={(e) => setLandingPageData({ ...landingPageData, valueProposition: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Call-to-Action</label>
                    <select
                      value={landingPageData.cta}
                      onChange={(e) => setLandingPageData({ ...landingPageData, cta: e.target.value })}
                      className="w-full px-4 h-10 rounded-lg border border-gray-200 bg-white/50 focus:bg-white text-sm text-gray-900 focus:border-[#0a9396] focus:outline-none focus:ring-2 focus:ring-[#0a9396]/20"
                    >
                      <option value="Sign Up">Sign Up</option>
                      <option value="Get Started">Get Started</option>
                      <option value="Learn More">Learn More</option>
                      <option value="Request Demo">Request Demo</option>
                      <option value="Buy Now">Buy Now</option>
                      <option value="Download">Download</option>
                    </select>
                  </div>
                  <Button
                    onClick={handleLandingPageGeneration}
                    disabled={!landingPageData.product || !landingPageData.targetAudience || isLoading}
                    className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-md shadow-red-500/20 transition-all cursor-pointer h-12 text-base font-medium mt-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Target className="mr-2 h-4 w-4" />
                        Generate Landing Page Copy
                      </>
                    )}
                  </Button>
                </>
              )}

              {results && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="mt-8 relative overflow-hidden rounded-2xl border border-[#0a9396]/20 bg-gradient-to-br from-white to-teal-50/40 p-[1px] shadow-lg shadow-[#0a9396]/5"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#0a9396] to-teal-400" />
                  <div className="rounded-[15px] bg-white/80 p-5 backdrop-blur-md">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="rounded-full bg-teal-100/50 p-1.5 border border-teal-200/50">
                          <CheckCircle2 className="h-4 w-4 text-[#0a9396]" />
                        </div>
                        <h4 className="font-semibold text-gray-900">Generated Results</h4>
                      </div>
                      <button
                        onClick={() => handleCopy(results)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white transition-all border border-transparent hover:border-gray-200 hover:shadow-sm cursor-pointer"
                        title="Copy to clipboard"
                      >
                        {copied ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <span className="text-green-600">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap max-h-[400px] overflow-y-auto custom-scrollbar bg-white/50 p-4 rounded-xl border border-gray-100/80 shadow-inner shadow-gray-100/50">
                      {results}
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    );
  };

  const categories = Array.from(new Set(aiTools.map(t => t.category)));
  
  const filteredTools = aiTools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? tool.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col pt-2 pb-6">
      {/* Header Section */}
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#0a9396]/10 rounded-xl">
              <Zap className="h-6 w-6 text-[#0a9396]" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">AI Tools Workspace</h1>
            <Badge className="bg-gradient-to-r from-teal-400 to-[#0a9396] text-white border-none shadow-sm shadow-teal-500/20">Pro Feature</Badge>
          </div>
          <p className="text-gray-500 pl-1">
            Leverage cutting-edge AI to automate and enhance your digital marketing workflows
          </p>
        </div>
      </div>

      {/* Main Split View */}
      <div className="flex-1 flex gap-6 min-h-0">
        {/* Left Sidebar: Tool Library */}
        <div className="w-[350px] shrink-0 flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50 space-y-4 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search AI tools..." 
                className="pl-9 bg-white border-gray-200 focus:ring-[#0a9396]/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar hide-scrollbar">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === null 
                    ? "bg-[#0a9396] text-white shadow-sm" 
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                All Tools
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === category 
                      ? "bg-[#0a9396] text-white shadow-sm" 
                      : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
            {filteredTools.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>No tools found</p>
              </div>
            ) : (
              filteredTools.map((tool, index) => {
                const Icon = tool.icon;
                const isActive = activeTool === tool.id;
                
                return (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <button
                      onClick={() => {
                        setActiveTool(tool.id);
                        setResults("");
                      }}
                      className={`w-full text-left p-3 rounded-xl transition-all duration-200 group relative border cursor-pointer ${
                        isActive
                          ? "bg-white border-[#0a9396]/30 shadow-md shadow-[#0a9396]/5 translate-x-1"
                          : "bg-transparent border-transparent hover:bg-gray-50/80 hover:border-gray-100"
                      }`}
                    >
                      {isActive && (
                        <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-gradient-to-b ${tool.color}`} />
                      )}
                      <div className="flex items-start gap-3">
                        <div className={`rounded-lg p-2 shrink-0 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`}>
                          <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-20 rounded-lg blur-sm group-hover:opacity-30`} />
                          <div className={`relative bg-gradient-to-br ${tool.color} p-2 rounded-lg`}>
                            <Icon className="h-4 w-4 text-white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0 pt-0.5">
                          <div className="flex items-center justify-between mb-0.5">
                            <h3 className={`font-semibold truncate pr-2 ${isActive ? "text-[#0a9396]" : "text-gray-900"}`}>
                              {tool.name}
                            </h3>
                          </div>
                          <p className={`text-xs line-clamp-2 ${isActive ? "text-gray-600" : "text-gray-500"}`}>
                            {tool.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Content Area: Active Tool or Welcome State */}
        <div className="flex-1 min-w-0">
          {renderToolInterface()}
        </div>
      </div>
    </div>
  );
}
