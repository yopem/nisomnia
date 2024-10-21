import { TRPCError } from "@trpc/server"
import { and, count, eq, sql } from "drizzle-orm"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/lib/api/trpc"
import {
  articleAuthors,
  articleEditors,
  articles,
  articleTopics,
  articleTranslations,
} from "@/lib/db/schema/article"
import { topics } from "@/lib/db/schema/topic"
import { users } from "@/lib/db/schema/user"
import { cuid, trimText } from "@/lib/utils"
import { generateUniqueArticleSlug } from "@/lib/utils/slug"
import {
  createArticleSchema,
  translateArticleSchema,
  updateArticleSchema,
} from "@/lib/validation/article"
import { languageType } from "@/lib/validation/language"

export const articleRouter = createTRPCRouter({
  articleTranslationById: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      try {
        const articleTranslationData =
          await ctx.db.query.articleTranslations.findFirst({
            where: (articleTranslations, { eq }) =>
              eq(articleTranslations.id, input),
            with: {
              articles: {
                columns: {
                  id: true,
                  title: true,
                  language: true,
                  featuredImage: true,
                },
              },
            },
          })

        const articleTopicsData = await ctx.db
          .select({ id: topics.id, title: topics.title })
          .from(articleTopics)
          .leftJoin(articles, eq(articleTopics.articleId, articles.id))
          .leftJoin(topics, eq(articleTopics.topicId, topics.id))
          .where(eq(articles.id, articleTranslationData?.articles[0].id!))

        const articleAuthorsData = await ctx.db
          .select({ id: users.id, name: users.name })
          .from(articleAuthors)
          .leftJoin(articles, eq(articleAuthors.articleId, articles.id))
          .leftJoin(users, eq(articleAuthors.userId, users.id))
          .where(eq(articles.id, articleTranslationData?.articles[0].id!))

        const articleEditorsData = await ctx.db
          .select({ id: users.id, name: users.name })
          .from(articleEditors)
          .leftJoin(articles, eq(articleEditors.articleId, articles.id))
          .leftJoin(users, eq(articleEditors.userId, users.id))
          .where(eq(articles.id, articleTranslationData?.articles[0].id!))

        const articleData = articleTranslationData?.articles.map((item) => ({
          ...item,
          topics: articleTopicsData,
          authors: articleAuthorsData,
          editors: articleEditorsData,
        }))

        const data = {
          ...articleTranslationData,
          articles: articleData,
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
  byId: adminProtectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      try {
        const articleData = await ctx.db
          .select()
          .from(articles)
          .where(eq(articles.id, input))
          .limit(1)

        const articleTopicsData = await ctx.db
          .select({ id: topics.id, title: topics.title })
          .from(articleTopics)
          .leftJoin(articles, eq(articleTopics.articleId, articles.id))
          .leftJoin(topics, eq(articleTopics.topicId, topics.id))
          .where(eq(articles.id, input))

        const articleAuthorsData = await ctx.db
          .select({ id: users.id, name: users.name })
          .from(articleAuthors)
          .leftJoin(articles, eq(articleAuthors.articleId, articles.id))
          .leftJoin(users, eq(articleAuthors.userId, users.id))
          .where(eq(articles.id, input))

        const articleEditorsData = await ctx.db
          .select({ id: users.id, name: users.name })
          .from(articleEditors)
          .leftJoin(articles, eq(articleEditors.articleId, articles.id))
          .leftJoin(users, eq(articleEditors.userId, users.id))
          .where(eq(articles.id, input))

        const data = articleData.map((item) => ({
          ...item,
          topics: articleTopicsData,
          authors: articleAuthorsData,
          editors: articleEditorsData,
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
      const articleData = await ctx.db
        .select()
        .from(articles)
        .where(eq(articles.slug, input))
        .limit(1)

      const articleTopicsData = await ctx.db
        .select({ id: topics.id, title: topics.title, slug: topics.slug })
        .from(articleTopics)
        .leftJoin(articles, eq(articleTopics.articleId, articles.id))
        .leftJoin(topics, eq(articleTopics.topicId, topics.id))
        .where(eq(articles.id, articleData[0].id))

      const articleAuthorsData = await ctx.db
        .select({ id: users.id, name: users.name, username: users.username })
        .from(articleAuthors)
        .leftJoin(articles, eq(articleAuthors.articleId, articles.id))
        .leftJoin(users, eq(articleAuthors.userId, users.id))
        .where(eq(articles.id, articleData[0].id))

      const articleEditorsData = await ctx.db
        .select({ id: users.id, name: users.name })
        .from(articleEditors)
        .leftJoin(articles, eq(articleEditors.articleId, articles.id))
        .leftJoin(users, eq(articleEditors.userId, users.id))
        .where(eq(articles.id, articleData[0].id))

      const data = articleData.map((item) => ({
        ...item,
        topics: articleTopicsData,
        authors: articleAuthorsData,
        editors: articleEditorsData,
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
        const data = await ctx.db.query.articles.findMany({
          where: (articles, { eq, and }) =>
            and(
              eq(articles.language, input.language),
              eq(articles.status, "published"),
            ),
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          orderBy: (articles, { desc }) => [desc(articles.updatedAt)],
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

        const data = await ctx.db.query.articles.findMany({
          where: (articles, { eq, and, lt }) =>
            and(
              eq(articles.language, input.language),
              eq(articles.status, "published"),
              input.cursor
                ? lt(articles.updatedAt, new Date(input.cursor))
                : undefined,
            ),
          limit: limit + 1,
          orderBy: (articles, { desc }) => [desc(articles.updatedAt)],
        })

        let nextCursor: Date | undefined = undefined

        if (data.length > limit) {
          const nextItem = data.pop()
          if (nextItem?.updatedAt) {
            nextCursor = nextItem.updatedAt
          }
        }

        return {
          articles: data,
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
        const articles = await ctx.db.query.articles.findMany({
          where: (articles, { eq, and }) =>
            and(
              eq(articles.language, input.language),
              eq(articles.status, "published"),
            ),
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          orderBy: (articles, { desc }) => [desc(articles.updatedAt)],
          with: {
            topics: true,
          },
        })

        const data = articles.filter((article) =>
          article.topics.some((topic) => topic.topicId === input.topicId),
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

        const articles = await ctx.db.query.articles.findMany({
          where: (articles, { eq, and, lt }) =>
            and(
              eq(articles.language, input.language),
              eq(articles.status, "published"),
              input.cursor
                ? lt(articles.updatedAt, new Date(input.cursor))
                : undefined,
            ),
          limit: limit + 1,
          orderBy: (articles, { desc }) => [desc(articles.updatedAt)],
          with: {
            topics: true,
          },
        })

        const data = articles.filter((article) =>
          article.topics.some((topic) => topic.topicId === input.topicId),
        )

        let nextCursor: Date | undefined = undefined

        if (data.length > limit) {
          const nextItem = data.pop()
          if (nextItem?.updatedAt) {
            nextCursor = nextItem.updatedAt
          }
        }

        return {
          articles: data,
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
  byAuthorId: publicProcedure
    .input(
      z.object({
        authorId: z.string(),
        language: languageType,
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const articles = await ctx.db.query.articles.findMany({
          where: (articles, { eq, and }) =>
            and(
              eq(articles.language, input.language),
              eq(articles.status, "published"),
            ),
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          orderBy: (articles, { desc }) => [desc(articles.updatedAt)],
          with: {
            authors: true,
          },
        })

        const data = articles.filter((article) =>
          article.authors.some((author) => author.userId === input.authorId),
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
  byAuthorIdInfinite: publicProcedure
    .input(
      z.object({
        authorId: z.string(),
        language: languageType,
        limit: z.number().min(1).max(100).nullable(),
        cursor: z.date().optional().nullable(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const limit = input.limit ?? 50

        const articles = await ctx.db.query.articles.findMany({
          where: (articles, { eq, and, lt }) =>
            and(
              eq(articles.language, input.language),
              eq(articles.status, "published"),
              input.cursor
                ? lt(articles.updatedAt, new Date(input.cursor))
                : undefined,
            ),
          limit: limit + 1,
          orderBy: (articles, { desc }) => [desc(articles.updatedAt)],
          with: {
            authors: true,
          },
        })

        const data = articles.filter((article) =>
          article.authors.some((author) => author.userId === input.authorId),
        )

        let nextCursor: Date | undefined = undefined

        if (data.length > limit) {
          const nextItem = data.pop()
          if (nextItem?.updatedAt) {
            nextCursor = nextItem.updatedAt
          }
        }

        return {
          articles: data,
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
        currentArticleId: z.string(),
        language: languageType,
        limit: z.number().min(1).max(100).nullable(),
        cursor: z.date().optional().nullable(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const limit = input.limit ?? 50

        const articles = await ctx.db.query.articles.findMany({
          where: (articles, { eq, and, not, lt }) =>
            and(
              eq(articles.language, input.language),
              eq(articles.status, "published"),
              input.cursor
                ? lt(articles.updatedAt, new Date(input.cursor))
                : undefined,
              not(eq(articles.id, input.currentArticleId)),
            ),
          limit: limit + 1,
          orderBy: (articles, { desc }) => [desc(articles.updatedAt)],
          with: {
            topics: true,
          },
        })

        const data = articles.filter((article) =>
          article.topics.some((topic) => topic.topicId === input.topicId),
        )

        let nextCursor: Date | undefined = undefined

        if (data.length > limit) {
          const nextItem = data.pop()
          if (nextItem?.updatedAt) {
            nextCursor = nextItem.updatedAt
          }
        }

        return {
          articles: data,
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
        language: languageType,
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.articles.findMany({
          where: (articles, { eq }) => eq(articles.language, input.language),
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          orderBy: (articles, { desc }) => [desc(articles.updatedAt)],
          with: {
            articleTranslation: {
              columns: {
                id: true,
              },
              with: {
                articles: {
                  columns: {
                    id: true,
                    title: true,
                    language: true,
                    featuredImage: true,
                  },
                },
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
        const data = await ctx.db.query.articles.findMany({
          where: (articles, { eq, and }) =>
            and(
              eq(articles.language, input.language),
              eq(articles.status, "published"),
            ),
          columns: {
            slug: true,
            updatedAt: true,
          },
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          orderBy: (articles, { desc }) => [desc(articles.id)],
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
        .from(articles)
        .where(and(eq(articles.status, "published")))

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
      const data = await ctx.db.select({ value: count() }).from(articles)

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
          .from(articles)
          .where(
            and(eq(articles.language, input), eq(articles.status, "published")),
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
  search: publicProcedure
    .input(z.object({ language: languageType, searchQuery: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.articles.findMany({
          where: (articles, { eq, and, or, ilike }) =>
            and(
              eq(articles.language, input.language),
              eq(articles.status, "published"),
              or(
                ilike(articles.title, `%${input.searchQuery}%`),
                ilike(articles.slug, `%${input.searchQuery}%`),
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
        const data = await ctx.db.query.articles.findMany({
          where: (articles, { eq, and, or, ilike }) =>
            and(
              eq(articles.language, input.language),
              or(
                ilike(articles.title, `%${input.searchQuery}%`),
                ilike(articles.slug, `%${input.searchQuery}%`),
              ),
            ),
          with: {
            articleTranslation: {
              with: {
                articles: true,
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
  create: adminProtectedProcedure
    .input(createArticleSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const slug = await generateUniqueArticleSlug(input.title)

        const generatedExcerpt = !input.excerpt
          ? trimText(input.content, 160)
          : input.excerpt
        const generatedMetaTitle = !input.metaTitle
          ? input.title
          : input.metaTitle
        const generatedMetaDescription = !input.metaDescription
          ? generatedExcerpt
          : input.metaDescription

        const articleTranslationId = cuid()
        const articleId = cuid()

        const articleTranslation = await ctx.db
          .insert(articleTranslations)
          .values({
            id: articleTranslationId,
          })
          .returning()

        const data = await ctx.db
          .insert(articles)
          .values({
            ...input,
            id: articleId,
            slug: slug,
            excerpt: generatedExcerpt,
            metaTitle: generatedMetaTitle,
            metaDescription: generatedMetaDescription,
            articleTranslationId: articleTranslation[0].id,
          })
          .returning()

        const topicValues = input.topics.map((topic) => ({
          articleId: data[0].id,
          topicId: topic,
        }))

        const authorValues = input.authors.map((author) => ({
          articleId: data[0].id,
          userId: author,
        }))

        const editorValues = input.editors.map((editor) => ({
          articleId: data[0].id,
          userId: editor,
        }))

        await ctx.db.transaction(async () => {
          await ctx.db.insert(articleTopics).values(topicValues)
          await ctx.db.insert(articleAuthors).values(authorValues)
          await ctx.db.insert(articleEditors).values(editorValues)
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
  update: adminProtectedProcedure
    .input(updateArticleSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const data = await ctx.db
          .update(articles)
          .set({
            ...input,
            updatedAt: sql`CURRENT_TIMESTAMP`,
          })
          .where(eq(articles.id, input.id))
          .returning()

        await ctx.db.transaction(async () => {
          await ctx.db
            .delete(articleTopics)
            .where(eq(articleTopics.articleId, input.id))
          await ctx.db
            .delete(articleAuthors)
            .where(eq(articleAuthors.articleId, input.id))
          await ctx.db
            .delete(articleEditors)
            .where(eq(articleEditors.articleId, input.id))
        })

        const topicValues = input.topics.map((topic) => ({
          articleId: data[0].id,
          topicId: topic,
        }))

        const authorValues = input.authors.map((author) => ({
          articleId: data[0].id,
          userId: author,
        }))

        const editorValues = input.editors.map((editor) => ({
          articleId: data[0].id,
          userId: editor,
        }))

        await ctx.db.transaction(async () => {
          await ctx.db.insert(articleAuthors).values(authorValues)
          await ctx.db.insert(articleTopics).values(topicValues)
          await ctx.db.insert(articleEditors).values(editorValues)
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
  updateWithoutChangeUpdatedDate: adminProtectedProcedure
    .input(updateArticleSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const data = await ctx.db
          .update(articles)
          .set({
            ...input,
          })
          .where(eq(articles.id, input.id))
          .returning()

        await ctx.db.transaction(async () => {
          await ctx.db
            .delete(articleTopics)
            .where(eq(articleTopics.articleId, input.id))
          await ctx.db
            .delete(articleAuthors)
            .where(eq(articleAuthors.articleId, input.id))
          await ctx.db
            .delete(articleEditors)
            .where(eq(articleEditors.articleId, input.id))
        })

        const topicValues = input.topics.map((topic) => ({
          articleId: data[0].id,
          topicId: topic,
        }))

        const authorValues = input.authors.map((author) => ({
          articleId: data[0].id,
          userId: author,
        }))

        const editorValues = input.editors.map((editor) => ({
          articleId: data[0].id,
          userId: editor,
        }))

        await ctx.db.transaction(async () => {
          await ctx.db.insert(articleAuthors).values(authorValues)
          await ctx.db.insert(articleEditors).values(editorValues)
          await ctx.db.insert(articleTopics).values(topicValues)
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
  translate: adminProtectedProcedure
    .input(translateArticleSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const slug = await generateUniqueArticleSlug(input.title)
        const generatedExcerpt = !input.excerpt
          ? trimText(input.content, 160)
          : input.excerpt
        const generatedMetaTitle = !input.metaTitle
          ? input.title
          : input.metaTitle
        const generatedMetaDescription = !input.metaDescription
          ? generatedExcerpt
          : input.metaDescription

        const data = await ctx.db
          .insert(articles)
          .values({
            id: cuid(),
            slug: slug,
            excerpt: generatedExcerpt,
            metaTitle: generatedMetaTitle,
            metaDescription: generatedMetaDescription,
            ...input,
          })
          .returning()

        const topicValues = input.topics.map((topic) => ({
          articleId: data[0].id,
          topicId: topic,
        }))

        const authorValues = input.authors.map((author) => ({
          articleId: data[0].id,
          userId: author,
        }))

        const editorValues = input.editors.map((editor) => ({
          articleId: data[0].id,
          userId: editor,
        }))

        await ctx.db.transaction(async () => {
          await ctx.db.insert(articleAuthors).values(authorValues)
          await ctx.db.insert(articleTopics).values(topicValues)
          await ctx.db.insert(articleEditors).values(editorValues)
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
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        const article = await ctx.db.query.articles.findFirst({
          where: (articles, { eq }) => eq(articles.id, input),
          with: { authors: true },
        })

        const isUserAuthor = article?.authors.some(
          (author) => author.userId === ctx.session.user.id,
        )

        if (!isUserAuthor) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Only the author of the article is allowed to delete it.",
          })
        }

        const data = await ctx.db.transaction(async () => {
          await ctx.db
            .delete(articleTopics)
            .where(eq(articleTopics.articleId, input))
          await ctx.db
            .delete(articleAuthors)
            .where(eq(articleAuthors.articleId, input))
          await ctx.db
            .delete(articleEditors)
            .where(eq(articleEditors.articleId, input))
          await ctx.db.delete(articles).where(eq(articles.id, input))
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
  deleteByAdmin: adminProtectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.transaction(async () => {
          await ctx.db
            .delete(articleTopics)
            .where(eq(articleTopics.articleId, input))
          await ctx.db
            .delete(articleAuthors)
            .where(eq(articleAuthors.articleId, input))
          await ctx.db
            .delete(articleEditors)
            .where(eq(articleEditors.articleId, input))
          await ctx.db.delete(articles).where(eq(articles.id, input))
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
