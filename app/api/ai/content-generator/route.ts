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

    const { topic, type, length, tone } = await request.json();
    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const wordCount = parseInt(length) || 1500;
    const contentType = type || "blog-post";

    const prompt = `You are a professional content creator and digital marketing expert. Generate a high-quality, comprehensive ${contentType} about "${topic}".

    TONE: ${tone || "Professional and informative"}
    TARGET LENGTH: Approximately ${wordCount} words

    The content should be well-structured with:
    - A compelling H1 title
    - An engaging introduction
    - Clear H2 and H3 subheadings
    - Actionable insights and best practices
    - A strong conclusion
    - Use Markdown formatting for the output.

    Ensure the content is SEO-optimized and provides real value to the reader.`;

    const content = await generateText(prompt);
    return NextResponse.json({ content, remaining: usage.remaining });
  } catch (error) {
    console.error("Error generating content:", error);
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 });
  }
}
