import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function relativeTime(date: Date): string {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 172800) return "yesterday";
  return `${Math.floor(diff / 86400)} days ago`;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  const { requestId } = await params;

  const project = await prisma.project.findUnique({
    where: { id: requestId },
    include: {
      client: { select: { id: true, name: true, city: true, country: true } },
    },
  });

  if (!project || project.proId !== null) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: project.id,
    client: project.client.name,
    company: project.client.name,
    clientId: project.client.id,
    project: project.title,
    budget: project.budget ?? 0,
    currency: project.currency === "GBP" ? "£" : "$",
    category: project.category ?? "General",
    location: project.country ?? project.client.country ?? "Remote",
    country: project.country ?? project.client.country ?? null,
    city: project.client.city,
    posted: relativeTime(project.createdAt),
    description: project.description,
    timeline: project.timeline ?? "To be discussed",
    requirements: project.category ? [project.category] : [],
    deliverables: [],
    status: "open",
  });
}
