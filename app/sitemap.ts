import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || "https://telemoz.com";

  // Define static routes
  const staticRoutes = [
    "",
    "/marketplace",
    "/login",
    "/register",
    "/forgot-password",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Fetch all professional users dynamically to generate marketplace listing URLs
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

    const dynamicProRoutes = pros.map((pro) => ({
      url: `${baseUrl}/marketplace/${pro.id}`,
      lastModified: pro.updatedAt || new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

    return [...staticRoutes, ...dynamicProRoutes];
  } catch (error) {
    console.error("Failed to generate dynamic sitemap routes:", error);
    // Return static routes if database query fails during build
    return staticRoutes;
  }
}
