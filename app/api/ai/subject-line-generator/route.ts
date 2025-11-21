import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { emailTopic, goal, count } = await request.json();

    if (!emailTopic) {
      return NextResponse.json(
        { error: "Email topic is required" },
        { status: 400 }
      );
    }

    const subjectLineCount = parseInt(count) || 10;

    // Mock subject line generation - Replace with actual AI API call
    const subjectLines: Record<string, string[]> = {
      "open-rate": [
        `You won't believe this about ${emailTopic}`,
        `${emailTopic}: This changes everything`,
        `Quick question about ${emailTopic}`,
        `Re: ${emailTopic}`,
        `Fwd: ${emailTopic} - You need to see this`,
        `🎯 ${emailTopic} - Exclusive for you`,
        `URGENT: ${emailTopic} update`,
        `${emailTopic}: Don't miss this`,
        `Your ${emailTopic} guide is ready`,
        `Inside: ${emailTopic} secrets`,
        `[Name], this ${emailTopic} tip is for you`,
        `Why ${emailTopic} matters (3 min read)`,
        `${emailTopic}: The truth nobody tells you`,
        `Can we talk about ${emailTopic}?`,
        `Your ${emailTopic} questions answered`,
      ],
      "click-rate": [
        `Download your ${emailTopic} guide now`,
        `${emailTopic}: Get your free resource`,
        `Access your ${emailTopic} toolkit`,
        `Claim your ${emailTopic} checklist`,
        `${emailTopic}: Start your free trial`,
        `Get instant access to ${emailTopic}`,
        `${emailTopic}: Your action plan inside`,
        `Unlock ${emailTopic} resources`,
        `${emailTopic}: Click to discover more`,
        `Your ${emailTopic} solution awaits`,
      ],
      conversion: [
        `Transform your ${emailTopic} today`,
        `${emailTopic}: Limited time offer`,
        `Join thousands using ${emailTopic}`,
        `${emailTopic}: Your success story starts here`,
        `Start your ${emailTopic} journey now`,
        `${emailTopic}: See results in 30 days`,
        `Get started with ${emailTopic} - Free`,
        `${emailTopic}: No credit card required`,
        `Your ${emailTopic} transformation begins`,
        `${emailTopic}: Book your spot now`,
      ],
      engagement: [
        `What's your take on ${emailTopic}?`,
        `${emailTopic}: Share your experience`,
        `Join the ${emailTopic} conversation`,
        `${emailTopic}: We want your feedback`,
        `Your opinion on ${emailTopic} matters`,
        `Let's discuss ${emailTopic} together`,
        `${emailTopic}: What do you think?`,
        `Share your ${emailTopic} story`,
        `${emailTopic}: Join the community`,
        `Help us improve ${emailTopic}`,
      ],
    };

    const selectedLines = (subjectLines[goal] || subjectLines["open-rate"]).slice(
      0,
      Math.min(subjectLineCount, subjectLines[goal]?.length || 10)
    );

    const subjectLineList = `# Email Subject Line Generator
**Email Topic**: ${emailTopic}
**Goal**: ${goal}
**Number of Variations**: ${selectedLines.length}

---

## Generated Subject Lines

${selectedLines
  .map(
    (line, index) => `### ${index + 1}. ${line}

**Character Count**: ${line.length} characters
**Word Count**: ${line.split(" ").length} words
**Spam Score**: Low ✅
**Open Rate Potential**: ${index < 5 ? "High" : index < 10 ? "Medium-High" : "Medium"}

---`
  )
  .join("\n\n")}

## Subject Line Analysis

### Best Practices for ${goal}:

${goal === "open-rate"
  ? `- Use curiosity and intrigue
- Include personalization tokens ([Name])
- Create urgency or FOMO
- Ask questions
- Use numbers and specific details
- Keep under 50 characters for mobile`
  : goal === "click-rate"
  ? `- Include clear value proposition
- Use action words (Download, Get, Access)
- Mention free resources or tools
- Create clear benefit statements
- Use "Your" to personalize`
  : goal === "conversion"
  ? `- Focus on transformation/outcome
- Include time-sensitive language
- Highlight social proof
- Use "Free" or "No credit card"
- Create clear next steps`
  : `- Ask engaging questions
- Invite participation
- Use conversational tone
- Request feedback or opinions
- Build community feeling`}

## Character Count Optimization

### Mobile Display:
- **Optimal**: 30-40 characters (full display)
- **Good**: 40-50 characters (mostly visible)
- **Truncated**: 50+ characters (may be cut off)

### Desktop Display:
- **Optimal**: 50-60 characters
- **Maximum**: 78 characters

## A/B Testing Recommendations

### Test Variations:
1. **Personalization**: With vs. without [Name]
2. **Length**: Short (30 chars) vs. Medium (50 chars)
3. **Emojis**: With vs. without emojis
4. **Urgency**: Time-sensitive vs. evergreen
5. **Question Format**: Question vs. statement

### Testing Schedule:
- Test 2 variations per email
- Run for minimum 1,000 sends
- Analyze after 24-48 hours
- Implement winner for future sends

## Spam Score Factors

### Red Flags to Avoid:
- ALL CAPS
- Excessive punctuation (!!!)
- Spam trigger words (Free, Click here, Act now)
- Misleading content
- Poor grammar/spelling

### Green Flags:
- Clear, honest messaging
- Proper capitalization
- Relevant to email content
- Professional tone
- Value-focused

## Industry Benchmarks

### Average Open Rates by Industry:
- **Marketing**: 15-25%
- **E-commerce**: 18-28%
- **SaaS**: 20-30%
- **B2B**: 15-22%
- **B2C**: 18-25%

### Subject Line Impact:
- **Top 10%**: 40%+ open rate
- **Average**: 20-25% open rate
- **Below Average**: <15% open rate

**Note**: This is mock subject line generation. Connect to actual AI service for personalized, goal-optimized subject lines.`;

    return NextResponse.json({ subjectLines: subjectLineList });
  } catch (error) {
    console.error("Error generating subject lines:", error);
    return NextResponse.json(
      { error: "Failed to generate subject lines" },
      { status: 500 }
    );
  }
}

