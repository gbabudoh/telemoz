import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { triggerNotification, upsertSubscriber, type TriggerPayload } from "@/lib/novu";

/**
 * POST /api/notifications/send
 * Body: { workflowId, to, payload? }
 *
 * Admin-only endpoint to fire arbitrary Novu workflow notifications.
 * Individual feature routes should call lib/novu helpers directly.
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.userType !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body: TriggerPayload = await req.json();

  if (!body.workflowId || !body.to) {
    return NextResponse.json({ error: "workflowId and to are required" }, { status: 400 });
  }

  await triggerNotification(body);
  return NextResponse.json({ ok: true });
}

/**
 * PUT /api/notifications/send
 * Body: { subscriberId, email?, firstName?, lastName? }
 *
 * Upsert a subscriber in Novu (call after registration / profile update).
 */
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  await upsertSubscriber(body);
  return NextResponse.json({ ok: true });
}
