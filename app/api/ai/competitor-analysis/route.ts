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

    const { competitorUrl, industry } = await request.json();
    if (!competitorUrl) {
      return NextResponse.json({ error: "Competitor URL is required" }, { status: 400 });
    }

    const prompt = `You are a senior market research analyst. Conduct a comprehensive competitor analysis for ${competitorUrl}.

    INDUSTRY: ${industry || "General"}

    The analysis should include:
    1. Executive Summary of their digital presence.
    2. Estimated SEO and Content strategy.
    3. Likely top-performing keywords and traffic sources.
    4. Backlink profile assessment.
    5. Perceived competitive advantages and weaknesses.
    6. Actionable plan for outranking them.

    Use realistic, data-driven insights. Use Markdown formatting.`;

    const analysis = await generateText(prompt);
    return NextResponse.json({ analysis, remaining: usage.remaining });
  } catch (error) {
    console.error("Error generating competitor analysis:", error);
    return NextResponse.json({ error: "Failed to generate competitor analysis" }, { status: 500 });
  }
}
