import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.redirect(`${baseUrl}/login`);
    }

    const { searchParams } = new URL(request.url);
    const selectedRole = searchParams.get("role") || "client";
    const role = (selectedRole === "pro" || selectedRole === "client") ? selectedRole : "client";

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (user) {
      // If the user's role is not set to the selected role (e.g. newly created user defaulted to client)
      if (user.userType !== role && user.userType === "client") {
        await prisma.user.update({
          where: { id: user.id },
          data: { userType: role },
        });
      }

      // If the user is a pro, ensure they have a pro profile
      if (role === "pro") {
        const existingProfile = await prisma.proProfile.findUnique({
          where: { userId: user.id },
        });

        if (!existingProfile) {
          await prisma.proProfile.create({
            data: {
              userId: user.id,
              bio: "I am a digital marketing professional.",
              specialties: [],
              location: user.city || user.country || "United Kingdom",
            },
          });
        }
      }
    }

    // Redirect to respective dashboard
    const redirectPath = role === "pro" ? "/pro" : "/client";
    return NextResponse.redirect(`${baseUrl}${redirectPath}`);
  } catch (error) {
    console.error("Google callback redirect error:", error);
    return NextResponse.redirect(`${baseUrl}/login?error=OAuthCallbackError`);
  }
}
