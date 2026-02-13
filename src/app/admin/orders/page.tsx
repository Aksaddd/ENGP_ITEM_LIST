import { prisma } from "@/lib/prisma";
import { OrderStatusBadge } from "@/components/order-status-badge";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true, company: true } },
      items: { include: { product: true } },
      _count: { select: { items: true, auditLogs: true } },
    },
  });

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Orders</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">{orders.length} total orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
          <p className="text-gray-600 mt-1">Orders will appear here when customers place them.</p>
        </div>
      ) : (
        {/* Mobile card view */}
        <div className="md:hidden space-y-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/admin/orders/${order.id}`}
              className="block bg-white rounded-xl border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-green-600">{order.orderNumber}</span>
                <OrderStatusBadge status={order.status} />
              </div>
              <div className="text-sm text-gray-900">{order.user.name}</div>
              <div className="text-xs text-gray-500">
                {order.user.company || order.user.email}
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-3 text-sm">
                  <span className="font-medium text-gray-900">${order.totalAmount.toFixed(2)}</span>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-500">{order._count.items} items</span>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Desktop table view */}
        <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-medium text-green-600 hover:text-green-700"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{order.user.name}</div>
                      <div className="text-xs text-gray-500">
                        {order.user.company || order.user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {order._count.items} items
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">
                        ${order.totalAmount.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-green-600 hover:text-green-700 text-sm font-medium"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
