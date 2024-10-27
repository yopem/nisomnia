import { TRPCError } from "@trpc/server"
import { and, count, desc, eq, sql } from "drizzle-orm"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "@/lib/api/trpc"
import { articleTopics, topics, topicTranslations } from "@/lib/db/schema"
import { cuid } from "@/lib/utils"
import { generateUniqueTopicSlug } from "@/lib/utils/slug"
import { languageType } from "@/lib/validation/language"
import {
  createTopicSchema,
  topicVisibility,
  translateTopicSchema,
  updateTopicSchema,
} from "@/lib/validation/topic"

export const topicRouter = createTRPCRouter({
  topicTranslationById: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.topicTranslations.findFirst({
          where: (topicTranslations, { eq }) => eq(topicTranslations.id, input),
          with: {
            topics: true,
          },
        })

        return data ?? null
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
        language: languageType,
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.topics.findMany({
          where: (topics, { eq }) => eq(topics.language, input.language),
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          orderBy: (users, { desc }) => [desc(users.updatedAt)],
          with: {
            topicTranslation: {
              with: {
                topics: true,
              },
            },
          },
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
  byId: adminProtectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.topics.findFirst({
          where: (topics, { eq }) => eq(topics.id, input),
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
        const data = await ctx.db.query.topics.findMany({
          where: (topics, { and, eq }) =>
            and(
              eq(topics.language, input.language),
              eq(topics.status, "published"),
            ),
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          orderBy: (topics, { desc }) => [desc(topics.createdAt)],
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
  byArticleCount: publicProcedure
    .input(
      z.object({
        language: languageType,
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db
          .select({
            id: topics.id,
            title: topics.title,
            slug: topics.slug,
            language: topics.language,
            count: sql<number>`count(${articleTopics.articleId})`.mapWith(
              Number,
            ),
          })
          .from(topics)
          .where(
            and(
              eq(topics.language, input.language),
              eq(topics.status, "published"),
              eq(topics.visibility, "public"),
            ),
          )
          .leftJoin(articleTopics, eq(articleTopics.topicId, topics.id))
          .limit(input.perPage)
          .offset((input.page - 1) * input.perPage)
          .groupBy(topics.id)
          .orderBy(desc(count(articleTopics.articleId)))

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
        const data = await ctx.db.query.topics.findMany({
          where: (topics, { eq, and }) =>
            and(
              eq(topics.language, input.language),
              eq(topics.status, "published"),
            ),
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          orderBy: (topics, { desc }) => [desc(topics.updatedAt)],
          columns: {
            slug: true,
            updatedAt: true,
          },
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
  byVisibility: publicProcedure
    .input(
      z.object({
        visibility: topicVisibility,
        language: languageType,
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.topics.findMany({
          where: (topics, { eq, and }) =>
            and(
              eq(topics.visibility, input.visibility),
              eq(topics.language, input.language),
              eq(topics.status, "published"),
            ),
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          orderBy: (topics, { desc }) => [desc(topics.updatedAt)],
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
  bySlug: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    try {
      const data = await ctx.db.query.topics.findFirst({
        where: (topics, { eq }) => eq(topics.slug, input),
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
  search: publicProcedure
    .input(z.object({ language: languageType, searchQuery: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.topics.findMany({
          where: (topics, { eq, and, or, ilike }) =>
            and(
              eq(topics.language, input.language),
              eq(topics.visibility, "public"),
              eq(topics.status, "published"),
              or(
                ilike(topics.title, `%${input.searchQuery}%`),
                ilike(topics.slug, `%${input.searchQuery}%`),
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
    .input(z.string())
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.topics.findMany({
          where: (topics, { or, ilike }) =>
            or(
              ilike(topics.title, `%${input}%`),
              ilike(topics.slug, `%${input}%`),
            ),
          with: {
            topicTranslation: {
              with: {
                topics: true,
              },
            },
          },
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
  count: publicProcedure.query(async ({ ctx }) => {
    try {
      const data = await ctx.db
        .select({ value: count() })
        .from(topics)
        .where(eq(topics.status, "published"))

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
      const data = await ctx.db.select({ value: count() }).from(topics)

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
          .from(topics)
          .where(
            and(eq(topics.language, input), eq(topics.status, "published")),
          )

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
  create: adminProtectedProcedure
    .input(createTopicSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const slug = await generateUniqueTopicSlug(input.title)
        const generatedMetaTitle = !input.metaTitle
          ? input.title
          : input.metaTitle
        const generatedMetaDescription = !input.metaDescription
          ? input.description
          : input.metaDescription

        const topicTranslationId = cuid()
        const topicId = cuid()

        const topicTranslation = await ctx.db
          .insert(topicTranslations)
          .values({
            id: topicTranslationId,
          })
          .returning()

        const data = await ctx.db
          .insert(topics)
          .values({
            id: topicId,
            slug: slug,
            metaTitle: generatedMetaTitle,
            metaDescription: generatedMetaDescription,
            topicTranslationId: topicTranslation[0].id,
            ...input,
          })
          .returning()

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
    .input(updateTopicSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const data = await ctx.db
          .update(topics)
          .set({
            ...input,
            updatedAt: sql`CURRENT_TIMESTAMP`,
          })
          .where(eq(topics.id, input.id))

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
  translate: adminProtectedProcedure
    .input(translateTopicSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const slug = await generateUniqueTopicSlug(input.title)
        const generatedMetaTitle = !input.metaTitle
          ? input.title
          : input.metaTitle
        const generatedMetaDescription = !input.metaDescription
          ? input.description
          : input.metaDescription

        const data = await ctx.db.insert(topics).values({
          id: cuid(),
          slug: slug,
          metaTitle: generatedMetaTitle,
          metaDescription: generatedMetaDescription,
          ...input,
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
  delete: adminProtectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        const topic = await ctx.db.query.topics.findFirst({
          where: (topic, { eq }) => eq(topic.id, input),
        })

        if (topic) {
          const checkIfTopicTranslationHasTopic =
            await ctx.db.query.topicTranslations.findMany({
              where: (topicTranslations, { eq }) =>
                eq(topicTranslations.id, topic.topicTranslationId),
              with: {
                topics: true,
              },
            })

          if (checkIfTopicTranslationHasTopic[0]?.topics.length === 1) {
            const data = await ctx.db.transaction(async () => {
              await ctx.db
                .delete(articleTopics)
                .where(eq(articleTopics.topicId, input))

              await ctx.db.delete(topics).where(eq(topics.id, input))

              await ctx.db
                .delete(topicTranslations)
                .where(eq(topicTranslations.id, topic.topicTranslationId))
            })

            return data
          } else {
            const data = await ctx.db.transaction(async () => {
              await ctx.db
                .delete(articleTopics)
                .where(eq(articleTopics.topicId, input))

              await ctx.db.delete(topics).where(eq(topics.id, input))
            })

            return data
          }
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
})
