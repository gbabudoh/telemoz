import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.userType !== "pro") {
    return NextResponse.json(
      { error: "Only professionals can express interest" },
      { status: 403 }
    );
  }

  try {
    const { requestId } = await params;
    const body = await request.json().catch(() => ({}));
    const message: string | undefined = body.message;

    const project = await prisma.project.findUnique({
      where: { id: requestId },
      include: { client: { select: { id: true, name: true } } },
    });

    if (!project || project.proId !== null) {
      return NextResponse.json({ error: "Project not available" }, { status: 404 });
    }

    const existing = await prisma.inquiry.findUnique({
      where: { proId_projectId: { proId: session.user.id, projectId: requestId } },
    });
    if (existing) {
      return NextResponse.json(
        { error: "You have already expressed interest in this project" },
        { status: 409 }
      );
    }

    const pro = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true },
    });

    const inquiry = await prisma.inquiry.create({
      data: {
        proId: session.user.id,
        clientId: project.clientId,
        projectId: requestId,
        message: message ?? null,
      },
    });

    // Create the first message in the chat thread
    if (message) {
      await prisma.message.create({
        data: {
          text: message,
          senderId: session.user.id,
          receiverId: project.clientId,
          inquiryId: inquiry.id,
          projectId: requestId,
        },
      });
    }

    // In-app notification for the client
    await prisma.notification.create({
      data: {
        userId: project.clientId,
        title: "New Interest in Your Project",
        message: `${pro?.name ?? "A professional"} expressed interest in "${project.title}".`,
        type: "inquiry",
        link: "/client/inquiries",
      },
    });

    // Novu email/push — non-fatal
    try {
      const { triggerNotification } = await import("@/lib/novu");
      await triggerNotification({
        workflowId: "new-inquiry",
        to: project.clientId,
        payload: {
          proName: pro?.name ?? "A professional",
          projectName: project.title,
          inquiryUrl: "/client/inquiries",
        },
      });
    } catch (e) {
      console.error("Novu notification failed:", e);
    }

    return NextResponse.json({ inquiry }, { status: 201 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("CRITICAL: Error in marketplace interest submission:", error);
    return NextResponse.json({ error: "Internal Server Error", details: errorMessage }, { status: 500 });
  }
}
