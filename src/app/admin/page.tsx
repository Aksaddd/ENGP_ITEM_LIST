import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [productCount, activeProducts, orderCount, pendingOrders, totalRevenue, recentOrders] =
    await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { status: "active" } }),
      prisma.order.count(),
      prisma.order.count({ where: { status: "pending" } }),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { status: { not: "cancelled" } },
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, company: true } },
          _count: { select: { items: true } },
        },
      }),
    ]);

  const stats = [
    {
      label: "Total Products",
      value: productCount,
      sub: `${activeProducts} active`,
      color: "bg-green-50 text-green-700",
    },
    {
      label: "Total Orders",
      value: orderCount,
      sub: `${pendingOrders} pending`,
      color: "bg-blue-50 text-blue-700",
    },
    {
      label: "Revenue",
      value: `$${(totalRevenue._sum.totalAmount || 0).toFixed(2)}`,
      sub: "all time",
      color: "bg-amber-50 text-amber-700",
    },
    {
      label: "Pending Review",
      value: pendingOrders,
      sub: "needs attention",
      color: pendingOrders > 0 ? "bg-red-50 text-red-700" : "bg-gray-50 text-gray-700",
    },
  ];

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Welcome back, Mathew. Here&apos;s your overview.</p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors self-start sm:self-auto whitespace-nowrap"
        >
          + Add Product
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`rounded-xl p-6 ${stat.color}`}
          >
            <div className="text-sm font-medium opacity-80">{stat.label}</div>
            <div className="text-3xl font-bold mt-1">{stat.value}</div>
            <div className="text-sm opacity-60 mt-1">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="text-sm text-green-600 hover:text-green-700 font-medium"
          >
            View All &rarr;
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No orders yet.</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div>
                  <div className="font-medium text-gray-900">{order.orderNumber}</div>
                  <div className="text-sm text-gray-500">
                    {order.user.name}
                    {order.user.company && ` (${order.user.company})`} &middot;{" "}
                    {order._count.items} items
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">
                    ${order.totalAmount.toFixed(2)}
                  </div>
                  <div
                    className={`text-xs font-medium ${
                      order.status === "pending"
                        ? "text-yellow-600"
                        : order.status === "confirmed"
                          ? "text-blue-600"
                          : order.status === "delivered"
                            ? "text-green-600"
                            : "text-gray-500"
                    }`}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
