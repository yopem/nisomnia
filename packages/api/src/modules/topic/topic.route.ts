import { TRPCError } from "@trpc/server"
import { z } from "zod"

import { slugify, uniqueCharacter } from "@nisomnia/utils"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "../../trpc"
import { LANGUAGE_TYPE } from "../language/language.schema"
import {
  createTopicSchema,
  TOPIC_TYPE,
  translateTopicSchema,
  updateTopicSchema,
} from "./topic.schema"

export const topicRouter = createTRPCRouter({
  topicTranslationPrimaryById: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.db.topicTranslationPrimary.findUnique({
        where: {
          id: input,
        },
        select: {
          id: true,
          topics: {
            select: {
              id: true,
              title: true,
              language: true,
              type: true,
            },
          },
        },
      })
    }),
  byId: adminProtectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.db.topic.findUnique({
        where: { id: input },
        select: {
          topic_translation_primary_id: true,
          id: true,
          title: true,
          slug: true,
          language: true,
          description: true,
          meta_title: true,
          meta_description: true,
          type: true,
          featured_image: {
            select: {
              id: true,
              url: true,
            },
          },
          createdAt: true,
          updatedAt: true,
        },
      })
    }),
  byLanguage: publicProcedure
    .input(
      z.object({
        language: z.enum(LANGUAGE_TYPE),
        page: z.number(),
        per_page: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.topic.findMany({
        where: { language: input.language },
        orderBy: {
          createdAt: "desc",
        },
        skip: (input.page - 1) * input.per_page,
        take: input.per_page,
        select: {
          topic_translation_primary_id: true,
          id: true,
          language: true,
          title: true,
          slug: true,
          description: true,
          meta_title: true,
          meta_description: true,
          type: true,
          featured_image: {
            select: {
              url: true,
            },
          },
        },
      })
    }),
  dashboard: adminProtectedProcedure
    .input(
      z.object({
        language: z.enum(LANGUAGE_TYPE),
        page: z.number(),
        per_page: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.topic.findMany({
        where: { language: input.language },
        orderBy: {
          createdAt: "desc",
        },
        skip: (input.page - 1) * input.per_page,
        take: input.per_page,
        select: {
          topic_translation_primary_id: true,
          id: true,
          language: true,
          title: true,
          slug: true,
          type: true,
          createdAt: true,
          updatedAt: true,
          topic_translation_primary: {
            select: {
              id: true,
              topics: {
                select: {
                  title: true,
                  language: true,
                },
              },
            },
          },
        },
      })
    }),
  sitemap: publicProcedure
    .input(
      z.object({
        language: z.enum(LANGUAGE_TYPE),
        page: z.number(),
        per_page: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.topic.findMany({
        where: { language: input.language },
        orderBy: {
          createdAt: "desc",
        },
        skip: (input.page - 1) * input.per_page,
        take: input.per_page,
        select: {
          slug: true,
          updatedAt: true,
        },
      })
    }),
  byType: publicProcedure
    .input(
      z.object({
        type: z.enum(TOPIC_TYPE),
        language: z.enum(LANGUAGE_TYPE),
        page: z.number(),
        per_page: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.topic.findMany({
        where: {
          AND: [
            {
              type: input.type,
              language: input.language,
            },
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: (input.page - 1) * input.per_page,
        take: input.per_page,
        select: {
          topic_translation_primary_id: true,
          id: true,
          title: true,
          language: true,
          slug: true,
          description: true,
          type: true,
          featured_image: {
            select: {
              url: true,
            },
          },
        },
      })
    }),
  articlesByTopicSlug: publicProcedure
    .input(
      z.object({
        slug: z.string(),
        page: z.number(),
        per_page: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.topic.findUnique({
        where: {
          slug: input.slug,
        },
        select: {
          id: true,
          title: true,
          language: true,
          topic_translation_primary_id: true,
          slug: true,
          description: true,
          meta_title: true,
          meta_description: true,
          type: true,
          articles: {
            skip: (input.page - 1) * input.per_page,
            take: input.per_page,
            orderBy: {
              updatedAt: "desc",
            },
            select: {
              id: true,
              title: true,
              slug: true,
              meta_title: true,
              meta_description: true,
              excerpt: true,
              status: true,
              content: true,
              topics: {
                select: {
                  title: true,
                  slug: true,
                },
              },
              featured_image: {
                select: {
                  url: true,
                },
              },
            },
          },
          featured_image: {
            select: {
              url: true,
            },
          },
          _count: {
            select: {
              articles: true,
            },
          },
          createdAt: true,
          updatedAt: true,
        },
      })
    }),
  articlesByTopicSlugInfinite: publicProcedure
    .input(
      z.object({
        slug: z.string(),
        limit: z.number().min(1).max(100).nullable(),
        cursor: z.string().nullable(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 50

      const cursorCondition = input.cursor
        ? {
            updatedAt: {
              lt: new Date(input.cursor),
            },
          }
        : {}

      const topic = await ctx.db.topic.findUnique({
        where: {
          slug: input.slug,
        },
        select: {
          id: true,
          title: true,
          language: true,
          topic_translation_primary_id: true,
          slug: true,
          description: true,
          meta_title: true,
          meta_description: true,
          type: true,
          articles: {
            where: {
              AND: [
                {
                  status: "published",
                },
                cursorCondition,
              ],
            },
            take: limit + 1,
            orderBy: {
              updatedAt: "desc",
            },
            select: {
              id: true,
              title: true,
              slug: true,
              meta_title: true,
              meta_description: true,
              excerpt: true,
              status: true,
              content: true,
              topics: {
                select: {
                  title: true,
                  slug: true,
                },
              },
              featured_image: {
                select: {
                  url: true,
                },
              },
            },
          },
          featured_image: {
            select: {
              url: true,
            },
          },
          _count: {
            select: {
              articles: true,
            },
          },
          createdAt: true,
          updatedAt: true,
        },
      })

      let nextCursor: string | undefined = undefined

      if (topic && Array.isArray(topic) && topic.length > limit) {
        const nextItem = topic.pop()
        if (nextItem.updatedAt) {
          nextCursor = nextItem.updatedAt.toISOString()
        }
      }
      return {
        topic,
        nextCursor,
      }
    }),
  bySlug: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return await ctx.db.topic.findUnique({
      where: { slug: input },
      select: {
        id: true,
        title: true,
        language: true,
        slug: true,
        description: true,
        meta_title: true,
        meta_description: true,
        type: true,
        featured_image: {
          select: {
            url: true,
          },
        },
        articles: {
          take: 6,
          orderBy: {
            updatedAt: "desc",
          },
          select: {
            id: true,
            excerpt: true,
            title: true,
            slug: true,
            status: true,
            featured_image: {
              select: {
                url: true,
              },
            },
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    })
  }),
  search: publicProcedure
    .input(
      z.object({ language: z.enum(LANGUAGE_TYPE), search_query: z.string() }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.topic.findMany({
        where: {
          AND: [
            {
              language: input.language,
            },
          ],
          OR: [
            {
              title: {
                search: input.search_query.split(" ").join(" & "),
              },
              slug: {
                search: input.search_query.split(" ").join(" & "),
              },
            },
          ],
        },
        take: 10,
        select: {
          topic_translation_primary_id: true,
          id: true,
          type: true,
          slug: true,
          title: true,
          featured_image: {
            select: {
              url: true,
            },
          },
        },
      })
    }),
  searchDashboard: publicProcedure
    .input(
      z.object({ language: z.enum(LANGUAGE_TYPE), search_query: z.string() }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.topic.findMany({
        where: {
          AND: [
            {
              language: input.language,
            },
          ],
          OR: [
            {
              title: {
                search: input.search_query.split(" ").join(" & "),
              },
              slug: {
                search: input.search_query.split(" ").join(" & "),
              },
            },
          ],
        },
        take: 10,
        select: {
          topic_translation_primary_id: true,
          id: true,
          title: true,
          slug: true,
          type: true,
          createdAt: true,
          updatedAt: true,
          topic_translation_primary: {
            select: {
              id: true,
              topics: {
                select: {
                  title: true,
                  language: true,
                },
              },
            },
          },
        },
      })
    }),
  searchByType: publicProcedure
    .input(
      z.object({
        type: z.enum(TOPIC_TYPE),
        language: z.enum(LANGUAGE_TYPE),
        search_query: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.topic.findMany({
        where: {
          AND: [
            {
              type: input.type,
              language: input.language,
            },
          ],
          OR: [
            {
              title: {
                search: input.search_query.split(" ").join(" & "),
              },
              slug: {
                search: input.search_query.split(" ").join(" & "),
              },
            },
          ],
        },
        take: 10,
        select: {
          topic_translation_primary_id: true,
          id: true,
          type: true,
          slug: true,
          title: true,
          featured_image: {
            select: {
              url: true,
            },
          },
        },
      })
    }),
  dashboardSearch: adminProtectedProcedure
    .input(
      z.object({ language: z.enum(LANGUAGE_TYPE), search_query: z.string() }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.topic.findMany({
        where: {
          AND: [
            {
              language: input.language,
            },
          ],
          OR: [
            {
              title: {
                search: input.search_query.split(" ").join(" & "),
              },
              slug: {
                search: input.search_query.split(" ").join(" & "),
              },
            },
          ],
        },
        take: 10,
        select: {
          topic_translation_primary_id: true,
          id: true,
          slug: true,
          title: true,
          type: true,
          createdAt: true,
          updatedAt: true,
          topic_translation_primary: {
            select: {
              id: true,
              topics: {
                select: {
                  title: true,
                  language: true,
                },
              },
            },
          },
        },
      })
    }),
  count: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.topic.count()
  }),
  countByLanguage: publicProcedure
    .input(z.enum(LANGUAGE_TYPE))
    .query(async ({ ctx, input }) => {
      return await ctx.db.topic.count({
        where: {
          language: input,
        },
      })
    }),
  create: adminProtectedProcedure
    .input(createTopicSchema)
    .mutation(async ({ ctx, input }) => {
      const slug = `${slugify(input.title)}_${uniqueCharacter()}`
      const generatedMetaTitle = !input.meta_title
        ? input.title
        : input.meta_title
      const generatedMetaDescription = !input.meta_description
        ? input.description
        : input.meta_description
      return await ctx.db.topicTranslationPrimary.create({
        data: {
          topics: {
            create: {
              title: input.title,
              language: input.language,
              slug: slug,
              description: input.description,
              meta_title: generatedMetaTitle,
              meta_description: generatedMetaDescription,
              type: input.type,
              featured_image_id: input.featured_image_id,
            },
          },
        },
      })
    }),
  update: adminProtectedProcedure
    .input(updateTopicSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.topic.update({
        where: {
          id: input.id,
        },
        data: input,
      })
    }),
  translate: adminProtectedProcedure
    .input(translateTopicSchema)
    .mutation(async ({ ctx, input }) => {
      const slug = `${slugify(input.title)}_${uniqueCharacter()}`
      const generatedMetaTitle = !input.meta_title
        ? input.title
        : input.meta_title
      const generatedMetaDescription = !input.meta_description
        ? input.description
        : input.meta_description
      return await ctx.db.topic.create({
        data: {
          topic_translation_primary_id: input.topic_translation_primary_id,
          title: input.title,
          language: input.language,
          slug: slug,
          description: input.description,
          meta_title: generatedMetaTitle,
          meta_description: generatedMetaDescription,
          type: input.type,
          featured_image_id: input.featured_image_id,
        },
      })
    }),
  delete: adminProtectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const topic = await ctx.db.topic.findUnique({
        where: { id: input },
      })

      if (!topic) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Topic not found",
        })
      }
      return await ctx.db.topic.delete({ where: { id: input } })
    }),
})
