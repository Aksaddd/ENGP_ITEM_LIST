"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { OrderStatusBadge } from "@/components/order-status-badge";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  batch: string;
  batchGrade: string;
  imageUrl?: string | null;
  price: number;
  unit: string;
  quantity: number;
}

interface OrderItem {
  id: string;
  productId: string;
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
  updatedAt: string;
  items: OrderItem[];
  auditLogs: AuditEntry[];
  user: { name: string; email: string };
}

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editItems, setEditItems] = useState<{ productId: string; quantity: number }[]>([]);
  const [editNotes, setEditNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchOrder = useCallback(async () => {
    try {
      const res = await fetch(`/api/orders/${id}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
      }
    } catch {
      // ignore
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  function startEditing() {
    if (!order) return;
    setEditItems(order.items.map((i) => ({ productId: i.productId, quantity: i.quantity })));
    setEditNotes(order.notes || "");
    setEditing(true);
    setError("");
  }

  async function saveChanges() {
    if (!order) return;
    setSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: editItems, notes: editNotes }),
      });

      if (!res.ok) {
        const body = await res.json();
        setError(body.error || "Failed to update order");
        setSaving(false);
        return;
      }

      setEditing(false);
      setSaving(false);
      fetchOrder();
    } catch {
      setError("Something went wrong");
      setSaving(false);
    }
  }

  async function cancelOrder() {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    try {
      const res = await fetch(`/api/orders/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/orders");
      }
    } catch {
      // ignore
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-gray-500">Loading order...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-gray-500">Order not found.</div>
        <Link href="/orders" className="text-green-600 hover:text-green-700 mt-2 inline-block">
          &larr; Back to orders
        </Link>
      </div>
    );
  }

  const isPending = order.status === "pending";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/orders" className="text-green-600 hover:text-green-700 text-sm font-medium">
        &larr; Back to Orders
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{order.orderNumber}</h1>
          <div className="flex items-center gap-3 mt-2">
            <OrderStatusBadge status={order.status} />
            <span className="text-sm text-gray-500">
              Placed{" "}
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

        {isPending && !editing && (
          <div className="flex gap-2">
            <button
              onClick={startEditing}
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
            >
              Edit Order
            </button>
            <button
              onClick={cancelOrder}
              className="px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Order Items */}
      <div className="mt-6 bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Order Items</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {order.items.map((item) => {
            const editItem = editing
              ? editItems.find((ei) => ei.productId === item.productId)
              : null;

            return (
              <div key={item.id} className="p-4 sm:p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg flex items-center justify-center text-xl flex-shrink-0 overflow-hidden">
                  {item.product.imageUrl ? (
                    <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                  ) : (
                    "🍎"
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                  <div className="text-sm text-gray-500">
                    Batch {item.product.batch} &middot; Grade {item.product.batchGrade}
                  </div>
                </div>

                {editing && editItem ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setEditItems((prev) =>
                          prev
                            .map((ei) =>
                              ei.productId === item.productId
                                ? { ...ei, quantity: Math.max(0, ei.quantity - 1) }
                                : ei
                            )
                            .filter((ei) => ei.quantity > 0)
                        )
                      }
                      className="w-7 h-7 rounded border border-gray-300 flex items-center justify-center text-sm"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-medium text-gray-900">
                      {editItem.quantity}
                    </span>
                    <button
                      onClick={() =>
                        setEditItems((prev) =>
                          prev.map((ei) =>
                            ei.productId === item.productId
                              ? { ...ei, quantity: ei.quantity + 1 }
                              : ei
                          )
                        )
                      }
                      className="w-7 h-7 rounded border border-gray-300 flex items-center justify-center text-sm"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                )}

                <div className="text-right">
                  <div className="font-medium text-gray-900">
                    ${(item.priceAtTime * item.quantity).toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500">
                    ${item.priceAtTime.toFixed(2)} {item.product.unit}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
          <span className="font-medium text-gray-900">Total</span>
          <span className="text-2xl font-bold text-gray-900">
            ${order.totalAmount.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Notes */}
      {(order.notes || editing) && (
        <div className="mt-4 bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-2">Notes</h2>
          {editing ? (
            <textarea
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-900"
            />
          ) : (
            <p className="text-gray-600">{order.notes || "No notes"}</p>
          )}
        </div>
      )}

      {/* Edit actions */}
      {editing && (
        <div className="mt-4 flex gap-3 justify-end">
          <button
            onClick={() => setEditing(false)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={saveChanges}
            disabled={saving}
            className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}

      {/* Audit Log */}
      <div className="mt-6 bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Order History</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {order.auditLogs.map((log) => (
            <div key={log.id} className="px-6 py-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-900">{log.description}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    by {log.user.name} ({log.user.role})
                  </p>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
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
  );
}
