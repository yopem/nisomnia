import { TRPCError } from "@trpc/server"
import { tryCatch } from "@yopem/try-catch"

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"
import { adPosition } from "@/server/db/schema"
import { getAdsByPosition } from "@/server/db/service/ad"

export const adRouter = createTRPCRouter({
  byPosition: publicProcedure.input(adPosition).query(async ({ input }) => {
    const { data, error } = await tryCatch(getAdsByPosition(input))

    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error fetching ads",
      })
    }

    return data
  }),
})
