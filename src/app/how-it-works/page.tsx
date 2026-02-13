import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getContent(): Promise<Record<string, string>> {
  try {
    const page = await prisma.pageContent.findUnique({ where: { id: "how-it-works" } });
    if (page) return JSON.parse(page.content);
  } catch {
    // fall back to defaults
  }
  return {};
}

const STEP_ICONS = [
  <svg key="1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>,
  <svg key="2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>,
  <svg key="3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" /></svg>,
  <svg key="4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.745 3.745 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" /></svg>,
  <svg key="5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>,
];

const STEP_COLORS = [
  { bg: "from-emerald-50 to-emerald-100", text: "text-[#059669]" },
  { bg: "from-amber-50 to-amber-100", text: "text-[#D97706]" },
  { bg: "from-blue-50 to-blue-100", text: "text-blue-600" },
  { bg: "from-purple-50 to-purple-100", text: "text-purple-600" },
  { bg: "from-rose-50 to-rose-100", text: "text-[#E11D48]" },
];

const DEFAULT_STEPS = [
  { title: "Create Your Account", desc: "Sign up in seconds. Tell us about your business so we can tailor your experience \u2014 whether you run a restaurant, juice bar, grocery store, or catering service." },
  { title: "Browse Our Inventory", desc: "Explore our curated catalog of premium fruit. Every listing includes batch numbers, quality grades, origin details, and real-time stock levels \u2014 so you know exactly what you\u2019re ordering." },
  { title: "Add to Cart & Order", desc: "Select the products and quantities you need, then submit your order. You can modify your cart anytime before checkout. Need something specific? Add a note and we\u2019ll do our best." },
  { title: "We Confirm & Prepare", desc: "Our team reviews your order, confirms availability, and hand-selects the freshest stock from the requested batches. You\u2019ll be notified at every stage through your order dashboard." },
  { title: "Fresh Delivery", desc: "Your order is packed with care, maintaining cold-chain integrity from our warehouse to your door. Track your order status in real time from your account dashboard." },
];

export default async function HowItWorksPage() {
  const c = await getContent();

  const headline = c.headline || "How It Works";
  const subtitle = c.subtitle || "Ordering wholesale fruit shouldn\u2019t be complicated. Here\u2019s how ENGP makes it easy, from sign-up to delivery.";

  const steps = DEFAULT_STEPS.map((def, i) => ({
    title: c[`step${i + 1}Title`] || def.title,
    desc: c[`step${i + 1}Desc`] || def.desc,
  }));

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="badge-fresh inline-block mb-4">Simple Process</span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#1A1A1A] tracking-tight">
            {headline}
          </h1>
          <p className="mt-6 text-lg text-[#78716C] max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-6 mb-20">
          {steps.map((step, i) => (
            <div key={i} className="card p-6 sm:p-8 hover-glow">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${STEP_COLORS[i].bg} flex items-center justify-center flex-shrink-0 ${STEP_COLORS[i].text}`}>
                  {STEP_ICONS[i]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-bold text-[#A8A29E] tracking-widest uppercase">
                      Step {String(i + 1).padStart(2, "0")}
                    </span>
                    {i === 0 && (
                      <span className="badge-fresh text-[10px]">Start Here</span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[#78716C] leading-relaxed max-w-2xl">
                    {step.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mb-20">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#1A1A1A] tracking-tight text-center mb-10">
            Common Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="font-semibold text-[#1A1A1A] mb-2 text-sm">Is there a minimum order?</h3>
              <p className="text-sm text-[#78716C] leading-relaxed">We work primarily with wholesale buyers. Minimum orders vary by product — check individual listings for details.</p>
            </div>
            <div className="card p-6">
              <h3 className="font-semibold text-[#1A1A1A] mb-2 text-sm">Can I modify my order after placing it?</h3>
              <p className="text-sm text-[#78716C] leading-relaxed">Yes! Orders can be modified while they&apos;re in &ldquo;pending&rdquo; status. Once confirmed by our team, changes may be limited.</p>
            </div>
            <div className="card p-6">
              <h3 className="font-semibold text-[#1A1A1A] mb-2 text-sm">What areas do you deliver to?</h3>
              <p className="text-sm text-[#78716C] leading-relaxed">We currently serve the greater metro area. Contact us for delivery availability to your location.</p>
            </div>
            <div className="card p-6">
              <h3 className="font-semibold text-[#1A1A1A] mb-2 text-sm">What does batch grading mean?</h3>
              <p className="text-sm text-[#78716C] leading-relaxed">Each batch is graded A (Premium), B (Standard), or C (Economy) based on size, appearance, and quality. Grade A is our finest.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#1A1A1A] tracking-tight mb-4">
            Ready to get started?
          </h2>
          <p className="text-[#78716C] mb-8 max-w-md mx-auto">
            Create a free account and place your first order in minutes.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/register" className="btn-primary">Create Account</Link>
            <Link href="/catalog" className="btn-ghost">Browse Catalog</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
