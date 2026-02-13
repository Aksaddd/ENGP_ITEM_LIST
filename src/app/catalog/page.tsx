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
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A] tracking-tight">
                Product Catalog
              </h1>
              <p className="text-[#78716C] mt-2 text-sm">
                Browse our current inventory &mdash;{" "}
                <span className="text-[#064E3B] font-medium">{products.length} items</span> available
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <form className="flex-1" action="/catalog" method="GET">
            {category && <input type="hidden" name="category" value={category} />}
            <div className="relative group">
              <input
                type="text"
                name="search"
                defaultValue={search || ""}
                placeholder="Search products, batches, origins..."
                className="w-full px-5 py-3 pl-11 bg-white rounded-2xl input-glow text-[#1A1A1A] text-sm placeholder:text-[#A8A29E]"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4.5 h-4.5 text-[#A8A29E] absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 group-focus-within:text-[#059669]"
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
                className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  !category
                    ? "btn-primary !py-2.5"
                    : "bg-white text-[#44403C] border border-[#E7E5E4] hover:border-[#064E3B]/20 hover:text-[#064E3B]"
                }`}
              >
                All
              </a>
              {uniqueCategories.map((cat) => (
                <a
                  key={cat}
                  href={`/catalog?category=${encodeURIComponent(cat)}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
                  className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    category === cat
                      ? "btn-primary !py-2.5"
                      : "bg-white text-[#44403C] border border-[#E7E5E4] hover:border-[#064E3B]/20 hover:text-[#064E3B]"
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
          <div className="text-center py-24">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-14 h-14 mx-auto mb-6 text-[#059669]/30">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <h3 className="text-lg font-semibold text-[#1A1A1A] mt-4">
              No products found
            </h3>
            <p className="text-[#78716C] mt-2 text-sm max-w-sm mx-auto">
              {search
                ? `No results for "${search}". Try a different search term.`
                : "Check back soon — new inventory is added regularly."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger-children">
            {products.map((product) => (
              <div key={product.id} className="animate-fade-in-up">
                <ProductCard
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
