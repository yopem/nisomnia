import { defineConfig, type Config } from "drizzle-kit"

export default defineConfig({
  dialect: "postgresql",
  schema: "./lib/db/schema",
  out: "./lib/db/migrations",
  dbCredentials: {
    url: import.meta.env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
}) satisfies Config
