import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Find all projects where the current user is either the client or the pro
    const projects = await prisma.project.findMany({
      where: {
        OR: [{ clientId: userId }, { proId: userId }],
        proId: { not: null }, // only include projects with an assigned pro
      },
      select: {
        id: true,
        title: true,
        clientId: true,
        proId: true,
        updatedAt: true,
        client: { select: { id: true, name: true, userType: true } },
        pro: { select: { id: true, name: true, userType: true } },
      },
      orderBy: { updatedAt: "desc" },
    });

    // Build unique conversations keyed by the "other" user's id
    const seen = new Map<string, {
      id: string;
      name: string;
      projectId: string;
      projectTitle: string;
      updatedAt: Date;
    }>();

    for (const p of projects) {
      const other = p.clientId === userId ? p.pro! : p.client;
      if (!seen.has(other.id)) {
        seen.set(other.id, {
          id: other.id,
          name: other.name,
          projectId: p.id,
          projectTitle: p.title,
          updatedAt: p.updatedAt,
        });
      }
    }

    const conversations = Array.from(seen.values()).map((c) => ({
      id: c.id,
      name: c.name,
      projectId: c.projectId,
      lastMessage: c.projectTitle, // use project title as context
      updatedAt: c.updatedAt.toISOString(),
    }));

    return NextResponse.json(conversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 });
  }
}
