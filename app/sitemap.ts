import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || "https://telemoz.com";

  // Define static routes including marketing subpages
  const staticRoutes = [
    "",
    "/marketplace",
    "/login",
    "/register",
    "/forgot-password",
    "/about",
    "/acceptable-use",
    "/benefits",
    "/blog",
    "/cookie-policy",
    "/documentation",
    "/how-it-works",
    "/pricing",
    "/privacy",
    "/refund-policy",
    "/support",
    "/terms",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : (route === "/marketplace" ? 0.9 : 0.7),
  }));

  // Fetch all professional users and project briefs dynamically
  try {
    const pros = await prisma.user.findMany({
      where: {
        userType: "pro",
      },
      select: {
        id: true,
        updatedAt: true,
      },
    });

    const briefs = await prisma.projectBrief.findMany({
      select: {
        id: true,
        updatedAt: true,
      },
    });

    const dynamicProRoutes = pros.map((pro) => ({
      url: `${baseUrl}/marketplace/${pro.id}`,
      lastModified: pro.updatedAt || new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

    const dynamicBriefRoutes = briefs.map((brief) => ({
      url: `${baseUrl}/marketplace/requests/${brief.id}`,
      lastModified: brief.updatedAt || new Date(),
      changeFrequency: "daily" as const,
      priority: 0.6,
    }));

    return [...staticRoutes, ...dynamicProRoutes, ...dynamicBriefRoutes];
  } catch (error) {
    console.error("Failed to generate dynamic sitemap routes:", error);
    // Return static routes if database query fails during build
    return staticRoutes;
  }
}
