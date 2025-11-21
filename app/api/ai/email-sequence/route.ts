import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { purpose, audience, sequenceLength } = await request.json();

    if (!purpose || !audience) {
      return NextResponse.json(
        { error: "Purpose and audience are required" },
        { status: 400 }
      );
    }

    const length = parseInt(sequenceLength) || 3;

    // Mock email sequence - Replace with actual AI API call
    const emails = [];
    for (let i = 1; i <= length; i++) {
      emails.push({
        subject: `Email ${i}: ${purpose} - Day ${i}`,
        body: `Hi there,

This is email ${i} of ${length} in your ${purpose} sequence for ${audience}.

[Email content would be generated here based on the purpose and audience]

Best regards,
Your Team`,
        sendDay: i,
      });
    }

    const sequence = `# Email Sequence: ${purpose}
**Target Audience**: ${audience}
**Sequence Length**: ${length} emails

---

${emails
  .map(
    (email, index) => `## Email ${index + 1} - Day ${email.sendDay}

**Subject**: ${email.subject}

**Body**:
${email.body}

**Send Timing**: ${index === 0 ? "Immediate" : `Day ${email.sendDay}`}
**Purpose**: ${index === 0 ? "Introduction" : index === emails.length - 1 ? "Conversion" : "Nurturing"}

---`
  )
  .join("\n\n")}

## Sequence Strategy
- **Email 1**: Welcome and introduction
- **Email 2-${length - 1}**: Value delivery and engagement
- **Email ${length}**: Call-to-action and conversion

## Best Practices
- Personalize each email
- A/B test subject lines
- Monitor open and click rates
- Adjust timing based on engagement

**Note**: This is a mock sequence. Connect to actual AI service for personalized email generation.`;

    return NextResponse.json({ sequence });
  } catch (error) {
    console.error("Error generating email sequence:", error);
    return NextResponse.json(
      { error: "Failed to generate email sequence" },
      { status: 500 }
    );
  }
}

