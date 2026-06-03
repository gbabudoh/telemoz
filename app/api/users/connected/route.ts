import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Returns users the current user has had inquiries with — usable as compose recipients
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const userType = session.user.userType;

  let users: { id: string; name: string; email: string; userType: string }[] = [];

  if (userType === "client") {
    const inquiries = await prisma.inquiry.findMany({
      where: { clientId: userId },
      include: {
        pro: { select: { id: true, name: true, email: true, userType: true } },
      },
    });
    users = inquiries
      .map((i) => i.pro)
      .filter((u): u is NonNullable<typeof u> => !!u);
  } else if (userType === "pro") {
    const inquiries = await prisma.inquiry.findMany({
      where: { proId: userId },
      include: {
        client: { select: { id: true, name: true, email: true, userType: true } },
      },
    });
    users = inquiries.map((i) => i.client);
  }

  // Deduplicate by id
  const seen = new Set<string>();
  const unique = users.filter((u) => {
    if (seen.has(u.id)) return false;
    seen.add(u.id);
    return true;
  });

  return NextResponse.json({ users: unique });
}
