import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const productCount = await prisma.product.count({
    where: { status: "active" },
  });

  const featuredProducts = await prisma.product.findMany({
    where: { status: "active" },
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-emerald-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Fresh Fruit,
              <br />
              <span className="text-green-200">Delivered in Bulk</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-green-100 max-w-2xl">
              Browse our wholesale fruit inventory, place orders online, and get
              premium quality produce delivered to your business.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/catalog"
                className="bg-white text-green-700 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-50 transition-colors"
              >
                Browse Catalog
              </Link>
              <Link
                href="/register"
                className="border-2 border-white text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-white/10 transition-colors"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-green-600">
              {productCount}+
            </div>
            <div className="text-gray-600 mt-1">Products Available</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-green-600">Fresh</div>
            <div className="text-gray-600 mt-1">Daily Inventory Updates</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-green-600">Graded</div>
            <div className="text-gray-600 mt-1">Quality Batch Tracking</div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-700 font-bold text-xl">
              1
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Browse Inventory
            </h3>
            <p className="text-gray-600 mt-2">
              View our current stock with batch info, grades, and pricing. Our
              inventory updates as availability changes.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-700 font-bold text-xl">
              2
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Place Your Order
            </h3>
            <p className="text-gray-600 mt-2">
              Add items to your cart and submit your order. You can modify it
              anytime before it&apos;s confirmed.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-700 font-bold text-xl">
              3
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              We Prepare &amp; Deliver
            </h3>
            <p className="text-gray-600 mt-2">
              We confirm your order, pick the freshest stock from your requested
              batches, and get it ready for you.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Latest Arrivals
            </h2>
            <Link
              href="/catalog"
              className="text-green-600 hover:text-green-700 font-medium"
            >
              View All &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-[4/3] bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center text-5xl">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    "🍎"
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                    <span>Batch {product.batch}</span>
                    <span className="text-gray-300">|</span>
                    <span>Grade {product.batchGrade}</span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xl font-bold text-gray-900">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500">{product.unit}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-white">FreshBatch</span>
            </div>
            <p className="text-sm">
              &copy; 2026 FreshBatch Distribution. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
