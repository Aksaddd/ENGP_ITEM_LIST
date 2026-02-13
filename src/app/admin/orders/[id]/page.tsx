"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { OrderStatusBadge } from "@/components/order-status-badge";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  batch: string;
  batchGrade: string;
  imageUrl?: string | null;
  unit: string;
}

interface OrderItem {
  id: string;
  quantity: number;
  priceAtTime: number;
  product: Product;
}

interface AuditEntry {
  id: string;
  action: string;
  field?: string | null;
  oldValue?: string | null;
  newValue?: string | null;
  description: string;
  createdAt: string;
  user: { name: string; role: string };
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  notes?: string | null;
  createdAt: string;
  items: OrderItem[];
  auditLogs: AuditEntry[];
  user: { name: string; email: string; company?: string | null; phone?: string | null };
}

const STATUS_FLOW = ["pending", "confirmed", "picking", "shipped", "delivered"];

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchOrder = useCallback(async () => {
    try {
      const res = await fetch(`/api/orders/${id}`);
      if (res.ok) setOrder(await res.json());
    } catch {
      // ignore
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  async function updateStatus(newStatus: string) {
    setUpdating(true);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) fetchOrder();
    } catch {
      // ignore
    }
    setUpdating(false);
  }

  if (loading) {
    return <div className="p-6 lg:p-8 text-gray-500">Loading order...</div>;
  }

  if (!order) {
    return (
      <div className="p-6 lg:p-8">
        <div className="text-gray-500">Order not found.</div>
        <Link href="/admin/orders" className="text-green-600 hover:text-green-700 mt-2 inline-block">
          &larr; Back to Orders
        </Link>
      </div>
    );
  }

  const currentIndex = STATUS_FLOW.indexOf(order.status);
  const nextStatus = currentIndex >= 0 && currentIndex < STATUS_FLOW.length - 1
    ? STATUS_FLOW[currentIndex + 1]
    : null;

  return (
    <div className="p-6 lg:p-8">
      <Link href="/admin/orders" className="text-green-600 hover:text-green-700 text-sm font-medium">
        &larr; Back to Orders
      </Link>

      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{order.orderNumber}</h1>
          <div className="flex items-center gap-3 mt-2">
            <OrderStatusBadge status={order.status} />
            <span className="text-sm text-gray-500">
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          {nextStatus && (
            <button
              onClick={() => updateStatus(nextStatus)}
              disabled={updating}
              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {updating ? "Updating..." : `Mark as ${nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1)}`}
            </button>
          )}
          {order.status === "pending" && (
            <button
              onClick={() => updateStatus("cancelled")}
              disabled={updating}
              className="border border-red-300 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>

      {/* Status Progress */}
      {order.status !== "cancelled" && (
        <div className="mt-6 bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
          <div className="overflow-x-auto">
            <div className="flex items-center justify-between min-w-[400px]">
              {STATUS_FLOW.map((status, i) => {
                const isDone = currentIndex >= i;
                const isCurrent = currentIndex === i;
                return (
                  <div key={status} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium ${
                          isDone
                            ? "bg-green-600 text-white"
                            : "bg-gray-200 text-gray-500"
                        } ${isCurrent ? "ring-2 ring-green-300" : ""}`}
                      >
                        {isDone ? "✓" : i + 1}
                      </div>
                      <span className={`text-[10px] sm:text-xs mt-1 capitalize ${isDone ? "text-green-600 font-medium" : "text-gray-400"}`}>
                        {status}
                      </span>
                    </div>
                    {i < STATUS_FLOW.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-1 sm:mx-2 ${currentIndex > i ? "bg-green-600" : "bg-gray-200"}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Order Items</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {order.items.map((item) => (
                <div key={item.id} className="px-4 sm:px-6 py-4 flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {item.product.imageUrl ? (
                      <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">{item.product.name}</div>
                    <div className="text-xs text-gray-500">
                      Batch {item.product.batch} &middot; Grade {item.product.batchGrade}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 flex-shrink-0">x{item.quantity}</div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-medium text-gray-900 text-sm sm:text-base">${(item.priceAtTime * item.quantity).toFixed(2)}</div>
                    <div className="text-xs text-gray-500">${item.priceAtTime.toFixed(2)} {item.product.unit}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 sm:px-6 py-4 border-t border-gray-200 flex justify-between items-center">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="text-xl sm:text-2xl font-bold text-gray-900">${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 mb-2">Customer Notes</h2>
              <p className="text-gray-600">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-3">Customer</h2>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-500">Name:</span>{" "}
                <span className="text-gray-900">{order.user.name}</span>
              </div>
              <div>
                <span className="text-gray-500">Email:</span>{" "}
                <span className="text-gray-900">{order.user.email}</span>
              </div>
              {order.user.company && (
                <div>
                  <span className="text-gray-500">Company:</span>{" "}
                  <span className="text-gray-900">{order.user.company}</span>
                </div>
              )}
              {order.user.phone && (
                <div>
                  <span className="text-gray-500">Phone:</span>{" "}
                  <span className="text-gray-900">{order.user.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Audit Log */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Audit Log</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {order.auditLogs.length} entries
              </p>
            </div>
            <div className="divide-y divide-gray-50 max-h-96 overflow-y-auto">
              {order.auditLogs.map((log) => (
                <div key={log.id} className="px-6 py-3">
                  <p className="text-sm text-gray-900">{log.description}</p>
                  {log.oldValue && log.newValue && (
                    <div className="mt-1 text-xs">
                      <span className="text-red-500 line-through">{log.oldValue}</span>
                      {" → "}
                      <span className="text-green-600">{log.newValue}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-400">
                      {log.user.name} ({log.user.role})
                    </span>
                    <span className="text-xs text-gray-300">&middot;</span>
                    <span className="text-xs text-gray-400">
                      {new Date(log.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
