"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      phone: formData.get("phone") as string,
      company: formData.get("company") as string,
    };

    if (data.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const body = await res.json();
      setError(body.error || "Registration failed");
      setLoading(false);
      return;
    }

    router.push("/login?registered=true");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-16 pt-24">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="card p-8 sm:p-10">
          <div className="text-center mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 mx-auto mb-4 text-[#059669]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
            </svg>
            <h1 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">
              Create an account
            </h1>
            <p className="text-[#78716C] mt-1.5 text-sm">
              Register to start ordering fresh produce
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl mb-6 text-sm font-medium animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#44403C] mb-2">
                Full Name <span className="text-[#D4A574]">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full px-4 py-3 bg-[#FAFAF7] rounded-2xl input-glow text-[#1A1A1A] text-sm placeholder:text-[#A8A29E]"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#44403C] mb-2">
                Email <span className="text-[#D4A574]">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 bg-[#FAFAF7] rounded-2xl input-glow text-[#1A1A1A] text-sm placeholder:text-[#A8A29E]"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#44403C] mb-2">
                Password <span className="text-[#D4A574]">*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                className="w-full px-4 py-3 bg-[#FAFAF7] rounded-2xl input-glow text-[#1A1A1A] text-sm placeholder:text-[#A8A29E]"
                placeholder="At least 6 characters"
              />
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-[#44403C] mb-2">
                Company / Business Name
              </label>
              <input
                id="company"
                name="company"
                type="text"
                className="w-full px-4 py-3 bg-[#FAFAF7] rounded-2xl input-glow text-[#1A1A1A] text-sm placeholder:text-[#A8A29E]"
                placeholder="Optional"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-[#44403C] mb-2">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="w-full px-4 py-3 bg-[#FAFAF7] rounded-2xl input-glow text-[#1A1A1A] text-sm placeholder:text-[#A8A29E]"
                placeholder="Optional"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full !py-3 text-base !mt-6 disabled:opacity-50 disabled:cursor-not-allowed disabled:!transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-[#78716C] mt-8">
            Already have an account?{" "}
            <Link href="/login" className="text-[#064E3B] hover:text-[#059669] font-medium transition-colors duration-300">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
