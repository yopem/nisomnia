import { TRPCError } from "@trpc/server"
import { count, eq, sql } from "drizzle-orm"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "@/lib/api/trpc"
import { productionCompanies } from "@/lib/db/schema"
import { cuid } from "@/lib/utils"
import { generateUniqueProductionCompanySlug } from "@/lib/utils/slug"
import {
  createProductionCompanySchema,
  updateProductionCompanySchema,
} from "@/lib/validation/production-company"

export const productionCompanyRouter = createTRPCRouter({
  dashboard: adminProtectedProcedure
    .input(
      z.object({
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.productionCompanies.findMany({
          orderBy: (productionCompanies, { desc }) => [
            desc(productionCompanies.createdAt),
          ],
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
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
        const data = await ctx.db.query.productionCompanies.findFirst({
          where: (productionCompany, { eq }) => eq(productionCompany.id, input),
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
      const data = await ctx.db.query.productionCompanies.findFirst({
        where: (productionCompany, { eq }) => eq(productionCompany.slug, input),
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
        .from(productionCompanies)

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
  search: adminProtectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      try {
        const data = await ctx.db.query.productionCompanies.findMany({
          where: (productionCompanies, { and, or, ilike }) =>
            and(
              or(
                ilike(productionCompanies.name, `%${input}%`),
                ilike(productionCompanies.slug, `%${input}%`),
              ),
            ),
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
  create: adminProtectedProcedure
    .input(createProductionCompanySchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const slug = await generateUniqueProductionCompanySlug(input.name)
        const data = await ctx.db
          .insert(productionCompanies)
          .values({ id: cuid(), slug: slug, ...input })
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
    .input(updateProductionCompanySchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const data = await ctx.db
          .update(productionCompanies)
          .set({
            ...input,
            updatedAt: sql`CURRENT_TIMESTAMP`,
          })
          .where(eq(productionCompanies.id, input.id))
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
  delete: adminProtectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        const data = await ctx.db
          .delete(productionCompanies)
          .where(eq(productionCompanies.id, input))

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
