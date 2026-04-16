"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Chart } from "@/components/ui/Chart";
import {
  Download,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  FileText,
  Info,
  X,
  Activity,
  BarChart3,
  ArrowUpRight,
  Zap,
  Minus,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { formatCurrency } from "@/lib/utils";

// ── Data ──────────────────────────────────────────────────────────────────────

const ALL_MONTHS = [
  { month: "Jan", users: 42,  projects: 12, revenue: 4200,  commission: 546  },
  { month: "Feb", users: 58,  projects: 18, revenue: 6100,  commission: 793  },
  { month: "Mar", users: 71,  projects: 24, revenue: 7800,  commission: 1014 },
  { month: "Apr", users: 85,  projects: 29, revenue: 9400,  commission: 1222 },
  { month: "May", users: 94,  projects: 33, revenue: 10200, commission: 1326 },
  { month: "Jun", users: 108, projects: 38, revenue: 11800, commission: 1534 },
  { month: "Jul", users: 115, projects: 41, revenue: 12100, commission: 1573 },
  { month: "Aug", users: 98,  projects: 35, revenue: 10900, commission: 1417 },
  { month: "Sep", users: 110, projects: 40, revenue: 11500, commission: 1495 },
  { month: "Oct", users: 120, projects: 45, revenue: 12500, commission: 1625 },
  { month: "Nov", users: 180, projects: 62, revenue: 18500, commission: 2405 },
  { month: "Dec", users: 250, projects: 89, revenue: 24500, commission: 3185 },
];

const RANGE_OPTIONS = [
  { label: "3 months",  value: "3months",  slice: 3  },
  { label: "6 months",  value: "6months",  slice: 6  },
  { label: "12 months", value: "12months", slice: 12 },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function pct(current: number, previous: number): string | null {
  if (!previous) return null;
  return (((current - previous) / previous) * 100).toFixed(1);
}

function MoMArrow({ current, previous }: { current: number; previous: number | null }) {
  if (previous === null) return <span className="text-gray-300 text-xs">—</span>;
  const delta = current - previous;
  const p = pct(current, previous);
  if (delta === 0) return <span className="text-gray-400 text-xs flex items-center gap-0.5"><Minus className="h-3 w-3" />0%</span>;
  const up = delta > 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${up ? "text-emerald-600" : "text-red-500"}`}>
      {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {up ? "+" : ""}{p}%
    </span>
  );
}

function TrendBadge({ pctStr }: { pctStr: string | null }) {
  if (!pctStr) return <span className="text-xs text-gray-400">vs prev period</span>;
  const up = parseFloat(pctStr) >= 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${up ? "text-emerald-600" : "text-red-500"}`}>
      {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {up ? "+" : ""}{pctStr}% vs prev
    </span>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdminReportsPage() {
  const [dateRange, setDateRange]       = useState("3months");
  const [infoDismissed, setInfoDismissed] = useState(false);

  const selected = RANGE_OPTIONS.find((o) => o.value === dateRange) ?? RANGE_OPTIONS[0];
  const slice    = selected.slice;

  const chartData = useMemo(() => ALL_MONTHS.slice(-slice), [slice]);
  const prevData  = useMemo(() => ALL_MONTHS.slice(-slice * 2, -slice), [slice]);

  const periodLabel = useMemo(() => {
    if (!chartData.length) return "";
    const first = chartData[0].month;
    const last  = chartData[chartData.length - 1].month;
    return first === last ? first : `${first} – ${last}`;
  }, [chartData]);

  // Aggregates
  const totals = useMemo(() => ({
    latestUsers: chartData[chartData.length - 1]?.users ?? 0,
    projects:    chartData.reduce((s, d) => s + d.projects, 0),
    revenue:     chartData.reduce((s, d) => s + d.revenue, 0),
    commission:  chartData.reduce((s, d) => s + d.commission, 0),
  }), [chartData]);

  const prevTotals = useMemo(() => ({
    latestUsers: prevData[prevData.length - 1]?.users ?? 0,
    projects:    prevData.reduce((s, d) => s + d.projects, 0),
    revenue:     prevData.reduce((s, d) => s + d.revenue, 0),
  }), [prevData]);

  const bestMonth = useMemo(
    () => chartData.reduce((b, d) => (d.revenue > b.revenue ? d : b), chartData[0]),
    [chartData]
  );

  const commissionRate = totals.revenue > 0
    ? ((totals.commission / totals.revenue) * 100).toFixed(1)
    : "0";

  const revenuePerProject = totals.projects > 0
    ? Math.round(totals.revenue / totals.projects)
    : 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Platform Reports
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Analytics and reporting across all platform activity
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {/* Date range selector */}
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {RANGE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setDateRange(opt.value)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  dateRange === opt.value
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm">
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Export
          </Button>
        </div>
      </motion.div>

      {/* Period label */}
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
          <Activity className="h-3 w-3" />
          Showing: {periodLabel}
        </span>
      </div>

      {/* Sample data notice */}
      {!infoDismissed && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
          <Info className="h-4 w-4 shrink-0" />
          <span className="flex-1">
            Charts use sample data for illustration. Connect your analytics API to display live figures.
          </span>
          <button
            onClick={() => setInfoDismissed(true)}
            className="text-blue-400 hover:text-blue-700 transition-colors ml-1"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label:   "Total Users",
            value:   totals.latestUsers.toLocaleString(),
            trend:   pct(totals.latestUsers, prevTotals.latestUsers),
            sub:     "Registered on platform",
            icon:    Users,
            iconBg:  "bg-[#0a9396]/10",
            iconColor: "text-[#0a9396]",
            accent:  "border-l-[#0a9396]",
          },
          {
            label:   "Projects",
            value:   totals.projects.toLocaleString(),
            trend:   pct(totals.projects, prevTotals.projects),
            sub:     `${slice}-month total`,
            icon:    FileText,
            iconBg:  "bg-indigo-100",
            iconColor: "text-indigo-600",
            accent:  "border-l-indigo-500",
          },
          {
            label:   "Revenue",
            value:   formatCurrency(totals.revenue),
            trend:   pct(totals.revenue, prevTotals.revenue),
            sub:     `${slice}-month total`,
            icon:    DollarSign,
            iconBg:  "bg-emerald-100",
            iconColor: "text-emerald-600",
            accent:  "border-l-emerald-500",
          },
          {
            label:   "Commission",
            value:   formatCurrency(totals.commission),
            trend:   null,
            sub:     `${commissionRate}% avg rate`,
            icon:    TrendingUp,
            iconBg:  "bg-amber-100",
            iconColor: "text-amber-600",
            accent:  "border-l-amber-500",
          },
        ].map((m, i) => {
          const Icon = m.icon;
          return (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <Card className={`border-l-4 ${m.accent} hover:shadow-md transition-shadow`}>
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                        {m.label}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 tabular-nums">
                        {m.value}
                      </p>
                      <div className="mt-1.5">
                        <TrendBadge pctStr={m.trend} />
                        {m.trend && (
                          <p className="text-xs text-gray-400 mt-0.5">{m.sub}</p>
                        )}
                        {!m.trend && (
                          <p className="text-xs text-gray-400">{m.sub}</p>
                        )}
                      </div>
                    </div>
                    <div className={`rounded-xl ${m.iconBg} p-2.5`}>
                      <Icon className={`h-5 w-5 ${m.iconColor}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Insights */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.32 }}
        className="grid grid-cols-1 sm:grid-cols-4 gap-4"
      >
        {[
          {
            label: "Best Month",
            value: bestMonth?.month ?? "—",
            sub:   `${formatCurrency(bestMonth?.revenue ?? 0)} revenue`,
            icon:  ArrowUpRight,
            iconBg: "bg-emerald-100",
            iconColor: "text-emerald-600",
            accent: "border-l-emerald-500",
          },
          {
            label: "Avg Revenue / Mo",
            value: formatCurrency(Math.round(totals.revenue / slice)),
            sub:   `Over ${slice} months`,
            icon:  Zap,
            iconBg: "bg-[#0a9396]/10",
            iconColor: "text-[#0a9396]",
            accent: "border-l-[#0a9396]",
          },
          {
            label: "Avg Projects / Mo",
            value: Math.round(totals.projects / slice).toString(),
            sub:   `Over ${slice} months`,
            icon:  Activity,
            iconBg: "bg-amber-100",
            iconColor: "text-amber-600",
            accent: "border-l-amber-500",
          },
          {
            label: "Revenue / Project",
            value: formatCurrency(revenuePerProject),
            sub:   "Avg project value",
            icon:  BarChart3,
            iconBg: "bg-indigo-100",
            iconColor: "text-indigo-600",
            accent: "border-l-indigo-500",
          },
        ].map((ins) => {
          const Icon = ins.icon;
          return (
            <Card key={ins.label} className={`border-l-4 ${ins.accent} hover:shadow-sm transition-shadow`}>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start gap-3">
                  <div className={`rounded-xl ${ins.iconBg} p-2.5 shrink-0`}>
                    <Icon className={`h-4 w-4 ${ins.iconColor}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      {ins.label}
                    </p>
                    <p className="text-lg font-bold text-gray-900 tabular-nums truncate">
                      {ins.value}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{ins.sub}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-start gap-2">
              <div className="rounded-lg bg-[#0a9396]/10 p-1.5 mt-0.5 shrink-0">
                <Activity className="h-4 w-4 text-[#0a9396]" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold text-gray-900">
                  Platform Growth
                </CardTitle>
                <p className="text-xs text-gray-400 mt-0.5">
                  Users, projects & revenue — {periodLabel}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Chart
              data={chartData}
              type="line"
              dataKey="month"
              dataKeys={["users", "projects", "revenue"]}
              title="Monthly Growth Trends"
              colors={["#0a9396", "#10b981", "#6366f1"]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-start gap-2">
              <div className="rounded-lg bg-emerald-100 p-1.5 mt-0.5 shrink-0">
                <BarChart3 className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold text-gray-900">
                  Revenue vs Commission
                </CardTitle>
                <p className="text-xs text-gray-400 mt-0.5">
                  Gross revenue vs platform earnings — {periodLabel}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Chart
              data={chartData}
              type="bar"
              dataKey="month"
              dataKeys={["revenue", "commission"]}
              title="Revenue vs Commission"
              colors={["#10b981", "#0a9396"]}
            />
          </CardContent>
        </Card>
      </div>

      {/* Monthly Breakdown Table */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2">
              <div className="rounded-lg bg-gray-100 p-1.5 mt-0.5 shrink-0">
                <FileText className="h-4 w-4 text-gray-500" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold text-gray-900">
                  Monthly Breakdown
                </CardTitle>
                <p className="text-xs text-gray-400 mt-0.5">
                  Exact figures with month-over-month change — {periodLabel}
                </p>
              </div>
            </div>
            <span className="text-xs text-gray-400 shrink-0 mt-1">
              ★ = best month
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  {[
                    { label: "Month",       align: "left"  },
                    { label: "Users",       align: "right" },
                    { label: "Projects",    align: "right" },
                    { label: "Revenue",     align: "right" },
                    { label: "MoM Δ",       align: "right" },
                    { label: "Commission",  align: "right" },
                    { label: "Rate",        align: "right" },
                  ].map((h) => (
                    <th
                      key={h.label}
                      className={`py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wide text-${h.align}`}
                    >
                      {h.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {chartData.map((row, i) => {
                  const prev        = i > 0 ? chartData[i - 1] : null;
                  const rate        = row.revenue > 0
                    ? ((row.commission / row.revenue) * 100).toFixed(1)
                    : "0";
                  const isBest      = row.month === bestMonth?.month;
                  const isLatest    = i === chartData.length - 1;

                  return (
                    <tr
                      key={row.month}
                      className={`transition-colors ${
                        isBest
                          ? "bg-emerald-50/60 hover:bg-emerald-50"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      {/* Month */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-900">
                            {row.month}
                          </span>
                          {isBest && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                              ★ Best
                            </span>
                          )}
                          {isLatest && !isBest && (
                            <span className="text-[10px] font-semibold text-[#0a9396] bg-[#0a9396]/10 px-1.5 py-0.5 rounded-full">
                              Latest
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Users */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex flex-col items-end">
                          <span className="text-sm text-gray-700 tabular-nums">
                            {row.users.toLocaleString()}
                          </span>
                          {prev && (
                            <MoMArrow current={row.users} previous={prev.users} />
                          )}
                        </div>
                      </td>

                      {/* Projects */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex flex-col items-end">
                          <span className="text-sm text-gray-700 tabular-nums">
                            {row.projects}
                          </span>
                          {prev && (
                            <MoMArrow current={row.projects} previous={prev.projects} />
                          )}
                        </div>
                      </td>

                      {/* Revenue */}
                      <td className="py-3.5 px-5 text-right">
                        <span className={`text-sm font-semibold tabular-nums ${isBest ? "text-emerald-700" : "text-gray-900"}`}>
                          {formatCurrency(row.revenue)}
                        </span>
                      </td>

                      {/* MoM Revenue Δ */}
                      <td className="py-3.5 px-5 text-right">
                        <MoMArrow
                          current={row.revenue}
                          previous={prev ? prev.revenue : null}
                        />
                      </td>

                      {/* Commission */}
                      <td className="py-3.5 px-5 text-right">
                        <span className="text-sm font-semibold text-[#0a9396] tabular-nums">
                          {formatCurrency(row.commission)}
                        </span>
                      </td>

                      {/* Rate */}
                      <td className="py-3.5 px-5 text-right">
                        <span className="text-sm text-gray-500 tabular-nums">
                          {rate}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>

              {/* Totals footer */}
              <tfoot>
                <tr className="border-t-2 border-gray-200 bg-gray-50">
                  <td className="py-3.5 px-5 text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Period total
                  </td>
                  <td className="py-3.5 px-5 text-right text-xs text-gray-400">
                    Latest: <span className="font-bold text-gray-700">{totals.latestUsers.toLocaleString()}</span>
                  </td>
                  <td className="py-3.5 px-5 text-right text-sm font-bold text-gray-900 tabular-nums">
                    {totals.projects}
                  </td>
                  <td className="py-3.5 px-5 text-right text-sm font-bold text-gray-900 tabular-nums">
                    {formatCurrency(totals.revenue)}
                  </td>
                  <td className="py-3.5 px-5" />
                  <td className="py-3.5 px-5 text-right text-sm font-bold text-[#0a9396] tabular-nums">
                    {formatCurrency(totals.commission)}
                  </td>
                  <td className="py-3.5 px-5 text-right text-sm font-semibold text-gray-500 tabular-nums">
                    {commissionRate}%
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
