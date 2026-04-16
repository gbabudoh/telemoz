import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { contactId, date, time, duration, type, topic } = body;

    if (!contactId || !date || !time) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const scheduledAt = new Date(`${date}T${time}`);
    if (isNaN(scheduledAt.getTime())) {
      return NextResponse.json({ error: "Invalid date or time" }, { status: 400 });
    }

    // Determine who the pro is — look for a shared project between current user and contact
    const project = await prisma.project.findFirst({
      where: {
        OR: [
          { clientId: userId, proId: contactId },
          { clientId: contactId, proId: userId },
        ],
      },
      select: { proId: true, clientId: true, client: { select: { name: true } }, pro: { select: { name: true } } },
    });

    // The pro is whoever has userType pro in this pair
    // Fallback: use the proId from the project
    let proId: string;
    let contactName: string;

    if (project?.proId === userId) {
      // current user is the pro
      proId = userId;
      contactName = project.client.name;
    } else if (project?.proId) {
      // current user is the client, contact is the pro
      proId = project.proId;
      contactName = project.pro?.name ?? "Client";
    } else {
      // No shared project — fallback: assume current user is pro
      proId = userId;
      const contact = await prisma.user.findUnique({ where: { id: contactId }, select: { name: true } });
      contactName = contact?.name ?? "Contact";
    }

    const call = await prisma.scheduledCall.create({
      data: {
        proId,
        contactId,
        contactName,
        scheduledAt,
        duration: parseInt(duration) || 30,
        callType: type === "audio" ? "audio" : "video",
        topic: topic || null,
      },
    });

    return NextResponse.json({ success: true, callId: call.id });
  } catch (error) {
    console.error("Error scheduling call:", error);
    return NextResponse.json({ error: "Failed to schedule call" }, { status: 500 });
  }
}
