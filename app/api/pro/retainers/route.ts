import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.userType !== "pro") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const retainers = await prisma.retainerAgreement.findMany({
    where: { proId: session.user.id },
    include: { client: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ retainers });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.userType !== "pro") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { clientId, title, description, monthlyRate, currency, hoursIncluded, billingDay, startDate, endDate } = body;

  if (!clientId || !title || !monthlyRate || !startDate) {
    return NextResponse.json({ error: "clientId, title, monthlyRate, and startDate are required" }, { status: 400 });
  }

  const retainer = await prisma.retainerAgreement.create({
    data: {
      proId: session.user.id,
      clientId,
      title,
      description: description ?? null,
      monthlyRate: parseFloat(monthlyRate),
      currency: currency ?? "GBP",
      hoursIncluded: hoursIncluded ? parseInt(hoursIncluded) : null,
      billingDay: billingDay ? parseInt(billingDay) : 1,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      status: "active",
    },
    include: { client: { select: { id: true, name: true, email: true } } },
  });

  return NextResponse.json({ retainer }, { status: 201 });
}
