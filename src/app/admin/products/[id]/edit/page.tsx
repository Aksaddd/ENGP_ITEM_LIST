"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FileUpload } from "@/components/file-upload";

interface Product {
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
  status: string;
}

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const fetchProduct = useCallback(async () => {
    try {
      const res = await fetch(`/api/products/${id}`);
      if (res.ok) {
        const data = await res.json();
        setProduct(data);
        setImageUrl(data.imageUrl || "");
      }
    } catch {
      // ignore
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      imageUrl,
      batch: formData.get("batch") as string,
      batchGrade: formData.get("batchGrade") as string,
      price: parseFloat(formData.get("price") as string),
      unit: formData.get("unit") as string,
      quantity: parseInt(formData.get("quantity") as string),
      category: formData.get("category") as string,
      origin: formData.get("origin") as string,
      status: formData.get("status") as string,
    };

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json();
        setError(body.error || "Failed to update product");
        setSaving(false);
        return;
      }

      router.push("/admin/products");
    } catch {
      setError("Something went wrong");
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this product? This cannot be undone.")) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/admin/products");
      }
    } catch {
      setError("Failed to delete product");
    }
  }

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="text-gray-500">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-6 lg:p-8">
        <div className="text-gray-500">Product not found.</div>
        <Link href="/admin/products" className="text-green-600 hover:text-green-700 mt-2 inline-block">
          &larr; Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <Link href="/admin/products" className="text-green-600 hover:text-green-700 text-sm font-medium">
        &larr; Back to Products
      </Link>

      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-4 mb-6 sm:mb-8">Edit Product</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Basic Information</h2>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
            <input id="name" name="name" type="text" required defaultValue={product.name}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-900" />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea id="description" name="description" rows={3} defaultValue={product.description || ""}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-900" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
            <FileUpload
              accept="image"
              currentUrl={imageUrl || null}
              onUpload={(url) => setImageUrl(url)}
              onRemove={() => setImageUrl("")}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input id="category" name="category" type="text" defaultValue={product.category || ""}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-900" />
            </div>
            <div>
              <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-1">Origin</label>
              <input id="origin" name="origin" type="text" defaultValue={product.origin || ""}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-900" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Batch &amp; Pricing</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="batch" className="block text-sm font-medium text-gray-700 mb-1">Batch Number *</label>
              <input id="batch" name="batch" type="text" required defaultValue={product.batch}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-900" />
            </div>
            <div>
              <label htmlFor="batchGrade" className="block text-sm font-medium text-gray-700 mb-1">Batch Grade *</label>
              <select id="batchGrade" name="batchGrade" required defaultValue={product.batchGrade}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-900">
                <option value="A">A - Premium</option>
                <option value="B">B - Standard</option>
                <option value="C">C - Economy</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
              <input id="price" name="price" type="number" step="0.01" min="0" required defaultValue={product.price}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-900" />
            </div>
            <div>
              <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">Unit *</label>
              <select id="unit" name="unit" required defaultValue={product.unit}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-900">
                <option value="per case">Per Case</option>
                <option value="per lb">Per LB</option>
                <option value="per box">Per Box</option>
                <option value="per unit">Per Unit</option>
              </select>
            </div>
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Stock Qty *</label>
              <input id="quantity" name="quantity" type="number" min="0" required defaultValue={product.quantity}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-900" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Status</h2>
          <select id="status" name="status" defaultValue={product.status}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-900">
            <option value="active">Active - visible in catalog</option>
            <option value="archived">Archived - hidden from catalog</option>
          </select>
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">
          <button
            type="button"
            onClick={handleDelete}
            className="text-red-600 hover:text-red-700 text-sm font-medium text-center sm:text-left"
          >
            Delete Product
          </button>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/admin/products"
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-center">
              Cancel
            </Link>
            <button type="submit" disabled={saving}
              className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50">
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
