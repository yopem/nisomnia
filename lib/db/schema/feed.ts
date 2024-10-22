import { relations } from "drizzle-orm"
import {
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core"

import { FEED_TYPE } from "@/lib/validation/feed"
import { languageEnum } from "./language"
import { topics } from "./topic"

export const feedTypeEnum = pgEnum("feed_type", FEED_TYPE)

export const feeds = pgTable("feeds", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  language: languageEnum("language").notNull().default("id"),
  featuredImage: text("featured_image"),
  link: text("link"),
  type: feedTypeEnum("type").notNull().default("website"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const feedTopics = pgTable(
  "_feed_topics",
  {
    feedId: text("feed_id")
      .notNull()
      .references(() => feeds.id),
    topicId: text("topic_id")
      .notNull()
      .references(() => topics.id),
  },
  (t) => ({
    compoundKey: primaryKey({
      columns: [t.feedId, t.topicId],
    }),
  }),
)

export const feedsRelations = relations(feeds, ({ many }) => ({
  topics: many(feedTopics),
}))

export type InsertFeed = typeof feeds.$inferInsert
export type SelectFeed = typeof feeds.$inferSelect
