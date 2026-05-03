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

    const { brandName, topic, platform, tone } = await request.json();
    if (!brandName || !topic) {
      return NextResponse.json({ error: "Brand name and topic are required" }, { status: 400 });
    }

    const prompt = `You are a social media manager for ${brandName}. Generate 3 engaging social media posts for ${platform}.

    TOPIC: ${topic}
    TONE: ${tone}

    For each post, include:
    1. Captivating caption (with emojis)
    2. Relevant hashtags
    3. Suggested image/visual description

    Tailor the content to ${platform}'s best practices. Use Markdown formatting.`;

    const content = await generateText(prompt);
    return NextResponse.json({ content, remaining: usage.remaining });
  } catch (error) {
    console.error("Error generating social media content:", error);
    return NextResponse.json({ error: "Failed to generate social media content" }, { status: 500 });
  }
}
