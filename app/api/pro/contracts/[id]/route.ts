import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const contract = await prisma.contract.findUnique({ where: { id } });
  if (!contract) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const isPro = session.user.id === contract.proId;
  const isClient = session.user.id === contract.clientId;
  if (!isPro && !isClient) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  // Client signs
  if (isClient && !isPro) {
    if (body.action === "sign") {
      const updated = await prisma.$transaction(async (tx) => {
        const updatedContract = await tx.contract.update({
          where: { id },
          data: {
            clientSignedAt: new Date(),
            status: contract.proSignedAt ? "signed" : "sent",
          },
        });

        if (updatedContract.status === "signed" && updatedContract.projectId) {
          await tx.project.update({
            where: { id: updatedContract.projectId },
            data: { status: "active" },
          });
        }
        return updatedContract;
      });
      return NextResponse.json({ contract: updated });
    }
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  // Pro edits / sends / signs
  const { title, content, value, currency, expiresAt, status, action } = body;

  if (action === "sign") {
    const updated = await prisma.$transaction(async (tx) => {
      const updatedContract = await tx.contract.update({
        where: { id },
        data: {
          proSignedAt: new Date(),
          status: contract.clientSignedAt ? "signed" : contract.status,
        },
      });

      if (updatedContract.status === "signed" && updatedContract.projectId) {
        await tx.project.update({
          where: { id: updatedContract.projectId },
          data: { status: "active" },
        });
      }
      return updatedContract;
    });
    return NextResponse.json({ contract: updated });
  }

  const updated = await prisma.contract.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(content !== undefined && { content }),
      ...(value !== undefined && { value: value ? parseFloat(value) : null }),
      ...(currency !== undefined && { currency }),
      ...(expiresAt !== undefined && { expiresAt: expiresAt ? new Date(expiresAt) : null }),
      ...(status !== undefined && { status }),
    },
  });

  return NextResponse.json({ contract: updated });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.userType !== "pro") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const contract = await prisma.contract.findUnique({ where: { id } });
  if (!contract) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (contract.proId !== session.user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.contract.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
