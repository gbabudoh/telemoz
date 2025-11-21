"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  Zap,
  Sparkles,
  FileText,
  Search,
  TrendingUp,
  MessageSquare,
  X,
  Loader2,
  Copy,
  CheckCircle2,
  Link2,
  Hash,
  PenTool,
  Target,
  BarChart3,
  Calendar,
  Type,
  Mail,
  Globe,
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
      setResults("Error generating analysis. Please try again.");
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
      setResults("Error generating optimizations. Please try again.");
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
      setResults("Error generating ad copy. Please try again.");
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
      setResults("Error generating email sequence. Please try again.");
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
      setResults("Error generating keywords. Please try again.");
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
      setResults("Error generating content. Please try again.");
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
      setResults("Error generating outreach emails. Please try again.");
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
      setResults("Error generating social media content. Please try again.");
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
      setResults("Error generating competitor analysis. Please try again.");
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
      setResults("Error generating headlines. Please try again.");
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
      setResults("Error generating subject lines. Please try again.");
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
      setResults("Error generating landing page copy. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderToolInterface = () => {
    const tool = aiTools.find((t) => t.id === activeTool);
    if (!tool) return null;

    const Icon = tool.icon;

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mt-6"
        >
          <Card className="border-2 border-[#0a9396]/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`rounded-lg bg-gradient-to-br ${tool.color} p-3`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-gray-900">{tool.name}</CardTitle>
                    <CardDescription className="text-gray-600">{tool.description}</CardDescription>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setActiveTool(null);
                    setResults("");
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Topic Gap Analyzer */}
              {activeTool === 1 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Target URL"
                      placeholder="https://example.com/page"
                      value={topicGapData.url}
                      onChange={(e) => setTopicGapData({ ...topicGapData, url: e.target.value })}
                    />
                    <Input
                      label="Target Keyword"
                      placeholder="e.g., digital marketing services"
                      value={topicGapData.keyword}
                      onChange={(e) => setTopicGapData({ ...topicGapData, keyword: e.target.value })}
                    />
                  </div>
                  <Button
                    onClick={handleTopicGapAnalysis}
                    disabled={!topicGapData.url || !topicGapData.keyword || isLoading}
                    className="w-full bg-[#0a9396] hover:bg-[#087579] text-white"
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
                  <Input
                    label="Page URL"
                    placeholder="https://example.com/page"
                    value={seoOptData.url}
                    onChange={(e) => setSeoOptData({ ...seoOptData, url: e.target.value })}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Content</label>
                    <textarea
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-500 focus:border-[#0a9396] focus:outline-none focus:ring-2 focus:ring-[#0a9396]/20 transition-all min-h-[120px]"
                      placeholder="Paste your content here..."
                      value={seoOptData.content}
                      onChange={(e) => setSeoOptData({ ...seoOptData, content: e.target.value })}
                    />
                  </div>
                  <Button
                    onClick={handleSEOOptimization}
                    disabled={!seoOptData.url || !seoOptData.content || isLoading}
                    className="w-full bg-[#0a9396] hover:bg-[#087579] text-white"
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Product/Service"
                      placeholder="e.g., digital marketing services"
                      value={adCopyData.product}
                      onChange={(e) => setAdCopyData({ ...adCopyData, product: e.target.value })}
                    />
                    <Input
                      label="Target Audience"
                      placeholder="e.g., small business owners"
                      value={adCopyData.targetAudience}
                      onChange={(e) => setAdCopyData({ ...adCopyData, targetAudience: e.target.value })}
                    />
                  </div>
                  <Input
                    label="Unique Selling Point"
                    placeholder="e.g., 24/7 support, proven results"
                    value={adCopyData.usp}
                    onChange={(e) => setAdCopyData({ ...adCopyData, usp: e.target.value })}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Platform</label>
                    <select
                      value={adCopyData.platform}
                      onChange={(e) => setAdCopyData({ ...adCopyData, platform: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:border-[#0a9396] focus:outline-none focus:ring-2 focus:ring-[#0a9396]/20"
                    >
                      <option value="Google">Google Ads</option>
                      <option value="Facebook">Facebook Ads</option>
                      <option value="LinkedIn">LinkedIn Ads</option>
                      <option value="Twitter">Twitter Ads</option>
                    </select>
                  </div>
                  <Button
                    onClick={handleAdCopyGeneration}
                    disabled={!adCopyData.product || !adCopyData.targetAudience || isLoading}
                    className="w-full bg-[#0a9396] hover:bg-[#087579] text-white"
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
                  <Input
                    label="Email Purpose"
                    placeholder="e.g., welcome series, product launch, re-engagement"
                    value={emailData.purpose}
                    onChange={(e) => setEmailData({ ...emailData, purpose: e.target.value })}
                  />
                  <Input
                    label="Target Audience"
                    placeholder="e.g., new subscribers, existing customers"
                    value={emailData.audience}
                    onChange={(e) => setEmailData({ ...emailData, audience: e.target.value })}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Sequence Length</label>
                    <select
                      value={emailData.sequenceLength}
                      onChange={(e) => setEmailData({ ...emailData, sequenceLength: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:border-[#0a9396] focus:outline-none focus:ring-2 focus:ring-[#0a9396]/20"
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
                    className="w-full bg-[#0a9396] hover:bg-[#087579] text-white"
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
                  <Input
                    label="Seed Keyword"
                    placeholder="e.g., digital marketing"
                    value={keywordData.seedKeyword}
                    onChange={(e) => setKeywordData({ ...keywordData, seedKeyword: e.target.value })}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Location</label>
                      <select
                        value={keywordData.location}
                        onChange={(e) => setKeywordData({ ...keywordData, location: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:border-[#0a9396] focus:outline-none focus:ring-2 focus:ring-[#0a9396]/20"
                      >
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="Australia">Australia</option>
                        <option value="Global">Global</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Language</label>
                      <select
                        value={keywordData.language}
                        onChange={(e) => setKeywordData({ ...keywordData, language: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:border-[#0a9396] focus:outline-none focus:ring-2 focus:ring-[#0a9396]/20"
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
                    className="w-full bg-[#0a9396] hover:bg-[#087579] text-white"
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
                  <Input
                    label="Topic"
                    placeholder="e.g., How to improve SEO in 2024"
                    value={contentData.topic}
                    onChange={(e) => setContentData({ ...contentData, topic: e.target.value })}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Content Type</label>
                      <select
                        value={contentData.type}
                        onChange={(e) => setContentData({ ...contentData, type: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:border-[#0a9396] focus:outline-none focus:ring-2 focus:ring-[#0a9396]/20"
                      >
                        <option value="blog-post">Blog Post</option>
                        <option value="article">Article</option>
                        <option value="guide">Guide</option>
                        <option value="how-to">How-To</option>
                        <option value="listicle">Listicle</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Word Count</label>
                      <select
                        value={contentData.length}
                        onChange={(e) => setContentData({ ...contentData, length: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:border-[#0a9396] focus:outline-none focus:ring-2 focus:ring-[#0a9396]/20"
                      >
                        <option value="1000">1,000 words</option>
                        <option value="1500">1,500 words</option>
                        <option value="2000">2,000 words</option>
                        <option value="2500">2,500 words</option>
                        <option value="3000">3,000+ words</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Tone</label>
                    <select
                      value={contentData.tone}
                      onChange={(e) => setContentData({ ...contentData, tone: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:border-[#0a9396] focus:outline-none focus:ring-2 focus:ring-[#0a9396]/20"
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
                    className="w-full bg-[#0a9396] hover:bg-[#087579] text-white"
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
                  <Input
                    label="Target Website"
                    placeholder="e.g., example.com"
                    value={linkBuildingData.targetWebsite}
                    onChange={(e) => setLinkBuildingData({ ...linkBuildingData, targetWebsite: e.target.value })}
                  />
                  <Input
                    label="Target Page URL"
                    placeholder="https://example.com/blog-post"
                    value={linkBuildingData.targetPage}
                    onChange={(e) => setLinkBuildingData({ ...linkBuildingData, targetPage: e.target.value })}
                  />
                  <Input
                    label="Your Website"
                    placeholder="https://yoursite.com"
                    value={linkBuildingData.yourWebsite}
                    onChange={(e) => setLinkBuildingData({ ...linkBuildingData, yourWebsite: e.target.value })}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Outreach Approach</label>
                    <select
                      value={linkBuildingData.approach}
                      onChange={(e) => setLinkBuildingData({ ...linkBuildingData, approach: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:border-[#0a9396] focus:outline-none focus:ring-2 focus:ring-[#0a9396]/20"
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
                    className="w-full bg-[#0a9396] hover:bg-[#087579] text-white"
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
                  <Input
                    label="Topic/Theme"
                    placeholder="e.g., Digital marketing tips"
                    value={socialMediaData.topic}
                    onChange={(e) => setSocialMediaData({ ...socialMediaData, topic: e.target.value })}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Platform</label>
                      <select
                        value={socialMediaData.platform}
                        onChange={(e) => setSocialMediaData({ ...socialMediaData, platform: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:border-[#0a9396] focus:outline-none focus:ring-2 focus:ring-[#0a9396]/20"
                      >
                        <option value="Instagram">Instagram</option>
                        <option value="Twitter">Twitter</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="Facebook">Facebook</option>
                        <option value="TikTok">TikTok</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Post Type</label>
                      <select
                        value={socialMediaData.postType}
                        onChange={(e) => setSocialMediaData({ ...socialMediaData, postType: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:border-[#0a9396] focus:outline-none focus:ring-2 focus:ring-[#0a9396]/20"
                      >
                        <option value="caption">Caption</option>
                        <option value="carousel">Carousel Post</option>
                        <option value="story">Story</option>
                        <option value="reel">Reel Script</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Tone</label>
                    <select
                      value={socialMediaData.tone}
                      onChange={(e) => setSocialMediaData({ ...socialMediaData, tone: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:border-[#0a9396] focus:outline-none focus:ring-2 focus:ring-[#0a9396]/20"
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
                    className="w-full bg-[#0a9396] hover:bg-[#087579] text-white"
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
                  <Input
                    label="Competitor Website URL"
                    placeholder="https://competitor.com"
                    value={competitorData.competitorUrl}
                    onChange={(e) => setCompetitorData({ ...competitorData, competitorUrl: e.target.value })}
                  />
                  <Input
                    label="Your Website URL"
                    placeholder="https://yoursite.com"
                    value={competitorData.yourUrl}
                    onChange={(e) => setCompetitorData({ ...competitorData, yourUrl: e.target.value })}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Analysis Type</label>
                    <select
                      value={competitorData.analysisType}
                      onChange={(e) => setCompetitorData({ ...competitorData, analysisType: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:border-[#0a9396] focus:outline-none focus:ring-2 focus:ring-[#0a9396]/20"
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
                    className="w-full bg-[#0a9396] hover:bg-[#087579] text-white"
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
                  <Input
                    label="Topic/Article Title"
                    placeholder="e.g., Digital marketing strategies"
                    value={headlineData.topic}
                    onChange={(e) => setHeadlineData({ ...headlineData, topic: e.target.value })}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Content Type</label>
                      <select
                        value={headlineData.type}
                        onChange={(e) => setHeadlineData({ ...headlineData, type: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:border-[#0a9396] focus:outline-none focus:ring-2 focus:ring-[#0a9396]/20"
                      >
                        <option value="blog">Blog Post</option>
                        <option value="article">Article</option>
                        <option value="ad">Ad Copy</option>
                        <option value="email">Email Subject</option>
                        <option value="social">Social Media</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Number of Headlines</label>
                      <select
                        value={headlineData.count}
                        onChange={(e) => setHeadlineData({ ...headlineData, count: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:border-[#0a9396] focus:outline-none focus:ring-2 focus:ring-[#0a9396]/20"
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
                    className="w-full bg-[#0a9396] hover:bg-[#087579] text-white"
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
                  <Input
                    label="Email Topic/Content"
                    placeholder="e.g., Product launch announcement"
                    value={subjectLineData.emailTopic}
                    onChange={(e) => setSubjectLineData({ ...subjectLineData, emailTopic: e.target.value })}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Goal</label>
                      <select
                        value={subjectLineData.goal}
                        onChange={(e) => setSubjectLineData({ ...subjectLineData, goal: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:border-[#0a9396] focus:outline-none focus:ring-2 focus:ring-[#0a9396]/20"
                      >
                        <option value="open-rate">High Open Rate</option>
                        <option value="click-rate">High Click Rate</option>
                        <option value="conversion">Conversion Focused</option>
                        <option value="engagement">Engagement</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Number of Variations</label>
                      <select
                        value={subjectLineData.count}
                        onChange={(e) => setSubjectLineData({ ...subjectLineData, count: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:border-[#0a9396] focus:outline-none focus:ring-2 focus:ring-[#0a9396]/20"
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
                    className="w-full bg-[#0a9396] hover:bg-[#087579] text-white"
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
                  <Input
                    label="Product/Service"
                    placeholder="e.g., Digital marketing agency"
                    value={landingPageData.product}
                    onChange={(e) => setLandingPageData({ ...landingPageData, product: e.target.value })}
                  />
                  <Input
                    label="Target Audience"
                    placeholder="e.g., Small business owners"
                    value={landingPageData.targetAudience}
                    onChange={(e) => setLandingPageData({ ...landingPageData, targetAudience: e.target.value })}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Value Proposition</label>
                    <textarea
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-500 focus:border-[#0a9396] focus:outline-none focus:ring-2 focus:ring-[#0a9396]/20 transition-all min-h-[80px]"
                      placeholder="What makes your product/service unique?"
                      value={landingPageData.valueProposition}
                      onChange={(e) => setLandingPageData({ ...landingPageData, valueProposition: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Call-to-Action</label>
                    <select
                      value={landingPageData.cta}
                      onChange={(e) => setLandingPageData({ ...landingPageData, cta: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:border-[#0a9396] focus:outline-none focus:ring-2 focus:ring-[#0a9396]/20"
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
                    className="w-full bg-[#0a9396] hover:bg-[#087579] text-white"
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
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-6 p-4 rounded-lg bg-gray-50 border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">Results</h4>
                    <button
                      onClick={() => handleCopy(results)}
                      className="p-1 rounded hover:bg-gray-200"
                      title="Copy to clipboard"
                    >
                      {copied ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4 text-gray-600" />
                      )}
                    </button>
                  </div>
                  <div className="text-sm text-gray-700 whitespace-pre-wrap max-h-96 overflow-y-auto">
                    {results}
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Zap className="h-6 w-6 text-[#0a9396]" />
          <h1 className="text-3xl font-bold text-gray-900">AI-Powered Tools</h1>
          <Badge variant="primary" size="sm">Pro Feature</Badge>
        </div>
        <p className="text-gray-600">
          Leverage cutting-edge AI to automate and enhance your digital marketing workflows
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {aiTools.map((tool, index) => {
          const Icon = tool.icon;
          return (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className={`h-full transition-all cursor-pointer ${
                  activeTool === tool.id
                    ? "border-2 border-[#0a9396] shadow-lg"
                    : "hover:border-[#0a9396]/50"
                }`}
                onClick={() => {
                  setActiveTool(activeTool === tool.id ? null : tool.id);
                  setResults("");
                }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className={`rounded-lg bg-gradient-to-br ${tool.color} p-3 w-fit`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <Badge variant="info" size="sm">
                      {tool.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-gray-900">{tool.name}</CardTitle>
                  <CardDescription className="text-gray-600">{tool.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className={`w-full ${
                      activeTool === tool.id
                        ? "bg-[#087579] text-white"
                        : "bg-[#0a9396] hover:bg-[#087579] text-white"
                    }`}
                  >
                    {activeTool === tool.id ? "Close Tool" : "Use Tool"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {renderToolInterface()}
    </div>
  );
}
