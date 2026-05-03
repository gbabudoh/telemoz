import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ proId: string }> }
) {
  try {
    const { proId } = await params;

    const pro = await prisma.user.findUnique({
      where: {
        id: proId,
        userType: "pro",
      },
      include: {
        proProfile: {
          include: {
            skills: true,
            certifications: true,
          },
        },
      },
    });

    if (!pro || !pro.proProfile) {
      return NextResponse.json({ error: "Professional not found" }, { status: 404 });
    }

    // Format data to match frontend expectation
    const formattedPro = {
      id: pro.id,
      name: pro.name,
      title: pro.proProfile.bio.split(".")[0] || "Digital Marketing Professional",
      location: pro.proProfile.location || pro.city || pro.country || "Remote",
      rating: pro.proProfile.rating || 0,
      reviews: pro.proProfile.reviewCount || 0,
      specialties: pro.proProfile.specialties || [],
      price: pro.proProfile.monthlyRate 
        ? `£${pro.proProfile.monthlyRate}/mo` 
        : (pro.proProfile.hourlyRate ? `£${pro.proProfile.hourlyRate}/hr` : "Enquire for rates"),
      bio: pro.proProfile.bio,
      availability: pro.proProfile.availability || "available",
      certifications: pro.proProfile.certifications.map(c => ({
        name: c.name,
        issuer: c.issuer,
        issueDate: c.issueDate,
        expiryDate: c.expiryDate,
        credentialId: c.credentialId,
      })),
      deliverables: [
        "Digital marketing strategy",
        "Performance reporting",
        "Campaign optimization",
        "Channel management"
      ],
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
