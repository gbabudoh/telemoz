"use client";

import { Button } from "@/components/ui/Button";
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
  ClipboardList,
  AlertTriangle,
  ChevronRight,
  Lock,
  X,
  AlignLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";


const aiTools = [
  {
    id: 1,
    name: "Topic Gap Analyzer",
    description: "Analyse top-ranking pages and generate comprehensive content outlines",
    icon: Search,
    category: "SEO",
    color: "from-emerald-500 to-teal-500",
    available: true,
  },
  {
    id: 2,
    name: "On-Page Optimization",
    description: "Get real-time SEO optimisations for your content",
    icon: FileText,
    category: "SEO",
    color: "from-blue-500 to-cyan-500",
    available: true,
  },
  {
    id: 3,
    name: "Ad Copy Generator",
    description: "Generate 10 variations of ad copy for Google/Facebook/LinkedIn",
    icon: Sparkles,
    category: "PPC",
    color: "from-purple-500 to-pink-500",
    available: true,
  },
  {
    id: 4,
    name: "Email Sequence Creator",
    description: "Generate full automation sequences with multiple email drafts",
    icon: MessageSquare,
    category: "Email",
    color: "from-amber-500 to-orange-500",
    available: true,
  },
  {
    id: 5,
    name: "Keyword Research Matrix",
    description: "Find keywords, search volume, difficulty, and related queries",
    icon: Hash,
    category: "SEO",
    color: "from-indigo-500 to-purple-500",
    available: true,
  },
  {
    id: 6,
    name: "Content Engine",
    description: "Generate blog posts, articles, and long-form content",
    icon: PenTool,
    category: "Content",
    color: "from-green-500 to-emerald-500",
    available: true,
  },
  {
    id: 7,
    name: "Link Building Outreach",
    description: "Generate personalised outreach emails for link building targets",
    icon: Link2,
    category: "SEO",
    color: "from-cyan-500 to-blue-500",
    available: true,
  },
  {
    id: 8,
    name: "Social Content Studio",
    description: "Create platform-specific content for Instagram, Twitter, LinkedIn",
    icon: MessageSquare,
    category: "Social",
    color: "from-pink-500 to-rose-500",
    available: true,
  },
  {
    id: 9,
    name: "Competitor Analysis",
    description: "Analyse competitor keywords, content strategies, and SEO",
    icon: BarChart3,
    category: "SEO",
    color: "from-violet-500 to-purple-500",
    available: true,
  },
  {
    id: 10,
    name: "Headline Generator",
    description: "Generate multiple headline variations for A/B testing loops",
    icon: Type,
    category: "Content",
    color: "from-orange-500 to-red-500",
    available: true,
  },
  {
    id: 11,
    name: "Subject Line Optimizer",
    description: "Create high open-rate email subject lines and preview text",
    icon: Mail,
    category: "Email",
    color: "from-teal-500 to-cyan-500",
    available: true,
  },
  {
    id: 12,
    name: "Landing Page Copywriter",
    description: "Generate conversion-focused landing page copy blocks",
    icon: Target,
    category: "PPC",
    color: "from-red-500 to-pink-500",
    available: true,
  },
  {
    id: 13,
    name: "Campaign Brief Summariser",
    description: "Paste a client brief and extract structured scope, KPIs, timeline, and deliverables",
    icon: ClipboardList,
    category: "Strategy",
    color: "from-[#0a9396] to-teal-500",
    available: true,
  },
  {
    id: 14,
    name: "Performance Anomaly Analyser",
    description: "Describe a campaign metric change and get an AI explanation with recommended actions",
    icon: AlertTriangle,
    category: "Analytics",
    color: "from-amber-500 to-yellow-500",
    available: true,
  },
];

const GlassInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={`w-full px-6 h-14 rounded-2xl border border-white/60 bg-white/40 focus:bg-white/90 text-[15px] font-bold text-gray-900 placeholder-gray-400 focus:border-[#0a9396]/40 focus:outline-none focus:ring-8 focus:ring-[#0a9396]/5 transition-all backdrop-blur-xl shadow-[inset_0_2px_10px_rgb(0,0,0,0.03)] ${props.className || ""}`}
  />
);

const GlassSelect = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <div className="relative group/select">
    <select
      {...props}
      className={`w-full px-6 h-14 rounded-2xl border border-white/60 bg-white/40 focus:bg-white/90 text-[15px] font-bold text-gray-900 focus:border-[#0a9396]/40 focus:outline-none focus:ring-8 focus:ring-[#0a9396]/5 transition-all backdrop-blur-xl shadow-[inset_0_2px_10px_rgb(0,0,0,0.03)] appearance-none cursor-pointer ${props.className || ""}`}
    >
      {props.children}
    </select>
    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-focus-within/select:text-[#0a9396] transition-colors">
      <ChevronRight className="h-4 w-4 rotate-90" />
    </div>
  </div>
);

const GlassTextarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    {...props}
    className={`w-full px-6 py-5 rounded-[2rem] border border-white/60 bg-white/40 focus:bg-white/90 text-[15px] font-bold text-gray-900 placeholder-gray-400 focus:border-[#0a9396]/40 focus:outline-none focus:ring-8 focus:ring-[#0a9396]/5 transition-all backdrop-blur-xl shadow-[inset_0_2px_10px_rgb(0,0,0,0.03)] resize-y min-h-[120px] ${props.className || ""}`}
  />
);

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="text-[12px] font-black tracking-[0.18em] uppercase text-gray-500 ml-1 flex items-center gap-1.5">
    {children}
  </label>
);

