import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";


// GET /api/projects - Get all projects for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userType = searchParams.get("userType"); // "pro" or "client"
    const status = searchParams.get("status");

    const where: NonNullable<Parameters<typeof prisma.project.findMany>[0]>["where"] = {};
    
    if (userType === "pro") {
      where.proId = session.user.id;
    } else if (userType === "client") {
      where.clientId = session.user.id;
    } else {
      // Return projects where user is either pro or client
      where.OR = [
        { proId: session.user.id },
        { clientId: session.user.id },
      ];
    }

    if (status) {
      where.status = status as NonNullable<typeof where.status>;
    }

    const projects = await prisma.project.findMany({
      where,
      include: {
        pro: { select: { name: true, email: true } },
        client: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ projects });
  } catch (error: unknown) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description, clientId, proId, startDate, endDate, budget } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    // Determine proId and clientId based on user type
    let finalProId = proId;
    let finalClientId = clientId;

    if (session.user.userType === "pro") {
      finalProId = session.user.id;
      if (!finalClientId) {
        return NextResponse.json(
          { error: "Client ID is required" },
          { status: 400 }
        );
      }
    } else if (session.user.userType === "client") {
      finalClientId = session.user.id;
      if (!finalProId) {
        return NextResponse.json(
          { error: "Pro ID is required" },
          { status: 400 }
        );
      }
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        proId: finalProId as string,
        clientId: finalClientId as string,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : undefined,
        budget: budget ? parseFloat(budget) : 0,
        status: "planning",
      },
      include: {
        pro: { select: { name: true, email: true } },
        client: { select: { name: true, email: true } },
      },
    });

    return NextResponse.json(
      { project },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}

