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

    const { url, content } = await request.json();
    if (!url || !content) {
      return NextResponse.json({ error: "URL and content are required" }, { status: 400 });
    }

    const prompt = `You are a senior SEO specialist. Provide a detailed SEO optimization report for the following content and URL.

    URL: ${url}
    CONTENT: ${content}

    The report should include:
    1. Title Tag recommendations
    2. Meta Description optimization
    3. Header (H1-H6) structure improvements
    4. Keyword optimization (primary and secondary keywords)
    5. Content quality and readability improvements
    6. Technical SEO suggestions (internal/external linking, image alt text)
    7. Overall SEO Score (0-10)

    Provide actionable, specific recommendations based on the provided content. Use Markdown formatting.`;

    const optimizations = await generateText(prompt);
    return NextResponse.json({ optimizations, remaining: usage.remaining });
  } catch (error) {
    console.error("Error generating SEO optimizations:", error);
    return NextResponse.json({ error: "Failed to generate optimizations" }, { status: 500 });
  }
}
