import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.userType !== "pro") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const proposals = await prisma.proposal.findMany({
    where: { proId: session.user.id },
    include: { client: { select: { id: true, name: true, email: true } }, project: { select: { id: true, title: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ proposals });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.userType !== "pro") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { clientId, projectId, title, summary, scope, deliverables, timeline, price, currency, validUntil, notes } = body;

  if (!clientId || !title || !summary || !scope || !price) {
    return NextResponse.json({ error: "clientId, title, summary, scope, and price are required" }, { status: 400 });
  }

  const proposal = await prisma.proposal.create({
    data: {
      proId: session.user.id,
      clientId,
      projectId: projectId ?? null,
      title,
      summary,
      scope,
      deliverables: deliverables ?? [],
      timeline: timeline ?? "",
      price: parseFloat(price),
      currency: currency ?? "GBP",
      validUntil: validUntil ? new Date(validUntil) : null,
      notes: notes ?? null,
      status: "draft",
    },
    include: { client: { select: { id: true, name: true, email: true } } },
  });

  return NextResponse.json({ proposal }, { status: 201 });
}
