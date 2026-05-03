import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.userType !== "client") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const { action } = await req.json();

  if (action === "release") {
    const invoice = await prisma.invoice.update({
      where: { id, clientId: session.user.id },
      data: { 
        escrowStatus: "released",
        status: "paid",
        paidAt: new Date(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any
    });

    return NextResponse.json({ invoice });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
