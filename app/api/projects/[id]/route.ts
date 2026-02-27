import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

type ProjectStatus = "under_review" | "planning" | "active" | "on_hold" | "completed" | "cancelled";
type DeliverableType = "report" | "document" | "design" | "other";

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

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        pro: { select: { name: true, email: true } },
        client: { select: { name: true, email: true } },
        milestones: true,
        deliverables: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Check if user has access to this project
    if (project.proId !== session.user.id && project.clientId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    return NextResponse.json({ project });
  } catch (error: unknown) {
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

    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Check if user has access to this project
    if (project.proId !== session.user.id && project.clientId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // Prepare update data
    const updateData: Parameters<typeof prisma.project.update>[0]["data"] & {
      currency?: string;
      country?: string | null;
    } = {};
    if (body.title) updateData.title = body.title;
    if (body.description) updateData.description = body.description;
    if (body.category) updateData.category = body.category;
    if (body.timeline) updateData.timeline = body.timeline;
    if (body.status) updateData.status = body.status as ProjectStatus;
    if (body.startDate) updateData.startDate = new Date(body.startDate);
    if (body.endDate !== undefined) {
      updateData.endDate = body.endDate ? new Date(body.endDate) : null;
    }
    if (body.budget !== undefined) updateData.budget = parseFloat(body.budget);
    if (body.currency) updateData.currency = body.currency;
    if (body.country !== undefined) updateData.country = body.country;

    // Handle milestones (replace implementation)
    if (body.milestones) {
      updateData.milestones = {
        deleteMany: {},
        create: body.milestones.map((m: { title: string; description: string; status?: string; dueDate?: string }) => ({
          title: m.title,
          description: m.description,
          status: m.status || "planning",
          dueDate: m.dueDate ? new Date(m.dueDate) : null,
        })),
      };
    }

    // Handle deliverables (replace implementation)
    if (body.deliverables) {
      updateData.deliverables = {
        deleteMany: {},
        create: body.deliverables.map((d: { title: string; description: string; status?: string; type?: DeliverableType; dueDate?: string }) => ({
          title: d.title,
          description: d.description,
          status: d.status || "planning",
          type: d.type || "other",
          dueDate: d.dueDate ? new Date(d.dueDate) : null,
        })),
      };
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: updateData as any, // eslint-disable-line @typescript-eslint/no-explicit-any
      include: {
        pro: { select: { name: true, email: true } },
        client: { select: { name: true, email: true } },
        milestones: true,
        deliverables: true,
      },
    });

    return NextResponse.json({ project: updatedProject });
  } catch (error: unknown) {
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

    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Check if user has access to this project
    if (project.proId !== session.user.id && project.clientId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error: unknown) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
