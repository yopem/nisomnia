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
      try {
        const data = await ctx.db.ad.findMany({
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
        const data = await ctx.db.ad.findUnique({
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
  byPosition: publicProcedure
    .input(z.enum(AD_POSITION))
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.ad.findMany({
          where: { position: input, active: true },
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

        return data
      } catch (error) {
        console.error("Error:", error)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Ad not found",
        })
      }
    }),
  count: adminProtectedProcedure.query(async ({ ctx }) => {
    try {
      const data = await ctx.db.ad.count()

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
    .input(createAdSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.ad.create({
          data: input,
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
    .input(updateAdSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.ad.update({
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
  delete: adminProtectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.ad.delete({
          where: { id: input },
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
