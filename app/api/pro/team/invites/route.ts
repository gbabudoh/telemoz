import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// DELETE /api/pro/team/invites?id=xxx  — revoke a pending invite
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.userType !== "pro") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const invite = await prisma.teamInvite.findUnique({ where: { id } });
  if (!invite || invite.agencyId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (invite.status !== "pending") {
    return NextResponse.json({ error: "Invite is not pending" }, { status: 400 });
  }

  await prisma.teamInvite.update({ where: { id }, data: { status: "revoked" } });
  return NextResponse.json({ success: true });
}
