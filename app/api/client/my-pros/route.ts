import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  void request;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projects = await prisma.project.findMany({
      where: { clientId: session.user.id, proId: { not: null } },
      include: {
        pro: {
          select: {
            id: true,
            name: true,
            email: true,
            proProfile: {
              select: {
                specialties: true,
                location: true,
                rating: true,
                reviewCount: true,
                availability: true,
                verified: true,
                certifications: { select: { name: true } },
              },
            },
          },
        },
      },
    });

    const prosMap = new Map<string, {
      id: string;
      name: string;
      email: string;
      activeProjects: number;
      completedProjects: number;
      totalSpent: number;
      profile: {
        specialties: string[];
        location: string;
        rating: number;
        reviewCount: number;
        availability: string;
        verified: boolean;
        certifications: { name: string }[];
      } | null;
    }>();

    for (const project of projects) {
      if (!project.pro) continue;
      const proId = project.pro.id;
      const isActive = ["planning", "active", "under_review"].includes(project.status);
      const isCompleted = project.status === "completed";
      const budget = project.budget ?? 0;
      const existing = prosMap.get(proId);

      if (existing) {
        if (isActive) existing.activeProjects += 1;
        if (isCompleted) existing.completedProjects += 1;
        existing.totalSpent += budget;
      } else {
        prosMap.set(proId, {
          id: proId,
          name: project.pro.name,
          email: project.pro.email,
          activeProjects: isActive ? 1 : 0,
          completedProjects: isCompleted ? 1 : 0,
          totalSpent: budget,
          profile: project.pro.proProfile
            ? {
                ...project.pro.proProfile,
                availability: project.pro.proProfile.availability.toString(),
              }
            : null,
        });
      }
    }

    return NextResponse.json({ pros: Array.from(prosMap.values()) });
  } catch (error) {
    console.error("Error fetching client pros:", error);
    return NextResponse.json({ error: "Failed to fetch pros" }, { status: 500 });
  }
}
