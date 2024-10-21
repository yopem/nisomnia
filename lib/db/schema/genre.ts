import { relations } from "drizzle-orm"
import { pgTable, text, timestamp } from "drizzle-orm/pg-core"

import { languageEnum } from "./language"
import { movieGenres } from "./movie"

export const genreTranslations = pgTable("genre_translations", {
  id: text("id").primaryKey(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const genres = pgTable("genres", {
  id: text("id").primaryKey(),
  tmdbId: text("tmdb_id").notNull().unique(),
  language: languageEnum("language").notNull().default("id"),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  genreTranslationId: text("genre_translation_id")
    .notNull()
    .references(() => genreTranslations.id),
  featuredImage: text("featured_image"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const genresRelations = relations(genres, ({ one, many }) => ({
  genreTranslation: one(genreTranslations, {
    fields: [genres.genreTranslationId],
    references: [genreTranslations.id],
  }),
  movies: many(movieGenres),
}))

export const genreTranslationsRelations = relations(
  genreTranslations,
  ({ many }) => ({
    genres: many(genres),
  }),
)

export type InsertGenre = typeof genres.$inferInsert
export type SelectGenre = typeof genres.$inferSelect

export type InsertGenreTranslation = typeof genreTranslations.$inferInsert
export type SelectGenreTranslation = typeof genreTranslations.$inferSelect
