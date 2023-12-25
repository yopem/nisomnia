import { TRPCError } from "@trpc/server"
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
      try {
        const data = await ctx.db.media.findMany({
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

        if (!data) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Media not found",
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
        const data = await ctx.db.media.findMany({
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

        if (!data) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Media not found",
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
  dashboardInfinite: adminProtectedProcedure
    .input(
      z.object({
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

        const medias = await ctx.db.media.findMany({
          where: {
            AND: [cursorCondition],
          },
          take: limit + 1,
          orderBy: {
            updatedAt: "desc",
          },
          select: {
            id: true,
            name: true,
            url: true,
            type: true,
            description: true,
            author_id: true,
            createdAt: true,
            updatedAt: true,
          },
        })

        let nextCursor: string | undefined = undefined

        if (medias.length > limit) {
          const nextItem = medias.pop()
          if (nextItem?.updatedAt) {
            nextCursor = nextItem.updatedAt.toISOString()
          }
        }

        if (!medias) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Media not found",
          })
        }

        return {
          medias,
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
        const data = await ctx.db.media.findUnique({
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

        if (!data) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Media not found",
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
  byName: adminProtectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.media.findUnique({
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

        if (!data) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Media not found",
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
  byAuthorId: adminProtectedProcedure
    .input(
      z.object({
        author_id: z.string(),
        page: z.number(),
        per_page: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.media.findMany({
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

        if (!data) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Media not found",
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
  search: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    try {
      const data = await ctx.db.media.findMany({
        where: {
          name: {
            contains: input,
            mode: "insensitive",
          },
        },
        select: {
          id: true,
          name: true,
          url: true,
        },
      })

      if (!data) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Media not found",
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
      const data = await ctx.db.media.count()

      if (!data) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Media not found",
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
    .input(uploadMediaSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.media.create({
          data: {
            name: input.name,
            type: input.type,
            url: input.url,
            description: input.description,
            author_id: ctx.session.user.id,
          },
        })

        if (!data) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Failed to create media",
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
  update: adminProtectedProcedure
    .input(updateMediaSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.media.update({
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
            message: "Failed to update media",
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
  deleteById: adminProtectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.media.delete({ where: { id: input } })

        if (!data) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Failed to delete media",
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
  deleteByName: adminProtectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.media.delete({ where: { name: input } })

        if (!data) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Failed to delete media",
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
