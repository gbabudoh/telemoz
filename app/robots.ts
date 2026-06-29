import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL || "https://telemoz.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/marketplace", "/logos/", "/favicon.ico"],
        disallow: ["/api/", "/pro/", "/client/", "/admin/", "/verify-email", "/reset-password"],
      },
      {
        // ChatGPT / OpenAI Search Crawlers
        userAgent: ["GPTBot", "OAI-SearchBot", "ChatGPT-User"],
        allow: ["/", "/marketplace"],
        disallow: ["/api/", "/pro/", "/client/", "/admin/"],
      },
      {
        // Perplexity AI Search Crawler
        userAgent: "PerplexityBot",
        allow: ["/", "/marketplace"],
        disallow: ["/api/", "/pro/", "/client/", "/admin/"],
      },
      {
        // Anthropic Claude Crawler
        userAgent: "ClaudeBot",
        allow: ["/", "/marketplace"],
        disallow: ["/api/", "/pro/", "/client/", "/admin/"],
      },
      {
        // Google Extended (Gemini, Bard AI crawler)
        userAgent: "Google-Extended",
        allow: ["/", "/marketplace"],
        disallow: ["/api/", "/pro/", "/client/", "/admin/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
