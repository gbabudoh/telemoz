import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.userType !== "pro") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { contactName, contactId, date, time, duration, callType, topic } = body;

    if (!contactName || !date || !time) {
      return NextResponse.json(
        { error: "contactName, date, and time are required" },
        { status: 400 }
      );
    }

    // Combine date + time into a single DateTime
    const scheduledAt = new Date(`${date}T${time}:00`);
    if (isNaN(scheduledAt.getTime())) {
      return NextResponse.json({ error: "Invalid date or time" }, { status: 400 });
    }

    const scheduledCall = await prisma.scheduledCall.create({
      data: {
        proId: session.user.id,
        contactName,
        contactId: contactId ?? null,
        scheduledAt,
        duration: duration ? parseInt(String(duration), 10) : 30,
        callType: callType === "audio" ? "audio" : "video",
        topic: topic || null,
        status: "pending",
      },
    });

    return NextResponse.json({ scheduledCall }, { status: 201 });
  } catch (error: unknown) {
    console.error("Error scheduling call:", error);
    return NextResponse.json(
      { error: "Failed to schedule call" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.userType !== "pro") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const calls = await prisma.scheduledCall.findMany({
      where: { proId: session.user.id },
      orderBy: { scheduledAt: "asc" },
    });

    return NextResponse.json({ calls });
  } catch (error: unknown) {
    console.error("Error fetching scheduled calls:", error);
    return NextResponse.json(
      { error: "Failed to fetch scheduled calls" },
      { status: 500 }
    );
  }
}
