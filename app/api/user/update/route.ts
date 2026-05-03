import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { User, ProProfile } from "@prisma/client";

type ExtendedUser = User & {
  emailNotifications?: boolean;
  projectUpdates?: boolean;
  newInquiries?: boolean;
  paymentReceived?: boolean;
  reportReady?: boolean;
  proMessages?: boolean;
  marketingEmails?: boolean;
  proProfile?: ProProfile | null;
};

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
    const { 
      name, email, country, city, timezone,
      emailNotifications, projectUpdates, newInquiries, paymentReceived, marketingEmails,
      reportReady, proMessages,
      proProfile
    } = body;

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

    // Update user and proProfile if provided
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name !== undefined ? name : undefined,
        email: email !== undefined ? email.toLowerCase() : undefined,
        country: country !== undefined ? (country || null) : undefined,
        city: city !== undefined ? (city || null) : undefined,
        timezone: timezone !== undefined ? (timezone || "Europe/London") : undefined,
        emailNotifications: emailNotifications !== undefined ? emailNotifications : undefined,
        projectUpdates: projectUpdates !== undefined ? projectUpdates : undefined,
        newInquiries: newInquiries !== undefined ? newInquiries : undefined,
        paymentReceived: paymentReceived !== undefined ? paymentReceived : undefined,
        reportReady: reportReady !== undefined ? reportReady : undefined,
        proMessages: proMessages !== undefined ? proMessages : undefined,
        marketingEmails: marketingEmails !== undefined ? marketingEmails : undefined,
        ...(proProfile && {
          proProfile: {
            upsert: {
              create: {
                bio: proProfile.bio || "",
                location: proProfile.location || city || "",
                website: proProfile.website,
                linkedIn: proProfile.linkedIn,
                portfolio: proProfile.portfolio,
                hourlyRate: proProfile.hourlyRate ? parseFloat(proProfile.hourlyRate) : null,
                monthlyRate: proProfile.monthlyRate ? parseFloat(proProfile.monthlyRate) : null,
                availability: proProfile.availability || "available",
              },
              update: {
                bio: proProfile.bio !== undefined ? proProfile.bio : undefined,
                location: proProfile.location !== undefined ? proProfile.location : undefined,
                website: proProfile.website !== undefined ? proProfile.website : undefined,
                linkedIn: proProfile.linkedIn !== undefined ? proProfile.linkedIn : undefined,
                portfolio: proProfile.portfolio !== undefined ? proProfile.portfolio : undefined,
                hourlyRate: proProfile.hourlyRate !== undefined ? (proProfile.hourlyRate ? parseFloat(proProfile.hourlyRate) : null) : undefined,
                monthlyRate: proProfile.monthlyRate !== undefined ? (proProfile.monthlyRate ? parseFloat(proProfile.monthlyRate) : null) : undefined,
                availability: proProfile.availability !== undefined ? proProfile.availability : undefined,
              },
            },
          },
        }),
      },
      include: { proProfile: true },
    });

    // Return updated user data (without password)
    const u = updatedUser as ExtendedUser;
    const userResponse = {
      id: u.id,
      name: u.name,
      email: u.email,
      country: u.country,
      city: u.city,
      timezone: u.timezone,
      userType: u.userType,
      emailNotifications: u.emailNotifications,
      projectUpdates: u.projectUpdates,
      newInquiries: u.newInquiries,
      paymentReceived: u.paymentReceived,
      reportReady: u.reportReady,
      proMessages: u.proMessages,
      marketingEmails: u.marketingEmails,
      updatedAt: u.updatedAt,
      proProfile: u.proProfile,
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


