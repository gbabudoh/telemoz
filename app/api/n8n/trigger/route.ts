import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { triggerWebhook } from "@/lib/n8n";

/**
 * POST /api/n8n/trigger
 * Admin-only endpoint to manually fire an n8n webhook.
 * Body: { webhookPath, payload }
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.userType !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { webhookPath, payload } = await req.json();

  if (!webhookPath) {
    return NextResponse.json({ error: "webhookPath is required" }, { status: 400 });
  }

  await triggerWebhook(webhookPath, payload ?? {});
  return NextResponse.json({ ok: true });
}
