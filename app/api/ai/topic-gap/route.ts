import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateText } from "@/lib/ai";
import { checkAndIncrementAiUsage, AI_DAILY_CAP } from "@/lib/ai-rate-limit";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const usage = await checkAndIncrementAiUsage(session.user.id);
    if (!usage.allowed) {
      return NextResponse.json(
        { error: `Daily limit of ${AI_DAILY_CAP} AI requests reached. Resets at midnight.` },
        { status: 429 }
      );
    }

    const { url, keyword } = await request.json();
    if (!url || !keyword) {
      return NextResponse.json({ error: "URL and keyword are required" }, { status: 400 });
    }

    const prompt = `You are a senior SEO strategist and content analyst. Conduct a comprehensive Topic Gap Analysis for the following keyword and URL.

    KEYWORD: ${keyword}
    URL: ${url}

    The analysis should include:
    1. Analysis of what top-ranking pages cover that this URL might be missing.
    2. Specific content topics and sub-topics to add.
    3. Recommendations for content structure (headers, FAQ, etc.).
    4. A detailed content outline to outrank competitors.
    5. Recommended content length and depth.
    6. Internal linking opportunities.

    Provide actionable, data-driven insights. Use Markdown formatting.`;

    const analysis = await generateText(prompt);
    return NextResponse.json({ analysis, remaining: usage.remaining });
  } catch (error) {
    console.error("Error generating topic gap analysis:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate analysis" },
      { status: 500 }
    );
  }
}
