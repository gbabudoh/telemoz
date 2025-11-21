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

// Helper function to extract ObjectId string from populated or non-populated field
function getIdString(id: mongoose.Types.ObjectId | { _id: mongoose.Types.ObjectId } | any): string {
  if (id instanceof mongoose.Types.ObjectId) {
    return id.toString();
  }
  if (id && typeof id === 'object' && '_id' in id) {
    return id._id.toString();
  }
  return String(id);
}

// GET /api/projects/[id] - Get a specific project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid project ID" },
        { status: 400 }
      );
    }

    await connectDB();

    const project = await Project.findById(id)
      .populate("proId", "name email")
      .populate("clientId", "name email");

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Check if user has access to this project
    const proIdStr = getIdString(project.proId);
    const clientIdStr = getIdString(project.clientId);
    
    if (proIdStr !== session.user.id && clientIdStr !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

// PATCH /api/projects/[id] - Update a project
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid project ID" },
        { status: 400 }
      );
    }

    await connectDB();

    const project = await Project.findById(id);

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Check if user has access to this project
    const proIdStr = getIdString(project.proId);
    const clientIdStr = getIdString(project.clientId);
    
    if (proIdStr !== session.user.id && clientIdStr !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // Update allowed fields
    if (body.title) project.title = body.title;
    if (body.description) project.description = body.description;
    if (body.status) project.status = body.status;
    if (body.startDate) project.startDate = new Date(body.startDate);
    if (body.endDate !== undefined) {
      project.endDate = body.endDate ? new Date(body.endDate) : undefined;
    }
    if (body.budget !== undefined) project.budget = body.budget;
    if (body.milestones) project.milestones = body.milestones;
    if (body.deliverables) project.deliverables = body.deliverables;

    await project.save();

    const updatedProject = await Project.findById(id)
      .populate("proId", "name email")
      .populate("clientId", "name email");

    return NextResponse.json({ project: updatedProject });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[id] - Delete a project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid project ID" },
        { status: 400 }
      );
    }

    await connectDB();

    const project = await Project.findById(id);

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Check if user has access to this project
    const proIdStr = getIdString(project.proId);
    const clientIdStr = getIdString(project.clientId);
    
    if (proIdStr !== session.user.id && clientIdStr !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    await Project.findByIdAndDelete(id);

    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
