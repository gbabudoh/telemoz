import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.userType !== "pro") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const assets = await prisma.brandAsset.findMany({
    where: { proId: session.user.id },
    include: { project: { select: { id: true, title: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ assets });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.userType !== "pro") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { name, type, fileUrl, mimeType, sizeBytes, notes, projectId, clientName } = body;

  if (!name || !fileUrl) {
    return NextResponse.json({ error: "name and fileUrl are required" }, { status: 400 });
  }

  const asset = await prisma.brandAsset.create({
    data: {
      proId: session.user.id,
      name, type: type ?? "other",
      fileUrl, mimeType: mimeType ?? null,
      sizeBytes: sizeBytes ? parseInt(sizeBytes) : null,
      notes: notes ?? null,
      projectId: projectId ?? null,
      clientName: clientName ?? null,
    },
    include: { project: { select: { id: true, title: true } } },
  });

  return NextResponse.json({ asset }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.userType !== "pro") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const asset = await prisma.brandAsset.findUnique({ where: { id } });
  if (!asset || asset.proId !== session.user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.brandAsset.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
