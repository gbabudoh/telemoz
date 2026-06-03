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
        pro: { select: { id: true, name: true, email: true, image: true } },
        client: { select: { id: true, name: true, email: true, image: true } },
        milestones: {
          select: { id: true, title: true, status: true, dueDate: true },
          orderBy: { dueDate: "asc" },
        },
        deliverables: {
          select: { id: true, title: true, approvalStatus: true },
        },
        invoices: {
          where: { status: "paid" },
          select: { total: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    // Compute real progress per project
    const enriched = projects.map((p) => {
      const totalMilestones = p.milestones.length;
      const completedMilestones = p.milestones.filter((m) => m.status === "completed").length;
      const totalDeliverables = p.deliverables.length;
      const approvedDeliverables = p.deliverables.filter((d) => d.approvalStatus === "approved").length;
      const amountPaid = p.invoices.reduce((sum, inv) => sum + inv.total, 0);

      let progress = 0;
      if (totalMilestones > 0) {
        progress = Math.round((completedMilestones / totalMilestones) * 100);
      } else if (totalDeliverables > 0) {
        progress = Math.round((approvedDeliverables / totalDeliverables) * 100);
      } else if (p.status === "completed") {
        progress = 100;
      }
      // 0% when no milestones or deliverables — honest, not a fake status-based guess

      const nextMilestone = p.milestones.find((m) => m.status !== "completed");

      return {
        ...p,
        progress,
        totalMilestones,
        completedMilestones,
        totalDeliverables,
        approvedDeliverables,
        amountPaid,
        nextMilestoneName: nextMilestone?.title ?? null,
        nextMilestoneDue: nextMilestone?.dueDate ?? null,
      };
    });

    return NextResponse.json({ projects: enriched });
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
    const { 
      title, description, category, timeline, clientId, proId, startDate, endDate, budget, currency, country,
      objective, targetAudience, platforms, deliverables, additionalNotes
    } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    // Determine proId and clientId based on user type
    let finalProId = proId;
    let finalClientId = clientId || session.user.id;

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
    }

    // Use transaction to create both Project and ProjectBrief
    const project = await prisma.$transaction(async (tx) => {
      const p = await tx.project.create({
        data: {
          title,
          description,
          category,
          timeline,
          proId: finalProId || null,
          clientId: finalClientId,
          startDate: startDate ? new Date(startDate) : new Date(),
          endDate: endDate ? new Date(endDate) : undefined,
          budget: budget ? parseFloat(budget) : 0,
          currency: currency || "GBP",
          country: country || null,
          status: "under_review",
        },
        include: {
          pro: { select: { name: true, email: true, image: true } },
          client: { select: { name: true, email: true, image: true } },
        },
      });

      // Create the brief automatically
      await tx.projectBrief.create({
        data: {
          clientId: finalClientId,
          projectId: p.id,
          title: p.title,
          objective: objective || description, // fallback to description if objective is missing
          targetAudience: targetAudience || null,
          platforms: platforms || [],
          deliverables: deliverables || [],
          timeline: timeline || p.timeline || null,
          budget: p.budget,
          currency: p.currency,
          additionalNotes: additionalNotes || null,
        }
      });

      return p;
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

