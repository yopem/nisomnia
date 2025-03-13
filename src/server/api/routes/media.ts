import { TRPCError } from "@trpc/server"
import { tryCatch } from "@yopem/try-catch"
import { z } from "zod"

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"
import { mediaCategory } from "@/server/db/schema"
import {
  getMediasByCategory,
  getMediasCount,
  getMediaSitemap,
  searchMedias,
  searchMediasByCategory,
} from "@/server/db/service/media"

export const mediaRouter = createTRPCRouter({
  byCategory: publicProcedure.input(mediaCategory).query(async ({ input }) => {
    const { data, error } = await tryCatch(getMediasByCategory(input))
    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error fetching media",
      })
    }
    return data
  }),

  sitemap: publicProcedure
    .input(z.object({ page: z.number(), perPage: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(getMediaSitemap(input))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching media",
        })
      }
      return data
    }),

  count: publicProcedure.query(async () => {
    const { data, error } = await tryCatch(getMediasCount())
    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error fetching media",
      })
    }
    return data
  }),

  search: publicProcedure
    .input(z.object({ searchQuery: z.string(), limit: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(searchMedias(input))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching media",
        })
      }
      return data
    }),

  searchByCategory: publicProcedure
    .input(
      z.object({
        searchQuery: z.string(),
        category: mediaCategory,
        limit: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(searchMediasByCategory(input))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching media",
        })
      }
      return data
    }),
})
