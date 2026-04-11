import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.userType !== "pro") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const body = await req.json();

  const retainer = await prisma.retainerAgreement.findUnique({ where: { id } });
  if (!retainer) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (retainer.proId !== session.user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { title, description, monthlyRate, hoursIncluded, status, endDate } = body;

  const updated = await prisma.retainerAgreement.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(monthlyRate !== undefined && { monthlyRate: parseFloat(monthlyRate) }),
      ...(hoursIncluded !== undefined && { hoursIncluded: hoursIncluded ? parseInt(hoursIncluded) : null }),
      ...(status !== undefined && { status }),
      ...(endDate !== undefined && { endDate: endDate ? new Date(endDate) : null }),
    },
    include: { client: { select: { id: true, name: true, email: true } } },
  });

  return NextResponse.json({ retainer: updated });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.userType !== "pro") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const retainer = await prisma.retainerAgreement.findUnique({ where: { id } });
  if (!retainer || retainer.proId !== session.user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.retainerAgreement.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
