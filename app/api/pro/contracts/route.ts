import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.userType !== "pro") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const contracts = await prisma.contract.findMany({
    where: { proId: session.user.id },
    include: {
      client: { select: { id: true, name: true, email: true } },
      project: { select: { id: true, title: true } },
      proposal: { select: { id: true, title: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ contracts });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.userType !== "pro") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { clientId, projectId, proposalId, title, content, value, currency, expiresAt } = body;

  if (!clientId || !title || !content) {
    return NextResponse.json({ error: "clientId, title, and content are required" }, { status: 400 });
  }

  const contract = await prisma.contract.create({
    data: {
      proId: session.user.id,
      clientId,
      projectId: projectId ?? null,
      proposalId: proposalId ?? null,
      title,
      content,
      value: value ? parseFloat(value) : null,
      currency: currency ?? "GBP",
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      status: "draft",
    },
    include: { client: { select: { id: true, name: true, email: true } } },
  });

  return NextResponse.json({ contract }, { status: 201 });
}
