import { TRPCError } from "@trpc/server"
import { tryCatch } from "@yopem/try-catch"
import { z } from "zod"

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"
import { languageType } from "@/server/db/schema"
import {
  getFeedsByLanguage,
  getFeedsByOwner,
  getFeedsByTopicId,
  getFeedsCount,
  getFeedsCountByLanguage,
  getFeedsSitemap,
  searchFeeds,
} from "@/server/db/service/feed"

export const feedRouter = createTRPCRouter({
  byLanguage: publicProcedure
    .input(
      z.object({
        language: languageType,
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(getFeedsByLanguage(input))

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching ads",
        })
      }

      return data
    }),

  byTopicId: publicProcedure
    .input(
      z.object({
        topicId: z.string(),
        language: languageType,
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(getFeedsByTopicId(input))

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching ads",
        })
      }

      return data
    }),

  byOwner: publicProcedure
    .input(
      z.object({
        owner: z.string(),
        language: languageType,
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(getFeedsByOwner(input))

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching ads",
        })
      }

      return data
    }),

  sitemap: publicProcedure
    .input(
      z.object({
        language: languageType,
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(getFeedsSitemap(input))

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching ads",
        })
      }

      return data
    }),

  count: publicProcedure.query(async () => {
    const { data, error } = await tryCatch(getFeedsCount())

    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error fetching ads",
      })
    }

    return data
  }),

  countByLanguage: publicProcedure
    .input(languageType)
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(getFeedsCountByLanguage(input))

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching ads",
        })
      }

      return data
    }),

  search: publicProcedure
    .input(
      z.object({
        language: languageType,
        searchQuery: z.string(),
        limit: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(searchFeeds(input))

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching ads",
        })
      }

      return data
    }),
})
