import { NextRequest, NextResponse } from "next/server";
import { runFullSync } from "@/lib/sync-engine";

export async function GET(req: NextRequest) {
  // Simple security check for cron jobs (e.g. CRON_SECRET)
  const authHeader = req.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const results = await runFullSync();
    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error("Cron Sync Failed:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
