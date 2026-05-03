import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { rateLimit } from "@/lib/rate-limit";
import { upsertSubscriber } from "@/lib/novu";

type UserTypeLocal = "pro" | "client" | "admin";

export async function POST(request: NextRequest) {
  // Rate limiting (5 attempts per 15 minutes)
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0] : "anonymous";
  const limitResult = await rateLimit(`register_${ip}`, {
    limit: 5,
    windowMs: 15 * 60 * 1000,
  });

  if (!limitResult.success) {
    return NextResponse.json(
      { error: "Too many registration attempts. Please try again later." },
      { 
        status: 429,
        headers: {
          "X-RateLimit-Limit": limitResult.limit.toString(),
          "X-RateLimit-Remaining": limitResult.remaining.toString(),
          "X-RateLimit-Reset": limitResult.reset.toString(),
        }
      }
    );
  }

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
    const hashedPassword = await bcrypt.hash(password, 12);
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

    // Register user in Novu for notifications
    try {
      await upsertSubscriber({
        subscriberId: newUser.id,
        email: newUser.email,
        firstName: newUser.name.split(" ")[0],
        lastName: newUser.name.split(" ").slice(1).join(" "),
      });
    } catch (novuError) {
      console.error("Failed to register Novu subscriber:", novuError);
      // We don't fail the whole registration if Novu fails
    }

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

