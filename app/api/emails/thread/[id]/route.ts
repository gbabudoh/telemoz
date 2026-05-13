import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { PrismaClient } from "@prisma/client";

// Local interface extension to ensure newly generated models are recognized by TS
interface EmailDB extends PrismaClient {
  emailThread: { 
    findMany: (args?: object) => Promise<Array<{ id: string; subject: string; updatedAt: Date; messages: object[]; participants: object[] }>>; 
    findUnique: (args: object) => Promise<{ id: string; participants: Array<{ id: string }>; messages: object[] } | null>; 
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

// GET /api/emails/[id] - Fetch full thread detail
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const thread = await db.emailThread.findUnique({
      where: { id: params.id },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          include: {
            sender: { select: { id: true, name: true, image: true, userType: true } },
            receiver: { select: { id: true, name: true, image: true, userType: true } }
          }
        },
        participants: {
          select: { id: true, name: true, image: true, userType: true }
        }
      }
    });

    if (!thread || !thread.participants.some(p => p.id === session.user.id)) {
      return NextResponse.json({ error: "Thread not found or access denied" }, { status: 404 });
    }

    // Mark all received messages in this thread as read
    await db.emailMessage.updateMany({
      where: {
        threadId: params.id,
        receiverId: session.user.id,
        isRead: false
      },
      data: { isRead: true }
    });

    return NextResponse.json({ thread });
  } catch (error) {
    console.error("Error fetching thread detail:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PATCH /api/emails/[id] - Update message state (archive, delete, read)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { isArchived, isDeleted, isRead, isThread } = body;

    if (isThread) {
      // Apply to all relevant messages in the thread for this user
      await db.emailMessage.updateMany({
        where: {
          threadId: params.id,
          OR: [
            { senderId: session.user.id },
            { receiverId: session.user.id }
          ]
        },
        data: {
          ...(isArchived !== undefined && { isArchived }),
          ...(isDeleted !== undefined && { isDeleted }),
          ...(isRead !== undefined && { isRead })
        }
      });
      return NextResponse.json({ message: "Thread updated" });
    } else {
      // Update single message
      await db.emailMessage.update({
        where: { id: params.id },
        data: {
          ...(isArchived !== undefined && { isArchived }),
          ...(isDeleted !== undefined && { isDeleted }),
          ...(isRead !== undefined && { isRead })
        }
      });
      return NextResponse.json({ message: "Message updated" });
    }
  } catch (error) {
    console.error("Error updating email state:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE /api/emails/[id] - Permanently delete
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // For safety, we only mark as deleted unless it's already in trash
    const { permanent } = Object.fromEntries(new URL(request.url).searchParams);

    if (permanent === "true") {
       // Check if user has permission
       const thread = await db.emailThread.findUnique({
         where: { id: params.id },
         include: { participants: true }
       });
       if (thread && thread.participants.some((p: { id: string }) => p.id === session.user.id)) {
         await db.emailThread.delete({ where: { id: params.id } });
       }
    } else {
      await db.emailMessage.updateMany({
        where: {
          threadId: params.id,
          OR: [
            { senderId: session.user.id },
            { receiverId: session.user.id }
          ]
        },
        data: { isDeleted: true }
      });
    }

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Error deleting email:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
