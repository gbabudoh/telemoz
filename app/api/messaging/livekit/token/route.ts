import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateLiveKitToken } from "@/lib/livekit";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const room = searchParams.get("room");
  const username = session.user.name || "User";

  if (!room) {
    return NextResponse.json({ error: "Missing room name" }, { status: 400 });
  }

  try {
    const token = await generateLiveKitToken(room, username, session.user.id);
    return NextResponse.json({ token });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("LiveKit Token Error:", errorMessage);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
