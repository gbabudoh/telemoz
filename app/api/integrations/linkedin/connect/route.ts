import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getLinkedInAuthUrl } from "@/lib/integrations/linkedin";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = getLinkedInAuthUrl();
  return NextResponse.redirect(url);
}
