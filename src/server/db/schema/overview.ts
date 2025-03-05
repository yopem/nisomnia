import { relations } from "drizzle-orm"
import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createInsertSchema, createUpdateSchema } from "drizzle-zod"
import { z } from "zod"

import { createId } from "@/utils/cuid"
import { languageEnum } from "./language"
import { movieOverviewsTable } from "./movie"

export const OVERVIEW_TYPE = ["game", "movie", "tv"] as const

export const overviewType = z.enum(OVERVIEW_TYPE)

export const overviewTypeEnum = pgEnum("overview_type", OVERVIEW_TYPE)

export const overviewsTable = pgTable("overviews", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createId()),
  title: text("title").notNull(),
  content: text("content").notNull(),
  type: overviewTypeEnum("type").notNull().default("game"),
  language: languageEnum("language").notNull().default("en"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const overviewsRelations = relations(overviewsTable, ({ many }) => ({
  movies: many(movieOverviewsTable),
}))

export const insertOverviewSchema = createInsertSchema(overviewsTable)
export const updateOverviewSchema = createUpdateSchema(overviewsTable)

export type SelectOverview = typeof overviewsTable.$inferSelect

export type OverviewType = z.infer<typeof overviewType>
