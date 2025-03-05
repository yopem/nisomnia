import { db } from "@/server/db"
import type { AdPosition } from "@/server/db/schema"

export const getAdsByPosition = async (position: AdPosition) => {
  return await db.query.adsTable.findMany({
    where: (ads, { eq }) => eq(ads.position, position),
  })
}
