import { TRPCError } from "@trpc/server"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../../trpc"
import {
  createArticleCommentSchema,
  updateArticleCommentSchema,
} from "./article-comment.schema"

export const articleCommentRouter = createTRPCRouter({
  all: adminProtectedProcedure
    .input(z.object({ page: z.number(), per_page: z.number() }))
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.articleComment.findMany({
          orderBy: {
            createdAt: "desc",
          },
          skip: (input.page - 1) * input.per_page,
          take: input.per_page,
          select: {
            id: true,
            content: true,
            author: {
              select: {
                name: true,
                image: true,
              },
            },
            createdAt: true,
            updatedAt: true,
          },
        })

        if (!data) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Article comments not found",
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
    .input(z.object({ page: z.number(), per_page: z.number() }))
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.articleComment.findMany({
          orderBy: {
            createdAt: "desc",
          },
          skip: (input.page - 1) * input.per_page,
          take: input.per_page,
          select: {
            id: true,
            content: true,
            author: {
              select: {
                name: true,
              },
            },
            article: {
              select: {
                slug: true,
              },
            },
            createdAt: true,
            updatedAt: true,
          },
        })

        if (!data) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Article comments not found",
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
  byArticleId: publicProcedure
    .input(
      z.object({
        article_id: z.string(),
        page: z.number(),
        per_page: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.articleComment.findMany({
          where: {
            AND: [{ article_id: input.article_id, reply_to: null }],
          },
          orderBy: {
            createdAt: "desc",
          },
          skip: (input.page - 1) * input.per_page,
          take: input.per_page,
          select: {
            id: true,
            content: true,
            replies: {
              select: {
                id: true,
                content: true,
                article_id: true,
                author_id: true,
                reply_to_id: true,
                createdAt: true,
                updatedAt: true,
                author: {
                  select: {
                    name: true,
                    image: true,
                  },
                },
              },
            },
            author: {
              select: {
                name: true,
                image: true,
              },
            },
            createdAt: true,
          },
        })

        if (!data) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Article comments not found",
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
  byArticleIdInfinite: publicProcedure
    .input(
      z.object({
        article_id: z.string(),
        limit: z.number().min(1).max(100).nullable(),
        cursor: z.string().nullable(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const limit = input.limit ?? 50

        const cursorCondition = input.cursor
          ? {
              createdAt: {
                lt: new Date(input.cursor),
              },
            }
          : {}

        const articleComments = await ctx.db.articleComment.findMany({
          where: {
            AND: [
              {
                article_id: input.article_id,
                reply_to: null,
              },
              cursorCondition,
            ],
          },
          take: limit + 1,
          orderBy: {
            createdAt: "desc",
          },
          select: {
            id: true,
            content: true,
            author: {
              select: {
                name: true,
                image: true,
              },
            },
            replies: {
              select: {
                id: true,
                content: true,
                article_id: true,
                author_id: true,
                reply_to_id: true,
                createdAt: true,
                updatedAt: true,
                author: {
                  select: {
                    name: true,
                    image: true,
                  },
                },
              },
            },
            createdAt: true,
          },
        })

        let nextCursor: string | undefined = undefined

        if (articleComments.length > limit) {
          const nextItem = articleComments.pop()
          if (nextItem?.createdAt) {
            nextCursor = nextItem.createdAt.toISOString()
          }
        }

        if (!articleComments) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Article comments not found",
          })
        }

        return {
          articleComments,
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
  byId: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    try {
      const data = await ctx.db.articleComment.findMany({
        where: { id: input },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          content: true,
          replies: {
            select: {
              id: true,
              content: true,
              article_id: true,
              author_id: true,
              reply_to_id: true,
              createdAt: true,
              updatedAt: true,
              author: {
                select: {
                  name: true,
                  image: true,
                },
              },
            },
          },
          author: {
            select: {
              name: true,
              image: true,
            },
          },
          createdAt: true,
          updatedAt: true,
        },
      })

      if (!data) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Article comments not found",
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
      const data = await ctx.db.articleComment.count()

      if (!data) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Article comments not found",
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
  countByArticleId: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.articleComment.count({
          where: {
            AND: [{ article_id: input, reply_to: null }],
          },
        })

        if (!data) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Article comments not found",
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
  create: protectedProcedure
    .input(createArticleCommentSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.articleComment.create({
          data: {
            article_id: input.article_id,
            content: input.content,
            reply_to_id: input.reply_to_id,
            author_id: ctx.session.user.id,
          },
        })

        if (!data) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Failed to create article comment",
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
  update: protectedProcedure
    .input(updateArticleCommentSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const articleComment = await ctx.db.articleComment.findUnique({
          where: { id: input.id },
          select: {
            author: true,
          },
        })

        const isUserAuthor = articleComment?.author?.id === ctx.session.user.id

        if (!isUserAuthor) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message:
              "Only the author of the article comment is allowed to update it.",
          })
        }

        const data = await ctx.db.articleComment.update({
          where: {
            id: input.id,
          },
          data: {
            ...input,
            updatedAt: new Date(),
          },
        })

        if (!data) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Failed to update article comment",
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
  updateByAdmin: adminProtectedProcedure
    .input(updateArticleCommentSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.articleComment.update({
          where: {
            id: input.id,
          },
          data: {
            ...input,
            updatedAt: new Date(),
          },
        })

        if (!data) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Failed to update article comment",
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
        const articleComment = await ctx.db.articleComment.findUnique({
          where: { id: input },
          select: {
            author: true,
          },
        })

        const isUserAuthor = articleComment?.author?.id === ctx.session.user.id

        if (!isUserAuthor) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message:
              "Only the author of the article comment is allowed to delete it.",
          })
        }

        const data = await ctx.db.articleComment.delete({
          where: { id: input },
        })

        if (!data) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Failed to delete article comment",
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
  deleteByAdmin: adminProtectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.articleComment.delete({
          where: { id: input },
        })

        if (!data) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Failed to delete article comment",
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
