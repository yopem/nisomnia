import { and, count, eq } from "drizzle-orm"

import { db } from "@/server/db"
import {
  genresTable,
  movieGenresTable,
  movieOverviewsTable,
  movieProductionCompaniesTable,
  moviesTable,
  overviewsTable,
  productionCompaniesTable,
} from "@/server/db/schema"

export const getMovieBySlug = async (slug: string) => {
  const movieData = await db.query.moviesTable.findFirst({
    where: (movie, { eq }) => eq(movie.slug, slug),
  })

  if (movieData) {
    const movieGenresData = await db
      .select({
        id: genresTable.id,
        title: genresTable.title,
        slug: genresTable.slug,
      })
      .from(movieGenresTable)
      .leftJoin(moviesTable, eq(movieGenresTable.movieId, moviesTable.id))
      .leftJoin(genresTable, eq(movieGenresTable.genreId, genresTable.id))
      .where(eq(moviesTable.id, movieData.id))

    const movieOverviewsData = await db
      .select({
        id: overviewsTable.id,
        content: overviewsTable.content,
        language: overviewsTable.language,
      })
      .from(movieOverviewsTable)
      .leftJoin(moviesTable, eq(movieOverviewsTable.movieId, moviesTable.id))
      .leftJoin(
        overviewsTable,
        eq(movieOverviewsTable.overviewId, overviewsTable.id),
      )
      .where(eq(moviesTable.id, movieData.id))

    const movieProductionCompaniesData = await db
      .select({
        id: productionCompaniesTable.id,
        name: productionCompaniesTable.name,
        logo: productionCompaniesTable.logo,
      })
      .from(movieProductionCompaniesTable)
      .leftJoin(
        moviesTable,
        eq(movieProductionCompaniesTable.movieId, moviesTable.id),
      )
      .leftJoin(
        productionCompaniesTable,
        eq(
          movieProductionCompaniesTable.productionCompanyId,
          productionCompaniesTable.id,
        ),
      )
      .where(eq(moviesTable.id, movieData.id))

    const data = {
      ...movieData,
      overview: movieOverviewsData[0]?.content,
      genres: movieGenresData,
      productionCompanies: movieProductionCompaniesData,
    }

    return data
  }
}

export const getLatestMovies = async ({
  page,
  perPage,
}: {
  page: number
  perPage: number
}) => {
  return await db.query.moviesTable.findMany({
    where: (movies, { eq }) => eq(movies.status, "published"),
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (movies, { desc }) => [desc(movies.updatedAt)],
  })
}

export const getRelatedMovies = async ({
  currentMovieId,
  genreId,
  page,
  perPage,
}: {
  currentMovieId: string
  genreId: string
  page: number
  perPage: number
}) => {
  const movies = await db.query.moviesTable.findMany({
    where: (movies, { eq, and, not }) =>
      and(eq(movies.status, "published"), not(eq(movies.id, currentMovieId))),
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (movies, { desc }) => [desc(movies.updatedAt)],
    with: {
      genres: true,
    },
  })

  return movies.filter((movie) =>
    movie.genres.some((genre) => genre.genreId === genreId),
  )
}

export const getMoviesByGenreId = async ({
  genreId,
  page,
  perPage,
}: {
  genreId: string
  page: number
  perPage: number
}) => {
  const movies = await db.query.moviesTable.findMany({
    where: (movies, { eq }) => eq(movies.status, "published"),
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (movies, { desc }) => [desc(movies.updatedAt)],
    with: {
      genres: true,
    },
  })

  return movies.filter((movie) =>
    movie.genres.some((genre) => genre.genreId === genreId),
  )
}

export const getMoviesByProductionCompanyId = async ({
  productionCompanyId,
  page,
  perPage,
}: {
  productionCompanyId: string
  page: number
  perPage: number
}) => {
  const movies = await db.query.moviesTable.findMany({
    where: (movies, { eq }) => eq(movies.status, "published"),
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (movies, { desc }) => [desc(movies.updatedAt)],
    with: {
      productionCompanies: true,
    },
  })

  return movies.filter((movie) =>
    movie.productionCompanies.some(
      (productionCompany) =>
        productionCompany.productionCompanyId === productionCompanyId,
    ),
  )
}

export const getMoviesSitemap = async ({
  page,
  perPage,
}: {
  page: number
  perPage: number
}) => {
  return await db.query.moviesTable.findMany({
    where: (movies, { eq }) => eq(movies.status, "published"),
    columns: {
      slug: true,
      updatedAt: true,
    },
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (movies, { desc }) => [desc(movies.updatedAt)],
  })
}

export const getMoviesCount = async () => {
  const data = await db
    .select({ value: count() })
    .from(moviesTable)
    .where(and(eq(moviesTable.status, "published")))

  return data[0].value
}

export const searchMovies = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  return await db.query.moviesTable.findMany({
    where: (movies, { eq, and, or, ilike }) =>
      and(
        eq(movies.status, "published"),
        or(
          ilike(movies.title, `%${searchQuery}%`),
          ilike(movies.slug, `%${searchQuery}%`),
        ),
      ),
    orderBy: (movies, { desc }) => [desc(movies.updatedAt)],
    limit: limit,
  })
}
