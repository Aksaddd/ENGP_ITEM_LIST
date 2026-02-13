import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    where: { status: { not: "deleted" } },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { orderItems: true } },
    },
  });

  const active = products.filter((p) => p.status === "active");
  const archived = products.filter((p) => p.status === "archived");

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            {active.length} active, {archived.length} archived
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors self-start sm:self-auto whitespace-nowrap"
        >
          + Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">No products yet</h3>
          <p className="text-gray-600 mt-1 mb-6">
            Start by adding your first product to the inventory.
          </p>
          <Link
            href="/admin/products/new"
            className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Add First Product
          </Link>
        </div>
      ) : (
        {/* Mobile card view */}
        <div className="md:hidden space-y-3">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/admin/products/${product.id}/edit`}
              className="block bg-white rounded-xl border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-green-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${
                        product.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {product.status}
                    </span>
                  </div>
                  {product.category && (
                    <div className="text-xs text-gray-500 mt-0.5">{product.category}</div>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <span className="font-medium text-gray-900">${product.price.toFixed(2)}</span>
                    <span className="text-gray-400">|</span>
                    <span className={`font-medium ${
                      product.quantity > 10 ? "text-green-600" : product.quantity > 0 ? "text-yellow-600" : "text-red-600"
                    }`}>
                      {product.quantity} in stock
                    </span>
                    <span className="text-gray-400">|</span>
                    <span className="text-gray-500">{product._count.orderItems} orders</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {product.batch} &middot; Grade {product.batchGrade}
                  </div>
                </div>
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
                    Product
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Batch / Grade
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orders
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg flex items-center justify-center text-lg flex-shrink-0 overflow-hidden">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-600">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{product.name}</div>
                          {product.category && (
                            <div className="text-xs text-gray-500">{product.category}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{product.batch}</div>
                      <div className="text-xs text-gray-500">Grade {product.batchGrade}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        ${product.price.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500">{product.unit}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-sm font-medium ${
                          product.quantity > 10
                            ? "text-green-600"
                            : product.quantity > 0
                              ? "text-yellow-600"
                              : "text-red-600"
                        }`}
                      >
                        {product.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                          product.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {product._count.orderItems}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="text-green-600 hover:text-green-700 text-sm font-medium"
                      >
                        Edit
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
