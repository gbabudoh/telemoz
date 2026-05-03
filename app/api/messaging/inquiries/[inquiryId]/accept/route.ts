import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ inquiryId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { inquiryId } = await params;

  try {
    const inquiry = await prisma.inquiry.findUnique({
      where: { id: inquiryId },
      include: { project: true },
    });

    if (!inquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    if (inquiry.clientId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (inquiry.project.proId) {
      return NextResponse.json({ error: "Project already has an assigned professional" }, { status: 400 });
    }

    // Atomic update: Accept inquiry and assign pro to project
    await prisma.$transaction([
      prisma.inquiry.update({
        where: { id: inquiryId },
        data: { status: "accepted" },
      }),
      prisma.project.update({
        where: { id: inquiry.projectId },
        data: { 
          proId: inquiry.proId,
          status: "planning",
        },
      }),
      // System message
      prisma.message.create({
        data: {
          text: "✅ Client has accepted the professional. The project is now officially active.",
          senderId: session.user.id,
          receiverId: inquiry.proId,
          inquiryId: inquiry.id,
          projectId: inquiry.projectId,
        },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Acceptance error:", errorMessage);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
