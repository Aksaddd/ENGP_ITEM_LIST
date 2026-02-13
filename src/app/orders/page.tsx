"use client";

import { useEffect, useState } from "react";
import { OrderStatusBadge } from "@/components/order-status-badge";
import Link from "next/link";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  _count: { items: number };
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-[#1A1A1A] tracking-tight mb-8">My Orders</h1>
          <div className="text-[#A8A29E] text-sm">Loading orders...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-[#1A1A1A] tracking-tight mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-20 card">
            <span className="text-5xl block mb-4 fruit-shadow">📦</span>
            <h3 className="text-lg font-semibold text-[#1A1A1A]">No orders yet</h3>
            <p className="text-[#78716C] mt-1.5 mb-8 text-sm">
              Browse our catalog and place your first order.
            </p>
            <Link href="/catalog" className="btn-primary">
              Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="space-y-3 stagger-children">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="block card p-5 sm:p-6 group animate-fade-in-up"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-[#1A1A1A] tracking-tight">
                        {order.orderNumber}
                      </h3>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <div className="text-xs text-[#A8A29E] mt-1.5 flex items-center gap-2">
                      <span>{order._count.items} item(s)</span>
                      <span className="w-1 h-1 rounded-full bg-[#D6D3D1]" />
                      <span>
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <div className="text-xl font-bold text-[#1A1A1A] tracking-tight">
                        ${order.totalAmount.toFixed(2)}
                      </div>
                      {order.status === "pending" && (
                        <div className="text-[10px] text-[#059669] font-semibold uppercase tracking-wider mt-0.5">
                          Editable
                        </div>
                      )}
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-[#D6D3D1] transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#064E3B]">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
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
