import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const snapshot = await prisma.reportSnapshot.findUnique({
    where: { id },
    include: {
      project: { select: { id: true, title: true, status: true } },
      pro: { select: { id: true, name: true, image: true } },
    },
  });

  if (!snapshot || snapshot.clientId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Mark as viewed on first open
  if (!snapshot.viewedAt) {
    await prisma.reportSnapshot.update({
      where: { id },
      data: { viewedAt: new Date() },
      select: { id: true },
    });
  }

  return NextResponse.json({ snapshot });
}
