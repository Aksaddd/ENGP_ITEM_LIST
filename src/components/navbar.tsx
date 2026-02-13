"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "./cart-provider";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export function Navbar() {
  const { data: session, status } = useSession();
  const { totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const isAdmin = session?.user?.role === "admin";

  // Pages with dark hero backgrounds where navbar text should be white
  const isDarkHero = pathname === "/";

  // When not scrolled on dark hero pages, use white text; otherwise dark text
  const textOnBg = !scrolled && isDarkHero;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass-strong shadow-[0_1px_0_rgba(0,0,0,0.04)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-2 group">
              <span className={`font-display text-2xl font-bold tracking-tight transition-colors duration-300 ${
                textOnBg ? "text-white" : "text-[#1A1A1A]"
              }`}>
                ENGP
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              <Link
                href="/catalog"
                className={`nav-link px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                  textOnBg
                    ? "text-white/70 hover:text-white"
                    : "text-[#44403C] hover:text-[#064E3B]"
                }`}
              >
                Catalog
              </Link>
              <Link
                href="/about"
                className={`nav-link px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                  textOnBg
                    ? "text-white/70 hover:text-white"
                    : "text-[#44403C] hover:text-[#064E3B]"
                }`}
              >
                About
              </Link>
              <Link
                href="/how-it-works"
                className={`nav-link px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                  textOnBg
                    ? "text-white/70 hover:text-white"
                    : "text-[#44403C] hover:text-[#064E3B]"
                }`}
              >
                How It Works
              </Link>
              <Link
                href="/contact"
                className={`nav-link px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                  textOnBg
                    ? "text-white/70 hover:text-white"
                    : "text-[#44403C] hover:text-[#064E3B]"
                }`}
              >
                Contact
              </Link>
              {status !== "loading" && session && (
                <Link
                  href="/orders"
                  className={`nav-link px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                    textOnBg
                      ? "text-white/70 hover:text-white"
                      : "text-[#44403C] hover:text-[#064E3B]"
                  }`}
                >
                  My Orders
                </Link>
              )}
              {status !== "loading" && isAdmin && (
                <Link
                  href="/admin"
                  className={`nav-link px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                    textOnBg
                      ? "text-white/70 hover:text-white"
                      : "text-[#44403C] hover:text-[#064E3B]"
                  }`}
                >
                  Admin
                </Link>
              )}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <Link
              href="/cart"
              className={`relative p-2.5 rounded-full transition-all duration-300 ${
                textOnBg
                  ? "text-white/70 hover:text-white hover:bg-white/10"
                  : "text-[#44403C] hover:text-[#064E3B] hover:bg-[#064E3B]/5"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#064E3B] text-white text-[10px] font-semibold rounded-full w-[18px] h-[18px] flex items-center justify-center animate-scale-in">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Auth - Desktop */}
            {status === "loading" ? (
              <div className="hidden md:flex items-center gap-3">
                <div className={`h-4 w-20 rounded animate-pulse ${textOnBg ? "bg-white/20" : "bg-gray-200"}`} />
              </div>
            ) : session ? (
              <div className="hidden md:flex items-center gap-3">
                <span className={`text-sm transition-colors duration-300 ${
                  textOnBg ? "text-white/60" : "text-[#78716C]"
                }`}>
                  {session.user.name}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className={`btn-ghost text-xs ${
                    textOnBg
                      ? "!text-white/50 hover:!text-red-300"
                      : "text-[#78716C] hover:text-red-600"
                  }`}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/login"
                  className={`btn-ghost text-sm ${
                    textOnBg ? "!text-white/70 hover:!text-white" : ""
                  }`}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className={`text-sm !px-5 !py-2 ${
                    textOnBg
                      ? "inline-flex items-center justify-center rounded-full border border-white/30 text-white font-medium transition-all duration-300 hover:bg-white/10"
                      : "btn-primary"
                  }`}
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile toggle */}
            <button
              className={`md:hidden p-2 rounded-full transition-colors duration-300 ${
                textOnBg
                  ? "text-white/70 hover:bg-white/10"
                  : "text-[#44403C] hover:bg-[#064E3B]/5"
              }`}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                {mobileOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 9h16.5m-16.5 6.75h16.5"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden glass-strong rounded-2xl mb-4 p-4 space-y-1 animate-fade-in-up">
            <Link
              href="/catalog"
              className="block px-4 py-3 text-sm font-medium text-[#44403C] hover:text-[#064E3B] hover:bg-[#064E3B]/5 rounded-xl transition-all duration-200"
              onClick={() => setMobileOpen(false)}
            >
              Catalog
            </Link>
            <Link
              href="/about"
              className="block px-4 py-3 text-sm font-medium text-[#44403C] hover:text-[#064E3B] hover:bg-[#064E3B]/5 rounded-xl transition-all duration-200"
              onClick={() => setMobileOpen(false)}
            >
              About
            </Link>
            <Link
              href="/how-it-works"
              className="block px-4 py-3 text-sm font-medium text-[#44403C] hover:text-[#064E3B] hover:bg-[#064E3B]/5 rounded-xl transition-all duration-200"
              onClick={() => setMobileOpen(false)}
            >
              How It Works
            </Link>
            <Link
              href="/contact"
              className="block px-4 py-3 text-sm font-medium text-[#44403C] hover:text-[#064E3B] hover:bg-[#064E3B]/5 rounded-xl transition-all duration-200"
              onClick={() => setMobileOpen(false)}
            >
              Contact
            </Link>
            {status !== "loading" && session && (
              <Link
                href="/orders"
                className="block px-4 py-3 text-sm font-medium text-[#44403C] hover:text-[#064E3B] hover:bg-[#064E3B]/5 rounded-xl transition-all duration-200"
                onClick={() => setMobileOpen(false)}
              >
                My Orders
              </Link>
            )}
            {status !== "loading" && isAdmin && (
              <Link
                href="/admin"
                className="block px-4 py-3 text-sm font-medium text-[#44403C] hover:text-[#064E3B] hover:bg-[#064E3B]/5 rounded-xl transition-all duration-200"
                onClick={() => setMobileOpen(false)}
              >
                Admin
              </Link>
            )}
            <div className="divider-gradient my-2" />
            {status === "loading" ? (
              <div className="px-4 py-3">
                <div className="h-4 w-24 rounded animate-pulse bg-gray-200" />
              </div>
            ) : session ? (
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="block w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200"
              >
                Sign Out
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-4 py-3 text-sm font-medium text-[#44403C] hover:text-[#064E3B] hover:bg-[#064E3B]/5 rounded-xl transition-all duration-200"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="block px-4 py-3 text-sm font-medium text-[#064E3B] bg-[#064E3B]/5 rounded-xl transition-all duration-200"
                  onClick={() => setMobileOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
