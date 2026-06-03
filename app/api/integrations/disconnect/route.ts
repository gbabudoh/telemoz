import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const provider = searchParams.get("provider");

  if (!provider) {
    return NextResponse.json({ error: "Provider required" }, { status: 400 });
  }

  try {
    const integration = await prisma.externalIntegration.findFirst({
      where: { userId: session.user.id, provider: provider as never },
    });

    if (!integration) {
      return NextResponse.json({ error: "Integration not found" }, { status: 404 });
    }

    // Delete credentials first (cascade should handle it, but explicit is safer)
    await prisma.integrationCredential.deleteMany({
      where: { integrationId: integration.id },
    });

    await prisma.externalIntegration.delete({
      where: { id: integration.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to disconnect integration:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
