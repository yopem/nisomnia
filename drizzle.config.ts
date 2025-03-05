import "dotenv/config"

import { defineConfig, type Config } from "drizzle-kit"

export default defineConfig({
  dialect: "postgresql",
  schema: "./server/db/schema",
  out: "./server/db/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
}) satisfies Config
