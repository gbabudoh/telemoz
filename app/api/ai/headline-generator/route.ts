import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { topic, type, count } = await request.json();

    if (!topic) {
      return NextResponse.json(
        { error: "Topic is required" },
        { status: 400 }
      );
    }

    const headlineCount = parseInt(count) || 10;
    const contentType = type || "blog";

    // Mock headline generation - Replace with actual AI API call
    const headlineTypes: Record<string, string[]> = {
      blog: [
        `The Ultimate Guide to ${topic}`,
        `${topic}: Everything You Need to Know`,
        `How to Master ${topic} in 2024`,
        `${topic} Explained: A Complete Overview`,
        `10 Essential ${topic} Tips for Success`,
        `Why ${topic} Matters (And How to Use It)`,
        `${topic} Best Practices: Expert Insights`,
        `Getting Started with ${topic}: A Beginner's Guide`,
        `${topic} Strategies That Actually Work`,
        `The Future of ${topic}: Trends and Predictions`,
        `${topic} Mistakes to Avoid`,
        `Advanced ${topic} Techniques for Professionals`,
        `${topic} Case Studies: Real-World Examples`,
        `How ${topic} Can Transform Your Business`,
        `${topic} Tools and Resources You Need`,
      ],
      article: [
        `Understanding ${topic}: A Comprehensive Analysis`,
        `${topic} in 2024: Current Trends and Insights`,
        `The Science Behind ${topic}`,
        `${topic}: A Deep Dive into Best Practices`,
        `Exploring ${topic}: Key Concepts and Applications`,
      ],
      ad: [
        `Transform Your Business with ${topic}`,
        `${topic} Made Simple: Get Started Today`,
        `Why ${topic} is Your Key to Success`,
        `Discover the Power of ${topic}`,
        `Unlock Growth with ${topic}`,
      ],
      email: [
        `Everything You Need to Know About ${topic}`,
        `${topic}: Your Questions Answered`,
        `New Insights on ${topic}`,
        `${topic} Update: What's Changed`,
        `How ${topic} Can Help You`,
      ],
      social: [
        `🎯 ${topic} Tips You Need to Know`,
        `💡 Quick Guide to ${topic}`,
        `🚀 Master ${topic} in 5 Steps`,
        `✨ ${topic} Secrets Revealed`,
        `🔥 ${topic} That Actually Works`,
      ],
    };

    const headlines = headlineTypes[contentType] || headlineTypes.blog;
    const selectedHeadlines = headlines.slice(0, Math.min(headlineCount, headlines.length));

    const headlineList = `# Headline Generator Results
**Topic**: ${topic}
**Content Type**: ${contentType}
**Number of Headlines**: ${selectedHeadlines.length}

---

## Generated Headlines

${selectedHeadlines
  .map(
    (headline, index) => `### ${index + 1}. ${headline}

**Character Count**: ${headline.length} characters
**Word Count**: ${headline.split(" ").length} words
**Type**: ${index < 3 ? "High Impact" : index < 7 ? "Medium Impact" : "Alternative"}

---`
  )
  .join("\n\n")}

## Headline Analysis

### Best Performing Headline Types:
1. **"How-to" Headlines**: High engagement, clear value proposition
2. **"Ultimate Guide" Headlines**: Strong for SEO and authority building
3. **"Numbered" Headlines**: Great for listicles and scannable content
4. **"Question" Headlines**: Good for engagement and curiosity

### SEO Optimization Tips:
- Include primary keyword "${topic}" in headline
- Keep headlines under 60 characters for optimal display
- Use power words: Ultimate, Essential, Complete, Guide, Tips
- Include numbers when relevant (10, 5, Best, Top)

### A/B Testing Recommendations:
- Test emotional vs. rational headlines
- Test with/without numbers
- Test question format vs. statement format
- Test length variations

## Headline Formulas

### Formula 1: "How to [Achieve Goal]"
Example: "How to Master ${topic}"

### Formula 2: "[Number] [Type] [Topic]"
Example: "10 Essential ${topic} Tips"

### Formula 3: "The Ultimate [Type] to [Topic]"
Example: "The Ultimate Guide to ${topic}"

### Formula 4: "[Topic]: [Benefit/Outcome]"
Example: "${topic}: Everything You Need to Know"

### Formula 5: "Why [Topic] [Action]"
Example: "Why ${topic} Matters"

## Content Type Specific Recommendations

### For ${contentType}:
- **Optimal Length**: ${contentType === "blog" ? "50-60 characters" : contentType === "ad" ? "25-30 characters" : contentType === "email" ? "40-50 characters" : "Varies"}
- **Best Format**: ${contentType === "blog" ? "Clear, descriptive" : contentType === "ad" ? "Action-oriented" : contentType === "email" ? "Curiosity-driven" : "Engaging"}
- **Key Elements**: ${contentType === "blog" ? "Keyword, value proposition" : contentType === "ad" ? "Benefit, CTA" : contentType === "email" ? "Urgency, relevance" : "Relevance, clarity"}

**Note**: This is mock headline generation. Connect to actual AI service for personalized, topic-specific headlines.`;

    return NextResponse.json({ headlines: headlineList });
  } catch (error) {
    console.error("Error generating headlines:", error);
    return NextResponse.json(
      { error: "Failed to generate headlines" },
      { status: 500 }
    );
  }
}

