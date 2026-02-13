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
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-[#A8A29E] text-sm">Loading order...</div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-[#78716C]">Order not found.</div>
          <Link href="/orders" className="text-[#064E3B] hover:text-[#059669] mt-2 inline-block text-sm font-medium transition-colors duration-300">
            &larr; Back to orders
          </Link>
        </div>
      </div>
    );
  }

  const isPending = order.status === "pending";

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <Link href="/orders" className="btn-ghost text-sm !px-0 text-[#78716C] hover:text-[#064E3B]">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Back to Orders
        </Link>

        <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">{order.orderNumber}</h1>
            <div className="flex items-center gap-3 mt-2">
              <OrderStatusBadge status={order.status} />
              <span className="text-xs text-[#A8A29E]">
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
              <button onClick={startEditing} className="btn-primary text-sm">
                Edit Order
              </button>
              <button
                onClick={cancelOrder}
                className="btn-secondary text-sm !text-red-500 !border-red-200 hover:!bg-red-50"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-100 text-red-600 px-5 py-3.5 rounded-2xl text-sm font-medium animate-fade-in">
            {error}
          </div>
        )}

        {/* Order Items */}
        <div className="mt-6 card">
          <div className="px-6 py-4 border-b border-[#F5F5F4]">
            <h2 className="font-semibold text-[#1A1A1A] tracking-tight">Order Items</h2>
          </div>
          <div className="divide-y divide-[#F5F5F4]">
            {order.items.map((item) => {
              const editItem = editing
                ? editItems.find((ei) => ei.productId === item.productId)
                : null;

              return (
                <div key={item.id} className="p-5 sm:p-6 flex items-center gap-4 group">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 overflow-hidden transition-transform duration-300 group-hover:scale-105">
                    {item.product.imageUrl ? (
                      <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="fruit-shadow">🍎</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-[#1A1A1A] tracking-tight">{item.product.name}</h3>
                    <div className="text-xs text-[#A8A29E] mt-0.5 flex items-center gap-2">
                      <span>Batch {item.product.batch}</span>
                      <span className="w-1 h-1 rounded-full bg-[#D6D3D1]" />
                      <span>Grade {item.product.batchGrade}</span>
                    </div>
                  </div>

                  {editing && editItem ? (
                    <div className="flex items-center gap-1.5">
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
                        className="w-8 h-8 rounded-full bg-[#F5F5F4] flex items-center justify-center text-[#78716C] hover:bg-[#064E3B]/10 hover:text-[#064E3B] transition-all duration-300 active:scale-90"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                        </svg>
                      </button>
                      <span className="w-8 text-center font-semibold text-[#1A1A1A] text-sm">
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
                        className="w-8 h-8 rounded-full bg-[#F5F5F4] flex items-center justify-center text-[#78716C] hover:bg-[#064E3B]/10 hover:text-[#064E3B] transition-all duration-300 active:scale-90"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <span className="text-sm text-[#78716C]">Qty: {item.quantity}</span>
                  )}

                  <div className="text-right">
                    <div className="font-bold text-[#1A1A1A] tracking-tight">
                      ${(item.priceAtTime * item.quantity).toFixed(2)}
                    </div>
                    <div className="text-[11px] text-[#A8A29E]">
                      ${item.priceAtTime.toFixed(2)} {item.product.unit}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="px-6 py-4 border-t border-[#F5F5F4] flex justify-between items-center">
            <span className="text-xs text-[#A8A29E] uppercase tracking-wider font-medium">Total</span>
            <span className="text-2xl font-bold text-[#1A1A1A] tracking-tight">
              ${order.totalAmount.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Notes */}
        {(order.notes || editing) && (
          <div className="mt-4 card p-6">
            <h2 className="font-semibold text-[#1A1A1A] tracking-tight mb-3">Notes</h2>
            {editing ? (
              <textarea
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-[#FAFAF7] rounded-2xl input-glow text-[#1A1A1A] text-sm placeholder:text-[#A8A29E] resize-none"
              />
            ) : (
              <p className="text-sm text-[#78716C] leading-relaxed">{order.notes || "No notes"}</p>
            )}
          </div>
        )}

        {/* Edit actions */}
        {editing && (
          <div className="mt-4 flex gap-3 justify-end">
            <button
              onClick={() => setEditing(false)}
              className="btn-secondary text-sm"
            >
              Cancel
            </button>
            <button
              onClick={saveChanges}
              disabled={saving}
              className="btn-primary text-sm disabled:opacity-50 disabled:!transform-none"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}

        {/* Audit Log */}
        <div className="mt-6 card">
          <div className="px-6 py-4 border-b border-[#F5F5F4]">
            <h2 className="font-semibold text-[#1A1A1A] tracking-tight">Order History</h2>
          </div>
          <div className="divide-y divide-[#F5F5F4]">
            {order.auditLogs.map((log) => (
              <div key={log.id} className="px-6 py-3.5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-[#1A1A1A]">{log.description}</p>
                    <p className="text-[11px] text-[#A8A29E] mt-0.5">
                      by {log.user.name} ({log.user.role})
                    </p>
                  </div>
                  <span className="text-[11px] text-[#D6D3D1] whitespace-nowrap ml-4">
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
  );
}
