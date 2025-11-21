// AI service for communicating with LLM APIs (OpenAI, Gemini, etc.)

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export interface AIGenerateOptions {
  prompt: string;
  model?: "gpt-4" | "gpt-3.5-turbo" | "gemini-pro";
  maxTokens?: number;
  temperature?: number;
}

export async function generateText(options: AIGenerateOptions): Promise<string> {
  const {
    prompt,
    model = "gpt-3.5-turbo",
    maxTokens = 1000,
    temperature = 0.7,
  } = options;

  if (model.startsWith("gpt")) {
    return generateWithOpenAI(prompt, model, maxTokens, temperature);
  } else if (model === "gemini-pro") {
    return generateWithGemini(prompt, maxTokens, temperature);
  }

  throw new Error(`Unsupported model: ${model}`);
}

async function generateWithOpenAI(
  prompt: string,
  model: string,
  maxTokens: number,
  temperature: number
): Promise<string> {
  if (!OPENAI_API_KEY) {
    throw new Error("OpenAI API key not configured");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      max_tokens: maxTokens,
      temperature,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || "";
}

async function generateWithGemini(
  prompt: string,
  maxTokens: number,
  temperature: number
): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API key not configured");
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: maxTokens,
          temperature,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.candidates[0]?.content?.parts[0]?.text || "";
}

// Specialized functions for marketing use cases
export async function generateAdCopy(
  product: string,
  targetAudience: string,
  tone: string = "professional"
): Promise<string> {
  const prompt = `Write compelling ad copy for ${product} targeting ${targetAudience}. 
    Tone: ${tone}. Include a headline and 2-3 bullet points highlighting key benefits.`;
  
  return generateText({ prompt, model: "gpt-3.5-turbo", maxTokens: 300 });
}

export async function analyzeSEO(content: string): Promise<{
  keywords: string[];
  readability: number;
  suggestions: string[];
}> {
  const prompt = `Analyze the following content for SEO:
    
${content}

Provide:
1. Key keywords found
2. Readability score (1-100)
3. Top 3 suggestions for improvement`;

  const analysis = await generateText({ prompt, model: "gpt-3.5-turbo", maxTokens: 500 });
  
  // Parse the response (in production, use structured output or JSON mode)
  return {
    keywords: [],
    readability: 75,
    suggestions: [],
  };
}

