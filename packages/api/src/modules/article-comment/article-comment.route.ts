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
      return await ctx.db.articleComment.findMany({
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
    }),
  dashboard: adminProtectedProcedure
    .input(z.object({ page: z.number(), per_page: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.articleComment.findMany({
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
      return await ctx.db.articleComment.findMany({
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

      return {
        articleComments,
        nextCursor,
      }
    }),
  byId: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return await ctx.db.articleComment.findMany({
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
  }),
  count: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.articleComment.count()
  }),
  countByArticleId: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.articleComment.count()
  }),
  create: protectedProcedure
    .input(createArticleCommentSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.articleComment.create({
        data: {
          article_id: input.article_id,
          content: input.content,
          reply_to_id: input.reply_to_id,
          author_id: ctx.session.user.id,
        },
      })
    }),
  // TODO: make users only can update their own comments
  update: adminProtectedProcedure
    .input(updateArticleCommentSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.articleComment.update({
        where: {
          id: input.id,
        },
        data: input,
      })
    }),
  // TODO: make users can delete their own comments
  delete: adminProtectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.articleComment.delete({ where: { id: input } })
    }),
})
