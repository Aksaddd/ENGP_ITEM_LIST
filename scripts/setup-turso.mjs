import { createClient } from "@libsql/client";
import { readFileSync } from "fs";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function run() {
  // Create tables
  console.log("Creating tables...");
  const setup = readFileSync("prisma/turso-setup.sql", "utf8");
  const setupStmts = setup.split(";").map(s => s.trim()).filter(s => s.length > 0);
  for (const stmt of setupStmts) {
    await client.execute(stmt);
    console.log("  OK:", stmt.substring(0, 55) + "...");
  }

  // Seed data
  console.log("\nSeeding data...");
  const seed = readFileSync("prisma/seed.sql", "utf8");
  const seedStmts = seed.split(";").map(s => s.trim()).filter(s => s.length > 0);
  for (const stmt of seedStmts) {
    await client.execute(stmt);
    console.log("  OK:", stmt.substring(0, 55) + "...");
  }

  console.log("\nDone! Turso database is ready.");
}

run().catch(e => {
  console.error("Error:", e.message);
  process.exit(1);
});
