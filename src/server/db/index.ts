import { SQL } from "bun"
import { drizzle } from "drizzle-orm/bun-sql"

import { databaseUrl } from "@/utils/constant"
import * as schema from "./schema"

const client = new SQL(databaseUrl)

export const db = drizzle({ client, schema })
