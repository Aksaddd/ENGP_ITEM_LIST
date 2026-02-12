import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const where =
    session.user.role === "admin" ? {} : { userId: session.user.id };

  const orders = await prisma.order.findMany({
    where,
    include: {
      user: { select: { id: true, name: true, email: true, company: true } },
      items: { include: { product: true } },
      _count: { select: { items: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { items, notes } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Order must contain at least one item" },
        { status: 400 }
      );
    }

    // Validate products and stock
    const productIds = items.map((i: { productId: string }) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, status: "active" },
    });

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: "Some products are no longer available" },
        { status: 400 }
      );
    }

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product || product.quantity < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product?.name || "product"}` },
          { status: 400 }
        );
      }
    }

    // Generate order number
    const orderCount = await prisma.order.count();
    const orderNumber = `ORD-${String(orderCount + 1).padStart(5, "0")}`;

    // Calculate total
    const totalAmount = items.reduce(
      (
        sum: number,
        item: { productId: string; quantity: number; priceAtTime: number }
      ) => {
        const product = products.find((p) => p.id === item.productId);
        return sum + (product?.price || item.priceAtTime) * item.quantity;
      },
      0
    );

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session.user.id,
        totalAmount,
        notes: notes || null,
        items: {
          create: items.map(
            (item: {
              productId: string;
              quantity: number;
              priceAtTime: number;
            }) => {
              const product = products.find((p) => p.id === item.productId);
              return {
                productId: item.productId,
                quantity: item.quantity,
                priceAtTime: product?.price || item.priceAtTime,
              };
            }
          ),
        },
        auditLogs: {
          create: {
            userId: session.user.id,
            action: "created",
            description: `Order ${orderNumber} created with ${items.length} item(s). Total: $${totalAmount.toFixed(2)}`,
          },
        },
      },
      include: {
        items: { include: { product: true } },
      },
    });

    // Decrease stock
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { quantity: { decrement: item.quantity } },
      });
    }

    return NextResponse.json(order);
  } catch {
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
