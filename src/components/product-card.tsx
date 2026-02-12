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

  const gradeColor =
    batchGrade === "A" || batchGrade === "Premium"
      ? "bg-green-100 text-green-800"
      : batchGrade === "B" || batchGrade === "Standard"
        ? "bg-yellow-100 text-yellow-800"
        : "bg-gray-100 text-gray-800";

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-green-50 to-emerald-100">
            🍎
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              Out of Stock
            </span>
          </div>
        )}
        <div className="absolute top-2 right-2 flex gap-1">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${gradeColor}`}>
            Grade {batchGrade}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-gray-900 text-lg leading-tight">
            {name}
          </h3>
        </div>

        {category && (
          <span className="text-xs text-gray-500 uppercase tracking-wide">
            {category}
          </span>
        )}

        {description && (
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {description}
          </p>
        )}

        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-gray-500">
          <span>Batch: {batch}</span>
          {origin && <span>Origin: {origin}</span>}
          <span>{quantity} available</span>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              ${price.toFixed(2)}
            </span>
            <span className="text-sm text-gray-500 ml-1">{unit}</span>
          </div>

          <button
            onClick={handleAdd}
            disabled={isOutOfStock}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isOutOfStock
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : added
                  ? "bg-green-100 text-green-700"
                  : "bg-green-600 text-white hover:bg-green-700 active:scale-95"
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
