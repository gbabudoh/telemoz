import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateReportData, computeNextSendAt } from "@/lib/report-generator";

// Secured by CRON_SECRET — Vercel passes this automatically via Authorization header
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();

  // Find all active scheduled reports due today or overdue
  const due = await prisma.scheduledReport.findMany({
    where: {
      active: true,
      nextSendAt: { lte: now },
    },
    include: {
      project: { select: { id: true, title: true } },
      pro: { select: { id: true, name: true } },
    },
  });

  let delivered = 0;
  let errors = 0;

  for (const schedule of due) {
    try {
      // Generate the report data
      const data = await generateReportData(
        schedule.proId,
        schedule.projectId ?? null,
        schedule.cadence
      );

      // Find recipient users by email (only Telemoz users)
      const recipientUsers = await prisma.user.findMany({
        where: { email: { in: schedule.recipients } },
        select: { id: true, email: true, name: true },
      });

      if (recipientUsers.length === 0) {
        console.warn(`No Telemoz users found for schedule ${schedule.id}`);
      }

      // Create a ReportSnapshot + Notification for each recipient
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

        // In-app notification
        await prisma.notification.create({
          data: {
            userId: recipient.id,
            title: `${schedule.title} — ${data.period.label}`,
            message: `Your ${schedule.cadence} performance report from ${schedule.pro.name} is ready to view.`,
            type: "report",
            link: `/client/reports/${snapshot.id}`,
          },
        });

        delivered++;
      }

      // Update schedule timestamps
      await prisma.scheduledReport.update({
        where: { id: schedule.id },
        data: {
          lastSentAt: now,
          nextSendAt: computeNextSendAt(schedule.cadence),
        },
      });
    } catch (err) {
      console.error(`Failed to deliver schedule ${schedule.id}:`, err);
      errors++;
    }
  }

  return NextResponse.json({
    processed: due.length,
    delivered,
    errors,
    timestamp: now.toISOString(),
  });
}
