import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const integrations = await prisma.externalIntegration.findMany({
      where: { userId: session.user.id },
      select: {
        provider: true,
        status: true,
        accountName: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(integrations);
  } catch (error) {
    console.error("Failed to fetch integrations:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
