import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import { sendEmail, passwordResetEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    const db = prisma as any;
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (user) {
      const token = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Save token to DB
      await db.passwordResetToken.create({
        data: {
          email: user.email,
          token,
          expiresAt,
        },
      });

      // Send email
      const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
      const resetUrl = `${baseUrl}/reset-password?token=${token}&email=${encodeURIComponent(user.email)}`;
      const emailOpts = passwordResetEmail(user.name, resetUrl);

      await sendEmail({
        to: user.email,
        subject: emailOpts.subject,
        html: emailOpts.html,
      });
    }

    // Always return success to protect user privacy
    return NextResponse.json({
      message: "If an account with that email exists, we have sent a password reset link.",
    });
  } catch (error) {
    console.error("Forgot password API error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
