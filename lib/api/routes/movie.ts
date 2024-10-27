import { TRPCError } from "@trpc/server"
import { count, eq, sql } from "drizzle-orm"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "@/lib/api/trpc"
import {
  genres,
  movieGenres,
  movieOverviews,
  movieProductionCompanies,
  movies,
  overviews,
  productionCompanies,
} from "@/lib/db/schema"
import { cuid } from "@/lib/utils"
import { generateUniqueMovieSlug } from "@/lib/utils/slug"
import { languageType } from "@/lib/validation/language"
import { createMovieSchema, updateMovieSchema } from "@/lib/validation/movie"

export const movieRouter = createTRPCRouter({
  byId: adminProtectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      try {
        const movieData = await ctx.db
          .select()
          .from(movies)
          .where(eq(movies.id, input))
          .limit(1)

        const movieOverviewsData = await ctx.db
          .select({
            id: overviews.id,
            title: overviews.title,
            language: overviews.language,
            content: overviews.content,
          })
          .from(movieOverviews)
          .leftJoin(movies, eq(movieOverviews.movieId, movies.id))
          .leftJoin(overviews, eq(movieOverviews.overviewId, overviews.id))
          .where(eq(movies.id, input))

        const movieGenresData = await ctx.db
          .select({ id: genres.id, title: genres.title })
          .from(movieGenres)
          .leftJoin(movies, eq(movieGenres.movieId, movies.id))
          .leftJoin(genres, eq(movieGenres.genreId, genres.id))
          .where(eq(movies.id, input))

        const movieProductionCompaniesData = await ctx.db
          .select({
            id: productionCompanies.id,
            name: productionCompanies.name,
          })
          .from(movieProductionCompanies)
          .leftJoin(movies, eq(movieProductionCompanies.movieId, movies.id))
          .leftJoin(
            productionCompanies,
            eq(
              movieProductionCompanies.productionCompanyId,
              productionCompanies.id,
            ),
          )
          .where(eq(movies.id, input))

        const data = movieData.map((item) => ({
          ...item,
          overview: movieOverviewsData[0].content,
          genres: movieGenresData,
          productionCompanies: movieProductionCompaniesData,
        }))

        return data[0]
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An internal error occurred",
          })
        }
      }
    }),
  bySlug: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    try {
      const movieData = await ctx.db
        .select()
        .from(movies)
        .where(eq(movies.slug, input))
        .limit(1)

      const movieGenresData = await ctx.db
        .select({ id: genres.id, title: genres.title, slug: genres.slug })
        .from(movieGenres)
        .leftJoin(movies, eq(movieGenres.movieId, movies.id))
        .leftJoin(genres, eq(movieGenres.genreId, genres.id))
        .where(eq(movies.id, movieData[0].id))

      const movieOverviewsData = await ctx.db
        .select({
          id: overviews.id,
          content: overviews.content,
          language: overviews.language,
        })
        .from(movieOverviews)
        .leftJoin(movies, eq(movieOverviews.movieId, movies.id))
        .leftJoin(overviews, eq(movieOverviews.overviewId, overviews.id))
        .where(eq(movies.id, movieData[0].id))

      const movieProductionCompaniesData = await ctx.db
        .select({
          id: productionCompanies.id,
          name: productionCompanies.name,
          logo: productionCompanies.logo,
        })
        .from(movieProductionCompanies)
        .leftJoin(movies, eq(movieProductionCompanies.movieId, movies.id))
        .leftJoin(
          productionCompanies,
          eq(
            movieProductionCompanies.productionCompanyId,
            productionCompanies.id,
          ),
        )
        .where(eq(movies.id, movieData[0].id))

      const data = movieData.map((item) => ({
        ...item,
        overview: movieOverviewsData[0].content,
        genres: movieGenresData,
        productionCompanies: movieProductionCompaniesData,
      }))

      return data[0]
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error
      } else {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An internal error occurred",
        })
      }
    }
  }),
  latest: publicProcedure
    .input(
      z.object({
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.movies.findMany({
          where: (movies, { eq }) => eq(movies.status, "published"),
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          orderBy: (movies, { desc }) => [desc(movies.updatedAt)],
        })

        return data
      } catch (error) {
        console.error("Error:", error)
        if (error instanceof TRPCError) {
          throw error
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An internal error occurred",
          })
        }
      }
    }),
  latestInfinite: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullable(),
        cursor: z.date().optional().nullable(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const limit = input.limit ?? 50

        const data = await ctx.db.query.movies.findMany({
          where: (movies, { and, eq, lt }) =>
            and(
              eq(movies.status, "published"),
              input.cursor
                ? lt(movies.updatedAt, new Date(input.cursor))
                : undefined,
            ),
          limit: limit + 1,
          orderBy: (movies, { desc }) => [desc(movies.updatedAt)],
        })

        let nextCursor: Date | undefined = undefined

        if (data.length > limit) {
          const nextItem = data.pop()
          if (nextItem?.updatedAt) {
            nextCursor = nextItem.updatedAt
          }
        }

        return {
          movies: data,
          nextCursor,
        }
      } catch (error) {
        console.error("Error:", error)
        if (error instanceof TRPCError) {
          throw error
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An internal error occurred",
          })
        }
      }
    }),
  byGenreId: publicProcedure
    .input(
      z.object({
        genreId: z.string(),
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const movies = await ctx.db.query.movies.findMany({
          where: (movies, { eq }) => eq(movies.status, "published"),
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          orderBy: (movies, { desc }) => [desc(movies.updatedAt)],
          with: {
            genres: true,
          },
        })

        const data = movies.filter((movie) =>
          movie.genres.some((genre) => genre.genreId === input.genreId),
        )

        return data
      } catch (error) {
        console.error("Error:", error)
        if (error instanceof TRPCError) {
          throw error
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An internal error occurred",
          })
        }
      }
    }),
  byGenreIdInfinite: publicProcedure
    .input(
      z.object({
        genreId: z.string(),
        limit: z.number().min(1).max(100).nullable(),
        cursor: z.date().optional().nullable(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const limit = input.limit ?? 50

        const movies = await ctx.db.query.movies.findMany({
          where: (movies, { and, eq, lt }) =>
            and(
              eq(movies.status, "published"),
              input.cursor
                ? lt(movies.updatedAt, new Date(input.cursor))
                : undefined,
            ),
          limit: limit + 1,
          orderBy: (movies, { desc }) => [desc(movies.updatedAt)],
          with: {
            genres: true,
          },
        })

        const data = movies.filter((movie) =>
          movie.genres.some((genre) => genre.genreId === input.genreId),
        )

        let nextCursor: Date | undefined = undefined

        if (data.length > limit) {
          const nextItem = data.pop()
          if (nextItem?.updatedAt) {
            nextCursor = nextItem.updatedAt
          }
        }

        return {
          movies: data,
          nextCursor,
        }
      } catch (error) {
        console.error("Error:", error)
        if (error instanceof TRPCError) {
          throw error
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An internal error occurred",
          })
        }
      }
    }),
  byProductionCompanyId: publicProcedure
    .input(
      z.object({
        productionCompanyId: z.string(),
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const movies = await ctx.db.query.movies.findMany({
          where: (movies, { eq }) => eq(movies.status, "published"),
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          orderBy: (movies, { desc }) => [desc(movies.updatedAt)],
          with: {
            productionCompanies: true,
          },
        })

        const data = movies.filter((movie) =>
          movie.productionCompanies.some(
            (productionCompany) =>
              productionCompany.productionCompanyId ===
              input.productionCompanyId,
          ),
        )

        return data
      } catch (error) {
        console.error("Error:", error)
        if (error instanceof TRPCError) {
          throw error
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An internal error occurred",
          })
        }
      }
    }),
  byProductionCompanyIdInfinite: publicProcedure
    .input(
      z.object({
        productionCompanyId: z.string(),
        limit: z.number().min(1).max(100).nullable(),
        cursor: z.date().optional().nullable(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const limit = input.limit ?? 50

        const movies = await ctx.db.query.movies.findMany({
          where: (movies, { and, eq, lt }) =>
            and(
              eq(movies.status, "published"),
              input.cursor
                ? lt(movies.updatedAt, new Date(input.cursor))
                : undefined,
            ),
          limit: limit + 1,
          orderBy: (movies, { desc }) => [desc(movies.updatedAt)],
          with: {
            productionCompanies: true,
          },
        })

        const data = movies.filter((movie) =>
          movie.productionCompanies.some(
            (productionCompany) =>
              productionCompany.productionCompanyId ===
              input.productionCompanyId,
          ),
        )

        let nextCursor: Date | undefined = undefined

        if (data.length > limit) {
          const nextItem = data.pop()
          if (nextItem?.updatedAt) {
            nextCursor = nextItem.updatedAt
          }
        }

        return {
          movies: data,
          nextCursor,
        }
      } catch (error) {
        console.error("Error:", error)
        if (error instanceof TRPCError) {
          throw error
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An internal error occurred",
          })
        }
      }
    }),
  relatedInfinite: publicProcedure
    .input(
      z.object({
        genreId: z.string(),
        currentMovieId: z.string(),
        limit: z.number().min(1).max(100).nullable(),
        cursor: z.date().optional().nullable(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const limit = input.limit ?? 50

        const movies = await ctx.db.query.movies.findMany({
          where: (movies, { eq, and, not, lt }) =>
            and(
              eq(movies.status, "published"),
              input.cursor
                ? lt(movies.updatedAt, new Date(input.cursor))
                : undefined,
              not(eq(movies.id, input.currentMovieId)),
            ),
          limit: limit + 1,
          orderBy: (movies, { desc }) => [desc(movies.updatedAt)],
          with: {
            genres: true,
          },
        })

        const data = movies.filter((movie) =>
          movie.genres.some((genre) => genre.genreId === input.genreId),
        )

        let nextCursor: Date | undefined = undefined

        if (data.length > limit) {
          const nextItem = data.pop()
          if (nextItem?.updatedAt) {
            nextCursor = nextItem.updatedAt
          }
        }

        return {
          movies: data,
          nextCursor,
        }
      } catch (error) {
        console.error("Error:", error)
        if (error instanceof TRPCError) {
          throw error
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An internal error occurred",
          })
        }
      }
    }),
  dashboard: adminProtectedProcedure
    .input(
      z.object({
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.movies.findMany({
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          orderBy: (movies, { desc }) => [desc(movies.updatedAt)],
        })

        return data
      } catch (error) {
        console.error("Error:", error)
        if (error instanceof TRPCError) {
          throw error
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An internal error occurred",
          })
        }
      }
    }),
  sitemap: publicProcedure
    .input(
      z.object({
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.movies.findMany({
          where: (movies, { eq }) => eq(movies.status, "published"),
          columns: {
            slug: true,
            updatedAt: true,
          },
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          orderBy: (movies, { desc }) => [desc(movies.id)],
        })

        return data
      } catch (error) {
        console.error("Error:", error)
        if (error instanceof TRPCError) {
          throw error
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An internal error occurred",
          })
        }
      }
    }),
  count: publicProcedure.query(async ({ ctx }) => {
    try {
      const data = await ctx.db
        .select({ value: count() })
        .from(movies)
        .where(eq(movies.status, "published"))

      return data[0].value
    } catch (error) {
      console.error("Error:", error)
      if (error instanceof TRPCError) {
        throw error
      } else {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An internal error occurred",
        })
      }
    }
  }),
  countDashboard: publicProcedure.query(async ({ ctx }) => {
    try {
      const data = await ctx.db.select({ value: count() }).from(movies)

      return data[0].value
    } catch (error) {
      console.error("Error:", error)
      if (error instanceof TRPCError) {
        throw error
      } else {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An internal error occurred",
        })
      }
    }
  }),
  search: publicProcedure
    .input(z.object({ language: languageType, searchQuery: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.movies.findMany({
          where: (movies, { and, or, ilike }) =>
            and(
              eq(movies.status, "published"),
              or(
                ilike(movies.title, `%${input.searchQuery}%`),
                ilike(movies.slug, `%${input.searchQuery}%`),
              ),
            ),
          limit: 10,
        })

        return data
      } catch (error) {
        console.error("Error:", error)
        if (error instanceof TRPCError) {
          throw error
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An internal error occurred",
          })
        }
      }
    }),
  searchDashboard: publicProcedure
    .input(z.object({ language: languageType, searchQuery: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.movies.findMany({
          where: (movies, { and, eq, or, ilike }) =>
            and(
              eq(movies.status, "published"),
              or(
                ilike(movies.title, `%${input.searchQuery}%`),
                ilike(movies.slug, `%${input.searchQuery}%`),
              ),
            ),
          limit: 10,
        })

        return data
      } catch (error) {
        console.error("Error:", error)
        if (error instanceof TRPCError) {
          throw error
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An internal error occurred",
          })
        }
      }
    }),
  create: adminProtectedProcedure
    .input(createMovieSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const slug = await generateUniqueMovieSlug(input.title)

        const generatedMetaTitle = !input.metaTitle
          ? input.title
          : input.metaTitle
        const generatedMetaDescription = !input.metaDescription
          ? (input.overview ?? input.title)
          : input.metaDescription

        const movieId = cuid()

        const data = await ctx.db
          .insert(movies)
          .values({
            ...input,
            id: movieId,
            slug: slug,
            metaTitle: generatedMetaTitle,
            metaDescription: generatedMetaDescription,
          })
          .returning()

        if (input.overview) {
          const overview = await ctx.db
            .insert(overviews)
            .values({
              id: cuid(),
              title: input.title,
              type: "movie",
              content: input.overview,
              // change if we have multiple languages
              language: "en",
            })
            .returning()

          await ctx.db.insert(movieOverviews).values({
            movieId: movieId,
            overviewId: overview[0].id,
          })
        }

        if (input.productionCompanies) {
          const productionCompanyValues = input.productionCompanies.map(
            (productionCompany) => ({
              movieId: data[0].id,
              productionCompanyId: productionCompany,
            }),
          )

          await ctx.db
            .insert(movieProductionCompanies)
            .values(productionCompanyValues)
        }

        if (input.genres) {
          const genreValues = input.genres.map((genre) => ({
            movieId: data[0].id,
            genreId: genre,
          }))

          await ctx.db.insert(movieGenres).values(genreValues)
        }

        return data
      } catch (error) {
        console.error("Error:", error)
        if (error instanceof TRPCError) {
          throw error
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An internal error occurred",
          })
        }
      }
    }),
  update: adminProtectedProcedure
    .input(updateMovieSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const data = await ctx.db
          .update(movies)
          .set({
            ...input,
            updatedAt: sql`CURRENT_TIMESTAMP`,
          })
          .where(eq(movies.id, input.id))
          .returning()

        await ctx.db.transaction(async () => {
          await ctx.db
            .delete(movieOverviews)
            .where(eq(movieOverviews.movieId, input.id))
          await ctx.db
            .delete(movieGenres)
            .where(eq(movieGenres.movieId, input.id))
          await ctx.db
            .delete(movieProductionCompanies)
            .where(eq(movieProductionCompanies.movieId, input.id))
        })

        if (input.overview) {
          const overview = await ctx.db
            .insert(overviews)
            .values({
              id: cuid(),
              title: input.title,
              type: "movie",
              content: input.overview,
              // change if we have multiple languages
              language: "en",
            })
            .returning()

          await ctx.db.insert(movieOverviews).values({
            movieId: input.id,
            overviewId: overview[0].id,
          })
        }

        if (input.productionCompanies) {
          const productionCompanyValues = input.productionCompanies.map(
            (productionCompany) => ({
              movieId: data[0].id,
              productionCompanyId: productionCompany,
            }),
          )

          await ctx.db
            .insert(movieProductionCompanies)
            .values(productionCompanyValues)
        }

        if (input.genres) {
          const genreValues = input.genres.map((genre) => ({
            movieId: data[0].id,
            genreId: genre,
          }))
          await ctx.db.insert(movieGenres).values(genreValues)
        }

        return data
      } catch (error) {
        console.error("Error:", error)
        if (error instanceof TRPCError) {
          throw error
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An internal error occurred",
          })
        }
      }
    }),
  updateWithoutChangeUpdatedDate: adminProtectedProcedure
    .input(updateMovieSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const data = await ctx.db
          .update(movies)
          .set({
            ...input,
          })
          .where(eq(movies.id, input.id))
          .returning()

        await ctx.db.transaction(async () => {
          await ctx.db
            .delete(movieOverviews)
            .where(eq(movieOverviews.movieId, input.id))
          await ctx.db
            .delete(movieGenres)
            .where(eq(movieGenres.movieId, input.id))
          await ctx.db
            .delete(movieProductionCompanies)
            .where(eq(movieProductionCompanies.movieId, input.id))
        })

        if (input.overview) {
          const overview = await ctx.db
            .insert(overviews)
            .values({
              id: cuid(),
              title: input.title,
              type: "movie",
              content: input.overview,
              // change if we have multiple languages
              language: "en",
            })
            .returning()

          await ctx.db.insert(movieOverviews).values({
            movieId: input.id,
            overviewId: overview[0].id,
          })
        }

        if (input.productionCompanies) {
          const productionCompanyValues = input.productionCompanies.map(
            (productionCompany) => ({
              movieId: data[0].id,
              productionCompanyId: productionCompany,
            }),
          )

          await ctx.db
            .insert(movieProductionCompanies)
            .values(productionCompanyValues)
        }

        if (input.genres) {
          const genreValues = input.genres.map((genre) => ({
            movieId: data[0].id,
            genreId: genre,
          }))

          await ctx.db.insert(movieGenres).values(genreValues)
        }

        return data
      } catch (error) {
        console.error("Error:", error)
        if (error instanceof TRPCError) {
          throw error
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An internal error occurred",
          })
        }
      }
    }),
  delete: adminProtectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.transaction(async () => {
          await ctx.db
            .delete(movieOverviews)
            .where(eq(movieOverviews.movieId, input))
          await ctx.db.delete(movieGenres).where(eq(movieGenres.movieId, input))
          await ctx.db
            .delete(movieProductionCompanies)
            .where(eq(movieProductionCompanies.movieId, input))
          await ctx.db.delete(movies).where(eq(movies.id, input))
        })

        return data
      } catch (error) {
        console.error("Error:", error)
        if (error instanceof TRPCError) {
          throw error
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An internal error occurred",
          })
        }
      }
    }),
})
