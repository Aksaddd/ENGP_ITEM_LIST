import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "FreshBatch - Premium Wholesale Fruit",
  description:
    "Curated wholesale fruit, sourced fresh and delivered in bulk. Browse our inventory, place orders, and experience premium produce.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-[#FAFAF7]">
        <Providers>
          <Navbar />
          <main className="relative">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
