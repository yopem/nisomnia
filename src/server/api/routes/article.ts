import { TRPCError } from "@trpc/server"
import { tryCatch } from "@yopem/try-catch"
import { z } from "zod"

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"
import { languageType } from "@/server/db/schema"
import {
  getArticleBySlug,
  getArticlesByLanguage,
  getArticlesByTopicId,
  getArticlesByUserId,
  getArticlesCount,
  getArticlesCountByLanguage,
  getArticlesCountByTopicId,
  getArticlesCountByUserId,
  getArticlesSitemap,
  getRelatedArticles,
  searchArticles,
} from "@/server/db/service/article"

export const articleRouter = createTRPCRouter({
  bySlug: publicProcedure.input(z.string()).query(async ({ input }) => {
    const { data, error } = await tryCatch(getArticleBySlug(input))
    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error fetching articles",
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
      const { data, error } = await tryCatch(getArticlesByLanguage(input))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching articles",
        })
      }
      return data
    }),

  related: publicProcedure
    .input(
      z.object({
        currentArticleId: z.string(),
        topicId: z.string(),
        language: languageType,
        limit: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(getRelatedArticles(input))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching articles",
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
      const { data, error } = await tryCatch(getArticlesByTopicId(input))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching articles",
        })
      }
      return data
    }),

  byUserId: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        language: languageType,
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(getArticlesByUserId(input))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching articles",
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
      const { data, error } = await tryCatch(getArticlesSitemap(input))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching articles",
        })
      }
      return data
    }),

  count: publicProcedure.query(async () => {
    const { data, error } = await tryCatch(getArticlesCount())
    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error fetching articles",
      })
    }
    return data
  }),

  countByLanguage: publicProcedure
    .input(languageType)
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(getArticlesCountByLanguage(input))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching articles",
        })
      }
      return data
    }),

  countByTopicId: publicProcedure.input(z.string()).query(async ({ input }) => {
    const { data, error } = await tryCatch(getArticlesCountByTopicId(input))
    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error fetching articles",
      })
    }
    return data
  }),

  countByUserId: publicProcedure.input(z.string()).query(async ({ input }) => {
    const { data, error } = await tryCatch(getArticlesCountByUserId(input))
    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error fetching articles",
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
      const { data, error } = await tryCatch(searchArticles(input))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching articles",
        })
      }
      return data
    }),
})
