import { and, count, desc, eq, sql } from "drizzle-orm"

import { db } from "@/server/db"
import { genresTable, movieGenresTable } from "@/server/db/schema"

export const getGenreBySlug = async (slug: string) => {
  return await db.query.genresTable.findFirst({
    where: (genre, { eq }) => eq(genre.slug, slug),
  })
}

export const getGenresByMovieCount = async ({
  page,
  perPage,
}: {
  page: number
  perPage: number
}) => {
  return await db
    .select({
      id: genresTable.id,
      title: genresTable.title,
      slug: genresTable.slug,
      count: sql<number>`count(${movieGenresTable.movieId})`.mapWith(Number),
    })
    .from(genresTable)
    .where(eq(genresTable.status, "published"))
    .leftJoin(movieGenresTable, eq(movieGenresTable.genreId, genresTable.id))
    .limit(perPage)
    .offset((page - 1) * perPage)
    .groupBy(genresTable.id)
    .orderBy(desc(count(movieGenresTable.movieId)))
}

export const getGenresSitemap = async ({
  page,
  perPage,
}: {
  page: number
  perPage: number
}) => {
  return await db.query.genresTable.findMany({
    where: (genres, { eq }) => eq(genres.status, "published"),
    columns: {
      slug: true,
      updatedAt: true,
    },
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (genres, { desc }) => [desc(genres.updatedAt)],
  })
}

export const getGenresCount = async () => {
  const data = await db
    .select({ value: count() })
    .from(genresTable)
    .where(and(eq(genresTable.status, "published")))

  return data[0].value
}

export const searchGenres = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  return await db.query.genresTable.findMany({
    where: (genres, { eq, and, or, ilike }) =>
      and(
        eq(genres.status, "published"),
        or(
          ilike(genres.title, `%${searchQuery}%`),
          ilike(genres.slug, `%${searchQuery}%`),
        ),
      ),
    orderBy: (genres, { desc }) => [desc(genres.updatedAt)],
    limit: limit,
  })
}
