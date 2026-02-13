import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const checks: Record<string, string> = {};

  // Check env vars
  checks.TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL ? "set" : "MISSING";
  checks.TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN ? "set" : "MISSING";
  checks.AUTH_SECRET = process.env.AUTH_SECRET ? "set" : "MISSING";
  checks.AUTH_TRUST_HOST = process.env.AUTH_TRUST_HOST ?? "MISSING";

  // Check database connection
  try {
    const { prisma } = await import("@/lib/prisma");
    const count = await prisma.product.count();
    checks.database = `connected (${count} products)`;
  } catch (e: unknown) {
    checks.database = `ERROR: ${e instanceof Error ? e.message : String(e)}`;
  }

  return NextResponse.json(checks);
}
