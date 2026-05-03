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

    const { seedKeyword, location, language } = await request.json();
    if (!seedKeyword) {
      return NextResponse.json({ error: "Seed keyword is required" }, { status: 400 });
    }

    const prompt = `You are an expert SEO and keyword research specialist. Conduct comprehensive keyword research for the following seed keyword.

    SEED KEYWORD: ${seedKeyword}
    LOCATION: ${location || "Global"}
    LANGUAGE: ${language || "English"}

    The report should include:
    1. A table of primary keywords with estimated search volume, difficulty (0-100), and search intent.
    2. A list of high-value long-tail keywords.
    3. Common question-based keywords.
    4. Semantic variations and related keywords.
    5. Keyword clusters and content opportunities.
    6. Search intent analysis.
    7. Actionable recommendations for a content strategy.

    Provide realistic, data-driven estimates for volume and difficulty. Use Markdown formatting.`;

    const keywords = await generateText(prompt);
    return NextResponse.json({ keywords, remaining: usage.remaining });
  } catch (error) {
    console.error("Error generating keyword research:", error);
    return NextResponse.json({ error: "Failed to generate keyword research" }, { status: 500 });
  }
}
