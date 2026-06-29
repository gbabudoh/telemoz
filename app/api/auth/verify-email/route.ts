import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { token, email } = await request.json();

    if (!token || !email) {
      return NextResponse.json(
        { error: "Token and email are required." },
        { status: 400 }
      );
    }

    const db = prisma as any;
    const verificationToken = await db.verificationToken.findFirst({
      where: {
        email: email.toLowerCase(),
        token,
      },
    });

    if (!verificationToken) {
      return NextResponse.json(
        { error: "Invalid verification link." },
        { status: 400 }
      );
    }

    if (new Date() > verificationToken.expiresAt) {
      // Clean up expired token
      await db.verificationToken.delete({
        where: { id: verificationToken.id },
      });
      return NextResponse.json(
        { error: "Verification link has expired. Please register again or request a new link." },
        { status: 400 }
      );
    }

    // Verify user
    await db.user.update({
      where: { email: email.toLowerCase() },
      data: { emailVerified: new Date() },
    });

    // Delete token
    await db.verificationToken.delete({
      where: { id: verificationToken.id },
    });

    return NextResponse.json({
      message: "Email verified successfully! You can now log in.",
    });
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: "Verification failed. Please try again." },
      { status: 500 }
    );
  }
}
