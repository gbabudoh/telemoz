import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.userType !== "client") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const contracts = await prisma.contract.findMany({
    where: { clientId: session.user.id, status: { not: "draft" } },
    include: { pro: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ contracts });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.userType !== "client") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const { action } = await req.json();

  if (action === "sign") {
    const contract = await prisma.$transaction(async (tx) => {
      const updatedContract = await tx.contract.update({
        where: { id, clientId: session.user.id },
        data: { 
          clientSignedAt: new Date(),
        },
        include: { pro: { select: { name: true, email: true } } },
      });

      if (updatedContract.proSignedAt && updatedContract.clientSignedAt) {
        await tx.contract.update({
          where: { id },
          data: { status: "signed" },
        });
        
        if (updatedContract.projectId) {
          await tx.project.update({
            where: { id: updatedContract.projectId },
            data: { status: "active" },
          });
        }
        return { ...updatedContract, status: "signed" };
      }

      return updatedContract;
    });

    return NextResponse.json({ contract });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
