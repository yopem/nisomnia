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
    .query(({ ctx, input }) => {
      return ctx.db.articleComment.findMany({
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
    .query(({ ctx, input }) => {
      return ctx.db.articleComment.findMany({
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
    .query(({ ctx, input }) => {
      return ctx.db.articleComment.findMany({
        where: { article_id: input.article_id },
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
        },
      })
    }),
  byId: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.db.articleComment.findMany({
      where: { id: input },
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
        createdAt: true,
        updatedAt: true,
      },
    })
  }),
  count: publicProcedure.query(({ ctx }) => {
    return ctx.db.articleComment.count()
  }),
  countByArticleId: publicProcedure.query(({ ctx }) => {
    return ctx.db.articleComment.count()
  }),
  create: protectedProcedure
    .input(createArticleCommentSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.articleComment.create({
        data: {
          article_id: input.article_id,
          content: input.content,
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
