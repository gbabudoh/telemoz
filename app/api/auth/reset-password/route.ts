import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { token, email, newPassword } = await request.json();

    if (!token || !email || !newPassword) {
      return NextResponse.json(
        { error: "Token, email, and password are required." },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    const db = prisma as any;
    // Find the token
    const resetToken = await db.passwordResetToken.findFirst({
      where: {
        email: email.toLowerCase(),
        token,
      },
    });

    if (!resetToken) {
      return NextResponse.json(
        { error: "Invalid password reset link." },
        { status: 400 }
      );
    }

    if (new Date() > resetToken.expiresAt) {
      // Clean up expired token
      await db.passwordResetToken.delete({
        where: { id: resetToken.id },
      });
      return NextResponse.json(
        { error: "Reset link has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Hash new password and update user
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await db.user.update({
      where: { email: email.toLowerCase() },
      data: { password: hashedPassword },
    });

    // Delete used token
    await db.passwordResetToken.delete({
      where: { id: resetToken.id },
    });

    return NextResponse.json({
      message: "Password reset successfully! You can now log in.",
    });
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "Reset failed. Please try again." },
      { status: 500 }
    );
  }
}
