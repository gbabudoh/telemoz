import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createHash } from "crypto";

type UserTypeLocal = "pro" | "client" | "admin";

// Hash password using SHA-256 (for production, use bcryptjs)
function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, userType, country, city, timezone } = body;

    // Validation
    if (!name || !email || !password || !userType) {
      return NextResponse.json(
        { error: "All required fields are missing" },
        { status: 400 }
      );
    }

    // Validate userType
    if (!["pro", "client", "admin"].includes(userType)) {
      return NextResponse.json(
        { error: "Invalid user type. Must be 'pro', 'client', or 'admin'" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Create new user
    const hashedPassword = hashPassword(password);
    const newUser = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        userType: userType as UserTypeLocal,
        country: country || undefined,
        city: city || undefined,
        timezone: timezone || "Europe/London",
        subscriptionTier: "starter",
        subscriptionStatus: "active",
      },
    });

    const userResponse = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      userType: newUser.userType,
      createdAt: newUser.createdAt,
    };

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: userResponse,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Registration error:", error);
    
    // Handle Prisma duplicate key error (P2002)
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}

