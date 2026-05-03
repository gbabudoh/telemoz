import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { User } from "@prisma/client";

type ExtendedUser = User & {
  emailNotifications: boolean;
  projectUpdates: boolean;
  newInquiries: boolean;
  paymentReceived: boolean;
  reportReady: boolean;
  proMessages: boolean;
  marketingEmails: boolean;
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { proProfile: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Return user data
    const { 
      emailNotifications, projectUpdates, newInquiries, paymentReceived, 
      reportReady, proMessages, marketingEmails 
    } = user as ExtendedUser;

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      country: user.country || "",
      city: user.city || "",
      timezone: user.timezone || "Europe/London",
      userType: user.userType,
      image: user.image,
      emailNotifications,
      projectUpdates,
      newInquiries,
      paymentReceived,
      reportReady,
      proMessages,
      marketingEmails,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      proProfile: user.proProfile,
    };

    return NextResponse.json({ user: userData }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}

