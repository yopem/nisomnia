import { relations } from "drizzle-orm"
import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core"

import { MEDIA_TYPE } from "@/lib/validation/media"
import { users } from "./user"

export const mediaTypeEnum = pgEnum("media_types", MEDIA_TYPE)

export const medias = pgTable("medias", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  url: text("url").notNull(),
  imageType: text("image_type").notNull(),
  type: mediaTypeEnum("type").notNull().default("all"),
  description: text("description"),
  authorId: text("author_id")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const mediaRelations = relations(medias, ({ one }) => ({
  author: one(users, {
    fields: [medias.authorId],
    references: [users.id],
  }),
}))

export type InsertMedia = typeof medias.$inferInsert
export type SelectMedia = typeof medias.$inferSelect
