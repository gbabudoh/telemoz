import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notifyNewMessage } from "@/lib/novu";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const inquiryId = searchParams.get("inquiryId");

  if (!inquiryId) {
    return NextResponse.json({ error: "Missing inquiryId" }, { status: 400 });
  }

  try {
    const messages = await prisma.message.findMany({
      where: { inquiryId },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ messages });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching messages:", errorMessage);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const body = await request.json();
  const { text, inquiryId, receiverId, projectId } = body;

  if (!text || !inquiryId || !receiverId) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const message = await prisma.message.create({
      data: {
        text,
        senderId: userId,
        receiverId,
        inquiryId,
        projectId: projectId ?? null,
      },
    });

    await prisma.inquiry.update({
      where: { id: inquiryId },
      data: { updatedAt: new Date() },
    });

    // Create in-app notification for the receiver
    try {
      // Get receiver type to construct correct link
      const receiver = await prisma.user.findUnique({
        where: { id: receiverId },
        select: { userType: true }
      });

      const notificationLink = `/messaging?inquiryId=${inquiryId}`;

      await prisma.notification.create({
        data: {
          userId: receiverId,
          title: `New Message from ${session.user.name || 'User'}`,
          message: text.length > 50 ? text.substring(0, 50) + '...' : text,
          type: 'message',
          link: notificationLink,
        },
      });

      // Trigger external notification via Novu
      await notifyNewMessage(
        receiverId,
        session.user.name || 'User',
        text.length > 100 ? text.substring(0, 100) + '...' : text,
        `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}${notificationLink}`
      );
    } catch (notificationError) {
      // Log notification errors but don't fail the message delivery
      console.error("Notification delivery failed:", notificationError);
    }

    return NextResponse.json({ message });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error creating message:", errorMessage);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
