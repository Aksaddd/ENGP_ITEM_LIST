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
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center py-16">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 mx-auto mb-6 text-[#059669]/30 animate-float">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
          <h1 className="text-3xl font-bold text-[#1A1A1A] tracking-tight mb-3">
            Your Cart
          </h1>
          <p className="text-[#78716C] mb-8">Your cart is empty.</p>
          <Link href="/catalog" className="btn-primary text-base !px-8 !py-3">
            Browse Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-[#1A1A1A] tracking-tight mb-8">
          Your Cart
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-5 py-3.5 rounded-2xl mb-6 text-sm font-medium animate-fade-in">
            {error}
          </div>
        )}

        {/* Cart Items */}
        <div className="card mb-6">
          <div className="divide-y divide-[#F5F5F4]">
            {items.map((item) => (
              <div key={item.productId} className="p-5 sm:p-6 flex items-center gap-4 group">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden transition-transform duration-300 group-hover:scale-105">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[#059669]/40">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V15m0 0l-2.25 1.313" />
                    </svg>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[#1A1A1A] tracking-tight">{item.name}</h3>
                  <div className="text-xs text-[#A8A29E] mt-0.5 flex items-center gap-2">
                    <span>Batch {item.batch}</span>
                    <span className="w-1 h-1 rounded-full bg-[#D6D3D1]" />
                    <span>Grade {item.batchGrade}</span>
                  </div>
                  <div className="text-sm text-[#78716C] mt-0.5">
                    ${item.price.toFixed(2)} {item.unit}
                  </div>
                </div>

                {/* Quantity controls */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="w-8 h-8 rounded-full bg-[#F5F5F4] flex items-center justify-center text-[#78716C] hover:bg-[#064E3B]/10 hover:text-[#064E3B] transition-all duration-300 active:scale-90"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                    </svg>
                  </button>
                  <span className="w-10 text-center font-semibold text-[#1A1A1A] text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    disabled={item.quantity >= item.maxQuantity}
                    className="w-8 h-8 rounded-full bg-[#F5F5F4] flex items-center justify-center text-[#78716C] hover:bg-[#064E3B]/10 hover:text-[#064E3B] transition-all duration-300 active:scale-90 disabled:opacity-40"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </button>
                </div>

                <div className="text-right min-w-[80px]">
                  <div className="font-bold text-[#1A1A1A] tracking-tight">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-xs text-[#A8A29E] hover:text-red-500 mt-1 transition-colors duration-300"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order summary */}
        <div className="card p-6">
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-[#44403C] mb-2">
              Order Notes
              <span className="text-[#A8A29E] font-normal ml-1">(optional)</span>
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-[#FAFAF7] rounded-2xl input-glow text-[#1A1A1A] text-sm placeholder:text-[#A8A29E] resize-none"
              placeholder="Any special requests or notes for this order..."
            />
          </div>

          <div className="divider-gradient my-6" />

          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-[#A8A29E] uppercase tracking-wider font-medium mb-1">
                Order Total
              </div>
              <div className="text-3xl font-bold text-[#1A1A1A] tracking-tight">
                ${totalAmount.toFixed(2)}
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={submitting}
              className="btn-primary text-base !px-8 !py-3.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:!transform-none"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Placing Order...
                </>
              ) : session ? (
                "Place Order"
              ) : (
                "Sign In to Order"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
