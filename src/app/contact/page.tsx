"use client";

import { useState, useEffect } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [content, setContent] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/pages/contact")
      .then((r) => r.json())
      .then((data) => {
        try { setContent(JSON.parse(data.content)); } catch { /* use defaults */ }
      })
      .catch(() => {});
  }, []);

  const headline = content.headline || "Contact Us";
  const subtitle = content.subtitle || "Have questions about ordering, pricing, or partnerships? We'd love to hear from you.";
  const email = content.email || "info@engp.com";
  const phone = content.phone || "(555) 123-4567";
  const hoursLine1 = content.hoursLine1 || "Mon \u2013 Fri: 6am \u2013 5pm";
  const hoursLine2 = content.hoursLine2 || "Sat: 7am \u2013 12pm";

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="badge-gold inline-block mb-4">Get in Touch</span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#1A1A1A] tracking-tight">
            {headline}
          </h1>
          <p className="mt-6 text-lg text-[#78716C] max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6 hover-glow">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#059669]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-[#1A1A1A] text-sm">Email</h3>
                  <p className="text-[#78716C] text-sm mt-1">{email}</p>
                </div>
              </div>
            </div>

            <div className="card p-6 hover-glow">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#D97706]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-[#1A1A1A] text-sm">Phone</h3>
                  <p className="text-[#78716C] text-sm mt-1">{phone}</p>
                </div>
              </div>
            </div>

            <div className="card p-6 hover-glow">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-50 to-rose-100 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#E11D48]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-[#1A1A1A] text-sm">Hours</h3>
                  <p className="text-[#78716C] text-sm mt-1">{hoursLine1}</p>
                  {hoursLine2 && <p className="text-[#78716C] text-sm">{hoursLine2}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="card p-6 sm:p-8">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-50 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-[#059669]">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">Message Sent</h3>
                  <p className="text-[#78716C] max-w-sm mx-auto">
                    Thank you for reaching out. We&apos;ll get back to you within one business day.
                  </p>
                  <button onClick={() => setSubmitted(false)} className="btn-ghost mt-6 text-sm">
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contactName" className="block text-sm font-medium text-[#44403C] mb-1.5">Name *</label>
                      <input id="contactName" name="name" type="text" required className="w-full px-4 py-3 bg-[#FAFAF7] rounded-xl input-glow text-[#1A1A1A] text-sm placeholder:text-[#A8A29E]" placeholder="Your name" />
                    </div>
                    <div>
                      <label htmlFor="contactEmail" className="block text-sm font-medium text-[#44403C] mb-1.5">Email *</label>
                      <input id="contactEmail" name="email" type="email" required className="w-full px-4 py-3 bg-[#FAFAF7] rounded-xl input-glow text-[#1A1A1A] text-sm placeholder:text-[#A8A29E]" placeholder="you@company.com" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="contactCompany" className="block text-sm font-medium text-[#44403C] mb-1.5">Company</label>
                    <input id="contactCompany" name="company" type="text" className="w-full px-4 py-3 bg-[#FAFAF7] rounded-xl input-glow text-[#1A1A1A] text-sm placeholder:text-[#A8A29E]" placeholder="Your business name" />
                  </div>
                  <div>
                    <label htmlFor="contactSubject" className="block text-sm font-medium text-[#44403C] mb-1.5">Subject *</label>
                    <select id="contactSubject" name="subject" required className="w-full px-4 py-3 bg-[#FAFAF7] rounded-xl input-glow text-[#1A1A1A] text-sm">
                      <option value="">Select a topic</option>
                      <option value="pricing">Pricing &amp; Wholesale Inquiries</option>
                      <option value="order">Order Support</option>
                      <option value="partnership">Partnership Opportunities</option>
                      <option value="general">General Question</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="contactMessage" className="block text-sm font-medium text-[#44403C] mb-1.5">Message *</label>
                    <textarea id="contactMessage" name="message" rows={5} required className="w-full px-4 py-3 bg-[#FAFAF7] rounded-xl input-glow text-[#1A1A1A] text-sm placeholder:text-[#A8A29E] resize-none" placeholder="Tell us how we can help..." />
                  </div>
                  <button type="submit" className="btn-primary w-full !py-3">Send Message</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
