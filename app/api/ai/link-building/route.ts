import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { targetWebsite, targetPage, yourWebsite, approach } = await request.json();

    if (!targetWebsite || !yourWebsite) {
      return NextResponse.json(
        { error: "Target website and your website are required" },
        { status: 400 }
      );
    }

    // Mock outreach email generation - Replace with actual AI API call
    const approachTemplates: Record<string, string> = {
      "guest-post": `Subject: Guest Post Pitch: [Your Topic] for ${targetWebsite}

Hi [Name],

I hope this email finds you well. I've been following ${targetWebsite} for a while and really admire the quality content you publish, especially your recent piece on [relevant topic].

I'm reaching out because I have an idea for a guest post that I believe would be valuable for your audience. I've noticed you cover [topic], and I'd like to contribute an article on "${targetPage || "a relevant topic"}".

**Proposed Topic**: [Your article topic]
**Why it's valuable**: [Brief explanation of value]
**My credentials**: [Brief bio/credentials]

I've attached a writing sample and my portfolio for your review. I'm confident I can deliver high-quality, well-researched content that aligns with your editorial standards.

Would you be interested in this collaboration? I'm flexible with timelines and happy to work within your guidelines.

Looking forward to hearing from you!

Best regards,
[Your Name]
[Your Title]
${yourWebsite}`,

      "broken-link": `Subject: Broken Link Found on ${targetWebsite}

Hi [Name],

I hope you're having a great day! I was browsing ${targetWebsite} and came across your excellent article: "${targetPage || "article title"}".

While reading, I noticed a broken link pointing to [broken link URL]. I thought you'd want to know about this.

I have a resource on my website (${yourWebsite}) that covers this exact topic and might be a good replacement. It's a comprehensive guide that your readers might find valuable.

Would you like me to send you the link so you can review it? I believe it would be a great fit for your content.

Thanks for the great content you publish!

Best regards,
[Your Name]
${yourWebsite}`,

      "resource-page": `Subject: Resource Suggestion for ${targetWebsite}

Hi [Name],

I've been a regular reader of ${targetWebsite} and particularly enjoyed your resource page on [topic]. Your curation is excellent!

I wanted to suggest a resource that might be a valuable addition to your list:

**Resource**: [Title]
**URL**: ${yourWebsite}
**Why it fits**: [Brief explanation]

This resource provides [value proposition] and has been well-received by [target audience]. I believe it would complement your existing resources nicely.

Would you consider adding it to your resource page? I'm happy to provide any additional information you might need.

Thank you for maintaining such a valuable resource!

Best regards,
[Your Name]
${yourWebsite}`,

      "skyscraper": `Subject: Better Resource Than [Competitor's Content]

Hi [Name],

I noticed you linked to [competitor's content] in your article "${targetPage || "article title"}". Great piece, by the way!

I've created a more comprehensive and up-to-date resource on this topic that includes:
- [Improvement 1]
- [Improvement 2]
- [Improvement 3]
- [Additional value]

You can find it here: ${yourWebsite}

I thought it might be a better fit for your readers. Would you consider updating your link? I'm confident it provides more value than the current resource.

Happy to answer any questions!

Best regards,
[Your Name]
${yourWebsite}`,

      "general": `Subject: Collaboration Opportunity with ${targetWebsite}

Hi [Name],

I hope this email finds you well. I've been following ${targetWebsite} and really appreciate the quality content you produce.

I'm reaching out because I believe there's a great opportunity for collaboration. I run ${yourWebsite}, where we focus on [your niche/topic].

I noticed you cover similar topics, and I thought we might be able to work together. Some ideas:

1. **Content Collaboration**: Co-create content that benefits both our audiences
2. **Resource Sharing**: Share valuable resources that complement your content
3. **Expertise Exchange**: Provide expert insights for your articles

I'm flexible and open to discussing what would work best for you. Would you be interested in exploring this?

Looking forward to your thoughts!

Best regards,
[Your Name]
[Your Title]
${yourWebsite}`,
    };

    const outreach = `# Link Building Outreach Email
**Target Website**: ${targetWebsite}
${targetPage ? `**Target Page**: ${targetPage}` : ""}
**Your Website**: ${yourWebsite}
**Approach**: ${approach}

---

${approachTemplates[approach] || approachTemplates["general"]}

---

## Follow-Up Email Template

**Subject**: Re: [Original Subject]

Hi [Name],

Just wanted to follow up on my previous email. I know you're busy, so I'll keep this brief.

[Brief reminder of your proposal/value]

Would love to hear your thoughts when you have a moment!

Best regards,
[Your Name]

---

## Best Practices for This Outreach:

1. **Personalization**: Always personalize the email with specific details about their content
2. **Value First**: Lead with value, not requests
3. **Be Concise**: Keep emails short and to the point
4. **Follow Up**: Send 1-2 follow-ups spaced 5-7 days apart
5. **Track Responses**: Monitor open rates and responses

## Outreach Tracking:

- **Email Sent**: [Date]
- **Follow-up 1**: [Date + 5 days]
- **Follow-up 2**: [Date + 12 days]
- **Status**: Pending

**Note**: This is a template. Personalize each email based on the specific website and context.`;

    return NextResponse.json({ outreach });
  } catch (error) {
    console.error("Error generating link building outreach:", error);
    return NextResponse.json(
      { error: "Failed to generate outreach email" },
      { status: 500 }
    );
  }
}

