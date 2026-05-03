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

    const { product, audience, framework } = await request.json();
    if (!product || !audience) {
      return NextResponse.json({ error: "Product and audience are required" }, { status: 400 });
    }

    const prompt = `You are a world-class landing page copywriter. Generate conversion-focused copy for the following product using the ${framework} framework.

    PRODUCT: ${product}
    AUDIENCE: ${audience}
    FRAMEWORK: ${framework}

    The copy should include:
    1. A powerful hero section (Headline + Subheadline).
    2. Detailed sections following the ${framework} logic.
    3. Compelling benefits and features.
    4. Strong calls-to-action (CTAs).
    5. A brief FAQ section.

    Use persuasive, audience-centric language. Use Markdown formatting.`;

    const copy = await generateText(prompt);
    return NextResponse.json({ copy, remaining: usage.remaining });
  } catch (error) {
    console.error("Error generating landing page copy:", error);
    return NextResponse.json({ error: "Failed to generate landing page copy" }, { status: 500 });
  }
}
