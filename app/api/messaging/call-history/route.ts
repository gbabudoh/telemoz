import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const inquiryId = searchParams.get("inquiryId");

  if (!inquiryId) {
    return NextResponse.json({ error: "Missing inquiryId" }, { status: 400 });
  }

  const calls = await prisma.callRequest.findMany({
    where: {
      inquiryId,
      status: { in: ["accepted", "declined", "missed", "ended"] },
    },
    select: {
      id: true,
      callType: true,
      status: true,
      fromId: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ calls });
}
