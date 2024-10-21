// TODO: use drizzle-zod

import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

import env from "@/env.mjs"
import * as schema from "./schema"

const queryClient = postgres(env.DATABASE_URL)

export const dbWithoutSchema = drizzle(queryClient)
export const db = drizzle(queryClient, { schema })
