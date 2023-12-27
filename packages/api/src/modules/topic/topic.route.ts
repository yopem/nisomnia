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
      try {
        const data = await ctx.db.topicTranslationPrimary.findUnique({
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
        const data = await ctx.db.topic.findUnique({
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
            status: true,
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
        language: z.enum(LANGUAGE_TYPE),
        page: z.number(),
        per_page: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.topic.findMany({
          where: { language: input.language, status: "published" },
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
        language: z.enum(LANGUAGE_TYPE),
        page: z.number(),
        per_page: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.topic.findMany({
          where: {
            AND: [
              {
                language: input.language,
                status: "published",
              },
            ],
          },
          orderBy: {
            articles: {
              _count: "desc",
            },
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
  dashboard: adminProtectedProcedure
    .input(
      z.object({
        language: z.enum(LANGUAGE_TYPE),
        page: z.number(),
        per_page: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.topic.findMany({
          where: { language: input.language },
          orderBy: {
            updatedAt: "desc",
          },
          skip: (input.page - 1) * input.per_page,
          take: input.per_page,
          select: {
            topic_translation_primary_id: true,
            id: true,
            language: true,
            title: true,
            slug: true,
            status: true,
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
        language: z.enum(LANGUAGE_TYPE),
        page: z.number(),
        per_page: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.topic.findMany({
          where: { language: input.language, status: "published" },
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
      try {
        const data = await ctx.db.topic.findMany({
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
  articlesByTopicSlug: publicProcedure
    .input(
      z.object({
        slug: z.string(),
        language: z.enum(LANGUAGE_TYPE),
        page: z.number(),
        per_page: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.topic.findUnique({
          where: {
            slug: input.slug,
            status: "published",
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
                language: input.language,
                status: "published",
              },
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
  articlesByTopicSlugInfinite: publicProcedure
    .input(
      z.object({
        slug: z.string(),
        language: z.enum(LANGUAGE_TYPE),
        limit: z.number().min(1).max(100).nullable(),
        cursor: z.string().nullable(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
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
            status: "published",
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
                    language: input.language,
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
      const data = await ctx.db.topic.findUnique({
        where: { slug: input, status: "published" },
        select: {
          id: true,
          title: true,
          language: true,
          slug: true,
          description: true,
          meta_title: true,
          meta_description: true,
          type: true,
          status: true,
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
    .input(
      z.object({ language: z.enum(LANGUAGE_TYPE), search_query: z.string() }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.topic.findMany({
          where: {
            AND: [
              {
                language: input.language,
                status: "published",
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
    .input(
      z.object({ language: z.enum(LANGUAGE_TYPE), search_query: z.string() }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.topic.findMany({
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
            language: true,
            title: true,
            slug: true,
            status: true,
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
  searchByType: publicProcedure
    .input(
      z.object({
        type: z.enum(TOPIC_TYPE),
        language: z.enum(LANGUAGE_TYPE),
        search_query: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.topic.findMany({
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
            status: true,
            featured_image: {
              select: {
                url: true,
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
  count: publicProcedure.query(async ({ ctx }) => {
    try {
      const data = await ctx.db.topic.count()

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
  countByLanguage: publicProcedure
    .input(z.enum(LANGUAGE_TYPE))
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.topic.count({
          where: {
            language: input,
            status: "published",
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
  create: adminProtectedProcedure
    .input(createTopicSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const slug = `${slugify(input.title)}_${uniqueCharacter()}`
        const generatedMetaTitle = !input.meta_title
          ? input.title
          : input.meta_title
        const generatedMetaDescription = !input.meta_description
          ? input.description
          : input.meta_description

        const data = await ctx.db.topicTranslationPrimary.create({
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
                status: input.status,
                featured_image_id: input.featured_image_id,
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
  update: adminProtectedProcedure
    .input(updateTopicSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.topic.update({
          where: {
            id: input.id,
          },
          data: {
            ...input,
            updatedAt: new Date(),
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
  translate: adminProtectedProcedure
    .input(translateTopicSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const slug = `${slugify(input.title)}_${uniqueCharacter()}`
        const generatedMetaTitle = !input.meta_title
          ? input.title
          : input.meta_title
        const generatedMetaDescription = !input.meta_description
          ? input.description
          : input.meta_description
        const data = await ctx.db.topic.create({
          data: {
            topic_translation_primary_id: input.topic_translation_primary_id,
            title: input.title,
            language: input.language,
            slug: slug,
            description: input.description,
            meta_title: generatedMetaTitle,
            meta_description: generatedMetaDescription,
            type: input.type,
            status: input.status,
            featured_image_id: input.featured_image_id,
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
  delete: adminProtectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.topic.delete({ where: { id: input } })

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
