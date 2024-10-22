import { relations } from "drizzle-orm"
import {
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core"

import { genres } from "./genre"
import { languageEnum } from "./language"
import { productionCompanies } from "./production-company"

export const movieTranslations = pgTable("movie_translations", {
  id: text("id").primaryKey(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const movies = pgTable("movies", {
  id: text("id").primaryKey(),
  imdbId: text("imdb_id").notNull().unique(),
  tmdbId: text("tmdb_id").notNull().unique(),
  language: languageEnum("language").notNull().default("id"),
  title: text("title").notNull(),
  otherTitle: text("other_title"),
  tagline: text("tagline"),
  slug: text("slug").notNull().unique(),
  overview: text("overview").notNull(),
  status: text("status"),
  originCountry: text("origin_country"),
  originalLanguage: text("original_language").notNull(),
  spokenLanguages: text("spoken_languages"),
  releaseDate: text("release_date"),
  revenue: integer("revenue"),
  runtime: integer("runtime"),
  budget: integer("budget"),
  homepage: text("homepage"),
  backdrop: text("backdrop"),
  poster: text("poster"),
  movieTranslationId: text("movie_translation_id")
    .notNull()
    .references(() => movieTranslations.id),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const moviesRelations = relations(movies, ({ one, many }) => ({
  movieTranslation: one(movieTranslations, {
    fields: [movies.movieTranslationId],
    references: [movieTranslations.id],
  }),
  genres: many(movieGenres),
  productionCompanies: many(movieProductionCompanies),
}))

export const movieTranslationsRelations = relations(
  movieTranslations,
  ({ many }) => ({
    movies: many(movies),
  }),
)

export const movieGenres = pgTable(
  "_movie_genres",
  {
    movieId: text("movie_id")
      .notNull()
      .references(() => movies.id),
    genreId: text("genre_id")
      .notNull()
      .references(() => genres.id),
  },
  (t) => ({
    compoundKey: primaryKey({
      columns: [t.movieId, t.genreId],
    }),
  }),
)

export const movieGenresRelations = relations(movieGenres, ({ one }) => ({
  movie: one(movies, {
    fields: [movieGenres.movieId],
    references: [movies.id],
  }),
  genre: one(genres, {
    fields: [movieGenres.genreId],
    references: [genres.id],
  }),
}))

export const movieProductionCompanies = pgTable(
  "_movie_production_companies",
  {
    movieId: text("movie_id")
      .notNull()
      .references(() => movies.id),
    productionCompanyId: text("production_company_id")
      .notNull()
      .references(() => productionCompanies.id),
  },
  (t) => ({
    compoundKey: primaryKey({
      columns: [t.movieId, t.productionCompanyId],
    }),
  }),
)

export const movieProductionCompaniesRelations = relations(
  movieProductionCompanies,
  ({ one }) => ({
    movie: one(movies, {
      fields: [movieProductionCompanies.movieId],
      references: [movies.id],
    }),
    productionCompany: one(productionCompanies, {
      fields: [movieProductionCompanies.productionCompanyId],
      references: [productionCompanies.id],
    }),
  }),
)

export type InsertMovie = typeof movies.$inferInsert
export type SelectMovie = typeof movies.$inferSelect

export type InsertMovieTranslation = typeof movieTranslations.$inferInsert
export type SelectMovieTranslation = typeof movieTranslations.$inferSelect
