import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { generateReportData } from "@/lib/report-generator";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.userType !== "pro") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;

  const schedule = await prisma.scheduledReport.findUnique({
    where: { id },
    include: { pro: { select: { id: true, name: true } } },
  });

  if (!schedule || schedule.proId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Find recipient Telemoz users by email
  const recipientUsers = await prisma.user.findMany({
    where: { email: { in: schedule.recipients } },
    select: { id: true, email: true, name: true },
  });

  if (recipientUsers.length === 0) {
    return NextResponse.json(
      { error: "No Telemoz accounts found for the selected recipients. Make sure clients have signed up." },
      { status: 422 }
    );
  }

  // Generate report data
  const data = await generateReportData(
    schedule.proId,
    schedule.projectId ?? null,
    schedule.cadence
  );

  const now = new Date();
  let delivered = 0;

  for (const recipient of recipientUsers) {
    const snapshot = await prisma.reportSnapshot.create({
      data: {
        scheduledReportId: schedule.id,
        projectId: schedule.projectId ?? null,
        proId: schedule.proId,
        clientId: recipient.id,
        title: schedule.title,
        period: data.period.label,
        cadence: schedule.cadence,
        data: data as object,
      },
    });

    await prisma.notification.create({
      data: {
        userId: recipient.id,
        title: `${schedule.title} — ${data.period.label}`,
        message: `Your ${schedule.cadence} performance report from ${schedule.pro.name} is ready to view.`,
        type: "report",
        link: `/client/reports/snapshots/${snapshot.id}`,
      },
    });

    delivered++;
  }

  // Update lastSentAt
  await prisma.scheduledReport.update({
    where: { id },
    data: { lastSentAt: now },
    select: { id: true },
  });

  return NextResponse.json({ delivered, period: data.period.label });
}
