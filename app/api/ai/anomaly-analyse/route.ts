import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { metric, change, platform, context } = await req.json();
  if (!metric || !change) return NextResponse.json({ error: "metric and change are required" }, { status: 400 });

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1200,
      messages: [
        {
          role: "user",
          content: `You are an expert paid media and digital marketing analyst. Analyse the following campaign performance anomaly and provide a structured diagnosis.

METRIC: ${metric}
CHANGE: ${change}
PLATFORM: ${platform || "Not specified"}
CONTEXT: ${context || "No additional context provided"}

Provide your response in this exact format:

**ANOMALY SUMMARY**
[1 sentence describing what happened]

**LIKELY CAUSES** (ranked by probability)
1. [Most likely cause + explanation]
2. [Second likely cause + explanation]
3. [Third likely cause + explanation]

**DIAGNOSTIC QUESTIONS**
[3-4 questions to ask/check to narrow down the root cause]

**RECOMMENDED ACTIONS**
[Prioritised list of actions to take immediately]

**PREVENTION**
[How to detect this earlier next time]`,
        },
      ],
    });

    const analysis = message.content[0].type === "text" ? message.content[0].text : "";
    return NextResponse.json({ analysis });
  } catch (error) {
    console.error("Anomaly analyse error:", error);
    return NextResponse.json({ error: "Failed to analyse anomaly" }, { status: 500 });
  }
}
