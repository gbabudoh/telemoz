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

    const { product, targetAudience, usp, platform } = await request.json();
    if (!product || !targetAudience) {
      return NextResponse.json({ error: "Product and targetAudience are required" }, { status: 400 });
    }

    const prompt = `You are a high-converting ad copywriter. Generate 5 ad copy variations for the following product and audience.

    PRODUCT: ${product}
    TARGET AUDIENCE: ${targetAudience}
    USP/BENEFITS: ${usp || "Not specified"}
    PLATFORM: ${platform || "General"}

    For each variation, provide:
    1. A catchy headline
    2. A persuasive description/body
    3. Suggested CTA (Call to Action)

    Tailor the tone and style to the ${platform} platform. Use Markdown for formatting.`;

    const adCopy = await generateText(prompt);
    return NextResponse.json({ adCopy, remaining: usage.remaining });
  } catch (error) {
    console.error("Error generating ad copy:", error);
    return NextResponse.json({ error: "Failed to generate ad copy" }, { status: 500 });
  }
}