export default function AIToolsPage() {
  const [activeTool, setActiveTool] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [aiUsage, setAiUsage] = useState<{ used: number; limit: number; remaining: number } | null>(null);

  useEffect(() => {
    fetch("/api/ai/usage")
      .then((r) => r.json())
      .then((d) => { if (!d.error) setAiUsage(d); })
      .catch(() => {});
  }, []);

  const [topicGapData, setTopicGapData] = useState({ url: "", keyword: "" });
  const [seoOptData, setSeoOptData] = useState({ url: "", content: "" });
  const [adCopyData, setAdCopyData] = useState({ product: "", targetAudience: "", usp: "", platform: "Google" });
  const [emailData, setEmailData] = useState({ purpose: "", audience: "", sequenceLength: "3" });
  const [keywordData, setKeywordData] = useState({ seedKeyword: "", location: "United Kingdom", language: "English" });
  const [contentData, setContentData] = useState({ topic: "", type: "blog-post", length: "1500", tone: "professional" });
  const [briefData, setBriefData] = useState({ rawBrief: "" });
  const [anomalyData, setAnomalyData] = useState({ metric: "", change: "", platform: "", context: "" });
  const [linkBuildingData, setLinkBuildingData] = useState({ targetUrl: "", niche: "", goal: "guest-post" });
  const [socialData, setSocialData] = useState({ brandName: "", topic: "", platform: "Instagram", tone: "creative" });
  const [competitorData, setCompetitorData] = useState({ competitorUrl: "", industry: "" });
  const [headlineData, setHeadlineData] = useState({ topic: "", targetAudience: "", count: "10" });
  const [subjectData, setSubjectData] = useState({ emailTopic: "", audience: "" });
  const [landingPageData, setLandingPageData] = useState({ product: "", audience: "", framework: "AIDA" });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenericToolRequest = async (endpoint: string, payload: Record<string, unknown>, resultKey: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/ai/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.status === 429) {
        setResults(`⚠️ ${data.error}`);
        setAiUsage((prev) => prev ? { ...prev, remaining: 0 } : null);
        return;
      }
      if (data[resultKey]) {
        setResults(data[resultKey]);
        if (typeof data.remaining === "number") {
          setAiUsage((prev) => prev ? { ...prev, remaining: data.remaining, used: prev.limit - data.remaining } : null);
        }
      } else {
        setResults(data.error || "Generation successful!");
      }
    } catch (error) {
      setResults(error instanceof Error ? error.message : "Error generating content. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTopicGapAnalysis = async () => {
    await handleGenericToolRequest("topic-gap", topicGapData, "analysis");
  };

  const handleSEOOptimization = async () => {
    await handleGenericToolRequest("seo-optimize", seoOptData, "optimizations");
  };

  const handleAdCopyGeneration = async () => {
    await handleGenericToolRequest("generate-copy", adCopyData, "adCopy");
  };

  const handleEmailSequence = async () => {
    await handleGenericToolRequest("email-sequence", emailData, "sequence");
  };

  const handleKeywordResearch = async () => {
    await handleGenericToolRequest("keyword-research", keywordData, "keywords");
  };

  const handleContentGeneration = async () => {
    await handleGenericToolRequest("content-generator", contentData, "content");
  };

  const handleLinkBuilding = async () => {
    await handleGenericToolRequest("link-building", linkBuildingData, "outreach");
  };

  const handleSocialMedia = async () => {
    await handleGenericToolRequest("social-media", socialData, "content");
  };

  const handleCompetitorAnalysis = async () => {
    await handleGenericToolRequest("competitor-analysis", competitorData, "analysis");
  };

  const handleHeadlineGeneration = async () => {
    await handleGenericToolRequest("headline-generator", headlineData, "headlines");
  };

  const handleSubjectLineOptimization = async () => {
    await handleGenericToolRequest("subject-line-generator", subjectData, "subjectLines");
  };

  const handleLandingPageCopy = async () => {
    await handleGenericToolRequest("landing-page", landingPageData, "copy");
  };

  const wordCount = results ? results.trim().split(/\s+/).filter(Boolean).length : 0;

  const renderToolInterface = () => {
    const tool = aiTools.find((t) => t.id === activeTool);

    if (!tool) {
      return (
        <div className="h-full flex flex-col items-center justify-center p-8 lg:p-16 text-center rounded-[3rem] bg-white/40 border border-white/60 shadow-[inset_0_2px_25px_rgb(255,255,255,0.8),0_20px_50px_rgb(0,0,0,0.03)] backdrop-blur-3xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a9396]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
          <div className="absolute -top-[20%] -right-[20%] w-[60%] h-[60%] rounded-full bg-[#0a9396]/5 blur-[100px] pointer-events-none" />

          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 1.5 }}
            className="w-40 h-40 rounded-[2.5rem] bg-gradient-to-br from-white to-[#0a9396]/5 flex items-center justify-center mb-10 shadow-2xl shadow-[#0a9396]/10 border border-white relative z-10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700"
          >
            <Sparkles className="h-16 w-16 text-[#0a9396] animate-pulse" />
            <div className="absolute -inset-6 bg-[#0a9396]/15 blur-3xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
          </motion.div>

          <h2 className="text-5xl lg:text-6xl font-black tracking-tighter text-gray-900 mb-6 relative z-10">
            Smart <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0a9396] to-teal-400">Assistant</span>
          </h2>
          <p className="text-gray-500 font-bold max-w-xl mx-auto mb-14 text-xl leading-relaxed relative z-10 opacity-80">
            Select a specialised AI tool from your library to generate high-performing marketing assets in seconds.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full max-w-2xl relative z-10">
            {[
              { icon: Zap, label: "Instant Output", desc: "Results in seconds", color: "from-amber-400 to-orange-500" },
              { icon: BarChart3, label: "Data Driven", desc: "Built for conversion", color: "from-teal-400 to-[#0a9396]" },
              { icon: AlignLeft, label: "8 Tools Live", desc: "More coming soon", color: "from-violet-400 to-purple-500" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="p-5 rounded-3xl bg-white/60 border border-white/80 shadow-lg shadow-black/5 flex items-center gap-4 backdrop-blur-xl hover:shadow-2xl hover:-translate-y-2 transition-all cursor-default group/card"
              >
                <div className={`p-3.5 bg-gradient-to-br ${item.color} rounded-2xl shadow-lg group-hover/card:scale-110 group-hover/card:rotate-3 transition-transform shrink-0`}>
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-left min-w-0">
                  <div className="font-black tracking-tight text-gray-900 text-base mb-0.5 truncate">{item.label}</div>
                  <div className="text-[13px] font-bold text-gray-500 opacity-70 truncate">{item.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      );
    }

    const Icon = tool.icon;

    if (!tool.available) {
      return (
        <AnimatePresence mode="wait">
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="h-full"
          >
            <div className="h-full border border-white/60 shadow-[inset_0_2px_20px_rgb(255,255,255,0.8),0_20px_50px_rgb(0,0,0,0.05)] bg-white/40 backdrop-blur-3xl overflow-hidden flex flex-col rounded-[3rem] relative">
              <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${tool.color} opacity-40`} />

              <div className="px-10 py-10 border-b border-white/40 relative z-10 flex items-center gap-8 bg-white/20 opacity-60">
                <div className={`rounded-[2rem] bg-gradient-to-br ${tool.color} p-6 shadow-2xl shadow-black/10 relative overflow-hidden opacity-60`}>
                  <Icon className="h-10 w-10 text-white relative z-10" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Badge className={`bg-gradient-to-r ${tool.color} text-white border-none px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] opacity-60`}>
                      {tool.category}
                    </Badge>
                  </div>
                  <h2 className="text-4xl font-black tracking-tighter text-gray-900 mb-1 drop-shadow-sm">{tool.name}</h2>
                  <p className="text-[17px] font-bold text-gray-500 tracking-tight leading-relaxed max-w-2xl">{tool.description}</p>
                </div>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center relative z-10">
                <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-[0.04] pointer-events-none`} />

                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", duration: 1 }}
                  className={`w-24 h-24 rounded-[2rem] bg-gradient-to-br ${tool.color} flex items-center justify-center mb-8 shadow-2xl shadow-black/10 relative`}
                >
                  <Lock className="h-10 w-10 text-white" />
                  <div className={`absolute -inset-4 bg-gradient-to-br ${tool.color} opacity-20 blur-2xl rounded-full`} />
                </motion.div>

                <h3 className="text-3xl font-black tracking-tighter text-gray-900 mb-3">Coming Soon</h3>
                <p className="text-gray-500 font-bold text-lg max-w-sm leading-relaxed mb-2">
                  <span className="text-gray-900">{tool.name}</span> is currently in development.
                </p>
                <p className="text-gray-400 font-medium text-sm max-w-xs">
                  We&apos;re building this tool to the same quality standard as the rest of the suite. Stay tuned.
                </p>

                <div className={`mt-10 px-6 py-3 rounded-2xl bg-gradient-to-r ${tool.color} text-white text-sm font-black uppercase tracking-widest opacity-50 cursor-default select-none`}>
                  In Development
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      );
    }

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={tool.id}
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -30, filter: "blur(10px)" }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="h-full"
        >
          <div className="h-full border border-white/60 shadow-[inset_0_2px_20px_rgb(255,255,255,0.8),0_20px_50px_rgb(0,0,0,0.05)] bg-white/40 backdrop-blur-3xl overflow-hidden flex flex-col rounded-[3rem] relative">
            <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${tool.color} opacity-90`} />

            <div className="px-10 py-10 border-b border-white/40 relative z-10 flex items-center gap-8 bg-white/20">
              <motion.div
                initial={{ scale: 0.5, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                className={`rounded-[2rem] bg-gradient-to-br ${tool.color} p-6 shadow-2xl shadow-black/10 relative overflow-hidden group shrink-0`}
              >
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 translate-x-full group-hover:-translate-x-full transition-transform duration-1000" />
                <Icon className="h-10 w-10 text-white relative z-10" />
              </motion.div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Badge className={`bg-gradient-to-r ${tool.color} text-white border-none px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]`}>
                    {tool.category}
                  </Badge>
                  <div className="h-1 w-1 rounded-full bg-gray-300" />
                  <span className="text-[11px] font-black uppercase tracking-widest text-gray-400">AI Powered Tool</span>
                </div>
                <h2 className="text-4xl font-black tracking-tighter text-gray-900 mb-1 drop-shadow-sm">{tool.name}</h2>
                <p className="text-[17px] font-bold text-gray-500 tracking-tight leading-relaxed max-w-2xl">{tool.description}</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-7 custom-scrollbar relative z-10 bg-gradient-to-b from-white/10 to-transparent">
              {/* Topic Gap Analyzer */}
              {activeTool === 1 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <FieldLabel>Target URL</FieldLabel>
                      <GlassInput placeholder="https://example.com/page" value={topicGapData.url} onChange={(e) => setTopicGapData({ ...topicGapData, url: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <FieldLabel>Focus Keyword</FieldLabel>
                      <GlassInput placeholder="e.g., digital marketing" value={topicGapData.keyword} onChange={(e) => setTopicGapData({ ...topicGapData, keyword: e.target.value })} />
                    </div>
                  </div>
                  <Button
                    onClick={handleTopicGapAnalysis}
                    disabled={!topicGapData.url || !topicGapData.keyword || isLoading}
                    className={`w-full bg-gradient-to-r ${tool.color} text-white shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all cursor-pointer h-14 rounded-2xl text-lg font-black tracking-wide uppercase mt-4 active:scale-[0.98] border border-white/20`}
                  >
                    {isLoading ? <><Loader2 className="mr-3 h-5 w-5 animate-spin" /> Analysing...</> : <><Search className="mr-3 h-5 w-5" /> Analyse Topic Gaps</>}
                  </Button>
                </>
              )}

              {/* On-Page Optimization */}
              {activeTool === 2 && (
                <>
                  <div className="space-y-2">
                    <FieldLabel>Page URL</FieldLabel>
                    <GlassInput placeholder="https://example.com/page-to-optimise" value={seoOptData.url} onChange={(e) => setSeoOptData({ ...seoOptData, url: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <FieldLabel>Page Content</FieldLabel>
                    <GlassTextarea placeholder="Paste your page content or HTML here..." value={seoOptData.content} onChange={(e) => setSeoOptData({ ...seoOptData, content: e.target.value })} className="min-h-[180px]" />
                  </div>
                  <Button
                    onClick={handleSEOOptimization}
                    disabled={!seoOptData.url || !seoOptData.content || isLoading}
                    className={`w-full bg-gradient-to-r ${tool.color} text-white shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all cursor-pointer h-14 rounded-2xl text-lg font-black tracking-wide uppercase mt-4 active:scale-[0.98] border border-white/20`}
                  >
                    {isLoading ? <><Loader2 className="mr-3 h-5 w-5 animate-spin" /> Optimising...</> : <><TrendingUp className="mr-3 h-5 w-5" /> Optimise Content</>}
                  </Button>
                </>
              )}

              {/* Ad Copy Generator */}
              {activeTool === 3 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <FieldLabel>Product / Service</FieldLabel>
                      <GlassInput placeholder="e.g., SEO consulting service" value={adCopyData.product} onChange={(e) => setAdCopyData({ ...adCopyData, product: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <FieldLabel>Target Audience</FieldLabel>
                      <GlassInput placeholder="e.g., small business owners" value={adCopyData.targetAudience} onChange={(e) => setAdCopyData({ ...adCopyData, targetAudience: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <FieldLabel>Unique Selling Point (USP)</FieldLabel>
                      <GlassInput placeholder="e.g., results in 30 days guaranteed" value={adCopyData.usp} onChange={(e) => setAdCopyData({ ...adCopyData, usp: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <FieldLabel>Ad Platform</FieldLabel>
                      <GlassSelect value={adCopyData.platform} onChange={(e) => setAdCopyData({ ...adCopyData, platform: e.target.value })}>
                        <option value="Google">Google</option>
                        <option value="Facebook">Facebook</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="Twitter">Twitter / X</option>
                      </GlassSelect>
                    </div>
                  </div>
                  <Button
                    onClick={handleAdCopyGeneration}
                    disabled={!adCopyData.product || !adCopyData.targetAudience || isLoading}
                    className={`w-full bg-gradient-to-r ${tool.color} text-white shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all cursor-pointer h-14 rounded-2xl text-lg font-black tracking-wide uppercase mt-4 active:scale-[0.98] border border-white/20`}
                  >
                    {isLoading ? <><Loader2 className="mr-3 h-5 w-5 animate-spin" /> Generating...</> : <><Sparkles className="mr-3 h-5 w-5" /> Generate Ad Copy</>}
                  </Button>
                </>
              )}

              {/* Email Sequence Creator */}
              {activeTool === 4 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <FieldLabel>Sequence Purpose</FieldLabel>
                      <GlassInput placeholder="e.g., onboarding new subscribers" value={emailData.purpose} onChange={(e) => setEmailData({ ...emailData, purpose: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <FieldLabel>Target Audience</FieldLabel>
                      <GlassInput placeholder="e.g., new trial sign-ups" value={emailData.audience} onChange={(e) => setEmailData({ ...emailData, audience: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <FieldLabel>Sequence Length</FieldLabel>
                    <GlassSelect value={emailData.sequenceLength} onChange={(e) => setEmailData({ ...emailData, sequenceLength: e.target.value })}>
                      <option value="3">3 emails (Brief)</option>
                      <option value="5">5 emails (Standard)</option>
                      <option value="7">7 emails (Extended)</option>
                      <option value="10">10 emails (Full)</option>
                    </GlassSelect>
                  </div>
                  <Button
                    onClick={handleEmailSequence}
                    disabled={!emailData.purpose || !emailData.audience || isLoading}
                    className={`w-full bg-gradient-to-r ${tool.color} text-white shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all cursor-pointer h-14 rounded-2xl text-lg font-black tracking-wide uppercase mt-4 active:scale-[0.98] border border-white/20`}
                  >
                    {isLoading ? <><Loader2 className="mr-3 h-5 w-5 animate-spin" /> Creating...</> : <><MessageSquare className="mr-3 h-5 w-5" /> Create Email Sequence</>}
                  </Button>
                </>
              )}

              {/* Keyword Research */}
              {activeTool === 5 && (
                <>
                  <div className="space-y-2">
                    <FieldLabel>Seed Keyword</FieldLabel>
                    <GlassInput placeholder="e.g., sustainable marketing" value={keywordData.seedKeyword} onChange={(e) => setKeywordData({ ...keywordData, seedKeyword: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <FieldLabel>Location</FieldLabel>
                      <GlassSelect value={keywordData.location} onChange={(e) => setKeywordData({ ...keywordData, location: e.target.value })}>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="Australia">Australia</option>
                        <option value="Global">Global</option>
                      </GlassSelect>
                    </div>
                    <div className="space-y-2">
                      <FieldLabel>Language</FieldLabel>
                      <GlassSelect value={keywordData.language} onChange={(e) => setKeywordData({ ...keywordData, language: e.target.value })}>
                        <option value="English">EN — English</option>
                        <option value="Spanish">ES — Spanish</option>
                        <option value="French">FR — French</option>
                        <option value="German">DE — German</option>
                      </GlassSelect>
                    </div>
                  </div>
                  <Button
                    onClick={handleKeywordResearch}
                    disabled={!keywordData.seedKeyword || isLoading}
                    className={`w-full bg-gradient-to-r ${tool.color} text-white shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all cursor-pointer h-14 rounded-2xl text-lg font-black tracking-wide uppercase mt-4 active:scale-[0.98] border border-white/20`}
                  >
                    {isLoading ? <><Loader2 className="mr-3 h-5 w-5 animate-spin" /> Researching...</> : <><Hash className="mr-3 h-5 w-5" /> Research Keywords</>}
                  </Button>
                </>
              )}

              {/* Content Generator */}
              {activeTool === 6 && (
                <>
                  <div className="space-y-2">
                    <FieldLabel>Topic</FieldLabel>
                    <GlassInput placeholder="e.g., How to improve your SEO in 2025" value={contentData.topic} onChange={(e) => setContentData({ ...contentData, topic: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <FieldLabel>Content Type</FieldLabel>
                      <GlassSelect value={contentData.type} onChange={(e) => setContentData({ ...contentData, type: e.target.value })}>
                        <option value="blog-post">Blog Post</option>
                        <option value="article">Article</option>
                        <option value="guide">Step-by-step Guide</option>
                        <option value="how-to">How-to Guide</option>
                        <option value="listicle">Listicle</option>
                      </GlassSelect>
                    </div>
                    <div className="space-y-2">
                      <FieldLabel>Word Count</FieldLabel>
                      <GlassSelect value={contentData.length} onChange={(e) => setContentData({ ...contentData, length: e.target.value })}>
                        <option value="1000">~1,000 words (Short)</option>
                        <option value="1500">~1,500 words (Standard)</option>
                        <option value="2000">~2,000 words (Medium)</option>
                        <option value="2500">~2,500 words (Long)</option>
                        <option value="3000">3,000+ words (Detailed)</option>
                      </GlassSelect>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <FieldLabel>Tone</FieldLabel>
                    <GlassSelect value={contentData.tone} onChange={(e) => setContentData({ ...contentData, tone: e.target.value })}>
                      <option value="professional">Professional</option>
                      <option value="casual">Casual</option>
                      <option value="friendly">Friendly</option>
                      <option value="authoritative">Authoritative</option>
                      <option value="conversational">Conversational</option>
                    </GlassSelect>
                  </div>
                  <Button
                    onClick={handleContentGeneration}
                    disabled={!contentData.topic || isLoading}
                    className={`w-full bg-gradient-to-r ${tool.color} text-white shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all cursor-pointer h-14 rounded-2xl text-lg font-black tracking-wide uppercase mt-4 active:scale-[0.98] border border-white/20`}
                  >
                    {isLoading ? <><Loader2 className="mr-3 h-5 w-5 animate-spin" /> Generating...</> : <><PenTool className="mr-3 h-5 w-5" /> Generate Content</>}
                  </Button>
                </>
              )}

              {/* Link Building Outreach */}
              {activeTool === 7 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <FieldLabel>Target URL</FieldLabel>
                      <GlassInput placeholder="https://competitor.com/blog" value={linkBuildingData.targetUrl} onChange={(e) => setLinkBuildingData({ ...linkBuildingData, targetUrl: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <FieldLabel>Niche / Industry</FieldLabel>
                      <GlassInput placeholder="e.g., Tech, Fashion" value={linkBuildingData.niche} onChange={(e) => setLinkBuildingData({ ...linkBuildingData, niche: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <FieldLabel>Outreach Goal</FieldLabel>
                    <GlassSelect value={linkBuildingData.goal} onChange={(e) => setLinkBuildingData({ ...linkBuildingData, goal: e.target.value })}>
                      <option value="guest-post">Guest Post Request</option>
                      <option value="link-insertion">Link Insertion</option>
                      <option value="skyscaper">Skyscraper Technique</option>
                      <option value="partnership">General Partnership</option>
                    </GlassSelect>
                  </div>
                  <Button
                    onClick={handleLinkBuilding}
                    disabled={!linkBuildingData.targetUrl || !linkBuildingData.niche || isLoading}
                    className={`w-full bg-gradient-to-r ${tool.color} text-white shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all cursor-pointer h-14 rounded-2xl text-lg font-black tracking-wide uppercase mt-4 active:scale-[0.98] border border-white/20`}
                  >
                    {isLoading ? <><Loader2 className="mr-3 h-5 w-5 animate-spin" /> Generating...</> : <><Link2 className="mr-3 h-5 w-5" /> Generate Outreach Email</>}
                  </Button>
                </>
              )}

              {/* Social Content Studio */}
              {activeTool === 8 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <FieldLabel>Brand Name</FieldLabel>
                      <GlassInput placeholder="e.g., Telemoz" value={socialData.brandName} onChange={(e) => setSocialData({ ...socialData, brandName: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <FieldLabel>Topic / News</FieldLabel>
                      <GlassInput placeholder="e.g., New AI Launch" value={socialData.topic} onChange={(e) => setSocialData({ ...socialData, topic: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <FieldLabel>Platform</FieldLabel>
                      <GlassSelect value={socialData.platform} onChange={(e) => setSocialData({ ...socialData, platform: e.target.value })}>
                        <option value="Instagram">Instagram</option>
                        <option value="Twitter">Twitter / X</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="Facebook">Facebook</option>
                      </GlassSelect>
                    </div>
                    <div className="space-y-2">
                      <FieldLabel>Tone</FieldLabel>
                      <GlassSelect value={socialData.tone} onChange={(e) => setSocialData({ ...socialData, tone: e.target.value })}>
                        <option value="creative">Creative</option>
                        <option value="professional">Professional</option>
                        <option value="humorous">Humorous</option>
                        <option value="minimalist">Minimalist</option>
                      </GlassSelect>
                    </div>
                  </div>
                  <Button
                    onClick={handleSocialMedia}
                    disabled={!socialData.brandName || !socialData.topic || isLoading}
                    className={`w-full bg-gradient-to-r ${tool.color} text-white shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all cursor-pointer h-14 rounded-2xl text-lg font-black tracking-wide uppercase mt-4 active:scale-[0.98] border border-white/20`}
                  >
                    {isLoading ? <><Loader2 className="mr-3 h-5 w-5 animate-spin" /> Generating...</> : <><MessageSquare className="mr-3 h-5 w-5" /> Generate Social Posts</>}
                  </Button>
                </>
              )}

              {/* Competitor Analysis */}
              {activeTool === 9 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <FieldLabel>Competitor URL</FieldLabel>
                      <GlassInput placeholder="https://competitor.com" value={competitorData.competitorUrl} onChange={(e) => setCompetitorData({ ...competitorData, competitorUrl: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <FieldLabel>Industry</FieldLabel>
                      <GlassInput placeholder="e.g., E-commerce, SaaS" value={competitorData.industry} onChange={(e) => setCompetitorData({ ...competitorData, industry: e.target.value })} />
                    </div>
                  </div>
                  <Button
                    onClick={handleCompetitorAnalysis}
                    disabled={!competitorData.competitorUrl || isLoading}
                    className={`w-full bg-gradient-to-r ${tool.color} text-white shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all cursor-pointer h-14 rounded-2xl text-lg font-black tracking-wide uppercase mt-4 active:scale-[0.98] border border-white/20`}
                  >
                    {isLoading ? <><Loader2 className="mr-3 h-5 w-5 animate-spin" /> Analysing...</> : <><BarChart3 className="mr-3 h-5 w-5" /> Analyse Competitor</>}
                  </Button>
                </>
              )}

              {/* Headline Generator */}
              {activeTool === 10 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <FieldLabel>Main Topic</FieldLabel>
                      <GlassInput placeholder="e.g., AI Marketing Automation" value={headlineData.topic} onChange={(e) => setHeadlineData({ ...headlineData, topic: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <FieldLabel>Target Audience</FieldLabel>
                      <GlassInput placeholder="e.g., Marketing Managers" value={headlineData.targetAudience} onChange={(e) => setHeadlineData({ ...headlineData, targetAudience: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <FieldLabel>Number of Variations</FieldLabel>
                    <GlassSelect value={headlineData.count} onChange={(e) => setHeadlineData({ ...headlineData, count: e.target.value })}>
                      <option value="5">5 variations</option>
                      <option value="10">10 variations</option>
                      <option value="15">15 variations</option>
                      <option value="20">20 variations</option>
                    </GlassSelect>
                  </div>
                  <Button
                    onClick={handleHeadlineGeneration}
                    disabled={!headlineData.topic || isLoading}
                    className={`w-full bg-gradient-to-r ${tool.color} text-white shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all cursor-pointer h-14 rounded-2xl text-lg font-black tracking-wide uppercase mt-4 active:scale-[0.98] border border-white/20`}
                  >
                    {isLoading ? <><Loader2 className="mr-3 h-5 w-5 animate-spin" /> Generating...</> : <><Type className="mr-3 h-5 w-5" /> Generate Headlines</>}
                  </Button>
                </>
              )}

              {/* Subject Line Optimizer */}
              {activeTool === 11 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <FieldLabel>Email Topic / Content</FieldLabel>
                      <GlassInput placeholder="e.g., Summer Sale 20% Off" value={subjectData.emailTopic} onChange={(e) => setSubjectData({ ...subjectData, emailTopic: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <FieldLabel>Audience Segment</FieldLabel>
                      <GlassInput placeholder="e.g., Existing Customers" value={subjectData.audience} onChange={(e) => setSubjectData({ ...subjectData, audience: e.target.value })} />
                    </div>
                  </div>
                  <Button
                    onClick={handleSubjectLineOptimization}
                    disabled={!subjectData.emailTopic || isLoading}
                    className={`w-full bg-gradient-to-r ${tool.color} text-white shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all cursor-pointer h-14 rounded-2xl text-lg font-black tracking-wide uppercase mt-4 active:scale-[0.98] border border-white/20`}
                  >
                    {isLoading ? <><Loader2 className="mr-3 h-5 w-5 animate-spin" /> Optimising...</> : <><Mail className="mr-3 h-5 w-5" /> Optimise Subject Lines</>}
                  </Button>
                </>
              )}

              {/* Landing Page Copywriter */}
              {activeTool === 12 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <FieldLabel>Product / Service Name</FieldLabel>
                      <GlassInput placeholder="e.g., Telemoz SEO" value={landingPageData.product} onChange={(e) => setLandingPageData({ ...landingPageData, product: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <FieldLabel>Audience</FieldLabel>
                      <GlassInput placeholder="e.g., Tech Startups" value={landingPageData.audience} onChange={(e) => setLandingPageData({ ...landingPageData, audience: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <FieldLabel>Copy Framework</FieldLabel>
                    <GlassSelect value={landingPageData.framework} onChange={(e) => setLandingPageData({ ...landingPageData, framework: e.target.value })}>
                      <option value="AIDA">AIDA (Attention, Interest, Desire, Action)</option>
                      <option value="PAS">PAS (Problem, Agitation, Solution)</option>
                      <option value="BAB">BAB (Before, After, Bridge)</option>
                      <option value="QUEST">QUEST (Qualify, Understand, Educate, Stimulate, Transition)</option>
                    </GlassSelect>
                  </div>
                  <Button
                    onClick={handleLandingPageCopy}
                    disabled={!landingPageData.product || !landingPageData.audience || isLoading}
                    className={`w-full bg-gradient-to-r ${tool.color} text-white shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all cursor-pointer h-14 rounded-2xl text-lg font-black tracking-wide uppercase mt-4 active:scale-[0.98] border border-white/20`}
                  >
                    {isLoading ? <><Loader2 className="mr-3 h-5 w-5 animate-spin" /> Generating...</> : <><Target className="mr-3 h-5 w-5" /> Generate Page Copy</>}
                  </Button>
                </>
              )}

              {/* Campaign Brief Summariser */}
              {activeTool === 13 && (
                <>
                  <div className="space-y-2">
                    <FieldLabel>Paste Client Brief</FieldLabel>
                    <GlassTextarea
                      rows={10}
                      placeholder="Paste the raw client brief here — email, document, or notes..."
                      value={briefData.rawBrief}
                      onChange={(e) => setBriefData({ rawBrief: e.target.value })}
                      className="min-h-[220px]"
                    />
                  </div>
                  <Button
                    onClick={async () => {
                      if (!briefData.rawBrief) return;
                      setIsLoading(true);
                      try {
                        const res = await fetch("/api/ai/brief-summarise", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(briefData) });
                        const data = await res.json();
                        setResults(data.summary || data.error || "Summary generated.");
                      } catch { setResults("Error generating summary."); }
                      finally { setIsLoading(false); }
                    }}
                    disabled={!briefData.rawBrief || isLoading}
                    className={`w-full bg-gradient-to-r ${tool.color} text-white shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all cursor-pointer h-14 rounded-2xl text-lg font-black tracking-wide uppercase mt-4 active:scale-[0.98] border border-white/20`}
                  >
                    {isLoading ? <><Loader2 className="mr-3 h-5 w-5 animate-spin" /> Summarising...</> : <><ClipboardList className="mr-3 h-5 w-5" /> Summarise Brief</>}
                  </Button>
                </>
              )}

              {/* Performance Anomaly Analyser */}
              {activeTool === 14 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <FieldLabel>Metric</FieldLabel>
                      <GlassInput placeholder="e.g. CTR, ROAS, CPA, Conversions" value={anomalyData.metric} onChange={(e) => setAnomalyData({ ...anomalyData, metric: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <FieldLabel>Change Observed</FieldLabel>
                      <GlassInput placeholder="e.g. dropped 40% week-over-week" value={anomalyData.change} onChange={(e) => setAnomalyData({ ...anomalyData, change: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <FieldLabel>Platform</FieldLabel>
                      <GlassInput placeholder="e.g. Meta Ads, Google Ads" value={anomalyData.platform} onChange={(e) => setAnomalyData({ ...anomalyData, platform: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <FieldLabel>Context</FieldLabel>
                      <GlassInput placeholder="e.g. no creative changes, same budget" value={anomalyData.context} onChange={(e) => setAnomalyData({ ...anomalyData, context: e.target.value })} />
                    </div>
                  </div>
                  <Button
                    onClick={async () => {
                      if (!anomalyData.metric || !anomalyData.change) return;
                      setIsLoading(true);
                      try {
                        const res = await fetch("/api/ai/anomaly-analyse", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(anomalyData) });
                        const data = await res.json();
                        setResults(data.analysis || data.error || "Analysis generated.");
                      } catch { setResults("Error generating analysis."); }
                      finally { setIsLoading(false); }
                    }}
                    disabled={!anomalyData.metric || !anomalyData.change || isLoading}
                    className={`w-full bg-gradient-to-r ${tool.color} text-white shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all cursor-pointer h-14 rounded-2xl text-lg font-black tracking-wide uppercase mt-4 active:scale-[0.98] border border-white/20`}
                  >
                    {isLoading ? <><Loader2 className="mr-3 h-5 w-5 animate-spin" /> Analysing...</> : <><AlertTriangle className="mr-3 h-5 w-5" /> Analyse Anomaly</>}
                  </Button>
                </>
              )}

              {/* Results Panel */}
              <AnimatePresence>
                {results && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="mt-10 relative"
                  >
                    <div className={`absolute -inset-1 bg-gradient-to-r ${tool.color} rounded-[2rem] blur-xl opacity-30 animate-pulse`} />
                    <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/60 p-[1px] shadow-[inset_0_2px_15px_rgb(255,255,255,0.7),0_10px_30px_rgb(0,0,0,0.05)] backdrop-blur-3xl">
                      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${tool.color}`} />

                      <div className="bg-gradient-to-b from-white/90 to-white/60 p-6 sm:p-8 rounded-[31px]">
                        <div className="flex items-center justify-between mb-6 border-b border-gray-200/50 pb-4">
                          <div className="flex items-center gap-3">
                            <div className={`rounded-full bg-gradient-to-br ${tool.color} p-1.5 shadow-md`}>
                              <CheckCircle2 className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <h4 className="font-black text-gray-900 tracking-tight text-lg leading-none">Results</h4>
                              <span className="text-[12px] font-bold text-gray-400 tracking-wide">{wordCount.toLocaleString()} words</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setResults("")}
                              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold text-gray-500 bg-white shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all border border-gray-100 hover:text-red-500 hover:border-red-100"
                              title="Clear results"
                            >
                              <X className="h-4 w-4" />
                              <span className="hidden sm:inline">Clear</span>
                            </button>
                            <button
                              onClick={() => handleCopy(results)}
                              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-gray-700 bg-white shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all border border-gray-100"
                            >
                              {copied ? (
                                <><CheckCircle2 className="h-4 w-4 text-emerald-500" /><span className="text-emerald-600">Copied!</span></>
                              ) : (
                                <><Copy className="h-4 w-4" /><span>Copy</span></>
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="text-[15px] leading-[1.9] text-gray-800 whitespace-pre-wrap max-h-[500px] overflow-y-auto custom-scrollbar p-6 rounded-[1.5rem] bg-white/80 border border-white/60 shadow-[inset_0_2px_15px_rgb(0,0,0,0.03)] backdrop-blur-md font-medium">
                          {results}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  };

  const categories = Array.from(new Set(aiTools.map((t) => t.category)));

  const categoryCounts = categories.reduce<Record<string, number>>((acc, cat) => {
    acc[cat] = aiTools.filter((t) => t.category === cat).length;
    return acc;
  }, {});

  const filteredTools = aiTools.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? tool.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const liveCount = aiTools.filter((t) => t.available).length;

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-gray-50 overflow-hidden pb-12 pt-4 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-[10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#0a9396]/10 blur-[140px] pointer-events-none mix-blend-multiply animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[130px] pointer-events-none mix-blend-multiply animate-pulse-slow" />
      <div className="absolute top-[50%] right-[30%] w-[40%] h-[40%] rounded-full bg-violet-400/10 blur-[140px] pointer-events-none mix-blend-multiply animate-float-slow" />

      <div className="relative z-10 max-w-[1600px] mx-auto h-[calc(100vh-8rem)] flex flex-col">
        {/* Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 bg-white/40 px-6 py-5 md:px-8 rounded-[2rem] sm:rounded-[2.5rem] border border-white/60 shadow-[inset_0_2px_15px_rgb(255,255,255,0.7),0_8px_30px_rgb(0,0,0,0.02)] backdrop-blur-2xl">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-gradient-to-br from-[#0a9396] to-teal-500 rounded-2xl shadow-lg shadow-[#0a9396]/20 relative overflow-hidden group shrink-0">
              <div className="absolute inset-0 bg-white/20 w-full h-full transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
              <Sparkles className="h-7 w-7 text-white relative z-10" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tighter flex items-center gap-3 mb-0.5">
                AI Tools
                <Badge variant="primary" size="lg" className="hidden sm:inline-flex bg-gradient-to-r from-teal-400 to-[#0a9396] text-white border-none py-1.5 px-3">
                  Pro
                </Badge>
              </h1>
              <p className="text-gray-500 font-bold tracking-wide text-sm">
                Generate content, optimise SEO, and automate marketing with AI.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            {aiUsage && (
              <div className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border shadow-sm backdrop-blur-xl transition-colors ${
                aiUsage.remaining === 0
                  ? "bg-red-50/80 border-red-200 text-red-600"
                  : aiUsage.remaining <= 5
                  ? "bg-amber-50/80 border-amber-200 text-amber-700"
                  : "bg-white/60 border-white/80 text-gray-700"
              }`}>
                <Zap className={`h-3.5 w-3.5 ${aiUsage.remaining === 0 ? "text-red-400" : aiUsage.remaining <= 5 ? "text-amber-400" : "text-emerald-400"}`} />
                <span className="text-[13px] font-black tracking-wide">
                  {aiUsage.remaining} / {aiUsage.limit} requests today
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/60 border border-white/80 shadow-sm backdrop-blur-xl">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[13px] font-black text-gray-700 tracking-wide">{liveCount} Live</span>
            </div>
          </div>
        </div>

        {/* Main Split View */}
        <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
          {/* Sidebar: Tool Library */}
          <div className="w-full lg:w-[400px] flex flex-col bg-white/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/60 shadow-[inset_0_2px_15px_rgb(255,255,255,0.7),0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden shrink-0 h-[400px] lg:h-full">
            <div className="p-6 border-b border-white/40 bg-white/40 space-y-5 shrink-0">
              <div className="relative group/search">
                <div className="absolute inset-0 bg-[#0a9396]/5 blur-xl rounded-2xl opacity-0 group-focus-within/search:opacity-100 transition-opacity pointer-events-none" />
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within/search:text-[#0a9396] group-focus-within/search:scale-110 transition-all z-10" />
                <input
                  type="text"
                  placeholder="Search tools..."
                  className="w-full pl-13 pr-5 !h-15 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-xl font-black text-gray-900 placeholder-gray-400 outline-none focus:border-[#0a9396]/30 focus:ring-8 focus:ring-[#0a9396]/5 transition-all shadow-[inset_0_2px_10px_rgb(0,0,0,0.02)] relative z-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="relative group/slider">
                <div className="absolute left-0 top-0 bottom-4 w-12 bg-gradient-to-r from-white via-white/40 to-transparent z-10 pointer-events-none" />
                <div id="category-slider" className="flex gap-2.5 overflow-x-auto pb-4 pt-1 scroll-smooth no-scrollbar px-10">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-5 py-2.5 rounded-[1.25rem] text-[12px] font-black tracking-[0.12em] uppercase transition-all duration-300 cursor-pointer flex-shrink-0 relative overflow-hidden ${
                      selectedCategory === null
                        ? "bg-gray-900 text-white shadow-xl shadow-gray-900/20 scale-105"
                        : "bg-white text-gray-400 border border-gray-100 hover:text-gray-900 hover:border-[#0a9396]/30 hover:shadow-lg hover:-translate-y-0.5"
                    }`}
                  >
                    All
                    <span className={`ml-1.5 text-[10px] ${selectedCategory === null ? "opacity-60" : "opacity-40"}`}>
                      {aiTools.length}
                    </span>
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-5 py-2.5 rounded-[1.25rem] text-[12px] font-black tracking-[0.12em] uppercase transition-all duration-300 cursor-pointer flex-shrink-0 ${
                        selectedCategory === category
                          ? "bg-gray-900 text-white shadow-xl shadow-gray-900/20 scale-105"
                          : "bg-white text-gray-400 border border-gray-100 hover:text-gray-900 hover:border-[#0a9396]/30 hover:shadow-lg hover:-translate-y-0.5"
                      }`}
                    >
                      {category}
                      <span className={`ml-1.5 text-[10px] ${selectedCategory === category ? "opacity-60" : "opacity-40"}`}>
                        {categoryCounts[category]}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-white via-white/40 to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 left-0 flex items-center z-20 px-1 pointer-events-none pb-4">
                  <button
                    onClick={() => document.getElementById("category-slider")?.scrollBy({ left: -200, behavior: "smooth" })}
                    className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-xl shadow-lg border border-white flex items-center justify-center cursor-pointer pointer-events-auto hover:scale-110 active:scale-90 transition-all text-[#0a9396] hover:bg-[#0a9396] hover:text-white"
                  >
                    <ChevronRight className="h-4 w-4 rotate-180" />
                  </button>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center z-20 px-1 pointer-events-none pb-4">
                  <button
                    onClick={() => document.getElementById("category-slider")?.scrollBy({ left: 200, behavior: "smooth" })}
                    className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-xl shadow-lg border border-white flex items-center justify-center cursor-pointer pointer-events-auto hover:scale-110 active:scale-90 transition-all text-[#0a9396] hover:bg-[#0a9396] hover:text-white"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-gradient-to-b from-white/30 to-transparent">
              {filteredTools.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <div className="w-20 h-20 rounded-3xl bg-white/40 border border-white/60 shadow-inner flex items-center justify-center mb-6 backdrop-blur-xl">
                    <Search className="h-10 w-10 text-gray-300" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-2 tracking-tight">No match found</h3>
                  <p className="text-gray-500 font-medium max-w-[200px]">Try adjusting your search or category filter.</p>
                </div>
              ) : (
                filteredTools.map((tool, index) => {
                  const Icon = tool.icon;
                  const isActive = activeTool === tool.id;

                  return (
                    <motion.div
                      key={tool.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <button
                        onClick={() => {
                          setActiveTool(tool.id);
                          setResults("");
                        }}
                        className={`w-full text-left p-4 rounded-[1.75rem] transition-all duration-300 group relative cursor-pointer flex items-center gap-4 ${
                          isActive
                            ? "bg-white border-[#0a9396]/10 shadow-[0_20px_40px_rgb(0,0,0,0.08)] scale-[1.02] z-10"
                            : tool.available
                            ? "bg-white/40 border-white/80 hover:bg-white hover:shadow-[0_10px_30px_rgb(0,0,0,0.04)] hover:scale-[1.01] hover:border-white"
                            : "bg-white/20 border-white/50 hover:bg-white/30 opacity-70"
                        } border`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="active-highlight"
                            className={`absolute -left-1.5 top-6 bottom-6 w-1.5 rounded-full bg-gradient-to-b ${tool.color} shadow-[0_0_15px_rgb(10,147,150,0.4)]`}
                          />
                        )}

                        <div className={`relative shrink-0 w-14 h-14 rounded-[1.25rem] transition-all duration-300 overflow-hidden flex items-center justify-center ${isActive ? "scale-110 rotate-3 shadow-xl" : "group-hover:scale-105 group-hover:-rotate-3 shadow-md"} ${!tool.available ? "opacity-60" : ""}`}>
                          <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-90`} />
                          <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                          <Icon className="h-6 w-6 text-white relative z-10 drop-shadow-md" />
                          {!tool.available && (
                            <div className="absolute inset-0 bg-gray-900/20 flex items-center justify-center">
                              <Lock className="h-3.5 w-3.5 text-white/80" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h3 className={`font-black text-[16px] truncate tracking-tight ${isActive ? "text-gray-900" : "text-gray-800"}`}>
                              {tool.name}
                            </h3>
                            {isActive && <div className="h-2 w-2 rounded-full bg-[#0a9396] animate-pulse shrink-0" />}
                          </div>
                          <div className="flex items-center gap-2">
                            <p className={`text-[12px] font-bold tracking-wide line-clamp-1 leading-tight ${isActive ? "text-gray-600" : "text-gray-500 opacity-80"}`}>
                              {tool.description}
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0 flex flex-col items-end gap-1.5">
                          {tool.available ? (
                            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                              Live
                            </span>
                          ) : (
                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
                              Soon
                            </span>
                          )}
                          <ChevronRight className={`h-4 w-4 transition-all ${isActive ? "text-[#0a9396] translate-x-0 opacity-100" : "text-gray-300 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"}`} />
                        </div>
                      </button>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right: Active Tool Panel */}
          <div className="flex-1 min-w-0 lg:h-full">
            {renderToolInterface()}
          </div>
        </div>
      </div>
    </div>
  );
}
