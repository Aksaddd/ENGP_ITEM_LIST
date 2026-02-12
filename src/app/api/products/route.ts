import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const products = await prisma.product.findMany({
    where: { status: "active" },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, description, imageUrl, batch, batchGrade, price, unit, quantity, category, origin } = body;

    if (!name || !batch || !batchGrade || price === undefined || quantity === undefined) {
      return NextResponse.json(
        { error: "Name, batch, batch grade, price, and quantity are required" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        description: description || null,
        imageUrl: imageUrl || null,
        batch,
        batchGrade,
        price: parseFloat(price),
        unit: unit || "per case",
        quantity: parseInt(quantity),
        category: category || null,
        origin: origin || null,
      },
    });

    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
