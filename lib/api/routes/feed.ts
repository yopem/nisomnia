import { TRPCError } from "@trpc/server"
import { count, eq, sql } from "drizzle-orm"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "@/lib/api/trpc"
import { feeds, feedTopics, topics } from "@/lib/db/schema"
import { cuid } from "@/lib/utils"
import { generateUniqueFeedSlug } from "@/lib/utils/slug"
import { createFeedSchema, updateFeedSchema } from "@/lib/validation/feed"
import { languageType } from "@/lib/validation/language"

export const feedRouter = createTRPCRouter({
  byId: adminProtectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      try {
        const feedData = await ctx.db
          .select()
          .from(feeds)
          .where(eq(feeds.id, input))
          .limit(1)

        const feedTopicsData = await ctx.db
          .select({ id: topics.id, title: topics.title })
          .from(feedTopics)
          .leftJoin(feeds, eq(feedTopics.feedId, feeds.id))
          .leftJoin(topics, eq(feedTopics.topicId, topics.id))
          .where(eq(feeds.id, input))

        const data = feedData.map((item) => ({
          ...item,
          topics: feedTopicsData,
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
  byLanguage: publicProcedure
    .input(
      z.object({
        language: languageType,
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.feeds.findMany({
          where: (feeds, { eq }) => eq(feeds.language, input.language),

          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          orderBy: (feeds, { desc }) => [desc(feeds.updatedAt)],
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
  byLanguageInfinite: publicProcedure
    .input(
      z.object({
        language: languageType,
        limit: z.number().min(1).max(100).nullable(),
        cursor: z.date().optional().nullable(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const limit = input.limit ?? 50

        const data = await ctx.db.query.feeds.findMany({
          where: (feeds, { eq, and, lt }) =>
            and(
              eq(feeds.language, input.language),
              input.cursor
                ? lt(feeds.updatedAt, new Date(input.cursor))
                : undefined,
            ),
          limit: limit + 1,
          orderBy: (feeds, { desc }) => [desc(feeds.updatedAt)],
        })

        let nextCursor: Date | undefined = undefined

        if (data.length > limit) {
          const nextItem = data.pop()
          if (nextItem?.updatedAt) {
            nextCursor = nextItem.updatedAt
          }
        }

        return {
          feeds: data,
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
  byTopicId: publicProcedure
    .input(
      z.object({
        topicId: z.string(),
        language: languageType,
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const feeds = await ctx.db.query.feeds.findMany({
          where: (feeds, { eq }) => eq(feeds.language, input.language),
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          orderBy: (feeds, { desc }) => [desc(feeds.updatedAt)],
          with: {
            topics: true,
          },
        })

        const data = feeds.filter((feed) =>
          feed.topics.some((topic) => topic.topicId === input.topicId),
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
  byTopicIdInfinite: publicProcedure
    .input(
      z.object({
        topicId: z.string(),
        language: languageType,
        limit: z.number().min(1).max(100).nullable(),
        cursor: z.date().optional().nullable(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const limit = input.limit ?? 50

        const feeds = await ctx.db.query.feeds.findMany({
          where: (feeds, { eq, and, lt }) =>
            and(
              eq(feeds.language, input.language),
              input.cursor
                ? lt(feeds.updatedAt, new Date(input.cursor))
                : undefined,
            ),
          limit: limit + 1,
          orderBy: (feeds, { desc }) => [desc(feeds.updatedAt)],
          with: {
            topics: true,
          },
        })

        const data = feeds.filter((feed) =>
          feed.topics.some((topic) => topic.topicId === input.topicId),
        )

        let nextCursor: Date | undefined = undefined

        if (data.length > limit) {
          const nextItem = data.pop()
          if (nextItem?.updatedAt) {
            nextCursor = nextItem.updatedAt
          }
        }

        return {
          feeds: data,
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
  byOwner: publicProcedure
    .input(
      z.object({
        owner: z.string(),
        language: languageType,
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.feeds.findMany({
          where: (feeds, { and, eq }) =>
            and(
              eq(feeds.language, input.language),
              eq(feeds.owner, input.owner),
            ),
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          orderBy: (feeds, { desc }) => [desc(feeds.updatedAt)],
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
  byOwnerInfinite: publicProcedure
    .input(
      z.object({
        owner: z.string(),
        language: languageType,
        limit: z.number().min(1).max(100).nullable(),
        cursor: z.date().optional().nullable(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const limit = input.limit ?? 50

        const data = await ctx.db.query.feeds.findMany({
          where: (feeds, { eq, and, lt }) =>
            and(
              eq(feeds.language, input.language),
              eq(feeds.owner, input.owner),
              input.cursor
                ? lt(feeds.updatedAt, new Date(input.cursor))
                : undefined,
            ),
          limit: limit + 1,
          orderBy: (feeds, { desc }) => [desc(feeds.updatedAt)],
        })

        let nextCursor: Date | undefined = undefined

        if (data.length > limit) {
          const nextItem = data.pop()
          if (nextItem?.updatedAt) {
            nextCursor = nextItem.updatedAt
          }
        }

        return {
          feeds: data,
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
        topicId: z.string(),
        currentFeedId: z.string(),
        language: languageType,
        limit: z.number().min(1).max(100).nullable(),
        cursor: z.date().optional().nullable(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const limit = input.limit ?? 50

        const feeds = await ctx.db.query.feeds.findMany({
          where: (feeds, { eq, and, not, lt }) =>
            and(
              eq(feeds.language, input.language),
              input.cursor
                ? lt(feeds.updatedAt, new Date(input.cursor))
                : undefined,
              not(eq(feeds.id, input.currentFeedId)),
            ),
          limit: limit + 1,
          orderBy: (feeds, { desc }) => [desc(feeds.updatedAt)],
          with: {
            topics: true,
          },
        })

        const data = feeds.filter((feed) =>
          feed.topics.some((topic) => topic.topicId === input.topicId),
        )

        let nextCursor: Date | undefined = undefined

        if (data.length > limit) {
          const nextItem = data.pop()
          if (nextItem?.updatedAt) {
            nextCursor = nextItem.updatedAt
          }
        }

        return {
          feeds: data,
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
        const data = await ctx.db.query.feeds.findMany({
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          orderBy: (feeds, { desc }) => [desc(feeds.updatedAt)],
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
        language: languageType,
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.feeds.findMany({
          where: (feeds, { eq }) => eq(feeds.language, input.language),

          columns: {
            slug: true,
            updatedAt: true,
          },
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          orderBy: (feeds, { desc }) => [desc(feeds.id)],
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
      const data = await ctx.db.select({ value: count() }).from(feeds)

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
      const data = await ctx.db.select({ value: count() }).from(feeds)

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
  countByLanguage: publicProcedure
    .input(languageType)
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db
          .select({ values: count() })
          .from(feeds)
          .where(eq(feeds.language, input))

        return data[0].values
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
        const data = await ctx.db.query.feeds.findMany({
          where: (feeds, { eq, and, or, ilike }) =>
            and(
              eq(feeds.language, input.language),
              or(
                ilike(feeds.title, `%${input.searchQuery}%`),
                ilike(feeds.slug, `%${input.searchQuery}%`),
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
        const data = await ctx.db.query.feeds.findMany({
          where: (feeds, { eq, and, or, ilike }) =>
            and(
              eq(feeds.language, input.language),
              or(
                ilike(feeds.title, `%${input.searchQuery}%`),
                ilike(feeds.slug, `%${input.searchQuery}%`),
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
    .input(createFeedSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const slug = await generateUniqueFeedSlug(input.title)

        const data = await ctx.db
          .insert(feeds)
          .values({
            id: cuid(),
            slug: slug,
            ...input,
          })
          .returning()

        const topicValues = input.topics.map((topic) => ({
          feedId: data[0].id,
          topicId: topic,
        }))

        await ctx.db.insert(feedTopics).values(topicValues)

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
    .input(updateFeedSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const data = await ctx.db
          .update(feeds)
          .set({
            ...input,
            updatedAt: sql`CURRENT_TIMESTAMP`,
          })
          .where(eq(feeds.id, input.id))
          .returning()

        await ctx.db.delete(feedTopics).where(eq(feedTopics.feedId, input.id))

        const topicValues = input.topics.map((topic) => ({
          feedId: data[0].id,
          topicId: topic,
        }))

        await ctx.db.insert(feedTopics).values(topicValues)

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
    .input(updateFeedSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const data = await ctx.db
          .update(feeds)
          .set({
            ...input,
          })
          .where(eq(feeds.id, input.id))
          .returning()

        await ctx.db.delete(feedTopics).where(eq(feedTopics.feedId, input.id))

        const topicValues = input.topics.map((topic) => ({
          feedId: data[0].id,
          topicId: topic,
        }))

        await ctx.db.insert(feedTopics).values(topicValues)

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
        const data = await ctx.db.delete(feeds).where(eq(feeds.id, input))

        await ctx.db.delete(feedTopics).where(eq(feedTopics.feedId, input))

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
