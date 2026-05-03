import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.userType !== "client") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const { status } = await req.json();

  if (!["accepted", "rejected"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const proposal = await prisma.proposal.update({
    where: { id, clientId: session.user.id },
    data: { 
      status,
      acceptedAt: status === "accepted" ? new Date() : null,
      rejectedAt: status === "rejected" ? new Date() : null,
    },
    include: { pro: { select: { name: true, email: true } } },
  });

  return NextResponse.json({ proposal });
}
