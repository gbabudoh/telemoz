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
    if (session.user.userType !== "client") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { proId, projectId, message } = await request.json();

    if (!proId || !projectId || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if an inquiry already exists for this pro and project
    const existing = await prisma.inquiry.findUnique({
      where: { proId_projectId: { proId, projectId } },
    });

    if (existing) {
      return NextResponse.json({ error: "You already have an active inquiry for this project with this professional" }, { status: 409 });
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        proId,
        clientId: session.user.id,
        projectId,
        message,
        status: "new",
      },
      include: {
        project: { select: { title: true } },
        client: { select: { name: true } },
      }
    });

    // Create notification for the pro
    await prisma.notification.create({
      data: {
        userId: proId,
        title: "New Project Inquiry",
        message: `${inquiry.client.name} is interested in hiring you for "${inquiry.project.title}".`,
        type: "inquiry",
        link: "/pro/inquiries",
      }
    });

    return NextResponse.json({ inquiry }, { status: 201 });
  } catch (error) {
    console.error("Error creating inquiry:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
