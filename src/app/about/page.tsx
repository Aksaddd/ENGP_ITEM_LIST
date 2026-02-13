import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getContent(): Promise<Record<string, string>> {
  try {
    const page = await prisma.pageContent.findUnique({ where: { id: "about" } });
    if (page) return JSON.parse(page.content);
  } catch {
    // fall back to defaults
  }
  return {};
}

export default async function AboutPage() {
  const c = await getContent();

  const headline = c.headline || "Premium Produce, Trusted Partners";
  const subtitle = c.subtitle || "ENGP is a wholesale fruit distribution company dedicated to connecting businesses with the highest quality produce, sourced responsibly and delivered fresh.";
  const value1Title = c.value1Title || "Quality First";
  const value1Desc = c.value1Desc || "Every batch is graded and inspected. We only distribute produce that meets our strict quality standards.";
  const value2Title = c.value2Title || "Trusted Relationships";
  const value2Desc = c.value2Desc || "We build long-term partnerships with growers and buyers, ensuring transparency and reliability at every step.";
  const value3Title = c.value3Title || "Wide Sourcing";
  const value3Desc = c.value3Desc || "Our network spans top-growing regions, giving you access to diverse, seasonal produce year-round.";
  const storyTitle = c.storyTitle || "Our Story";
  const storyP1 = c.storyP1 || "ENGP was founded with a straightforward mission: make premium wholesale fruit accessible and easy to order. We saw an industry that relied on phone calls, spreadsheets, and guesswork \u2014 and knew there was a better way.";
  const storyP2 = c.storyP2 || "Today, we serve restaurants, grocers, juice bars, and hospitality businesses with a curated selection of the finest fruit. Every product on our platform includes batch tracking, quality grading, and real-time availability, so you always know exactly what you\u2019re getting.";
  const storyP3 = c.storyP3 || "We believe great produce speaks for itself. That\u2019s why we focus on sourcing from trusted growers, maintaining cold-chain integrity, and delivering with care. Your business deserves nothing less.";

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="badge-gold inline-block mb-4">About Us</span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#1A1A1A] tracking-tight">
            {headline.includes(",") ? (
              <>
                {headline.split(",")[0]},
                <br />
                <span className="text-gradient">{headline.split(",").slice(1).join(",").trim()}</span>
              </>
            ) : (
              headline
            )}
          </h1>
          <p className="mt-6 text-lg text-[#78716C] max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="card p-8 text-center hover-glow">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-[#059669]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">{value1Title}</h3>
            <p className="text-sm text-[#78716C] leading-relaxed">{value1Desc}</p>
          </div>

          <div className="card p-8 text-center hover-glow">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-[#D97706]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">{value2Title}</h3>
            <p className="text-sm text-[#78716C] leading-relaxed">{value2Desc}</p>
          </div>

          <div className="card p-8 text-center hover-glow">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-rose-50 to-rose-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-[#E11D48]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.92 17.92 0 0 1-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">{value3Title}</h3>
            <p className="text-sm text-[#78716C] leading-relaxed">{value3Desc}</p>
          </div>
        </div>

        {/* Story Section */}
        <div className="card p-8 sm:p-12 mb-20">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#1A1A1A] tracking-tight mb-6">
              {storyTitle}
            </h2>
            <div className="space-y-4 text-[#44403C] leading-relaxed">
              <p>{storyP1}</p>
              <p>{storyP2}</p>
              <p>{storyP3}</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#1A1A1A] tracking-tight mb-4">
            Ready to partner with us?
          </h2>
          <p className="text-[#78716C] mb-8 max-w-md mx-auto">
            Create an account to browse our full inventory and place your first order.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/register" className="btn-primary">
              Get Started
            </Link>
            <Link href="/contact" className="btn-ghost">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
