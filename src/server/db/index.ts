import { drizzle } from "drizzle-orm/postgres-js"

import { databaseUrl } from "@/utils/constant"
import * as schema from "./schema"

export const db = drizzle(databaseUrl, {
  schema: schema,
})
