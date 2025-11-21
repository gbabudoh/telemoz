import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { product, targetAudience, valueProposition, cta } = await request.json();

    if (!product || !targetAudience) {
      return NextResponse.json(
        { error: "Product and target audience are required" },
        { status: 400 }
      );
    }

    // Mock landing page copy generation - Replace with actual AI API call
    const copy = `# Landing Page Copy: ${product}
**Target Audience**: ${targetAudience}
**Value Proposition**: ${valueProposition || "Not specified"}
**Call-to-Action**: ${cta}

---

## Hero Section

### Headline Options:

**Option 1 (Benefit-focused)**:
Transform Your Business with ${product}

**Option 2 (Problem-solution)**:
Stop Struggling with [Problem]. Get ${product} Instead.

**Option 3 (Outcome-focused)**:
Achieve [Desired Outcome] with ${product}

**Option 4 (Social proof)**:
Join [X] ${targetAudience} Using ${product}

**Option 5 (Question-based)**:
Ready to [Achieve Goal]? ${product} Can Help.

---

### Subheadline Options:

**Option 1**:
The ${product} solution designed specifically for ${targetAudience}. ${valueProposition || "Get results that matter."}

**Option 2**:
${targetAudience} trust ${product} to [Key Benefit]. Start your journey today.

**Option 3**:
Everything you need to [Achieve Goal] in one powerful ${product} platform.

---

## Value Proposition Section

### Primary Value Proposition:
${valueProposition || `${product} helps ${targetAudience} achieve [key benefit] through [unique approach].`}

### Key Benefits (3-5 points):

1. **Benefit 1**: [How ${product} helps ${targetAudience}]
   - Supporting detail or feature
   - Real-world impact

2. **Benefit 2**: [Second key benefit]
   - Supporting detail or feature
   - Measurable outcome

3. **Benefit 3**: [Third key benefit]
   - Supporting detail or feature
   - Competitive advantage

${valueProposition ? `4. **Benefit 4**: ${valueProposition}
   - How this differentiates you
   - Why it matters to ${targetAudience}` : ""}

---

## Features Section

### Feature 1: [Feature Name]
**Headline**: [Feature headline]
**Description**: [How this feature helps ${targetAudience}]
**Icon/Visual**: [Suggestion]

### Feature 2: [Feature Name]
**Headline**: [Feature headline]
**Description**: [Benefit to ${targetAudience}]
**Icon/Visual**: [Suggestion]

### Feature 3: [Feature Name]
**Headline**: [Feature headline]
**Description**: [Value proposition]
**Icon/Visual**: [Suggestion]

---

## Social Proof Section

### Testimonials Template:

**Testimonial 1**:
"${product} transformed our [specific area]. We saw [specific result] in just [timeframe]."
- [Name], [Title], [Company]

**Testimonial 2**:
"As a ${targetAudience}, ${product} has been a game-changer. [Specific benefit]."
- [Name], [Title], [Company]

### Trust Indicators:
- [X] ${targetAudience} using ${product}
- [X]% satisfaction rate
- [X] years of experience
- [X] successful projects

---

## Call-to-Action Section

### Primary CTA Button:
**Text**: ${cta}
**Placement**: Above the fold, mid-page, bottom of page

### CTA Variations:

**CTA 1 (Action-oriented)**:
${cta} Now

**CTA 2 (Benefit-focused)**:
Get Started with ${product}

**CTA 3 (Low-commitment)**:
Try ${product} Free

**CTA 4 (Urgency)**:
Start Your ${product} Journey Today

**CTA 5 (Value-focused)**:
Unlock ${product} Benefits

---

## FAQ Section

### Question 1:
**Q**: What is ${product}?
**A**: ${product} is [clear, concise explanation] designed for ${targetAudience}.

### Question 2:
**Q**: How does ${product} help ${targetAudience}?
**A**: ${product} helps ${targetAudience} by [key benefit explanation].

### Question 3:
**Q**: How do I get started with ${product}?
**A**: Getting started is easy. Simply ${cta.toLowerCase()} and follow our simple onboarding process.

### Question 4:
**Q**: What makes ${product} different?
**A**: ${valueProposition || `Unlike other solutions, ${product} focuses specifically on ${targetAudience} needs.`}

### Question 5:
**Q**: Is there a free trial?
**A**: Yes! Try ${product} free for [X] days. No credit card required.

---

## Conversion Optimization Tips

### Above the Fold:
- Clear headline with benefit
- Compelling subheadline
- Strong CTA button
- Trust indicators (if space allows)

### Mid-Page:
- Detailed benefits explanation
- Feature highlights
- Social proof/testimonials
- Secondary CTA

### Bottom of Page:
- Final CTA
- FAQ section
- Contact information
- Additional trust signals

### Page Elements:
- **Headline**: Clear, benefit-focused
- **Subheadline**: Expand on headline, add context
- **CTA Button**: Action-oriented, contrasting color
- **Images**: Show product/service in action
- **Trust Badges**: Security, guarantees, certifications
- **Social Proof**: Testimonials, logos, stats

---

## Copywriting Best Practices

### For ${targetAudience}:

1. **Use Their Language**: Speak in terms ${targetAudience} understand
2. **Address Pain Points**: Highlight problems ${targetAudience} face
3. **Show Benefits**: Focus on outcomes, not features
4. **Create Urgency**: Limited time offers or scarcity
5. **Build Trust**: Social proof, guarantees, credentials

### Power Words to Use:
- Transform
- Achieve
- Discover
- Unlock
- Proven
- Expert
- Results
- Success
- Growth
- Impact

### Words to Avoid:
- Free (use "No cost" or "Complimentary")
- Best (use "Top-rated" or "Leading")
- Guaranteed (use "Proven" or "Tested")
- Easy (use "Simple" or "Straightforward")

---

## Mobile Optimization

### Mobile-Specific Considerations:
- Shorter headlines (30-40 characters)
- Larger CTA buttons
- Simplified navigation
- Faster load times
- Thumb-friendly design

### Mobile CTA:
- Larger touch targets (44x44px minimum)
- Prominent placement
- Clear, concise text

---

## A/B Testing Recommendations

### Test Elements:
1. **Headlines**: Benefit vs. problem-solution
2. **CTAs**: Different action words
3. **Value Props**: Different benefit angles
4. **Social Proof**: Testimonials vs. stats
5. **Page Length**: Short vs. long form

**Note**: This is mock landing page copy. Connect to actual AI service for conversion-optimized, audience-specific copy generation.`;

    return NextResponse.json({ copy });
  } catch (error) {
    console.error("Error generating landing page copy:", error);
    return NextResponse.json(
      { error: "Failed to generate landing page copy" },
      { status: 500 }
    );
  }
}

