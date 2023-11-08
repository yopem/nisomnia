import { TRPCError } from "@trpc/server"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../../trpc"
import { LANGUAGE_TYPE } from "../language/language.schema"
import {
  updateUserByAdminSchema,
  updateUserSchema,
  USER_ROLE,
} from "./user.schema"

export const userRouter = createTRPCRouter({
  all: adminProtectedProcedure
    .input(z.object({ page: z.number(), per_page: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.user.findMany({
        orderBy: {
          createdAt: "desc",
        },
        skip: (input.page - 1) * input.per_page,
        take: input.per_page,
        select: {
          id: true,
          email: true,
          username: true,
          name: true,
          role: true,
          createdAt: true,
        },
      })
    }),
  byId: adminProtectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.db.user.findUnique({
        where: { id: input },
        select: {
          id: true,
          email: true,
          username: true,
          name: true,
          role: true,
          createdAt: true,
        },
      })
    }),
  byUsername: publicProcedure
    .input(z.object({ username: z.string(), language: z.enum(LANGUAGE_TYPE) }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.user.findUnique({
        where: { username: input.username },
        select: {
          id: true,
          email: true,
          username: true,
          name: true,
          phone_number: true,
          about: true,
          role: true,
          image: true,
          article_authors: {
            where: {
              language: input.language,
            },
            select: {
              title: true,
              language: true,
              slug: true,
              featured_image: {
                select: {
                  url: true,
                },
              },
            },
          },
          createdAt: true,
        },
      })
    }),
  byEmail: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return await ctx.db.user.findUnique({
      where: { email: input },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        role: true,
        createdAt: true,
      },
    })
  }),
  byRole: adminProtectedProcedure
    .input(
      z.object({
        role: z.enum(USER_ROLE),
        page: z.number(),
        per_page: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.user.findMany({
        where: { role: input.role },
        orderBy: {
          createdAt: "desc",
        },
        skip: (input.page - 1) * input.per_page,
        take: input.per_page,
        select: {
          id: true,
          email: true,
          username: true,
          name: true,
          createdAt: true,
        },
      })
    }),
  articlesByUserUsername: publicProcedure
    .input(
      z.object({
        username: z.string(),
        language: z.enum(LANGUAGE_TYPE),
        page: z.number(),
        per_page: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.user.findUnique({
        where: { username: input.username },
        select: {
          id: true,
          username: true,
          name: true,
          image: true,
          about: true,
          article_authors: {
            where: {
              language: input.language,
            },
            skip: (input.page - 1) * input.per_page,
            take: input.per_page,
            orderBy: {
              updatedAt: "desc",
            },
            select: {
              id: true,
              title: true,
              excerpt: true,
              slug: true,
              featured_image: {
                select: {
                  url: true,
                },
              },
            },
          },
          _count: {
            select: {
              article_authors: true,
            },
          },
        },
      })
    }),
  count: adminProtectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.user.count()
  }),
  search: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return await ctx.db.user.findMany({
      where: {
        OR: [
          {
            email: {
              search: input.split(" ").join(" & "),
            },
            name: {
              search: input.split(" ").join(" & "),
            },
            username: {
              search: input.split(" ").join(" & "),
            },
          },
        ],
      },
      take: 10,
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        image: true,
        role: true,
        createdAt: true,
      },
    })
  }),
  update: protectedProcedure
    .input(updateUserSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
      })

      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You can only update your profile.",
        })
      }

      return await ctx.db.user.update({
        where: {
          id: input.id,
        },
        data: input,
      })
    }),
  updateByAdmin: adminProtectedProcedure
    .input(updateUserByAdminSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.user.update({
        where: {
          id: input.id,
        },
        data: input,
      })
    }),
  delete: adminProtectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.user.delete({ where: { id: input } })
    }),
})
