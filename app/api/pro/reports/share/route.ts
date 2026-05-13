import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

interface ShareReport {
  id: string;
  token: string;
  projectId: string;
  proId: string;
  viewCount: number;
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { projectId } = await req.json();

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    // Ensure the project belongs to the Pro
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project || project.proId !== session.user.id) {
      return NextResponse.json({ error: "Project not found or unauthorized" }, { status: 404 });
    }

    // Create or find a share token using the new unique constraint
    const reportShare = await prisma.reportShare.upsert({
      where: { 
        projectId_proId: {
          projectId,
          proId: session.user.id,
        }
      },
      update: {
        updatedAt: new Date(),
      },
      create: {
        projectId,
        proId: session.user.id,
      },
    }) as ShareReport;

    return NextResponse.json({ 
      token: reportShare.token,
      shareUrl: `${process.env.NEXTAUTH_URL}/shared/report/${reportShare.token}` 
    });
  } catch (error: unknown) {
    console.error("Failed to generate report share:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
