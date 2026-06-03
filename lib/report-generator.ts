import prisma from "@/lib/prisma";

export interface ReportData {
  period: { start: string; end: string; label: string };
  project: {
    id: string;
    title: string;
    status: string;
    budget: number | null;
    currency: string;
  } | null;
  revenue: {
    total: number;
    paid: number;
    pending: number;
    invoiceCount: number;
    currency: string;
  };
  milestones: Array<{
    title: string;
    status: string;
    dueDate: string;
    completedAt: string | null;
  }>;
  campaigns: Array<{
    name: string;
    platform: string;
    impressions: number;
    clicks: number;
    spend: number;
    conversions: number;
  }>;
  timeTracked: {
    totalHours: number;
    billableHours: number;
  };
  generatedAt: string;
}

function getPeriodDates(cadence: string): { start: Date; end: Date; label: string } {
  const now = new Date();
  if (cadence === "weekly") {
    const end = new Date(now);
    const start = new Date(now);
    start.setDate(now.getDate() - 7);
    const label = `Week of ${start.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`;
    return { start, end, label };
  }
  // monthly — previous calendar month
  const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
  const label = start.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  return { start, end, label };
}

export async function generateReportData(
  proId: string,
  projectId: string | null,
  cadence: string
): Promise<ReportData> {
  const { start, end, label } = getPeriodDates(cadence);

  // Project info
  const project = projectId
    ? await prisma.project.findUnique({
        where: { id: projectId },
        select: { id: true, title: true, status: true, budget: true, currency: true },
      })
    : null;

  // Revenue — invoices in period
  const invoiceWhere = {
    proId,
    ...(projectId ? { projectId } : {}),
    createdAt: { gte: start, lte: end },
  };

  const invoices = await prisma.invoice.findMany({
    where: invoiceWhere,
    select: { total: true, status: true, currency: true },
  });

  const currency = invoices[0]?.currency ?? project?.currency ?? "GBP";
  const paid = invoices.filter(i => i.status === "paid").reduce((s, i) => s + i.total, 0);
  const pending = invoices.filter(i => i.status !== "paid" && i.status !== "cancelled").reduce((s, i) => s + i.total, 0);

  // Milestones
  const milestones = projectId
    ? await prisma.milestone.findMany({
        where: { projectId, dueDate: { gte: start, lte: end } },
        select: { title: true, status: true, dueDate: true, completedAt: true },
        orderBy: { dueDate: "asc" },
      })
    : [];

  // Campaigns
  const campaigns = await prisma.campaign.findMany({
    where: {
      proId,
      ...(projectId ? { projectId } : {}),
      startDate: { lte: end },
      OR: [{ endDate: null }, { endDate: { gte: start } }],
    },
    select: { name: true, platform: true, impressions: true, clicks: true, spend: true, conversions: true },
    take: 10,
  });

  // Time tracked
  const timeEntries = await prisma.timeEntry.findMany({
    where: {
      proId,
      ...(projectId ? { projectId } : {}),
      date: { gte: start, lte: end },
    },
    select: { hours: true, billable: true },
  });

  const totalHours = timeEntries.reduce((s, t) => s + t.hours, 0);
  const billableHours = timeEntries.filter(t => t.billable).reduce((s, t) => s + t.hours, 0);

  return {
    period: { start: start.toISOString(), end: end.toISOString(), label },
    project: project
      ? { id: project.id, title: project.title, status: project.status, budget: project.budget, currency: project.currency }
      : null,
    revenue: { total: paid + pending, paid, pending, invoiceCount: invoices.length, currency },
    milestones: milestones.map(m => ({
      title: m.title,
      status: m.status,
      dueDate: m.dueDate.toISOString(),
      completedAt: m.completedAt?.toISOString() ?? null,
    })),
    campaigns: campaigns.map(c => ({
      name: c.name,
      platform: c.platform,
      impressions: c.impressions,
      clicks: c.clicks,
      spend: c.spend,
      conversions: c.conversions,
    })),
    timeTracked: { totalHours, billableHours },
    generatedAt: new Date().toISOString(),
  };
}

export function computeNextSendAt(cadence: string): Date {
  const now = new Date();
  if (cadence === "weekly") {
    // Next Monday
    const next = new Date(now);
    const day = now.getDay(); // 0=Sun
    const daysUntilMonday = day === 1 ? 7 : (8 - day) % 7;
    next.setDate(now.getDate() + daysUntilMonday);
    next.setHours(8, 0, 0, 0);
    return next;
  }
  // Monthly — 1st of next month at 08:00
  const next = new Date(now.getFullYear(), now.getMonth() + 1, 1, 8, 0, 0, 0);
  return next;
}
