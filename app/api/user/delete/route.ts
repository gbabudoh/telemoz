import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // The Prisma schema is configured with 'onDelete: Cascade' for relations.
    // Deleting the user will automatically clean up:
    // - ProProfile
    // - Projects (where client)
    // - Invoices
    // - Proposals
    // - Contracts
    // - Team memberships, etc.
    
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ 
      message: "Account and all associated data deleted successfully." 
    });
  } catch (error: unknown) {
    console.error("Account deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete account. Please try again later." },
      { status: 500 }
    );
  }
}
