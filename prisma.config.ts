import path from "path";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrate: {
    async resolveUrl() {
      const dbPath = path.join(process.cwd(), "dev.db");
      return `file:${dbPath}`;
    },
  },
});
