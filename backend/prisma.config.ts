/// <reference types="node" />
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "ts-node prisma/seed.ts",
  },
  datasource: {
    // Use direct URL (non-pgbouncer) so Prisma Migrate can run DDL transactions
    url: process.env["DIRECT_URL"],
  },
});
