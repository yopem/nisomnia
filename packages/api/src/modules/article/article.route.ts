import { TRPCError } from "@trpc/server"
import { z } from "zod"

import { slugify, trimText, uniqueCharacter } from "@nisomnia/utils"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../../trpc"
import { LANGUAGE_TYPE } from "../language/language.schema"
import {
  createArticleSchema,
  translateArticleSchema,
  updateArticleSchema,
} from "./article.schema"

export const articleRouter = createTRPCRouter({
  all: publicProcedure.query(async ({ ctx }) => {
    try {
      const data = await ctx.db.article.findMany({
        orderBy: { id: "desc" },
      })

      if (!data) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Articles not found",
        })
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
  articleTranslationPrimaryById: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.articleTranslationPrimary.findUnique({
          where: {
            id: input,
          },
          select: {
            id: true,
            articles: {
              select: {
                id: true,
                slug: true,
                language: true,
                title: true,
                authors: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
                editors: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
                featured_image: {
                  select: {
                    id: true,
                    url: true,
                  },
                },
              },
            },
          },
        })

        if (!data) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Article not found",
          })
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
        const data = await ctx.db.article.findUnique({
          where: { id: input },
          select: {
            article_translation_primary_id: true,
            id: true,
            language: true,
            slug: true,
            content: true,
            excerpt: true,
            title: true,
            meta_title: true,
            meta_description: true,
            status: true,
            featured_image: {
              select: {
                id: true,
                name: true,
                url: true,
              },
            },
            createdAt: true,
            updatedAt: true,
            topics: {
              select: {
                id: true,
                title: true,
                slug: true,
              },
            },
            authors: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
              },
            },
            editors: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
              },
            },
          },
        })

        if (!data) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Article not found",
          })
        }

        return data
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
      const data = await ctx.db.article.findUnique({
        where: { slug: input },
        select: {
          id: true,
          language: true,
          title: true,
          content: true,
          excerpt: true,
          meta_title: true,
          meta_description: true,
          slug: true,
          status: true,
          featured_image: {
            select: {
              url: true,
              name: true,
            },
          },
          createdAt: true,
          updatedAt: true,
          topics: {
            select: {
              title: true,
              slug: true,
            },
          },
          authors: {
            select: {
              name: true,
              username: true,
              image: true,
            },
          },
          editors: {
            select: {
              name: true,
              username: true,
            },
          },
        },
      })

      if (!data) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Article not found",
        })
      }

      return data
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
        language: z.enum(LANGUAGE_TYPE),
        page: z.number(),
        per_page: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.article.findMany({
          where: {
            AND: [
              {
                language: input.language,
                status: "published",
              },
            ],
          },
          orderBy: {
            updatedAt: "desc",
          },
          skip: (input.page - 1) * input.per_page,
          take: input.per_page,
          select: {
            article_translation_primary_id: true,
            id: true,
            title: true,
            language: true,
            excerpt: true,
            slug: true,
            status: true,
            featured_image: {
              select: {
                url: true,
              },
            },
          },
        })

        if (!data) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Articles not found",
          })
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
  byLanguageInfinite: publicProcedure
    .input(
      z.object({
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

        const articles = await ctx.db.article.findMany({
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
            article_translation_primary_id: true,
            id: true,
            title: true,
            language: true,
            excerpt: true,
            slug: true,
            status: true,
            featured_image: {
              select: {
                url: true,
              },
            },
            updatedAt: true,
          },
        })

        let nextCursor: string | undefined = undefined

        if (articles.length > limit) {
          const nextItem = articles.pop()
          if (nextItem?.updatedAt) {
            nextCursor = nextItem.updatedAt.toISOString()
          }
        }

        if (!articles) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Articles not found",
          })
        }

        return {
          articles,
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
        language: z.enum(LANGUAGE_TYPE),
        topic_slug: z.string(),
        current_article_slug: z.string(),
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

        const articles = await ctx.db.article.findMany({
          where: {
            AND: [
              {
                language: input.language,
                topics: {
                  some: {
                    slug: input.topic_slug,
                  },
                },
                status: "published",
              },
              cursorCondition,
            ],
            NOT: [
              {
                slug: input.current_article_slug,
              },
            ],
          },
          take: limit + 1,
          orderBy: {
            updatedAt: "desc",
          },
          select: {
            article_translation_primary_id: true,
            id: true,
            title: true,
            language: true,
            excerpt: true,
            slug: true,
            status: true,
            featured_image: {
              select: {
                url: true,
              },
            },
            updatedAt: true,
          },
        })

        let nextCursor: string | undefined = undefined

        if (articles.length > limit) {
          const nextItem = articles.pop()
          if (nextItem?.updatedAt) {
            nextCursor = nextItem.updatedAt.toISOString()
          }
        }

        if (!articles) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Articles not found",
          })
        }

        return {
          articles,
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
  byTopic: publicProcedure
    .input(
      z.object({
        language: z.enum(LANGUAGE_TYPE),
        page: z.number(),
        per_page: z.number(),
        topic: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.article.findMany({
          where: {
            AND: [
              {
                language: input.language,
                status: "published",
                topics: {
                  some: {
                    title: input.topic,
                  },
                },
              },
            ],
          },
          orderBy: {
            updatedAt: "desc",
          },
          skip: (input.page - 1) * input.per_page,
          take: input.per_page,
          select: {
            article_translation_primary_id: true,
            id: true,
            title: true,
            language: true,
            excerpt: true,
            slug: true,
            status: true,
            featured_image: {
              select: {
                url: true,
              },
            },
          },
        })

        if (!data) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Articles not found",
          })
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
  byAuthor: publicProcedure
    .input(
      z.object({
        username: z.string(),
        language: z.enum(LANGUAGE_TYPE),
        page: z.number(),
        per_page: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.article.findMany({
          where: {
            AND: [
              {
                language: input.language,
                status: "published",
                authors: { some: { username: input.username } },
              },
            ],
          },
          orderBy: {
            updatedAt: "desc",
          },
          skip: (input.page - 1) * input.per_page,
          take: input.per_page,
          select: {
            title: true,
            language: true,
            content: true,
            excerpt: true,
            meta_title: true,
            meta_description: true,
            slug: true,
            id: true,
            status: true,
            featured_image: {
              select: {
                id: true,
                name: true,
                url: true,
              },
            },
            createdAt: true,
            updatedAt: true,
            topics: {
              select: {
                id: true,
                title: true,
                slug: true,
              },
            },
          },
        })

        if (!data) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Articles not found",
          })
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
        const data = await ctx.db.article.findMany({
          where: {
            language: input.language,
          },
          orderBy: {
            updatedAt: "desc",
          },
          skip: (input.page - 1) * input.per_page,
          take: input.per_page,
          select: {
            article_translation_primary_id: true,
            id: true,
            title: true,
            language: true,
            slug: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            authors: {
              select: {
                name: true,
              },
            },
            editors: {
              select: {
                name: true,
              },
            },
            article_translation_primary: {
              select: {
                id: true,
                articles: {
                  select: {
                    id: true,
                    title: true,
                    language: true,
                  },
                },
              },
            },
          },
        })

        if (!data) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Articles not found",
          })
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
        const data = await ctx.db.article.findMany({
          where: {
            AND: [
              {
                language: input.language,
                status: "published",
              },
            ],
          },
          orderBy: {
            updatedAt: "desc",
          },
          skip: (input.page - 1) * input.per_page,
          take: input.per_page,
          select: {
            slug: true,
            updatedAt: true,
          },
        })

        if (!data) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Articles not found",
          })
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
  count: publicProcedure.query(async ({ ctx }) => {
    try {
      const data = await ctx.db.article.count()

      if (!data) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Articles not found",
        })
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
  countByLanguage: publicProcedure
    .input(z.enum(LANGUAGE_TYPE))
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.article.count({
          where: {
            language: input,
          },
        })

        if (!data) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Articles not found",
          })
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
  search: publicProcedure
    .input(
      z.object({ language: z.enum(LANGUAGE_TYPE), search_query: z.string() }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.article.findMany({
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
          select: {
            article_translation_primary_id: true,
            id: true,
            title: true,
            slug: true,
            status: true,
            featured_image: {
              select: {
                url: true,
              },
            },
          },
        })

        if (!data) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Articles not found",
          })
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
  searchDashboard: publicProcedure
    .input(
      z.object({ language: z.enum(LANGUAGE_TYPE), search_query: z.string() }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.article.findMany({
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
          select: {
            article_translation_primary_id: true,
            id: true,
            title: true,
            slug: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            authors: {
              select: {
                name: true,
              },
            },
            article_translation_primary: {
              select: {
                id: true,
                articles: {
                  select: {
                    title: true,
                    language: true,
                  },
                },
              },
            },
          },
        })

        if (!data) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Articles not found",
          })
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
  create: adminProtectedProcedure
    .input(createArticleSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const slug = `${slugify(input.title)}_${uniqueCharacter()}`
        const generatedExcerpt = !input.excerpt
          ? trimText(input.content, 160)
          : input.excerpt
        const generatedMetaTitle = !input.meta_title
          ? input.title
          : input.meta_title
        const generatedMetaDescription = !input.meta_description
          ? generatedExcerpt
          : input.meta_description

        const data = await ctx.db.articleTranslationPrimary.create({
          data: {
            articles: {
              create: {
                title: input.title,
                language: input.language,
                content: input.content,
                excerpt: generatedExcerpt,
                meta_title: generatedMetaTitle,
                meta_description: generatedMetaDescription,
                slug: slug,
                featured_image_id: input.featured_image_id,
                status: input.status,
                topics: {
                  connect: input.topics.map((topicId) => ({ id: topicId })),
                },
                authors: {
                  connect: input.authors.map((authorId) => ({ id: authorId })),
                },
                editors: {
                  connect: input.editors.map((editorId) => ({ id: editorId })),
                },
              },
            },
          },
        })

        if (!data) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Failed to create article",
          })
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
  update: adminProtectedProcedure
    .input(updateArticleSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.article.update({
          where: {
            id: input.id,
          },
          data: {
            title: input.title,
            language: input.language,
            content: input.content,
            excerpt: input.excerpt,
            meta_title: input.meta_title,
            meta_description: input.meta_description,
            slug: input.slug,
            status: input.status,
            featured_image_id: input.featured_image_id,
            topics: {
              set: input.topics.map((topicId) => ({ id: topicId })),
            },
            authors: {
              set: input.authors.map((authorId) => ({ id: authorId })),
            },
            editors: {
              set: input.editors.map((editorId) => ({ id: editorId })),
            },
            updatedAt: new Date(),
          },
        })

        if (!data) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Failed to update article",
          })
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
  translate: adminProtectedProcedure
    .input(translateArticleSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const slug = `${slugify(input.title)}_${uniqueCharacter()}`
        const generatedExcerpt = !input.excerpt
          ? trimText(input.content, 160)
          : input.excerpt
        const generatedMetaTitle = !input.meta_title
          ? input.title
          : input.meta_title
        const generatedMetaDescription = !input.meta_description
          ? generatedExcerpt
          : input.meta_description

        const data = await ctx.db.article.create({
          data: {
            article_translation_primary_id:
              input.article_translation_primary_id,
            title: input.title,
            language: input.language,
            content: input.content,
            excerpt: generatedExcerpt,
            meta_title: generatedMetaTitle,
            meta_description: generatedMetaDescription,
            slug: slug,
            status: input.status,
            featured_image_id: input.featured_image_id,
            topics: {
              connect: input.topics.map((topicId) => ({ id: topicId })),
            },
            authors: {
              connect: input.authors.map((authorId) => ({ id: authorId })),
            },
            editors: {
              connect: input.editors.map((editorId) => ({ id: editorId })),
            },
          },
        })

        if (!data) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Failed to translate article",
          })
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
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        const article = await ctx.db.article.findUnique({
          where: { id: input },
          select: {
            authors: true,
          },
        })

        const isUserAuthor = article?.authors.some(
          (author) => author.id === ctx.session.user.id,
        )

        if (!isUserAuthor) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Only the author of the article is allowed to delete it.",
          })
        }

        const data = await ctx.db.article.delete({ where: { id: input } })

        if (!data) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Failed to delete article",
          })
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
  deleteByAdmin: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.article.delete({ where: { id: input } })

        if (!data) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Failed to delte article",
          })
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
})
