import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// POST: initiate a call request
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { toId, inquiryId, callType } = await request.json();
  if (!toId || !inquiryId || !callType) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Cancel any existing ringing requests for this inquiry
  await prisma.callRequest.updateMany({
    where: { inquiryId, status: "ringing" },
    data: { status: "missed" },
  });

  const roomName = `call-${inquiryId}-${Date.now()}`;

  const callRequest = await prisma.callRequest.create({
    data: {
      fromId: session.user.id,
      toId,
      inquiryId,
      callType: callType === "audio" ? "audio" : "video",
      status: "ringing",
      roomName,
    },
    include: {
      from: { select: { id: true, name: true, image: true } },
    },
  });

  // Resolve recipient's role so the notification link goes to the right page
  const recipient = await prisma.user.findUnique({
    where: { id: toId },
    select: { userType: true },
  });
  const recipientBase = recipient?.userType === "pro" ? "/pro/messaging" : "/client/messaging";

  await prisma.notification.create({
    data: {
      userId: toId,
      title: `Incoming ${callType === "audio" ? "voice" : "video"} call from ${session.user.name || "User"}`,
      message: `${session.user.name || "User"} is calling you`,
      type: "call_request",
      link: `${recipientBase}?callRequestId=${callRequest.id}`,
    },
  });

  return NextResponse.json({ callRequest });
}

// GET: poll for pending incoming call requests
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Auto-expire requests older than 35 seconds
  await prisma.callRequest.updateMany({
    where: {
      toId: session.user.id,
      status: "ringing",
      createdAt: { lt: new Date(Date.now() - 35_000) },
    },
    data: { status: "missed" },
  });

  const pending = await prisma.callRequest.findFirst({
    where: { toId: session.user.id, status: "ringing" },
    include: {
      from: { select: { id: true, name: true, image: true } },
      inquiry: { select: { id: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ callRequest: pending ?? null });
}
