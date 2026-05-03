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

    const { purpose, audience, sequenceLength } = await request.json();
    if (!purpose || !audience) {
      return NextResponse.json({ error: "Purpose and audience are required" }, { status: 400 });
    }

    const length = parseInt(sequenceLength) || 3;

    const prompt = `You are a world-class email copywriter. Create a ${length}-email sequence for the following purpose: "${purpose}".

    TARGET AUDIENCE: ${audience}

    For each email in the sequence, provide:
    1. Subject Line
    2. Body Content (engaging, persuasive, and professional)
    3. Recommended Send Timing (e.g., Day 1, Day 3)

    The sequence should follow a logical flow:
    - Email 1: Hook and value proposition
    - Middle emails: Nurturing, social proof, and building trust
    - Final email: Strong call-to-action

    Use Markdown to format the entire sequence clearly.`;

    const sequence = await generateText(prompt);
    return NextResponse.json({ sequence, remaining: usage.remaining });
  } catch (error) {
    console.error("Error generating email sequence:", error);
    return NextResponse.json({ error: "Failed to generate email sequence" }, { status: 500 });
  }
}
