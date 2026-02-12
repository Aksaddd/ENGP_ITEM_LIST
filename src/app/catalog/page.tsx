import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product-card";

export const dynamic = "force-dynamic";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const params = await searchParams;
  const category = params.category;
  const search = params.search;

  const where: Record<string, unknown> = { status: "active" };
  if (category) where.category = category;
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
      { batch: { contains: search } },
      { origin: { contains: search } },
    ];
  }

  const products = await prisma.product.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  const categories = await prisma.product.findMany({
    where: { status: "active", category: { not: null } },
    select: { category: true },
    distinct: ["category"],
  });

  const uniqueCategories = categories
    .map((c) => c.category)
    .filter(Boolean) as string[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Catalog</h1>
          <p className="text-gray-600 mt-1">
            Browse our current inventory &mdash; {products.length} items available
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <form className="flex-1" action="/catalog" method="GET">
          {category && <input type="hidden" name="category" value={category} />}
          <div className="relative">
            <input
              type="text"
              name="search"
              defaultValue={search || ""}
              placeholder="Search products, batches, origins..."
              className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-900"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </div>
        </form>

        {uniqueCategories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <a
              href="/catalog"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                !category
                  ? "bg-green-600 text-white"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              All
            </a>
            {uniqueCategories.map((cat) => (
              <a
                key={cat}
                href={`/catalog?category=${encodeURIComponent(cat)}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  category === cat
                    ? "bg-green-600 text-white"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {cat}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-16">
          <h3 className="text-lg font-medium text-gray-900 mt-4">
            No products found
          </h3>
          <p className="text-gray-600 mt-1">
            {search
              ? `No results for "${search}". Try a different search term.`
              : "Check back soon - new inventory is added regularly."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              description={product.description}
              imageUrl={product.imageUrl}
              batch={product.batch}
              batchGrade={product.batchGrade}
              price={product.price}
              unit={product.unit}
              quantity={product.quantity}
              category={product.category}
              origin={product.origin}
            />
          ))}
        </div>
      )}
    </div>
  );
}
