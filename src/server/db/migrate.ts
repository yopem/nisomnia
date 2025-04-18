import { SQL } from "bun"
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js"
import { migrate } from "drizzle-orm/postgres-js/migrator"

import { databaseUrl } from "@/utils/constant"

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set")
}

const migrationClient = new SQL(databaseUrl, { max: 1 })

const db: PostgresJsDatabase = drizzle(migrationClient)

const main = async () => {
  console.log("Migrating database...")
  await migrate(db, { migrationsFolder: "./src/server/db/migrations" })
  await migrationClient.end()
  console.log("Database migrated successfully!")
}

await main()
