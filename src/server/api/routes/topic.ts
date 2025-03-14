import { TRPCError } from "@trpc/server"
import { tryCatch } from "@yopem/try-catch"
import { z } from "zod"

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"
import { languageType } from "@/server/db/schema"
import {
  getTopicBySlug,
  getTopicsByArticlesCount,
  getTopicsByLanguage,
  getTopicsCount,
  getTopicsCountByLanguage,
  getTopicsSitemap,
  searchTopics,
} from "@/server/db/service/topic"

export const topicRouter = createTRPCRouter({
  bySlug: publicProcedure.input(z.string()).query(async ({ input }) => {
    const { data, error } = await tryCatch(getTopicBySlug(input))
    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error fetching topic",
      })
    }
    return data
  }),

  byLanguage: publicProcedure
    .input(
      z.object({
        language: languageType,
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(getTopicsByLanguage(input))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching topics",
        })
      }
      return data
    }),

  byArticlesCount: publicProcedure
    .input(
      z.object({
        language: languageType,
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(getTopicsByArticlesCount(input))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching topics",
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
      const { data, error } = await tryCatch(getTopicsSitemap(input))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching topics",
        })
      }
      return data
    }),

  count: publicProcedure.query(async () => {
    const { data, error } = await tryCatch(getTopicsCount())
    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error fetching topics count",
      })
    }
    return data
  }),

  countByLanguage: publicProcedure
    .input(languageType)
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(getTopicsCountByLanguage(input))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching topics count",
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
      const { data, error } = await tryCatch(searchTopics(input))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching topics",
        })
      }
      return data
    }),
})
