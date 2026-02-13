import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// Public GET — fetch page content
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const page = await prisma.pageContent.findUnique({
      where: { id: slug },
    });

    if (!page) {
      return NextResponse.json({ id: slug, content: "{}" });
    }

    return NextResponse.json(page);
  } catch {
    return NextResponse.json({ id: slug, content: "{}" });
  }
}

// Admin PATCH — update page content
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;

  try {
    const body = await request.json();
    const contentStr = JSON.stringify(body.content || {});

    const page = await prisma.pageContent.upsert({
      where: { id: slug },
      create: { id: slug, content: contentStr },
      update: { content: contentStr },
    });

    return NextResponse.json(page);
  } catch {
    return NextResponse.json({ error: "Failed to save page content" }, { status: 500 });
  }
}
