import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { presignedPutUrl, publicUrl, MINIO_BUCKET } from "@/lib/minio";
import { randomUUID } from "crypto";
import path from "path";

/**
 * GET /api/upload/presigned?filename=photo.jpg&contentType=image/jpeg
 *
 * Returns a pre-signed PUT URL the browser can upload to directly,
 * plus the final public URL of the object.
 */
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const filename = searchParams.get("filename");
  if (!filename) {
    return NextResponse.json({ error: "filename is required" }, { status: 400 });
  }

  const ext = path.extname(filename).toLowerCase();
  const objectName = `uploads/${session.user.id}/${randomUUID()}${ext}`;

  const uploadUrl = await presignedPutUrl(objectName, 3600, MINIO_BUCKET);
  const fileUrl = publicUrl(objectName, MINIO_BUCKET);

  return NextResponse.json({ uploadUrl, fileUrl, objectName });
}
