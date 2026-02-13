import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const DEFAULT_ID = "default";

// Public GET — anyone can read the hero video URL
export async function GET() {
  try {
    let settings = await prisma.siteSettings.findUnique({
      where: { id: DEFAULT_ID },
    });

    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: { id: DEFAULT_ID, heroVideo: "" },
      });
    }

    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

// Admin-only PATCH — update settings
export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const updateData: Record<string, unknown> = {};

    if (body.heroVideo !== undefined) {
      updateData.heroVideo = body.heroVideo;
    }

    const settings = await prisma.siteSettings.upsert({
      where: { id: DEFAULT_ID },
      create: { id: DEFAULT_ID, heroVideo: (updateData.heroVideo as string) || "" },
      update: updateData,
    });

    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
