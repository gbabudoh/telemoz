import { GoogleGenerativeAI } from "@google/generative-ai";
import Anthropic from "@anthropic-ai/sdk";
import Groq from "groq-sdk";

const isPlaceholder = (key: string | undefined) =>
  !key || key.includes("your-") || key.includes("sk-your-");

const geminiKey = process.env.GEMINI_API_KEY;
const anthropicKey = process.env.ANTHROPIC_API_KEY;
const groqKey = process.env.GROQ_API_KEY;

const genAI = !isPlaceholder(geminiKey) ? new GoogleGenerativeAI(geminiKey!) : null;
const anthropic = !isPlaceholder(anthropicKey) ? new Anthropic({ apiKey: anthropicKey! }) : null;
const groq = !isPlaceholder(groqKey) ? new Groq({ apiKey: groqKey! }) : null;

export type AIProvider = "gemini" | "claude" | "groq";

export interface GenerateOptions {
  provider?: AIProvider;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

// Resolve the best available provider when none is specified or when falling back
function resolveProvider(exclude: AIProvider[] = []): AIProvider | null {
  const order: AIProvider[] = ["groq", "claude", "gemini"];
  for (const p of order) {
    if (exclude.includes(p)) continue;
    if (p === "claude" && anthropic) return "claude";
    if (p === "groq" && groq) return "groq";
    if (p === "gemini" && genAI) return "gemini";
  }
  return null;
}

function isRateLimitError(error: unknown): boolean {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    return msg.includes("429") || msg.includes("rate limit") || msg.includes("quota") || msg.includes("too many requests");
  }
  return false;
}

async function callProvider(provider: AIProvider, prompt: string, options: GenerateOptions): Promise<string> {
  switch (provider) {
    case "gemini": {
      if (!genAI) throw new Error("Gemini API key not configured");
      const model = genAI.getGenerativeModel({ model: options.model || "gemini-2.0-flash" });
      const result = await model.generateContent(prompt);
      return result.response.text();
    }
    case "claude": {
      if (!anthropic) throw new Error("Anthropic API key not configured");
      const msg = await anthropic.messages.create({
        model: options.model || "claude-haiku-4-5-20251001",
        max_tokens: options.maxTokens || 4096,
        messages: [{ role: "user", content: prompt }],
      });
      return msg.content[0].type === "text" ? (msg.content[0] as { type: "text"; text: string }).text : "";
    }
    case "groq": {
      if (!groq) throw new Error("Groq API key not configured");
      const chat = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: options.model || "llama-3.3-70b-versatile",
        max_tokens: options.maxTokens,
        temperature: options.temperature,
      });
      return chat.choices[0]?.message?.content || "";
    }
    default:
      throw new Error(`Unsupported AI provider: ${provider}`);
  }
}

export async function generateText(prompt: string, options: GenerateOptions = {}): Promise<string> {
  // Determine starting provider: use explicit option, env default, or best available
  const envDefault = process.env.DEFAULT_AI_PROVIDER as AIProvider | undefined;
  const startProvider: AIProvider =
    options.provider || envDefault || resolveProvider() || "gemini";

  const tried: AIProvider[] = [];

  let current: AIProvider = startProvider;

  while (true) {
    tried.push(current);
    try {
      return await callProvider(current, prompt, options);
    } catch (error) {
      console.error(`AI generation error (${current}):`, error);

      // Only fall back automatically on rate limit / quota errors
      if (!isRateLimitError(error)) throw error;

      // Find next untried provider
      const next = resolveProvider(tried);
      if (!next) {
        console.error("All AI providers exhausted or unavailable.");
        throw error;
      }

      console.log(`Provider "${current}" rate-limited — falling back to "${next}"`);
      current = next;
    }
  }
}
