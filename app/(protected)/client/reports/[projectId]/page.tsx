"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Chart } from "@/components/ui/Chart";
import { Download, Calendar } from "lucide-react";
import { use } from "react";

export default function ClientReportPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);

  // Mock report data
  const reportData = [
    { month: "Jan", traffic: 12000, leads: 450, conversions: 120 },
    { month: "Feb", traffic: 15000, leads: 520, conversions: 145 },
    { month: "Mar", traffic: 18000, leads: 600, conversions: 180 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Project Report</h1>
          <p className="text-gray-600">Performance analytics for Project #{projectId}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Select Date Range
          </Button>
          <Button className="bg-[#0a9396] hover:bg-[#087579] text-white">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 mb-2">Total Traffic</p>
            <p className="text-3xl font-bold text-gray-900">45,000</p>
            <p className="text-sm text-emerald-600 mt-2">+25% from last period</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 mb-2">Total Leads</p>
            <p className="text-3xl font-bold text-gray-900">1,570</p>
            <p className="text-sm text-emerald-600 mt-2">+18% from last period</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 mb-2">Conversions</p>
            <p className="text-3xl font-bold text-gray-900">445</p>
            <p className="text-sm text-emerald-600 mt-2">+22% from last period</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <Chart
            data={reportData}
            type="line"
            dataKey="month"
            dataKeys={["traffic", "leads", "conversions"]}
            title="Monthly Performance"
          />
        </CardContent>
      </Card>
    </div>
  );
}

