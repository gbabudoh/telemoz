import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { rawBrief } = await req.json();
  if (!rawBrief) return NextResponse.json({ error: "rawBrief is required" }, { status: 400 });

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1500,
      messages: [
        {
          role: "user",
          content: `You are a senior digital marketing strategist. Extract and structure the following client brief into a clear, organised summary.

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
${rawBrief}`,
        },
      ],
    });

    const summary = message.content[0].type === "text" ? message.content[0].text : "";
    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Brief summarise error:", error);
    return NextResponse.json({ error: "Failed to summarise brief" }, { status: 500 });
  }
}
