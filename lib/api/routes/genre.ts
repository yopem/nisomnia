import { TRPCError } from "@trpc/server"
import { count, desc, eq, sql } from "drizzle-orm"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "@/lib/api/trpc"
import { genres, movieGenres } from "@/lib/db/schema"
import { cuid } from "@/lib/utils"
import { generateUniqueGenreSlug } from "@/lib/utils/slug"
import { createGenreSchema, updateGenreSchema } from "@/lib/validation/genre"

export const genreRouter = createTRPCRouter({
  dashboard: adminProtectedProcedure
    .input(
      z.object({
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.genres.findMany({
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          orderBy: (users, { desc }) => [desc(users.updatedAt)],
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
        const data = await ctx.db.query.genres.findFirst({
          where: (genres, { eq }) => eq(genres.id, input),
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
  byMovieCount: publicProcedure
    .input(
      z.object({
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db
          .select({
            id: genres.id,
            title: genres.title,
            slug: genres.slug,
            count: sql<number>`count(${movieGenres.movieId})`.mapWith(Number),
          })
          .from(genres)
          .where(eq(genres.status, "published"))
          .leftJoin(movieGenres, eq(movieGenres.genreId, genres.id))
          .limit(input.perPage)
          .offset((input.page - 1) * input.perPage)
          .groupBy(genres.id)
          .orderBy(desc(count(movieGenres.movieId)))

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
        const data = await ctx.db.query.genres.findMany({
          where: (genres, { eq }) => eq(genres.status, "published"),
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          orderBy: (genres, { desc }) => [desc(genres.updatedAt)],
          columns: {
            slug: true,
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
  bySlug: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    try {
      const data = await ctx.db.query.genres.findFirst({
        where: (genres, { eq }) => eq(genres.slug, input),
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
  search: publicProcedure
    .input(
      z.object({
        limit: z.number().optional().default(10),
        searchQuery: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.genres.findMany({
          where: (genres, { or, ilike }) =>
            or(
              ilike(genres.title, `%${input.searchQuery}%`),
              ilike(genres.slug, `%${input.searchQuery}%`),
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
  count: publicProcedure.query(async ({ ctx }) => {
    try {
      const data = await ctx.db
        .select({ value: count() })
        .from(genres)
        .where(eq(genres.status, "published"))

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
  countDashboard: publicProcedure.query(async ({ ctx }) => {
    try {
      const data = await ctx.db.select({ value: count() }).from(genres)

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
  create: adminProtectedProcedure
    .input(createGenreSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const slug = await generateUniqueGenreSlug(input.title)
        const generatedMetaTitle = !input.metaTitle
          ? input.title
          : input.metaTitle
        const generatedMetaDescription = !input.metaDescription
          ? input.description
          : input.metaDescription

        const data = await ctx.db
          .insert(genres)
          .values({
            id: cuid(),
            slug: slug,
            metaTitle: generatedMetaTitle,
            metaDescription: generatedMetaDescription,
            ...input,
          })
          .returning()

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
    .input(updateGenreSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const data = await ctx.db
          .update(genres)
          .set({
            ...input,
            updatedAt: sql`CURRENT_TIMESTAMP`,
          })
          .where(eq(genres.id, input.id))

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
        const data = await ctx.db.transaction(async () => {
          await ctx.db.delete(movieGenres).where(eq(movieGenres.genreId, input))
          await ctx.db.delete(genres).where(eq(genres.id, input))
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
