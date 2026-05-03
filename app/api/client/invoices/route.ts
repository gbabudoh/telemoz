import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.userType !== "client") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const invoices = await prisma.invoice.findMany({
    where: { clientId: session.user.id, status: { not: "draft" } },
    include: { pro: { select: { name: true, email: true } }, project: { select: { title: true } } },
    orderBy: { createdAt: "desc" },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapped = (invoices as any[]).map(inv => ({
    id: inv.id,
    invoiceNumber: inv.invoiceNumber,
    pro: inv.pro.name,
    project: inv.project?.title || "Direct Billing",
    total: inv.total,
    currency: inv.currency,
    status: inv.status,
    dueDate: inv.dueDate.toISOString().split('T')[0],
    createdAt: inv.createdAt.toISOString().split('T')[0],
    isEscrow: inv.isEscrow,
    escrowStatus: inv.escrowStatus,
    milestoneTitle: inv.milestoneTitle,
  }));

  return NextResponse.json({ invoices: mapped });
}
