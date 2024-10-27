import { DeleteObjectCommand } from "@aws-sdk/client-s3"
import { TRPCError } from "@trpc/server"
import { count, eq, sql } from "drizzle-orm"
import { z } from "zod"

import env from "@/env"
import {
  adminProtectedProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/lib/api/trpc"
import { medias } from "@/lib/db/schema"
import { r2Client } from "@/lib/r2"
import { cuid } from "@/lib/utils"
import {
  createMediaSchema,
  mediaCategory,
  mediaType,
  updateMediaSchema,
} from "@/lib/validation/media"

export const mediaRouter = createTRPCRouter({
  dashboard: adminProtectedProcedure
    .input(z.object({ page: z.number(), perPage: z.number() }))
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.medias.findMany({
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          orderBy: (medias, { desc }) => [desc(medias.createdAt)],
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
  dashboardInfinite: adminProtectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100),
        cursor: z.date().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const limit = input.limit ?? 50

        const data = await ctx.db.query.medias.findMany({
          where: (medias, { lt }) =>
            input.cursor
              ? lt(medias.updatedAt, new Date(input.cursor!))
              : undefined,
          limit: limit + 1,
          orderBy: (medias, { desc }) => [desc(medias.updatedAt)],
        })

        let nextCursor: Date | undefined = undefined

        if (data.length > limit) {
          const nextItem = data.pop()
          if (nextItem?.updatedAt) {
            nextCursor = nextItem.updatedAt
          }
        }

        return {
          medias: data,
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
  dashboardInfiniteByCategory: adminProtectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).optional().default(50),
        cursor: z.date().optional(),
        category: mediaCategory,
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.medias.findMany({
          where: (medias, { and, lt, eq }) =>
            and(
              input.cursor
                ? lt(medias.updatedAt, new Date(input.cursor!))
                : undefined,
              eq(medias.category, input.category),
            ),
          limit: input.limit + 1,
          orderBy: (medias, { desc }) => [desc(medias.updatedAt)],
        })

        let nextCursor: Date | undefined = undefined

        if (data.length > input.limit) {
          const nextItem = data.pop()
          if (nextItem?.updatedAt) {
            nextCursor = nextItem.updatedAt
          }
        }

        return {
          medias: data,
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
  byId: adminProtectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.medias.findFirst({
          where: (medias, { eq }) => eq(medias.id, input),
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
  byName: adminProtectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.medias.findFirst({
          where: (medias, { eq }) => eq(medias.name, input),
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
  byAuthorId: adminProtectedProcedure
    .input(
      z.object({
        authorId: z.string(),
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.medias.findMany({
          where: (medias, { eq }) => eq(medias.authorId, input.authorId),
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          orderBy: (medias, { desc }) => [desc(medias.createdAt)],
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
  search: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    try {
      const data = await ctx.db.query.medias.findMany({
        where: (medias, { ilike }) => ilike(medias.name, `%${input}%`),
        limit: 24,
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
  byCategory: publicProcedure
    .input(mediaCategory)
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.medias.findMany({
          where: (medias, { eq }) => eq(medias.category, input),
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
  searchByCategory: publicProcedure
    .input(
      z.object({
        searchQuery: z.string(),
        category: mediaCategory,
        limit: z.number().optional().default(24),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.medias.findMany({
          where: (medias, { and, ilike, eq }) =>
            and(
              eq(medias.category, input.category),
              ilike(medias.name, `%${input.searchQuery}%`),
            ),
          limit: input.limit,
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
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.medias.findMany({
          columns: {
            url: true,
            updatedAt: true,
          },
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          orderBy: (medias, { desc }) => [desc(medias.id)],
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
      const data = await ctx.db.select({ value: count() }).from(medias)

      return data[0].value
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
    .input(createMediaSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.insert(medias).values({
          id: cuid(),
          authorId: ctx.session.user.id,
          ...input,
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
    .input(updateMediaSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const data = await ctx.db
          .update(medias)
          .set({
            ...input,
            updatedAt: sql`CURRENT_TIMESTAMP`,
          })
          .where(eq(medias.id, input.id))

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
  deleteById: adminProtectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.delete(medias).where(eq(medias.id, input))

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
  deleteByName: adminProtectedProcedure
    .input(z.object({ type: mediaType, name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const mediaProperties = input.type + "/" + input.name

        const fileProperties = {
          Bucket: env.R2_BUCKET,
          Key: mediaProperties,
        }

        await r2Client.send(new DeleteObjectCommand(fileProperties))

        const data = await ctx.db
          .delete(medias)
          .where(eq(medias.name, input.name))

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
