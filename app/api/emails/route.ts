import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { PrismaClient } from "@prisma/client";

// Local interface extension to ensure newly generated models are recognized by TS
interface EmailDB extends PrismaClient {
  emailThread: { 
    findMany: (args?: object) => Promise<Array<{ 
      id: string; 
      subject: string; 
      updatedAt: Date; 
      messages: Array<{ 
        id: string; 
        content: string; 
        isRead: boolean; 
        createdAt: Date; 
        sender: { name: string; email: string; image: string }; 
        receiver: { name: string; email: string; image: string } 
      }>; 
      participants: Array<{ id: string; name: string; email: string; image: string; userType: string }>;
    }>>; 
    findUnique: (args: object) => Promise<{ id: string; participants: Array<{ id: string }> } | null>; 
    create: (args: object) => Promise<{ id: string }>; 
    update: (args: object) => Promise<{ id: string }>; 
    delete: (args: object) => Promise<{ id: string }>;
  };
  emailMessage: { 
    create: (args: object) => Promise<{ id: string }>; 
    updateMany: (args: object) => Promise<{ count: number }>; 
    update: (args: object) => Promise<{ id: string }>; 
  };
}

const db = prisma as unknown as EmailDB;

// GET /api/emails - Fetch user's email threads
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const folder = searchParams.get("folder") || "inbox"; // inbox, sent, archive, trash

    const userId = session.user.id;

    // Build the query based on the folder
    const whereClause: {
      participants: { some: { id: string } };
      messages?: { some: { isDeleted?: boolean; isArchived?: boolean; senderId?: string; receiverId?: string } };
    } = {
      participants: { some: { id: userId } }
    };

    if (folder === "trash") {
      whereClause.messages = { some: { isDeleted: true } };
    } else if (folder === "archive") {
      whereClause.messages = { some: { isArchived: true, isDeleted: false } };
    } else if (folder === "sent") {
      whereClause.messages = { some: { senderId: userId, isDeleted: false } };
    } else {
      // Inbox - received messages not archived or deleted
      whereClause.messages = { some: { receiverId: userId, isArchived: false, isDeleted: false } };
    }

    const threads = await db.emailThread.findMany({
      where: whereClause,
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: {
            sender: { select: { name: true, image: true, email: true } },
            receiver: { select: { name: true, image: true, email: true } }
          }
        },
        participants: {
          select: { id: true, name: true, image: true, email: true, userType: true }
        }
      },
      orderBy: { updatedAt: "desc" }
    });

    return NextResponse.json({ threads });
  } catch (error) {
    console.error("Error fetching emails:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/emails - Compose a new email/thread
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { receiverId, subject, content, inquiryId, projectId, threadId } = body;

    if (!content || (!threadId && (!receiverId || !subject))) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let thread;
    if (threadId) {
      // Reply to existing thread
      thread = await db.emailThread.update({
        where: { id: threadId },
        data: { updatedAt: new Date() }
      });
    } else {
      // Create new thread
      thread = await db.emailThread.create({
        data: {
          subject,
          inquiryId,
          projectId,
          participants: {
            connect: [
              { id: session.user.id },
              { id: receiverId }
            ]
          }
        }
      });
    }

    // Get receiver ID for replies
    let messageReceiverId = receiverId;
    if (!messageReceiverId && threadId) {
      const existingThread = await db.emailThread.findUnique({
        where: { id: threadId },
        include: { participants: true }
      });
      messageReceiverId = existingThread?.participants.find((p) => p.id !== session.user.id)?.id || "";
    }

    const message = await db.emailMessage.create({
      data: {
        threadId: thread.id,
        senderId: session.user.id,
        receiverId: messageReceiverId,
        content
      }
    });

    return NextResponse.json({ thread, message });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
