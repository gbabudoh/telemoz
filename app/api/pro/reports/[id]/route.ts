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

  const report = await prisma.scheduledReport.findUnique({ where: { id } });
  if (!report || report.proId !== session.user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { active, cadence, recipients, title } = body;

  const updated = await prisma.scheduledReport.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(active !== undefined && { active }),
      ...(cadence !== undefined && { cadence }),
      ...(recipients !== undefined && { recipients }),
    },
    include: { project: { select: { id: true, title: true } } },
  });

  return NextResponse.json({ report: updated });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.userType !== "pro") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const report = await prisma.scheduledReport.findUnique({ where: { id } });
  if (!report || report.proId !== session.user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.scheduledReport.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
