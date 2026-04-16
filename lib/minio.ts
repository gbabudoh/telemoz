import * as Minio from "minio";
import type { Readable } from "stream";

const endpoint = process.env.MINIO_ENDPOINT!;
const port = parseInt(process.env.MINIO_PORT ?? "9000", 10);
const useSSL = process.env.MINIO_USE_SSL === "true";
const accessKey = process.env.MINIO_ACCESS_KEY!;
const secretKey = process.env.MINIO_SECRET_KEY!;

export const MINIO_BUCKET = process.env.MINIO_BUCKET ?? "telemoz";
export const MINIO_PUBLIC_URL = process.env.NEXT_PUBLIC_MINIO_URL ?? `http://${endpoint}:${port}`;

let client: Minio.Client;

function getMinioClient(): Minio.Client {
  if (!client) {
    client = new Minio.Client({
      endPoint: endpoint,
      port,
      useSSL,
      accessKey,
      secretKey,
    });
  }
  return client;
}

export const minio = getMinioClient();

/** Ensure the default bucket exists, creating it if needed. */
export async function ensureBucket(bucket = MINIO_BUCKET): Promise<void> {
  const exists = await minio.bucketExists(bucket);
  if (!exists) {
    await minio.makeBucket(bucket, "us-east-1");
  }
}

/** Upload a Buffer / stream directly from the server. */
export async function uploadFile(
  objectName: string,
  data: Buffer | Readable,
  size: number,
  contentType: string,
  bucket = MINIO_BUCKET
): Promise<string> {
  await ensureBucket(bucket);
  await minio.putObject(bucket, objectName, data, size, {
    "Content-Type": contentType,
  });
  return `${MINIO_PUBLIC_URL}/${bucket}/${objectName}`;
}

/** Generate a pre-signed PUT URL so the browser can upload directly. */
export async function presignedPutUrl(
  objectName: string,
  expirySeconds = 3600,
  bucket = MINIO_BUCKET
): Promise<string> {
  await ensureBucket(bucket);
  return minio.presignedPutObject(bucket, objectName, expirySeconds);
}

/** Generate a pre-signed GET URL for temporary access to private objects. */
export async function presignedGetUrl(
  objectName: string,
  expirySeconds = 3600,
  bucket = MINIO_BUCKET
): Promise<string> {
  return minio.presignedGetObject(bucket, objectName, expirySeconds);
}

/** Delete an object. */
export async function deleteFile(objectName: string, bucket = MINIO_BUCKET): Promise<void> {
  await minio.removeObject(bucket, objectName);
}

/** Build a public URL for an object (only works if bucket policy is public). */
export function publicUrl(objectName: string, bucket = MINIO_BUCKET): string {
  return `${MINIO_PUBLIC_URL}/${bucket}/${objectName}`;
}
