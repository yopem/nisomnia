import { relations } from "drizzle-orm"
import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createInsertSchema, createUpdateSchema } from "drizzle-zod"
import { z } from "zod"

import { createId } from "@/utils/cuid"
import { articleTopicsTable } from "./article"
import { feedTopicsTable } from "./feed"
import { languageEnum } from "./language"
import { statusEnum } from "./status"

export const TOPIC_VISIBILITY = ["public", "internal"] as const

export const topicVisibility = z.enum(TOPIC_VISIBILITY)

export const topicVisibilityEnum = pgEnum("topic_visibility", TOPIC_VISIBILITY)

export const topicTranslationsTable = pgTable("topic_translations", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createId()),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const topicsTable = pgTable("topics", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createId()),
  language: languageEnum("language").notNull().default("id"),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  status: statusEnum("status").notNull().default("draft"),
  visibility: topicVisibilityEnum("visibility").notNull().default("public"),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  topicTranslationId: text("topic_translation_id")
    .notNull()
    .references(() => topicTranslationsTable.id),
  featuredImage: text("featured_image"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const topicsRelations = relations(topicsTable, ({ one, many }) => ({
  topicTranslation: one(topicTranslationsTable, {
    fields: [topicsTable.topicTranslationId],
    references: [topicTranslationsTable.id],
  }),
  articles: many(articleTopicsTable),
  feeds: many(feedTopicsTable),
}))

export const topicTranslationsRelations = relations(
  topicTranslationsTable,
  ({ many }) => ({
    topics: many(topicsTable),
  }),
)

export const insertTopicSchema = createInsertSchema(topicsTable)
export const updateTopicSchema = createUpdateSchema(topicsTable)
export const insertTopicTranslationSchema = createInsertSchema(
  topicTranslationsTable,
)

export type SelectTopic = typeof topicsTable.$inferSelect
export type SelectTopicTranslation = typeof topicTranslationsTable.$inferSelect

export type TopicVisibility = z.infer<typeof topicVisibility>
