import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ proId: string }> }
) {
  try {
    const { proId } = await params;

    // Fetch user and profile separately to isolate any deserialization issues
    const pro = await prisma.user.findUnique({
      where: { id: proId },
      select: {
        id: true,
        name: true,
        email: true,
        userType: true,
        city: true,
        country: true,
        proProfile: {
          select: {
            bio: true,
            specialties: true,
            location: true,
            rating: true,
            reviewCount: true,
            availability: true,
            verified: true,
            hourlyRate: true,
            monthlyRate: true,
          },
        },
      },
    });

    if (!pro || pro.userType !== "pro") {
      return NextResponse.json({ error: "Professional not found" }, { status: 404 });
    }

    // Fetch certifications separately with string-only fields to avoid DateTime deserialization issues
    let certifications: { name: string; issuer: string; issueDate: string; expiryDate?: string; credentialId?: string }[] = [];
    try {
      const raw = await prisma.certification.findMany({
        where: { profile: { userId: proId } },
        select: {
          name: true,
          issuer: true,
          issueDate: true,
          expiryDate: true,
          credentialId: true,
        },
      });
      certifications = raw.map((c) => ({
        name: c.name,
        issuer: c.issuer,
        issueDate: c.issueDate instanceof Date ? c.issueDate.toISOString() : String(c.issueDate),
        expiryDate: c.expiryDate
          ? c.expiryDate instanceof Date
            ? c.expiryDate.toISOString()
            : String(c.expiryDate)
          : undefined,
        credentialId: c.credentialId ?? undefined,
      }));
    } catch {
      // Certifications table may have bad data — return empty rather than failing the whole page
    }

    const profile = pro.proProfile;

    const formattedPro = {
      id: pro.id,
      name: pro.name,
      title: profile?.bio?.split(".")[0] || "Digital Marketing Professional",
      location: profile?.location || pro.city || pro.country || "Remote",
      rating: profile?.rating ?? 0,
      reviews: profile?.reviewCount ?? 0,
      specialties: profile?.specialties ?? [],
      price: profile?.monthlyRate
        ? `£${profile.monthlyRate}/mo`
        : profile?.hourlyRate
        ? `£${profile.hourlyRate}/hr`
        : "Enquire for rates",
      bio: profile?.bio || "This professional has not yet completed their profile.",
      availability: profile?.availability?.toString() ?? "available",
      certifications,
      deliverables: [
        "Digital marketing strategy",
        "Performance reporting",
        "Campaign optimization",
        "Channel management",
      ],
      profileComplete: !!profile,
    };

    return NextResponse.json({ pro: formattedPro });
  } catch (error) {
    console.error("Error fetching pro details:", error);
    return NextResponse.json(
      { error: "Failed to fetch professional details" },
      { status: 500 }
    );
  }
}
