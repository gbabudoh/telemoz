import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateText } from "@/lib/ai";
import { checkAndIncrementAiUsage, AI_DAILY_CAP } from "@/lib/ai-rate-limit";

export async function POST(req: NextRequest) {
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

  const { rawBrief } = await req.json();
  if (!rawBrief) {
    return NextResponse.json({ error: "rawBrief is required" }, { status: 400 });
  }

  try {
    const prompt = `You are a senior digital marketing strategist. Extract and structure the following client brief into a clear, organised summary.

Return your response in this exact format:

**PROJECT OVERVIEW**
[1-2 sentence summary]

**OBJECTIVES & KPIs**
[Bullet list of measurable goals]

**TARGET AUDIENCE**
[Description of target audience]

**SCOPE OF WORK**
[Bullet list of deliverables/services requested]

**BUDGET**
[Budget if mentioned, or "Not specified"]

**TIMELINE**
[Timeline if mentioned, or "Not specified"]

**PLATFORMS/CHANNELS**
[Platforms mentioned]

**KEY CONSTRAINTS & NOTES**
[Any constraints, must-haves, or important context]

---
CLIENT BRIEF:
${rawBrief}`;

    const summary = await generateText(prompt);
    return NextResponse.json({ summary, remaining: usage.remaining });
  } catch (error) {
    console.error("Brief summarise error:", error);
    return NextResponse.json({ error: "Failed to summarise brief" }, { status: 500 });
  }
}
