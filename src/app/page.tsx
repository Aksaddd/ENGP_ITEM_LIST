import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { HeroVideo } from "@/components/hero-video";

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

  // Fetch hero video URL from site settings
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "default" },
  });
  const heroVideoUrl = settings?.heroVideo || "";

  return (
    <div className="overflow-hidden">
      {/* ===== Hero Section ===== */}
      <section className={`relative min-h-[92vh] flex items-center overflow-hidden ${!heroVideoUrl ? "bg-hero" : ""}`}>
        {/* Video Background (admin-configurable) */}
        <HeroVideo videoUrl={heroVideoUrl} />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 relative z-10">
          <div className="max-w-3xl animate-fade-in-up">
            <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border border-white/15 bg-white/5 text-white/70 text-xs font-medium tracking-wide">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Fresh inventory updated daily
            </div>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-white">
              Nature&apos;s Finest,
              <br />
              <span className="text-gradient-hero">Delivered Fresh</span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-white/60 max-w-xl leading-relaxed">
              Premium wholesale fruit, hand-selected for quality. Browse our
              curated inventory and experience produce the way it was meant to be.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-[#064E3B] text-base font-medium transition-all duration-300 hover:shadow-[0_8px_30px_rgba(255,255,255,0.25)] hover:scale-[1.03] active:scale-[0.97]"
              >
                Explore Catalog
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-white/30 text-white text-base font-medium transition-all duration-300 hover:bg-white/10 hover:border-white/50 hover:scale-[1.03] active:scale-[0.97]"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FAFAF7] to-transparent z-10" />
      </section>

      {/* ===== Stats Bar ===== */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 -mt-16 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 stagger-children">
          <div className="card p-6 text-center animate-fade-in-up hover-glow">
            <div className="text-3xl font-bold text-gradient mb-1 font-display">
              {productCount}+
            </div>
            <div className="text-sm text-[#78716C]">Premium Products</div>
          </div>
          <div className="card p-6 text-center animate-fade-in-up hover-glow">
            <div className="text-3xl font-bold text-gradient mb-1 font-display">Fresh</div>
            <div className="text-sm text-[#78716C]">Daily Inventory Updates</div>
          </div>
          <div className="card p-6 text-center animate-fade-in-up hover-glow">
            <div className="text-3xl font-bold text-gradient mb-1 font-display">Graded</div>
            <div className="text-sm text-[#78716C]">Quality Batch Tracking</div>
          </div>
        </div>
      </section>

      {/* ===== How It Works ===== */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <span className="badge-gold inline-block mb-4">How It Works</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#1A1A1A] tracking-tight">
            From Orchard to Your&nbsp;
            <span className="text-gradient">Business</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-children">
          {/* Step 1 - Browse */}
          <div className="text-center group animate-fade-in-up">
            <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-emerald-200/50">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-[#059669]">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
              Browse Inventory
            </h3>
            <p className="text-[#78716C] text-sm leading-relaxed max-w-xs mx-auto">
              View our current stock with batch info, grades, and pricing.
              Our inventory updates as availability changes.
            </p>
          </div>

          {/* Step 2 - Order */}
          <div className="text-center group animate-fade-in-up">
            <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-amber-200/50">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-[#D97706]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
              Place Your Order
            </h3>
            <p className="text-[#78716C] text-sm leading-relaxed max-w-xs mx-auto">
              Add items to your cart and submit your order. Modify it
              anytime before it&apos;s confirmed.
            </p>
          </div>

          {/* Step 3 - Deliver */}
          <div className="text-center group animate-fade-in-up">
            <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-rose-50 to-rose-100 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-rose-200/50">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-[#E11D48]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
              We Prepare &amp; Deliver
            </h3>
            <p className="text-[#78716C] text-sm leading-relaxed max-w-xs mx-auto">
              We confirm your order, pick the freshest stock from your
              requested batches, and get it ready for you.
            </p>
          </div>
        </div>
      </section>

      {/* ===== Featured Products ===== */}
      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 lg:px-8 pb-24">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="badge-fresh inline-block mb-3">Just Arrived</span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#1A1A1A] tracking-tight">
                Latest Arrivals
              </h2>
            </div>
            <Link
              href="/catalog"
              className="btn-ghost text-sm group"
            >
              View All
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="card card-glow group animate-fade-in-up"
              >
                <div className="aspect-[4/3] bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 relative overflow-hidden flex items-center justify-center">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover img-zoom"
                    />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 text-[#059669]/30 transition-transform duration-500 group-hover:scale-110">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V15m0 0l-2.25 1.313M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-18 0l9 5.25 9-5.25M3 16.5l9-5.25m9 5.25l-9-5.25" />
                    </svg>
                  )}
                  <div className="absolute top-3 right-3">
                    <span className="badge-fresh">
                      Grade {product.batchGrade}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-lg text-[#1A1A1A] tracking-tight">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1.5 text-xs text-[#78716C]">
                    <span>Batch {product.batch}</span>
                    <span className="w-1 h-1 rounded-full bg-[#D6D3D1]" />
                    <span>Grade {product.batchGrade}</span>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#F5F5F4]">
                    <div>
                      <span className="text-2xl font-bold text-[#1A1A1A] tracking-tight">
                        ${product.price.toFixed(2)}
                      </span>
                      <span className="text-sm text-[#A8A29E] ml-1">
                        {product.unit}
                      </span>
                    </div>
                    <Link href="/catalog" className="btn-primary text-xs !px-4 !py-2">
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===== CTA Section ===== */}
      <section className="relative overflow-hidden">
        <div className="bg-luxury py-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
              Ready for
              <span className="text-gradient-hero"> Premium Produce</span>?
            </h2>
            <p className="text-white/50 text-lg max-w-xl mx-auto mb-10">
              Join businesses that trust ENGP for their wholesale fruit needs.
              Quality guaranteed, every delivery.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#D4A574] text-white text-base font-medium transition-all duration-300 hover:bg-[#C9956B] hover:shadow-[0_8px_30px_rgba(212,165,116,0.4)] hover:scale-[1.03] active:scale-[0.97]"
              >
                Start Ordering
              </Link>
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-white/25 text-white text-base font-medium transition-all duration-300 hover:bg-white/10 hover:border-white/40 hover:scale-[1.03] active:scale-[0.97]"
              >
                Browse Catalog
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="bg-[#0A0A0A] text-[#78716C] py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2.5">
              <span className="font-display text-xl font-bold text-white tracking-tight">
                ENGP
              </span>
            </div>
            <div className="flex items-center gap-8 text-sm">
              <Link href="/catalog" className="hover:text-white transition-colors duration-300">
                Catalog
              </Link>
              <Link href="/login" className="hover:text-white transition-colors duration-300">
                Sign In
              </Link>
              <Link href="/register" className="hover:text-white transition-colors duration-300">
                Register
              </Link>
            </div>
            <p className="text-xs text-[#57534E]">
              &copy; 2026 ENGP Distribution
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
