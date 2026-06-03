import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

function relativeTime(date: Date): string {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.userType !== "client") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const inquiries = await prisma.inquiry.findMany({
      where: { clientId: session.user.id },
      include: {
        pro: {
          select: {
            id: true,
            name: true,
            city: true,
            country: true,
            proProfile: {
              select: {
                bio: true,
                specialties: true,
                rating: true,
                reviewCount: true,
              }
            }
          }
        },
        project: {
          select: {
            id: true,
            title: true,
            description: true,
            budget: true,
            currency: true,
            category: true,
          },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { text: true, senderId: true, createdAt: true, read: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    const unreadCounts = await Promise.all(
      inquiries.map((i) =>
        prisma.message.count({
          where: { inquiryId: i.id, receiverId: session.user.id, read: false },
        })
      )
    );

    return NextResponse.json({
      inquiries: inquiries.map((i, idx) => ({
        id: i.id,
        proName: i.pro?.name || "Pending Assignment",
        proProfile: i.pro?.proProfile || null,
        project: i.project.title,
        budget: i.project.budget ?? 0,
        status: i.status,
        time: relativeTime(i.updatedAt),
        receivedDate: i.createdAt.toISOString(),
        description: i.project.description,
        requirements: i.project.category ? [i.project.category] : [],
        projectId: i.project.id,
        proId: i.pro?.id,
        message: i.message ?? "",
        lastMessage: i.messages[0] ?? null,
        unreadCount: unreadCounts[idx],
      })),
    });
  } catch (error) {
    console.error("Error fetching client inquiries:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
