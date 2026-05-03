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

    const { topic, targetAudience, count } = await request.json();
    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const prompt = `You are a professional copywriter specializing in high-click-through headlines. Generate ${count || 10} headline variations for the following topic.

    TOPIC: ${topic}
    TARGET AUDIENCE: ${targetAudience || "General"}

    Include a mix of:
    1. How-to headlines.
    2. Listicle (numbered) headlines.
    3. Question-based headlines.
    4. Emotional/Impactful headlines.

    Provide the headlines in a structured list with brief explanations of why each works. Use Markdown formatting.`;

    const headlines = await generateText(prompt);
    return NextResponse.json({ headlines, remaining: usage.remaining });
  } catch (error) {
    console.error("Error generating headlines:", error);
    return NextResponse.json({ error: "Failed to generate headlines" }, { status: 500 });
  }
}
