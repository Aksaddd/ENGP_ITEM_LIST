import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { put } from "@vercel/blob";
import { randomUUID } from "crypto";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
];

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);

    if (!isImage && !isVideo) {
      return NextResponse.json(
        { error: "Unsupported file type. Use JPEG, PNG, WebP, GIF, MP4, or WebM." },
        { status: 400 }
      );
    }

    const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;
    if (file.size > maxSize) {
      const limitMB = maxSize / (1024 * 1024);
      return NextResponse.json(
        { error: `File too large. Maximum size is ${limitMB}MB.` },
        { status: 400 }
      );
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || (isImage ? "jpg" : "mp4");
    const subDir = isImage ? "images" : "videos";
    const blobPath = `uploads/${subDir}/${randomUUID()}.${ext}`;

    const blob = await put(blobPath, file, {
      access: "public",
      contentType: file.type,
    });

    return NextResponse.json({ url: blob.url, type: isImage ? "image" : "video" });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
