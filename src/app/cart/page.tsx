"use client";

import { useCart } from "@/components/cart-provider";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, totalAmount } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleCheckout() {
    if (!session) {
      router.push("/login?callbackUrl=/cart");
      return;
    }

    if (items.length === 0) return;

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            priceAtTime: item.price,
          })),
          notes: notes || undefined,
        }),
      });

      if (!res.ok) {
        const body = await res.json();
        setError(body.error || "Failed to place order");
        setSubmitting(false);
        return;
      }

      const order = await res.json();
      clearCart();
      router.push(`/orders/${order.id}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart</h1>
        <p className="text-gray-600 mb-8">Your cart is empty.</p>
        <Link
          href="/catalog"
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          Browse Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-200">
          {items.map((item) => (
            <div key={item.productId} className="p-4 sm:p-6 flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  "🍎"
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                <div className="text-sm text-gray-500">
                  Batch {item.batch} &middot; Grade {item.batchGrade}
                </div>
                <div className="text-sm text-gray-500">
                  ${item.price.toFixed(2)} {item.unit}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                >
                  -
                </button>
                <span className="w-10 text-center font-medium text-gray-900">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  disabled={item.quantity >= item.maxQuantity}
                  className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                >
                  +
                </button>
              </div>

              <div className="text-right">
                <div className="font-semibold text-gray-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
                <button
                  onClick={() => removeItem(item.productId)}
                  className="text-sm text-red-500 hover:text-red-700 mt-1"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 bg-white rounded-xl border border-gray-200 p-6">
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Order Notes (optional)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-900"
            placeholder="Any special requests or notes for this order..."
          />
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
          <div>
            <div className="text-sm text-gray-500">Order Total</div>
            <div className="text-3xl font-bold text-gray-900">
              ${totalAmount.toFixed(2)}
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={submitting}
            className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Placing Order..." : session ? "Place Order" : "Sign In to Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
