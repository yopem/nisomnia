import { relations } from "drizzle-orm"
import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createInsertSchema, createUpdateSchema } from "drizzle-zod"
import { z } from "zod"

import { createId } from "@/utils/cuid"
import { usersTable } from "./user"

export const MEDIA_CATEGORY = [
  "all",
  "article",
  "feed",
  "topic",
  "genre",
  "review",
  "tutorial",
  "movie",
  "tv",
  "game",
  "production_company",
] as const

export const MEDIA_TYPE = [
  "image",
  "audio",
  "video",
  "document",
  "other",
] as const

export const mediaCategory = z.enum(MEDIA_CATEGORY)
export const mediaType = z.enum(MEDIA_TYPE)

export const mediaCategoryEnum = pgEnum("media_category", MEDIA_CATEGORY)
export const mediaTypeEnum = pgEnum("media_type", MEDIA_TYPE)

export const mediasTable = pgTable("medias", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name").notNull().unique(),
  url: text("url").notNull(),
  fileType: text("file_type").notNull(),
  category: mediaCategoryEnum("category").notNull().default("article"),
  type: mediaTypeEnum("type").notNull().default("image"),
  description: text("description"),
  authorId: text("author_id")
    .notNull()
    .references(() => usersTable.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const mediaRelations = relations(mediasTable, ({ one }) => ({
  author: one(usersTable, {
    fields: [mediasTable.authorId],
    references: [usersTable.id],
  }),
}))

export const insertMediaSchema = createInsertSchema(mediasTable)
export const updateMediaSchema = createUpdateSchema(mediasTable)

export type SelectMedia = typeof mediasTable.$inferSelect

export type MediaCategory = z.infer<typeof mediaCategory>
export type MediaType = z.infer<typeof mediaType>
