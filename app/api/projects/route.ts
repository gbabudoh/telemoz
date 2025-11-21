import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Project from "@/models/Project";
import mongoose from "mongoose";

// Connect to MongoDB
async function connectDB() {
  if (mongoose.connections[0].readyState) {
    return;
  }
  await mongoose.connect(process.env.MONGODB_URI || "");
}

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

    await connectDB();

    const { searchParams } = new URL(request.url);
    const userType = searchParams.get("userType"); // "pro" or "client"
    const status = searchParams.get("status");

    const query: any = {};
    
    if (userType === "pro") {
      query.proId = session.user.id;
    } else if (userType === "client") {
      query.clientId = session.user.id;
    } else {
      // Return projects where user is either pro or client
      query.$or = [
        { proId: session.user.id },
        { clientId: session.user.id },
      ];
    }

    if (status) {
      query.status = status;
    }

    const projects = await Project.find(query)
      .populate("proId", "name email")
      .populate("clientId", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json({ projects });
  } catch (error) {
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

    await connectDB();

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

    const project = new Project({
      title,
      description,
      proId: finalProId,
      clientId: finalClientId,
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : undefined,
      budget,
      status: "planning",
    });

    await project.save();

    const populatedProject = await Project.findById(project._id)
      .populate("proId", "name email")
      .populate("clientId", "name email");

    return NextResponse.json(
      { project: populatedProject },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}

