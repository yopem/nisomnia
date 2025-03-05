import { relations } from "drizzle-orm"
import { pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createInsertSchema, createUpdateSchema } from "drizzle-zod"

import { createId } from "@/utils/cuid"
import { movieGenresTable } from "./movie"
import { statusEnum } from "./status"

export const genresTable = pgTable("genres", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createId()),
  tmdbId: text("tmdb_id"),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  featuredImage: text("featured_image"),
  status: statusEnum("status").notNull().default("draft"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const genresRelations = relations(genresTable, ({ many }) => ({
  movies: many(movieGenresTable),
}))

export const insertGenreSchema = createInsertSchema(genresTable)
export const updateGenreSchema = createUpdateSchema(genresTable)

export type SelectGenre = typeof genresTable.$inferSelect
