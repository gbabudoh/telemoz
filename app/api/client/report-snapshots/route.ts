import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const snapshots = await prisma.reportSnapshot.findMany({
    where: { clientId: session.user.id },
    select: {
      id: true,
      title: true,
      period: true,
      cadence: true,
      viewedAt: true,
      createdAt: true,
      project: { select: { id: true, title: true } },
      pro: { select: { id: true, name: true, image: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ snapshots });
}
