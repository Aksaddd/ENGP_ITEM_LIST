"use client";

import { useCart } from "./cart-provider";
import { useState } from "react";

interface ProductCardProps {
  id: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  batch: string;
  batchGrade: string;
  price: number;
  unit: string;
  quantity: number;
  category?: string | null;
  origin?: string | null;
}

export function ProductCard({
  id,
  name,
  description,
  imageUrl,
  batch,
  batchGrade,
  price,
  unit,
  quantity,
  category,
  origin,
}: ProductCardProps) {
  const { addItem, items } = useCart();
  const [added, setAdded] = useState(false);

  const inCart = items.find((i) => i.productId === id);
  const isOutOfStock = quantity <= 0;

  function handleAdd() {
    if (isOutOfStock) return;
    addItem({
      productId: id,
      name,
      batch,
      batchGrade,
      price,
      unit,
      imageUrl,
      maxQuantity: quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  const gradeConfig =
    batchGrade === "A" || batchGrade === "Premium"
      ? { cls: "badge-fresh", label: "Premium" }
      : batchGrade === "B" || batchGrade === "Standard"
        ? { cls: "badge-gold", label: "Standard" }
        : { cls: "bg-[#F5F5F4] text-[#78716C] px-3 py-0.5 rounded-full text-xs font-semibold", label: batchGrade };

  return (
    <div className="card card-glow group">
      {/* Image */}
      <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover img-zoom"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-14 h-14 text-[#059669]/25 transition-all duration-500 group-hover:scale-110 group-hover:text-[#059669]/40">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V15m0 0l-2.25 1.313M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-18 0l9 5.25 9-5.25M3 16.5l9-5.25m9 5.25l-9-5.25" />
            </svg>
          </div>
        )}

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <span className="bg-white/90 text-[#1A1A1A] px-4 py-1.5 rounded-full text-sm font-medium">
              Out of Stock
            </span>
          </div>
        )}

        {/* Grade badge */}
        <div className="absolute top-3 right-3">
          <span className={gradeConfig.cls}>
            Grade {gradeConfig.label === "Premium" || gradeConfig.label === "Standard" ? batchGrade : batchGrade}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-[#1A1A1A] text-[1.05rem] leading-tight tracking-tight">
            {name}
          </h3>
        </div>

        {category && (
          <span className="text-[11px] text-[#A8A29E] uppercase tracking-wider font-medium">
            {category}
          </span>
        )}

        {description && (
          <p className="text-sm text-[#78716C] mt-1.5 line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}

        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3 text-[11px] text-[#A8A29E]">
          <span className="flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-[#D6D3D1]" />
            Batch {batch}
          </span>
          {origin && (
            <span className="flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-[#D6D3D1]" />
              {origin}
            </span>
          )}
          <span className="flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-[#D6D3D1]" />
            {quantity} available
          </span>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#F5F5F4]">
          <div>
            <span className="text-2xl font-bold text-[#1A1A1A] tracking-tight">
              ${price.toFixed(2)}
            </span>
            <span className="text-sm text-[#A8A29E] ml-1">{unit}</span>
          </div>

          <button
            onClick={handleAdd}
            disabled={isOutOfStock}
            className={`rounded-full text-sm font-medium transition-all duration-300 ${
              isOutOfStock
                ? "bg-[#F5F5F4] text-[#A8A29E] cursor-not-allowed px-5 py-2"
                : added
                  ? "bg-emerald-50 text-emerald-700 px-5 py-2 scale-105"
                  : inCart
                    ? "btn-secondary !py-2 !px-4 text-xs"
                    : "btn-primary !py-2 !px-5"
            }`}
          >
            {isOutOfStock
              ? "Unavailable"
              : added
                ? "Added!"
                : inCart
                  ? `In Cart (${inCart.quantity})`
                  : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
