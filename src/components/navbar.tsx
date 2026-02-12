"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "./cart-provider";
import { useState } from "react";

export function Navbar() {
  const { data: session } = useSession();
  const { totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = session?.user?.role === "admin";

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🍊</span>
              <span className="text-xl font-bold text-gray-900">
                FreshBatch
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/catalog"
                className="text-gray-600 hover:text-green-600 font-medium transition-colors"
              >
                Catalog
              </Link>
              {session && (
                <Link
                  href="/orders"
                  className="text-gray-600 hover:text-green-600 font-medium transition-colors"
                >
                  My Orders
                </Link>
              )}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="text-gray-600 hover:text-green-600 font-medium transition-colors"
                >
                  Admin
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/cart"
              className="relative p-2 text-gray-600 hover:text-green-600 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {session ? (
              <div className="hidden md:flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  {session.user.name}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-sm text-gray-500 hover:text-red-600 font-medium transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-sm text-gray-600 hover:text-green-600 font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}

            <button
              className="md:hidden p-2 text-gray-600"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-gray-200 py-3 space-y-2">
            <Link
              href="/catalog"
              className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
              onClick={() => setMobileOpen(false)}
            >
              Catalog
            </Link>
            {session && (
              <Link
                href="/orders"
                className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                onClick={() => setMobileOpen(false)}
              >
                My Orders
              </Link>
            )}
            {isAdmin && (
              <Link
                href="/admin"
                className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                onClick={() => setMobileOpen(false)}
              >
                Admin
              </Link>
            )}
            {session ? (
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="block w-full text-left px-3 py-2 text-red-600 hover:bg-gray-50 rounded-lg"
              >
                Sign Out
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="block px-3 py-2 text-green-600 hover:bg-gray-50 rounded-lg"
                  onClick={() => setMobileOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
