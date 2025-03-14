import { TRPCError } from "@trpc/server"
import { tryCatch } from "@yopem/try-catch"
import { z } from "zod"

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"
import {
  getProductionCompaniesCount,
  getProductionCompaniesSitemap,
  getProductionCompanyBySlug,
} from "@/server/db/service/production-company"

export const productionCompanyRouter = createTRPCRouter({
  bySlug: publicProcedure.input(z.string()).query(async ({ input }) => {
    const { data, error } = await tryCatch(getProductionCompanyBySlug(input))
    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error fetching production company",
      })
    }
    return data
  }),

  sitemap: publicProcedure
    .input(z.object({ page: z.number(), perPage: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(
        getProductionCompaniesSitemap(input),
      )
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching production companies",
        })
      }
      return data
    }),

  count: publicProcedure.query(async () => {
    const { data, error } = await tryCatch(getProductionCompaniesCount())
    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error fetching production companies",
      })
    }
    return data
  }),
})
