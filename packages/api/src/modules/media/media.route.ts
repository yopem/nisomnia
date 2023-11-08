import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../../trpc"
import { updateMediaSchema, uploadMediaSchema } from "./media.schema"

export const mediaRouter = createTRPCRouter({
  all: adminProtectedProcedure
    .input(z.object({ page: z.number(), per_page: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.media.findMany({
        orderBy: {
          createdAt: "desc",
        },
        skip: (input.page - 1) * input.per_page,
        take: input.per_page,
        select: {
          id: true,
          name: true,
          description: true,
          url: true,
          author: {
            select: {
              username: true,
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
      return await ctx.db.media.findMany({
        orderBy: {
          createdAt: "desc",
        },
        skip: (input.page - 1) * input.per_page,
        take: input.per_page,
        select: {
          id: true,
          url: true,
          name: true,
        },
      })
    }),
  byId: adminProtectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.db.media.findUnique({
        where: { id: input },
        select: {
          id: true,
          name: true,
          description: true,
          url: true,
          author: {
            select: {
              name: true,
              username: true,
            },
          },
          createdAt: true,
          updatedAt: true,
        },
      })
    }),
  byName: adminProtectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.db.media.findUnique({
        where: { name: input },
        select: {
          id: true,
          name: true,
          description: true,
          url: true,
          author: {
            select: {
              name: true,
              username: true,
            },
          },
          createdAt: true,
          updatedAt: true,
        },
      })
    }),
  byAuthorId: adminProtectedProcedure
    .input(
      z.object({
        author_id: z.string(),
        page: z.number(),
        per_page: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.media.findMany({
        where: { author_id: input.author_id },
        orderBy: {
          createdAt: "desc",
        },
        skip: (input.page - 1) * input.per_page,
        take: input.per_page,
        select: {
          id: true,
          url: true,
          name: true,
        },
      })
    }),
  search: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return await ctx.db.media.findMany({
      where: {
        OR: [
          {
            name: {
              search: input.split(" ").join(" & "),
            },
            url: {
              search: input.split(" ").join(" & "),
            },
            description: {
              search: input.split(" ").join(" & "),
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        url: true,
      },
    })
  }),
  count: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.media.count()
  }),
  create: protectedProcedure
    .input(uploadMediaSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.media.create({
        data: {
          name: input.name,
          type: input.type,
          url: input.url,
          description: input.description,
          author_id: ctx.session.user.id,
        },
      })
    }),
  update: adminProtectedProcedure
    .input(updateMediaSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.media.update({
        where: {
          id: input.id,
        },
        data: input,
      })
    }),
  deleteById: adminProtectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.media.delete({ where: { id: input } })
    }),
  deleteByName: adminProtectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.media.delete({ where: { name: input } })
    }),
})
