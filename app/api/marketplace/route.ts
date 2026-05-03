import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // 1. Fetch Professionals with their profiles
    const pros = await prisma.user.findMany({
      where: {
        userType: "pro",
        proProfile: { isNot: null },
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

    // Transform pros into the format expected by the frontend
    const formattedPros = pros.map((pro) => ({
      id: pro.id,
      name: pro.name,
      title: pro.proProfile?.bio.split(".")[0] || "Digital Marketing Professional",
      location: pro.proProfile?.location || pro.city || pro.country || "Remote",
      country: pro.country,
      city: pro.city,
      timezone: pro.timezone,
      rating: pro.proProfile?.rating || 0,
      reviews: pro.proProfile?.reviewCount || 0,
      specialties: pro.proProfile?.specialties || [],
      price: pro.proProfile?.monthlyRate 
        ? `£${pro.proProfile.monthlyRate}/mo` 
        : (pro.proProfile?.hourlyRate ? `£${pro.proProfile.hourlyRate}/hr` : "Enquire for rates"),
      category: pro.proProfile?.specialties[0]?.toLowerCase() || "other",
      verified: pro.proProfile?.verified || false,
      availability: pro.proProfile?.availability || "available",
      certifications: pro.proProfile?.certifications || [],
    }));

    // 2. Fetch Open Client Requests (Projects without a Pro assigned)
    const requests = await prisma.project.findMany({
      where: {
        proId: null,
        status: { in: ["under_review", "planning"] },
      },
      include: {
        client: {
          select: {
            name: true,
            city: true,
            country: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform requests into the format expected by the frontend
    const formattedRequests = requests.map((req) => ({
      id: req.id,
      client: req.client.name,
      company: req.client.name, // Assuming company is same as name if not separate
      project: req.title,
      budget: req.budget || 0,
      currency: req.currency === "GBP" ? "£" : "$",
      category: req.category?.toLowerCase() || "other",
      location: req.country || req.client.country || "Remote",
      country: req.country || req.client.country,
      city: req.client.city,
      posted: formatRelativeTime(req.createdAt),
      description: req.description,
      requirements: [], // You could add skills mapping here if needed
      status: "open",
    }));

    return NextResponse.json({
      pros: formattedPros,
      requests: formattedRequests,
    });
  } catch (error) {
    console.error("Marketplace API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch marketplace data" },
      { status: 500 }
    );
  }
}

// Helper function to format relative time
function formatRelativeTime(date: Date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 172800) return "yesterday";
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
}
