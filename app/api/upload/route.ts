import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadFile, MINIO_BUCKET } from "@/lib/minio";
import { randomUUID } from "crypto";
import path from "path";

const MAX_SIZE = 50 * 1024 * 1024; // 50 MB

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File exceeds 50 MB limit" }, { status: 413 });
  }

  const ext = path.extname(file.name).toLowerCase();
  const objectName = `uploads/${session.user.id}/${randomUUID()}${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const url = await uploadFile(objectName, buffer, buffer.length, file.type, MINIO_BUCKET);

  return NextResponse.json({ url, objectName, bucket: MINIO_BUCKET });
}
