import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

const CONTRACT_TEMPLATE = `# Services Agreement

**This agreement** is entered into between the service provider ("Pro") and the client ("Client") as detailed in the proposal.

## 1. Scope of Services
{{SCOPE}}

## 2. Payment Terms
Client agrees to pay the agreed fee of {{PRICE}} {{CURRENCY}} as specified in the proposal. Payment is due within 14 days of invoice.

## 3. Intellectual Property
Upon full payment, all deliverables created specifically for this project transfer to the Client. The Pro retains the right to display work in their portfolio.

## 4. Confidentiality
Both parties agree to keep confidential any proprietary information shared during the engagement.

## 5. Termination
Either party may terminate this agreement with 14 days written notice. Work completed to date will be invoiced accordingly.

## 6. Limitation of Liability
The Pro's total liability shall not exceed the total fees paid under this agreement.

## 7. Governing Law
This agreement is governed by the laws of England and Wales.`;

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.userType !== "pro") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { proposalId } = await req.json();

  if (!proposalId) return NextResponse.json({ error: "proposalId is required" }, { status: 400 });

  const proposal = await prisma.proposal.findUnique({
    where: { id: proposalId, proId: session.user.id },
  });

  if (!proposal) return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
  if (proposal.status !== "accepted") return NextResponse.json({ error: "Proposal must be accepted before converting to contract" }, { status: 400 });

  // Check if contract already exists
  const existingContract = await prisma.contract.findUnique({
    where: { proposalId: proposal.id },
  });
  if (existingContract) return NextResponse.json({ contract: existingContract });

  const content = CONTRACT_TEMPLATE
    .replace("{{SCOPE}}", proposal.scope)
    .replace("{{PRICE}}", proposal.price.toString())
    .replace("{{CURRENCY}}", proposal.currency);

  const contract = await prisma.contract.create({
    data: {
      proId: session.user.id,
      clientId: proposal.clientId,
      projectId: proposal.projectId,
      proposalId: proposal.id,
      title: `Agreement: ${proposal.title}`,
      content,
      value: proposal.price,
      currency: proposal.currency,
      status: "draft",
    },
  });

  return NextResponse.json({ contract }, { status: 201 });
}
