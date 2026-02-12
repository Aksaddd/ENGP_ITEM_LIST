import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true, company: true, phone: true } },
      items: { include: { product: true } },
      auditLogs: {
        include: { user: { select: { name: true, role: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (session.user.role !== "admin" && order.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(order);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } } },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (session.user.role !== "admin" && order.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();

  // Status update (admin only)
  if (body.status && session.user.role === "admin") {
    const oldStatus = order.status;
    const updated = await prisma.order.update({
      where: { id },
      data: { status: body.status },
      include: { items: { include: { product: true } } },
    });

    await prisma.auditLog.create({
      data: {
        orderId: id,
        userId: session.user.id,
        action: "status_changed",
        field: "status",
        oldValue: oldStatus,
        newValue: body.status,
        description: `Order status changed from "${oldStatus}" to "${body.status}"`,
      },
    });

    return NextResponse.json(updated);
  }

  // Item updates (customer - only if pending)
  if (body.items && order.status === "pending") {
    const items = body.items as {
      productId: string;
      quantity: number;
    }[];

    // Restore stock from old items
    for (const oldItem of order.items) {
      await prisma.product.update({
        where: { id: oldItem.productId },
        data: { quantity: { increment: oldItem.quantity } },
      });
    }

    // Validate new items
    const productIds = items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, status: "active" },
    });

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product || product.quantity < item.quantity) {
        // Restore old stock
        for (const oldItem of order.items) {
          await prisma.product.update({
            where: { id: oldItem.productId },
            data: { quantity: { decrement: oldItem.quantity } },
          });
        }
        return NextResponse.json(
          { error: `Insufficient stock for ${product?.name || "product"}` },
          { status: 400 }
        );
      }
    }

    // Build audit log entries
    const auditEntries: {
      orderId: string;
      userId: string;
      action: string;
      field: string;
      oldValue: string;
      newValue: string;
      description: string;
    }[] = [];

    // Detect changes
    for (const newItem of items) {
      const oldItem = order.items.find(
        (oi) => oi.productId === newItem.productId
      );
      const product = products.find((p) => p.id === newItem.productId);

      if (!oldItem) {
        auditEntries.push({
          orderId: id,
          userId: session.user.id,
          action: "item_added",
          field: "items",
          oldValue: "",
          newValue: `${product?.name}: qty ${newItem.quantity}`,
          description: `Added ${product?.name} (qty: ${newItem.quantity})`,
        });
      } else if (oldItem.quantity !== newItem.quantity) {
        auditEntries.push({
          orderId: id,
          userId: session.user.id,
          action: "item_quantity_changed",
          field: `${product?.name} quantity`,
          oldValue: String(oldItem.quantity),
          newValue: String(newItem.quantity),
          description: `Changed ${product?.name} quantity from ${oldItem.quantity} to ${newItem.quantity}`,
        });
      }
    }

    for (const oldItem of order.items) {
      const stillExists = items.find(
        (ni) => ni.productId === oldItem.productId
      );
      if (!stillExists) {
        auditEntries.push({
          orderId: id,
          userId: session.user.id,
          action: "item_removed",
          field: "items",
          oldValue: `${oldItem.product.name}: qty ${oldItem.quantity}`,
          newValue: "",
          description: `Removed ${oldItem.product.name} (was qty: ${oldItem.quantity})`,
        });
      }
    }

    // Delete old items
    await prisma.orderItem.deleteMany({ where: { orderId: id } });

    // Calculate new total
    const newTotal = items.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productId);
      return sum + (product?.price || 0) * item.quantity;
    }, 0);

    if (Math.abs(newTotal - order.totalAmount) > 0.01) {
      auditEntries.push({
        orderId: id,
        userId: session.user.id,
        action: "total_changed",
        field: "totalAmount",
        oldValue: `$${order.totalAmount.toFixed(2)}`,
        newValue: `$${newTotal.toFixed(2)}`,
        description: `Order total changed from $${order.totalAmount.toFixed(2)} to $${newTotal.toFixed(2)}`,
      });
    }

    // Create new items and update order
    const updated = await prisma.order.update({
      where: { id },
      data: {
        totalAmount: newTotal,
        notes: body.notes !== undefined ? body.notes : order.notes,
        items: {
          create: items.map((item) => {
            const product = products.find((p) => p.id === item.productId);
            return {
              productId: item.productId,
              quantity: item.quantity,
              priceAtTime: product?.price || 0,
            };
          }),
        },
      },
      include: {
        items: { include: { product: true } },
      },
    });

    // Deduct stock for new items
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { quantity: { decrement: item.quantity } },
      });
    }

    // Create audit logs
    if (auditEntries.length > 0) {
      await prisma.auditLog.createMany({ data: auditEntries });
    }

    return NextResponse.json(updated);
  }

  // Notes update
  if (body.notes !== undefined && order.status === "pending") {
    if (body.notes !== order.notes) {
      await prisma.auditLog.create({
        data: {
          orderId: id,
          userId: session.user.id,
          action: "notes_updated",
          field: "notes",
          oldValue: order.notes || "",
          newValue: body.notes || "",
          description: `Order notes updated`,
        },
      });
    }

    const updated = await prisma.order.update({
      where: { id },
      data: { notes: body.notes },
      include: { items: { include: { product: true } } },
    });

    return NextResponse.json(updated);
  }

  return NextResponse.json({ error: "No valid update provided" }, { status: 400 });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (session.user.role !== "admin" && order.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (order.status !== "pending") {
    return NextResponse.json(
      { error: "Can only cancel pending orders" },
      { status: 400 }
    );
  }

  // Restore stock
  for (const item of order.items) {
    await prisma.product.update({
      where: { id: item.productId },
      data: { quantity: { increment: item.quantity } },
    });
  }

  await prisma.auditLog.create({
    data: {
      orderId: id,
      userId: session.user.id,
      action: "cancelled",
      description: `Order ${order.orderNumber} cancelled`,
    },
  });

  const updated = await prisma.order.update({
    where: { id },
    data: { status: "cancelled" },
  });

  return NextResponse.json(updated);
}
