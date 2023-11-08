import { TRPCError } from "@trpc/server"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "../../trpc"
import { AD_POSITION, createAdSchema, updateAdSchema } from "./ad.schema"

export const adRouter = createTRPCRouter({
  all: publicProcedure
    .input(z.object({ page: z.number(), per_page: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.ad.findMany({
        orderBy: {
          createdAt: "desc",
        },
        skip: (input.page - 1) * input.per_page,
        take: input.per_page,
        select: {
          id: true,
          title: true,
          content: true,
          position: true,
          type: true,
          active: true,
          createdAt: true,
          updatedAt: true,
        },
      })
    }),
  byId: adminProtectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.db.ad.findUnique({
        where: { id: input },
        select: {
          id: true,
          title: true,
          content: true,
          position: true,
          type: true,
          active: true,
          createdAt: true,
          updatedAt: true,
        },
      })
    }),
  byPosition: publicProcedure
    .input(z.enum(AD_POSITION))
    .query(async ({ ctx, input }) => {
      return await ctx.db.ad.findMany({
        where: { position: input },
        select: {
          id: true,
          title: true,
          content: true,
          position: true,
          type: true,
          active: true,
          createdAt: true,
          updatedAt: true,
        },
      })
    }),
  count: adminProtectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.ad.count()
  }),
  create: adminProtectedProcedure
    .input(createAdSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.ad.create({
        data: input,
      })
    }),
  update: adminProtectedProcedure
    .input(updateAdSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.ad.update({
        where: {
          id: input.id,
        },
        data: input,
      })
    }),
  delete: adminProtectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const ad = await ctx.db.ad.findUnique({
        where: { id: input },
      })

      if (!ad) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Ad not found",
        })
      }

      return await ctx.db.ad.delete({ where: { id: input } })
    }),
})
