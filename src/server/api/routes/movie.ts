import { TRPCError } from "@trpc/server"
import { tryCatch } from "@yopem/try-catch"
import { z } from "zod"

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"
import {
  getLatestMovies,
  getMovieBySlug,
  getMoviesByGenreId,
  getMoviesByProductionCompanyId,
  getMoviesCount,
  getMoviesCountByGenreId,
  getMoviesSitemap,
  getRelatedMovies,
  searchMovies,
} from "@/server/db/service/movie"

export const movieRouter = createTRPCRouter({
  bySlug: publicProcedure.input(z.string()).query(async ({ input }) => {
    const { data, error } = await tryCatch(getMovieBySlug(input))
    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error fetching movies",
      })
    }
    return data
  }),

  latest: publicProcedure
    .input(z.object({ page: z.number(), perPage: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(getLatestMovies(input))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching movies",
        })
      }
      return data
    }),

  related: publicProcedure
    .input(
      z.object({
        currentMovieId: z.string(),
        genreId: z.string(),
        limit: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(getRelatedMovies(input))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching movies",
        })
      }
      return data
    }),

  byGenreId: publicProcedure
    .input(
      z.object({ genreId: z.string(), page: z.number(), perPage: z.number() }),
    )
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(getMoviesByGenreId(input))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching movies",
        })
      }
      return data
    }),

  byProductionCompanyId: publicProcedure
    .input(
      z.object({
        productionCompanyId: z.string(),
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(
        getMoviesByProductionCompanyId(input),
      )
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching movies",
        })
      }
      return data
    }),

  sitemap: publicProcedure
    .input(z.object({ page: z.number(), perPage: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(getMoviesSitemap(input))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching movies",
        })
      }
      return data
    }),

  count: publicProcedure.query(async () => {
    const { data, error } = await tryCatch(getMoviesCount())
    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error fetching movies",
      })
    }
    return data
  }),

  countByGenreId: publicProcedure.input(z.string()).query(async ({ input }) => {
    const { data, error } = await tryCatch(getMoviesCountByGenreId(input))
    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error fetching movies",
      })
    }
    return data
  }),

  search: publicProcedure
    .input(z.object({ searchQuery: z.string(), limit: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(searchMovies(input))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching movies",
        })
      }
      return data
    }),
})
