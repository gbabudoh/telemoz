import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const proposal = await prisma.proposal.findUnique({
    where: { id },
    include: {
      pro: { select: { id: true, name: true, email: true } },
      client: { select: { id: true, name: true, email: true } },
      project: { select: { id: true, title: true } },
    },
  });

  if (!proposal) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const isOwner = proposal.proId === session.user.id || proposal.clientId === session.user.id;
  if (!isOwner) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  return NextResponse.json({ proposal });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const proposal = await prisma.proposal.findUnique({ where: { id } });
  if (!proposal) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const isPro = session.user.id === proposal.proId;
  const isClient = session.user.id === proposal.clientId;

  if (!isPro && !isClient) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  // Client can only accept or reject
  if (isClient && !isPro) {
    const { action, rejectionNote } = body;
    if (action === "accept") {
      const updated = await prisma.proposal.update({
        where: { id },
        data: { status: "accepted", acceptedAt: new Date() },
      });
      return NextResponse.json({ proposal: updated });
    }
    if (action === "reject") {
      const updated = await prisma.proposal.update({
        where: { id },
        data: { status: "rejected", rejectedAt: new Date(), rejectionNote: rejectionNote ?? null },
      });
      return NextResponse.json({ proposal: updated });
    }
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  // Pro can edit or send
  const { title, summary, scope, deliverables, timeline, price, currency, validUntil, notes, status } = body;
  const updated = await prisma.proposal.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(summary !== undefined && { summary }),
      ...(scope !== undefined && { scope }),
      ...(deliverables !== undefined && { deliverables }),
      ...(timeline !== undefined && { timeline }),
      ...(price !== undefined && { price: parseFloat(price) }),
      ...(currency !== undefined && { currency }),
      ...(validUntil !== undefined && { validUntil: validUntil ? new Date(validUntil) : null }),
      ...(notes !== undefined && { notes }),
      ...(status !== undefined && { status }),
    },
  });

  return NextResponse.json({ proposal: updated });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.userType !== "pro") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const proposal = await prisma.proposal.findUnique({ where: { id } });
  if (!proposal) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (proposal.proId !== session.user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.proposal.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
