import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  // Prisma CLI commands need a datasource URL. Provide a valid fallback so
  // commands like `prisma generate` can run even if DATABASE_URL isn't set.
  datasource: {
    url:
      process.env.DATABASE_URL ??
      "postgresql://USER:PASSWORD@HOST:5432/plumbflow?schema=public",
  },
});
