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

    const { emailTopic, audience } = await request.json();
    if (!emailTopic) {
      return NextResponse.json({ error: "Email topic is required" }, { status: 400 });
    }

    const prompt = `You are a high-conversion email marketing expert. Generate 10 compelling email subject lines for the following topic.

    TOPIC: ${emailTopic}
    AUDIENCE: ${audience || "General"}

    Include variations for:
    1. Curiosity/Intrigue.
    2. Direct/Value-based.
    3. Urgency/Scarcity.
    4. Personal/Conversational.

    For each subject line, provide a brief note on why it will drive opens. Use Markdown formatting.`;

    const subjectLines = await generateText(prompt);
    return NextResponse.json({ subjectLines, remaining: usage.remaining });
  } catch (error) {
    console.error("Error generating subject lines:", error);
    return NextResponse.json({ error: "Failed to generate subject lines" }, { status: 500 });
  }
}
