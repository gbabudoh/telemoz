import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const proId = searchParams.get("proId");

  try {
    const calls = await prisma.scheduledCall.findMany({
      where: proId ? { proId } : { proId: session.user.id },
      orderBy: { scheduledAt: "asc" },
    });
    return NextResponse.json({ calls });
  } catch {
    return NextResponse.json({ error: "Failed to fetch calls" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { proId, scheduledAt, topic, callType, duration, contactName } = body;

  try {
    const call = await prisma.scheduledCall.create({
      data: {
        proId,
        scheduledAt: new Date(scheduledAt),
        topic,
        callType: callType || "video",
        duration: duration || 30,
        contactName: contactName || session.user.name || "Client",
        contactId: session.user.id,
      },
    });
    return NextResponse.json({ call });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Schedule Call Error:", errorMessage);
    return NextResponse.json({ error: "Failed to schedule call" }, { status: 500 });
  }
}
