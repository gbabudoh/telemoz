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
    name: "On-Page Optimization",
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
    category: "Email",
    color: "from-amber-500 to-orange-500",
  },
  {
    id: 5,
    name: "Keyword Research Matrix",
    description: "Find keywords, search volume, difficulty, and related queries",
    icon: Hash,
    category: "SEO",
    color: "from-indigo-500 to-purple-500",
  },
  {
    id: 6,
    name: "Content Engine",
    description: "Generate blog posts, articles, and long-form content",
    icon: PenTool,
    category: "Content",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: 7,
    name: "Link Building Outreach",
    description: "Generate personalized outreach emails for link building targets",
    icon: Link2,
    category: "SEO",
    color: "from-cyan-500 to-blue-500",
  },
  {
    id: 8,
    name: "Social Content Studio",
    description: "Create platform-specific content for Instagram, Twitter, LinkedIn",
    icon: MessageSquare,
    category: "Social",
    color: "from-pink-500 to-rose-500",
  },
  {
    id: 9,
    name: "Competitor Analysis",
    description: "Analyze competitor keywords, content strategies, and SEO",
    icon: BarChart3,
    category: "SEO",
    color: "from-violet-500 to-purple-500",
  },
  {
    id: 10,
    name: "Headline Generator",
    description: "Generate multiple headline variations for A/B testing loops",
    icon: Type,
    category: "Content",
    color: "from-orange-500 to-red-500",
  },
  {
    id: 11,
    name: "Subject Line Optimizer",
    description: "Create high open-rate email subject lines and preview text",
    icon: Mail,
    category: "Email",
    color: "from-teal-500 to-cyan-500",
  },
  {
    id: 12,
    name: "Landing Page Copywriter",
    description: "Generate conversion-focused landing page copy blocks",
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

  // Reusable component for the glass inputs
  const GlassInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input
      {...props}
      className={`w-full px-5 h-12 rounded-xl border border-white/60 bg-white/40 focus:bg-white/90 text-sm text-gray-900 placeholder-gray-500 focus:border-[#0a9396]/60 focus:outline-none focus:ring-4 focus:ring-[#0a9396]/10 transition-all backdrop-blur-md shadow-[inset_0_2px_4px_rgb(0,0,0,0.02)] ${props.className || ''}`}
    />
  );

  const GlassSelect = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
    <select
      {...props}
      className={`w-full px-5 h-12 rounded-xl border border-white/60 bg-white/40 focus:bg-white/90 text-sm text-gray-900 focus:border-[#0a9396]/60 focus:outline-none focus:ring-4 focus:ring-[#0a9396]/10 transition-all backdrop-blur-md shadow-[inset_0_2px_4px_rgb(0,0,0,0.02)] appearance-none cursor-pointer ${props.className || ''}`}
    >
      {props.children}
    </select>
  );

  const GlassTextarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <textarea
      {...props}
      className={`w-full px-5 py-4 rounded-xl border border-white/60 bg-white/40 focus:bg-white/90 text-sm text-gray-900 placeholder-gray-500 focus:border-[#0a9396]/60 focus:outline-none focus:ring-4 focus:ring-[#0a9396]/10 transition-all backdrop-blur-md shadow-[inset_0_2px_4px_rgb(0,0,0,0.02)] resize-y ${props.className || ''}`}
    />
  );

  const renderToolInterface = () => {
    const tool = aiTools.find((t) => t.id === activeTool);
    if (!tool) {
      return (
        <div className="h-full flex flex-col items-center justify-center p-8 lg:p-12 text-center rounded-[2.5rem] bg-white/40 border border-white/60 shadow-[inset_0_2px_15px_rgb(255,255,255,0.7),0_8px_30px_rgb(0,0,0,0.02)] backdrop-blur-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a9396]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
          
          <div className="w-32 h-32 rounded-[2rem] bg-gradient-to-br from-white to-[#0a9396]/10 flex items-center justify-center mb-8 shadow-2xl shadow-[#0a9396]/20 border border-white relative z-10 transition-all duration-700 group-hover:scale-105 group-hover:rotate-3">
            <Sparkles className="h-12 w-12 text-[#0a9396]" />
            <div className="absolute -inset-4 bg-[#0a9396]/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-black tracking-tighter text-gray-900 mb-6 relative z-10">
            Intelligent <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0a9396] to-teal-400">Generations</span>
          </h2>
          <p className="text-gray-500 font-medium max-w-lg mx-auto mb-12 text-lg leading-relaxed relative z-10">
            Select an algorithmic module from the active terminal library to instantly synthesize content, align SEO nodes, or architect marketing sequences.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-xl relative z-10">
            <div className="p-5 rounded-2xl bg-white/60 border border-white/80 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex items-center gap-4 backdrop-blur-xl hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-lg shadow-amber-500/20">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <div className="font-extrabold tracking-tight text-gray-900 text-base mb-0.5">Hyper Results</div>
                <div className="text-[13px] font-medium text-gray-500">Zero latency translations</div>
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-white/60 border border-white/80 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex items-center gap-4 backdrop-blur-xl hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="p-3 bg-gradient-to-br from-teal-400 to-[#0a9396] rounded-xl shadow-lg shadow-[#0a9396]/20">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <div className="font-extrabold tracking-tight text-gray-900 text-base mb-0.5">Telemetry Driven</div>
                <div className="text-[13px] font-medium text-gray-500">Conversion node mapping</div>
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
          initial={{ opacity: 0, scale: 0.98, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: -15 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="h-full"
        >
          <div className="h-full border border-white/60 shadow-[inset_0_2px_15px_rgb(255,255,255,0.7),0_8px_30px_rgb(0,0,0,0.04)] bg-white/40 backdrop-blur-2xl overflow-hidden flex flex-col rounded-[2.5rem] relative">
            <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${tool.color} opacity-80`} />
            
            <div className="px-8 py-6 pb-4 border-b border-white/40 relative z-10 flex items-center gap-5 bg-white/20">
               <div className={`rounded-2xl bg-gradient-to-br ${tool.color} p-4 shadow-lg`}>
                 <Icon className="h-8 w-8 text-white relative z-10" />
               </div>
               <div>
                 <h2 className="text-3xl font-black tracking-tight text-gray-900 mb-1.5 drop-shadow-sm">{tool.name}</h2>
                 <p className="text-[15px] font-medium text-gray-500 tracking-wide">{tool.description}</p>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-7 custom-scrollbar relative z-10 bg-gradient-to-b from-white/10 to-transparent">
              {/* Topic Gap Analyzer */}
              {activeTool === 1 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[13px] font-bold tracking-widest uppercase text-gray-600 ml-1">Target EndPoint URL</label>
                      <GlassInput
                        placeholder="https://example.com/page"
                        value={topicGapData.url}
                        onChange={(e) => setTopicGapData({ ...topicGapData, url: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[13px] font-bold tracking-widest uppercase text-gray-600 ml-1">Focus Keyword Node</label>
                      <GlassInput
                        placeholder="e.g., digital marketing vectors"
                        value={topicGapData.keyword}
                        onChange={(e) => setTopicGapData({ ...topicGapData, keyword: e.target.value })}
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleTopicGapAnalysis}
                    disabled={!topicGapData.url || !topicGapData.keyword || isLoading}
                    className={`w-full bg-gradient-to-r ${tool.color} text-white shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all cursor-pointer h-14 rounded-2xl text-lg font-black tracking-wide uppercase mt-4 active:scale-[0.98] border border-white/20`}
                  >
                    {isLoading ? (
                      <><Loader2 className="mr-3 h-5 w-5 animate-spin" /> Transmitting...</>
                    ) : (
                      <><Search className="mr-3 h-5 w-5" /> Compile Gap Analysis</>
                    )}
                  </Button>
                </>
              )}

              {/* On-Page Optimization */}
              {activeTool === 2 && (
                <>
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold tracking-widest uppercase text-gray-600 ml-1">Origin URL Pipeline</label>
                    <GlassInput
                      placeholder="https://example.com/page-to-optimize"
                      value={seoOptData.url}
                      onChange={(e) => setSeoOptData({ ...seoOptData, url: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold tracking-widest uppercase text-gray-600 ml-1">Raw HTML Content Block</label>
                    <GlassTextarea
                      placeholder="Paste your unparsed html/text segment here..."
                      value={seoOptData.content}
                      onChange={(e) => setSeoOptData({ ...seoOptData, content: e.target.value })}
                      className="min-h-[180px]"
                    />
                  </div>
                  <Button
                    onClick={handleSEOOptimization}
                    disabled={!seoOptData.url || !seoOptData.content || isLoading}
                    className={`w-full bg-gradient-to-r ${tool.color} text-white shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all cursor-pointer h-14 rounded-2xl text-lg font-black tracking-wide uppercase mt-4 active:scale-[0.98] border border-white/20`}
                  >
                    {isLoading ? (
                      <><Loader2 className="mr-3 h-5 w-5 animate-spin" /> Synthesizing...</>
                    ) : (
                      <><TrendingUp className="mr-3 h-5 w-5" /> Optimize DOM Nodes</>
                    )}
                  </Button>
                </>
              )}

              {/* Ad Copy Generator */}
              {activeTool === 3 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[13px] font-bold tracking-widest uppercase text-gray-600 ml-1">Vector / Product Service</label>
                      <GlassInput
                        placeholder="e.g., enterprise SEO tooling"
                        value={adCopyData.product}
                        onChange={(e) => setAdCopyData({ ...adCopyData, product: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[13px] font-bold tracking-widest uppercase text-gray-600 ml-1">Target Market Node</label>
                      <GlassInput
                        placeholder="e.g., fractional CMOs"
                        value={adCopyData.targetAudience}
                        onChange={(e) => setAdCopyData({ ...adCopyData, targetAudience: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[13px] font-bold tracking-widest uppercase text-gray-600 ml-1">Unique Anchor (USP)</label>
                      <GlassInput
                        placeholder="e.g., 200% conversion metrics"
                        value={adCopyData.usp}
                        onChange={(e) => setAdCopyData({ ...adCopyData, usp: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[13px] font-bold tracking-widest uppercase text-gray-600 ml-1">Delivery Platform</label>
                      <div className="relative">
                         <GlassSelect
                           value={adCopyData.platform}
                           onChange={(e) => setAdCopyData({ ...adCopyData, platform: e.target.value })}
                         >
                           <option value="Google">Google Search Console</option>
                           <option value="Facebook">Facebook Business Ops</option>
                           <option value="LinkedIn">LinkedIn B2B</option>
                           <option value="Twitter">Twitter Vectors</option>
                         </GlassSelect>
                         <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                            <TrendingUp className="h-4 w-4" />
                         </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={handleAdCopyGeneration}
                    disabled={!adCopyData.product || !adCopyData.targetAudience || isLoading}
                    className={`w-full bg-gradient-to-r ${tool.color} text-white shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all cursor-pointer h-14 rounded-2xl text-lg font-black tracking-wide uppercase mt-4 active:scale-[0.98] border border-white/20`}
                  >
                    {isLoading ? (
                      <><Loader2 className="mr-3 h-5 w-5 animate-spin" /> Parsing...</>
                    ) : (
                      <><Sparkles className="mr-3 h-5 w-5" /> Generate Variations</>
                    )}
                  </Button>
                </>
              )}

              {/* Email Sequence Creator */}
              {activeTool === 4 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[13px] font-bold tracking-widest uppercase text-gray-600 ml-1">Sequence Intent Path</label>
                      <GlassInput
                        placeholder="e.g., onboarding drip sequence"
                        value={emailData.purpose}
                        onChange={(e) => setEmailData({ ...emailData, purpose: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[13px] font-bold tracking-widest uppercase text-gray-600 ml-1">Receiver Profile Segment</label>
                      <GlassInput
                        placeholder="e.g., verified beta signups"
                        value={emailData.audience}
                        onChange={(e) => setEmailData({ ...emailData, audience: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold tracking-widest uppercase text-gray-600 ml-1">Automation Depth (Emails)</label>
                    <div className="relative">
                      <GlassSelect
                        value={emailData.sequenceLength}
                        onChange={(e) => setEmailData({ ...emailData, sequenceLength: e.target.value })}
                      >
                        <option value="3">3 node drip (Brief)</option>
                        <option value="5">5 node drip (Standard)</option>
                        <option value="7">7 node drip (Extended)</option>
                        <option value="10">10 node drip (Aggressive)</option>
                      </GlassSelect>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                         <Mail className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={handleEmailSequence}
                    disabled={!emailData.purpose || !emailData.audience || isLoading}
                    className={`w-full bg-gradient-to-r ${tool.color} text-white shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all cursor-pointer h-14 rounded-2xl text-lg font-black tracking-wide uppercase mt-4 active:scale-[0.98] border border-white/20`}
                  >
                     {isLoading ? <><Loader2 className="mr-3 h-5 w-5 animate-spin" /> Drafting...</> : <><MessageSquare className="mr-3 h-5 w-5" /> Architect Sequence Array</>}
                  </Button>
                </>
              )}

              {/* Keyword Research */}
              {activeTool === 5 && (
                <>
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold tracking-widest uppercase text-gray-600 ml-1">Protocol Seed Node</label>
                    <GlassInput
                      placeholder="e.g., sustainable marketing strategies"
                      value={keywordData.seedKeyword}
                      onChange={(e) => setKeywordData({ ...keywordData, seedKeyword: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[13px] font-bold tracking-widest uppercase text-gray-600 ml-1">Dataset Geolocation</label>
                      <div className="relative">
                        <GlassSelect
                          value={keywordData.location}
                          onChange={(e) => setKeywordData({ ...keywordData, location: e.target.value })}
                        >
                          <option value="United Kingdom">United Kingdom Matrix</option>
                          <option value="United States">United States Matrix</option>
                          <option value="Canada">Canada Matrix</option>
                          <option value="Australia">Australia Hub</option>
                          <option value="Global">Global Feed</option>
                        </GlassSelect>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                           <TrendingUp className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[13px] font-bold tracking-widest uppercase text-gray-600 ml-1">Syntax Language Code</label>
                      <div className="relative">
                        <GlassSelect
                          value={keywordData.language}
                          onChange={(e) => setKeywordData({ ...keywordData, language: e.target.value })}
                        >
                          <option value="English">EN - English</option>
                          <option value="Spanish">ES - Spanish</option>
                          <option value="French">FR - French</option>
                          <option value="German">DE - German</option>
                        </GlassSelect>
                         <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                           <TrendingUp className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={handleKeywordResearch}
                    disabled={!keywordData.seedKeyword || isLoading}
                    className={`w-full bg-gradient-to-r ${tool.color} text-white shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all cursor-pointer h-14 rounded-2xl text-lg font-black tracking-wide uppercase mt-4 active:scale-[0.98] border border-white/20`}
                  >
                     {isLoading ? <><Loader2 className="mr-3 h-5 w-5 animate-spin" /> Mining...</> : <><Hash className="mr-3 h-5 w-5" /> Execute Data Mining</>}
                  </Button>
                </>
              )}

              {/* Content Generator */}
              {activeTool === 6 && (
                <>
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold tracking-widest uppercase text-gray-600 ml-1">Synthesis Topic Core</label>
                    <GlassInput
                      placeholder="e.g., Decoding the 2024 core algorithms"
                      value={contentData.topic}
                      onChange={(e) => setContentData({ ...contentData, topic: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[13px] font-bold tracking-widest uppercase text-gray-600 ml-1">Formatting Node</label>
                      <div className="relative">
                        <GlassSelect
                          value={contentData.type}
                          onChange={(e) => setContentData({ ...contentData, type: e.target.value })}
                        >
                          <option value="blog-post">Standard Blog Form</option>
                          <option value="article">Deep-dive Article</option>
                          <option value="guide">Step-by-step Guide</option>
                          <option value="how-to">Instructional Array</option>
                          <option value="listicle">Listicle Index</option>
                        </GlassSelect>
                         <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                           <FileText className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[13px] font-bold tracking-widest uppercase text-gray-600 ml-1">String Length Capacity</label>
                      <div className="relative">
                        <GlassSelect
                          value={contentData.length}
                          onChange={(e) => setContentData({ ...contentData, length: e.target.value })}
                        >
                          <option value="1000">1,000 strings (Short)</option>
                          <option value="1500">1,500 strings (Standard)</option>
                          <option value="2000">2,000 strings (Dense)</option>
                          <option value="2500">2,500 strings (Extended)</option>
                          <option value="3000">3,000+ strings (Maximum depth)</option>
                        </GlassSelect>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                           <FileText className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold tracking-widest uppercase text-gray-600 ml-1">Sentiment Modifier</label>
                    <div className="relative">
                      <GlassSelect
                        value={contentData.tone}
                        onChange={(e) => setContentData({ ...contentData, tone: e.target.value })}
                      >
                        <option value="professional">Enterprise Professional</option>
                        <option value="casual">Startup Casual</option>
                        <option value="friendly">Network Friendly</option>
                        <option value="authoritative">Command Authoritative</option>
                        <option value="conversational">Direct Conversational</option>
                      </GlassSelect>
                       <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                           <MessageSquare className="h-4 w-4" />
                        </div>
                    </div>
                  </div>
                  <Button
                    onClick={handleContentGeneration}
                    disabled={!contentData.topic || isLoading}
                    className={`w-full bg-gradient-to-r ${tool.color} text-white shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all cursor-pointer h-14 rounded-2xl text-lg font-black tracking-wide uppercase mt-4 active:scale-[0.98] border border-white/20`}
                  >
                     {isLoading ? <><Loader2 className="mr-3 h-5 w-5 animate-spin" /> Compiling...</> : <><PenTool className="mr-3 h-5 w-5" /> Compile Node Block</>}
                  </Button>
                </>
              )}

              {/* Remaining Tools simplified mapping... */}
              {activeTool !== null && activeTool >= 7 && (
                <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl bg-white/20 border border-white/40 shadow-inner">
                   <div className="p-4 bg-white/40 rounded-full mb-4">
                     <Icon className="h-8 w-8 text-gray-600" />
                   </div>
                   <h3 className="text-xl font-bold text-gray-900 mb-2">Module Initializing</h3>
                   <p className="text-gray-500 font-medium">This generative node is currently booting its neural path logic.</p>
                </div>
              )}

              {/* Cinematic Results Readout */}
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
                          <h4 className="font-bold text-gray-900 tracking-tight text-lg">Transmission Complete</h4>
                        </div>
                        <button
                          onClick={() => handleCopy(results)}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-gray-700 bg-white shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all border border-gray-100"
                        >
                          {copied ? (
                            <>
                              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                              <span className="text-emerald-600">Buffer Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4" />
                              <span>Copy Block</span>
                            </>
                          )}
                        </button>
                      </div>
                      
                      <div className="text-[15px] leading-[1.8] text-gray-800 whitespace-pre-wrap max-h-[450px] overflow-y-auto custom-scrollbar p-6 rounded-2xl bg-white/70 border border-gray-100 shadow-[inset_0_2px_8px_rgb(0,0,0,0.02)]">
                        {results}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
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
    <div className="relative min-h-[calc(100vh-4rem)] bg-gray-50 overflow-hidden pb-12 pt-4 px-4 sm:px-6 lg:px-8">
       {/* Ambient Global Lighting Elements */}
       <div className="absolute top-[10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#0a9396]/10 blur-[140px] pointer-events-none mix-blend-multiply animate-pulse" />
       <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[130px] pointer-events-none mix-blend-multiply animate-pulse-slow" />
       <div className="absolute top-[50%] right-[30%] w-[40%] h-[40%] rounded-full bg-violet-400/10 blur-[140px] pointer-events-none mix-blend-multiply animate-float-slow" />

       <div className="relative z-10 max-w-[1600px] mx-auto h-[calc(100vh-8rem)] flex flex-col">
          {/* Header Section */}
          <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0 bg-white/40 p-6 md:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-white/60 shadow-[inset_0_2px_15px_rgb(255,255,255,0.7),0_8px_30px_rgb(0,0,0,0.02)] backdrop-blur-2xl">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-gradient-to-br from-[#0a9396] to-teal-500 rounded-2xl shadow-lg shadow-[#0a9396]/20 relative overflow-hidden group">
                   <div className="absolute inset-0 bg-white/20 w-full h-full transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                   <div className="absolute inset-0 bg-black/10 blur-sm mix-blend-overlay" />
                   <Sparkles className="h-8 w-8 text-white relative z-10" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tighter flex items-center gap-3 mb-1">
                  AI Interface Module
                  <Badge variant="primary" size="lg" className="hidden sm:inline-flex bg-gradient-to-r from-teal-400 to-[#0a9396] text-white border-none py-1.5 px-3">
                    Pro Matrix
                  </Badge>
                </h1>
                <p className="text-gray-500 font-bold tracking-wide">
                  Execute intelligent synthesis tasks using core LLM endpoints.
                </p>
              </div>
            </div>
          </div>

          {/* Main Split View */}
          <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
            {/* Left Sidebar: Tool Library */}
            <div className="w-full lg:w-[400px] flex flex-col bg-white/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/60 shadow-[inset_0_2px_15px_rgb(255,255,255,0.7),0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden shrink-0 h-[400px] lg:h-full">
              <div className="p-6 border-b border-white/40 bg-white/40 space-y-5 shrink-0">
                <div className="relative group/search">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within/search:text-[#0a9396] transition-colors" />
                  <GlassInput 
                    placeholder="Scan active module nodes..." 
                    className="pl-12 !h-14 font-medium"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2.5 overflow-x-auto pb-2 custom-scrollbar hide-scrollbar">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-4 py-2 rounded-xl text-[13px] font-bold tracking-wide whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategory === null 
                        ? "bg-gray-900 text-white shadow-lg shadow-gray-900/20 scale-105" 
                        : "bg-white/60 text-gray-600 border border-white hover:bg-white hover:shadow-sm"
                    }`}
                  >
                    All Schemas
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-xl text-[13px] font-bold tracking-wide whitespace-nowrap transition-all cursor-pointer ${
                        selectedCategory === category 
                          ? "bg-gray-900 text-white shadow-lg shadow-gray-900/20 scale-105" 
                          : "bg-white/60 text-gray-600 border border-white hover:bg-white hover:shadow-sm"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-gradient-to-b from-white/20 to-transparent">
                {filteredTools.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 px-4">
                    <div className="p-4 bg-white/40 rounded-full mb-3 shadow-inner">
                      <Search className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="font-bold tracking-wide">No modules align with that parameter.</p>
                  </div>
                ) : (
                  filteredTools.map((tool, index) => {
                    const Icon = tool.icon;
                    const isActive = activeTool === tool.id;
                    
                    return (
                      <motion.div
                        key={tool.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.04 }}
                      >
                        <button
                          onClick={() => {
                            setActiveTool(tool.id);
                            setResults("");
                          }}
                          className={`w-full text-left p-4 rounded-2xl transition-all duration-300 group relative border cursor-pointer flex items-center gap-4 ${
                            isActive
                              ? "bg-white/90 border-[#0a9396]/20 shadow-[0_8px_30px_rgb(0,0,0,0.06)] scale-[1.02]"
                              : "bg-white/40 border-white/60 hover:bg-white/80 hover:shadow-md hover:border-white"
                          }`}
                        >
                          {isActive && (
                            <motion.div 
                               layoutId="active-pill" 
                               className={`absolute -left-1 top-[15%] bottom-[15%] w-2 rounded-full bg-gradient-to-b ${tool.color}`} 
                            />
                          )}
                          <div className={`rounded-2xl p-3 shrink-0 transition-all duration-300 relative ${isActive ? "scale-110 shadow-lg" : "group-hover:scale-110 shadow-sm"}`}>
                            <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} rounded-2xl`} />
                            {isActive && <div className={`absolute -inset-2 bg-gradient-to-br ${tool.color} opacity-40 blur-xl rounded-full`} />}
                            <Icon className="h-5 w-5 text-white relative z-10" />
                          </div>
                          <div className="flex-1 min-w-0">
                             <h3 className={`font-black text-[15px] truncate tracking-tight mb-0.5 ${isActive ? "text-gray-900" : "text-gray-800"}`}>
                               {tool.name}
                             </h3>
                             <p className={`text-[12px] font-medium tracking-wide line-clamp-1 ${isActive ? "text-gray-600" : "text-gray-500"}`}>
                               {tool.description}
                             </p>
                          </div>
                        </button>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Content Area: Active Tool or Welcome State */}
            <div className="flex-1 min-w-0 lg:h-full">
              {renderToolInterface()}
            </div>
          </div>
       </div>
    </div>
  );
}
