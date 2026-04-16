import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, email, country, city, timezone } = body;

    // Validate email format if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: "Invalid email format" },
          { status: 400 }
        );
      }

      // Check if email is already taken by another user
      const existingUser = await prisma.user.findFirst({
        where: {
          email: email.toLowerCase(),
          NOT: { id: session.user.id },
        },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: "Email is already in use by another account" },
          { status: 409 }
        );
      }
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name !== undefined ? name : undefined,
        email: email !== undefined ? email.toLowerCase() : undefined,
        country: country !== undefined ? (country || null) : undefined,
        city: city !== undefined ? (city || null) : undefined,
        timezone: timezone !== undefined ? (timezone || "Europe/London") : undefined,
      },
    });

    // Return updated user data (without password)
    const userResponse = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      country: updatedUser.country,
      city: updatedUser.city,
      timezone: updatedUser.timezone,
      userType: updatedUser.userType,
      updatedAt: updatedUser.updatedAt,
    };

    return NextResponse.json(
      {
        message: "Account information updated successfully",
        user: userResponse,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error updating user:", error);
    
    // Handle Prisma specific errors if needed
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
       return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update account information" },
      { status: 500 }
    );
  }
}


