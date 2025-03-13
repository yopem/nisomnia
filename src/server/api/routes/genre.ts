import { TRPCError } from "@trpc/server"
import { tryCatch } from "@yopem/try-catch"
import { z } from "zod"

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"
import {
  getGenreBySlug,
  getGenresByMoviesCount,
  getGenresCount,
  getGenresSitemap,
  searchGenres,
} from "@/server/db/service/genre"

export const genreRouter = createTRPCRouter({
  bySlug: publicProcedure.input(z.string()).query(async ({ input }) => {
    const { data, error } = await tryCatch(getGenreBySlug(input))
    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error fetching genres",
      })
    }
    return data
  }),

  byMoviesCount: publicProcedure
    .input(z.object({ page: z.number(), perPage: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(getGenresByMoviesCount(input))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching genres",
        })
      }
      return data
    }),

  sitemap: publicProcedure
    .input(z.object({ page: z.number(), perPage: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(getGenresSitemap(input))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching genres",
        })
      }
      return data
    }),

  count: publicProcedure.query(async () => {
    const { data, error } = await tryCatch(getGenresCount())
    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error fetching genres",
      })
    }
    return data
  }),

  search: publicProcedure
    .input(z.object({ searchQuery: z.string(), limit: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(searchGenres(input))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching genres",
        })
      }
      return data
    }),
})
