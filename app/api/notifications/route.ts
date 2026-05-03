import { NextRequest, NextResponse } from "next/server";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/notifications - Fetch user's notifications
export async function GET() {
  let session: Session | null = null;
  try {
    session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Direct typed access to prisma.notification
    const notifications = await prisma.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return NextResponse.json({ notifications }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error("CRITICAL: Error fetching notifications:", {
      message: errorMessage,
      stack: errorStack,
      userId: session?.user?.id
    });
    return NextResponse.json(
      { error: "Internal Server Error", details: errorMessage }, 
      { status: 500 }
    );
  }
}

// PATCH /api/notifications - Mark all as read
// PATCH /api/notifications/[id] - Mark one as read
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, readAll } = body;

    if (readAll) {
      await prisma.notification.updateMany({
        where: { userId: session.user.id, read: false },
        data: { read: true },
      });
      return NextResponse.json({ message: "All notifications marked as read" });
    }

    if (id) {
      await prisma.notification.update({
        where: { id, userId: session.user.id },
        data: { read: true },
      });
      return NextResponse.json({ message: "Notification marked as read" });
    }

    return NextResponse.json({ error: "Missing notification ID" }, { status: 400 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error updating notifications:", errorMessage);
    return NextResponse.json({ error: "Internal Server Error", details: errorMessage }, { status: 500 });
  }
}
