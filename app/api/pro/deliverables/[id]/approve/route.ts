import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { action, note } = body; // action: "approve" | "request_revision"

  const deliverable = await prisma.deliverable.findUnique({
    where: { id },
    include: { project: { select: { proId: true, clientId: true } } },
  });

  if (!deliverable) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { proId, clientId } = deliverable.project;
  const isAuthorized = session.user.id === proId || session.user.id === clientId;
  if (!isAuthorized) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  if (!["approve", "request_revision"].includes(action)) {
    return NextResponse.json({ error: "action must be 'approve' or 'request_revision'" }, { status: 400 });
  }

  const newStatus = action === "approve" ? "approved" : "revision_requested";

  const [updated] = await prisma.$transaction([
    prisma.deliverable.update({
      where: { id },
      data: {
        approvalStatus: newStatus,
        approvedAt: action === "approve" ? new Date() : null,
        revisionNote: action === "request_revision" ? (note ?? null) : null,
      },
    }),
    prisma.deliverableApproval.create({
      data: {
        deliverableId: id,
        reviewerId: session.user.id,
        status: newStatus,
        note: note ?? null,
      },
    }),
  ]);

  return NextResponse.json({ deliverable: updated });
}
