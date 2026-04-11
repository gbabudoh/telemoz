import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.userType !== "pro") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");
  const retainerId = searchParams.get("retainerId");

  const entries = await prisma.timeEntry.findMany({
    where: {
      proId: session.user.id,
      ...(projectId && { projectId }),
      ...(retainerId && { retainerId }),
    },
    include: {
      project: { select: { id: true, title: true } },
      retainer: { select: { id: true, title: true } },
    },
    orderBy: { date: "desc" },
  });

  return NextResponse.json({ entries });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.userType !== "pro") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { description, hours, date, billable, projectId, retainerId } = body;

  if (!description || !hours || !date) {
    return NextResponse.json({ error: "description, hours, and date are required" }, { status: 400 });
  }

  const entry = await prisma.timeEntry.create({
    data: {
      proId: session.user.id,
      description,
      hours: parseFloat(hours),
      date: new Date(date),
      billable: billable !== false,
      invoiced: false,
      projectId: projectId ?? null,
      retainerId: retainerId ?? null,
    },
    include: {
      project: { select: { id: true, title: true } },
      retainer: { select: { id: true, title: true } },
    },
  });

  return NextResponse.json({ entry }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.userType !== "pro") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const entry = await prisma.timeEntry.findUnique({ where: { id } });
  if (!entry || entry.proId !== session.user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.timeEntry.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
