import { TRPCError } from "@trpc/server"
import { count, desc, eq, sql } from "drizzle-orm"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "@/lib/api/trpc"
import { genres, genreTranslations } from "@/lib/db/schema/genre"
import { movieGenres } from "@/lib/db/schema/movie"
import { cuid } from "@/lib/utils"
import { generateUniqueGenreSlug } from "@/lib/utils/slug"
import {
  createGenreSchema,
  translateGenreSchema,
  updateGenreSchema,
} from "@/lib/validation/genre"
import { languageType } from "@/lib/validation/language"

export const genreRouter = createTRPCRouter({
  genreTranslationById: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.genreTranslations.findFirst({
          where: (genreTranslations, { eq }) => eq(genreTranslations.id, input),
          with: {
            genres: true,
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
  dashboard: adminProtectedProcedure
    .input(
      z.object({
        language: languageType,
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.genres.findMany({
          where: (genres, { eq }) => eq(genres.language, input.language),
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          orderBy: (users, { desc }) => [desc(users.updatedAt)],
          with: {
            genreTranslation: {
              with: {
                genres: true,
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
  byLanguage: publicProcedure
    .input(
      z.object({
        language: languageType,
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.genres.findMany({
          where: (genres, { eq }) => eq(genres.language, input.language),
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          orderBy: (genres, { desc }) => [desc(genres.createdAt)],
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
        language: languageType,
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
            language: genres.language,
            count: sql<number>`count(${movieGenres.movieId})`.mapWith(Number),
          })
          .from(genres)
          .where(eq(genres.language, input.language))
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
        language: languageType,
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.genres.findMany({
          where: (genres, { eq }) => eq(genres.language, input.language),
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
    .input(z.object({ language: languageType, searchQuery: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.genres.findMany({
          where: (genres, { eq, and, or, ilike }) =>
            and(
              eq(genres.language, input.language),
              or(
                ilike(genres.title, `%${input.searchQuery}%`),
                ilike(genres.slug, `%${input.searchQuery}%`),
              ),
            ),
          limit: 10,
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
  searchDashboard: publicProcedure
    .input(z.object({ language: languageType, searchQuery: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.genres.findMany({
          where: (genres, { eq, and, or, ilike }) =>
            and(
              eq(genres.language, input.language),
              or(
                ilike(genres.title, `%${input.searchQuery}%`),
                ilike(genres.slug, `%${input.searchQuery}%`),
              ),
            ),
          with: {
            genreTranslation: {
              with: {
                genres: true,
              },
            },
          },
          limit: 10,
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
  countByLanguage: publicProcedure
    .input(languageType)
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db
          .select({ values: count() })
          .from(genres)
          .where(eq(genres.language, input))

        return data[0].values
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

        const genreTranslationId = cuid()
        const genreId = cuid()

        const genreTranslation = await ctx.db
          .insert(genreTranslations)
          .values({
            id: genreTranslationId,
          })
          .returning()

        const data = await ctx.db
          .insert(genres)
          .values({
            id: genreId,
            slug: slug,
            metaTitle: generatedMetaTitle,
            metaDescription: generatedMetaDescription,
            genreTranslationId: genreTranslation[0].id,
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
  translate: adminProtectedProcedure
    .input(translateGenreSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const slug = await generateUniqueGenreSlug(input.title)
        const generatedMetaTitle = !input.metaTitle
          ? input.title
          : input.metaTitle
        const generatedMetaDescription = !input.metaDescription
          ? input.description
          : input.metaDescription

        const data = await ctx.db.insert(genres).values({
          id: cuid(),
          slug: slug,
          metaTitle: generatedMetaTitle,
          metaDescription: generatedMetaDescription,
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
  delete: adminProtectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        const genre = await ctx.db.query.genres.findFirst({
          where: (genre, { eq }) => eq(genre.id, input),
        })

        if (genre) {
          const checkIfGenreTranslationHasGenre =
            await ctx.db.query.genreTranslations.findMany({
              where: (genreTranslations, { eq }) =>
                eq(genreTranslations.id, genre.genreTranslationId),
              with: {
                genres: true,
              },
            })

          if (checkIfGenreTranslationHasGenre[0]?.genres.length === 1) {
            const data = await ctx.db.transaction(async () => {
              await ctx.db
                .delete(movieGenres)
                .where(eq(movieGenres.genreId, input))

              await ctx.db.delete(genres).where(eq(genres.id, input))

              await ctx.db
                .delete(genreTranslations)
                .where(eq(genreTranslations.id, genre.genreTranslationId))
            })

            return data
          } else {
            const data = await ctx.db.transaction(async () => {
              await ctx.db
                .delete(movieGenres)
                .where(eq(movieGenres.genreId, input))

              await ctx.db.delete(genres).where(eq(genres.id, input))
            })

            return data
          }
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
})
