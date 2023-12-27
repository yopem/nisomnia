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
      try {
        const data = await ctx.db.user.findMany({
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
        const data = await ctx.db.user.findUnique({
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
  byUsername: publicProcedure
    .input(z.object({ username: z.string(), language: z.enum(LANGUAGE_TYPE) }))
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.user.findUnique({
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
              take: 6,
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
  byEmail: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    try {
      const data = await ctx.db.user.findUnique({
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
  byRole: adminProtectedProcedure
    .input(
      z.object({
        role: z.enum(USER_ROLE),
        page: z.number(),
        per_page: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.user.findMany({
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
      try {
        const data = await ctx.db.user.findUnique({
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
  articlesByUserUsernameInfinite: publicProcedure
    .input(
      z.object({
        username: z.string(),
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

        const user = await ctx.db.user.findUnique({
          where: { username: input.username },
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
            about: true,
            article_authors: {
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
          },
        })

        let nextCursor: string | undefined = undefined

        if (user && Array.isArray(user) && user.length > limit) {
          const nextItem = user.pop()
          if (nextItem.updatedAt) {
            nextCursor = nextItem.updatedAt.toISOString()
          }
        }

        return {
          user,
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
  count: adminProtectedProcedure.query(async ({ ctx }) => {
    try {
      const data = await ctx.db.user.count()

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
      const data = await ctx.db.user.findMany({
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
    .input(updateUserSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const isUser = await ctx.db.user.findUnique({
          where: { id: ctx.session.user.id },
        })

        if (!isUser) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You can only update your profile.",
          })
        }

        const data = await ctx.db.user.update({
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
  updateByAdmin: adminProtectedProcedure
    .input(updateUserByAdminSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.user.update({
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
        const isUser = await ctx.db.user.findUnique({
          where: { id: ctx.session.user.id },
        })

        if (!isUser) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You can only delete your profile.",
          })
        }

        const data = await ctx.db.user.delete({ where: { id: input } })

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
        const data = await ctx.db.user.delete({ where: { id: input } })

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
  current: protectedProcedure.query(({ ctx }) => {
    try {
      const data = ctx.session?.user

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
