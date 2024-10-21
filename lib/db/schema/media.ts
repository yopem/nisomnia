import { relations } from "drizzle-orm"
import { pgTable, text, timestamp } from "drizzle-orm/pg-core"

import { users } from "./user"

export const medias = pgTable("medias", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  url: text("url").notNull(),
  imageType: text("image_type").notNull(),
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
