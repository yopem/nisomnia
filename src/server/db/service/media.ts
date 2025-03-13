import { count } from "drizzle-orm"

import { db } from "@/server/db"
import { mediasTable, type MediaCategory } from "@/server/db/schema"

export const getMediasByCategory = async (category: MediaCategory) => {
  return await db.query.mediasTable.findMany({
    where: (medias, { eq }) => eq(medias.category, category),
    limit: 1000,
  })
}

export const getMediaSitemap = async ({
  page,
  perPage,
}: {
  page: number
  perPage: number
}) => {
  return await db.query.mediasTable.findMany({
    columns: {
      url: true,
      updatedAt: true,
    },
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (medias, { desc }) => [desc(medias.id)],
  })
}

export const getMediasCount = async () => {
  const data = await db.select({ value: count() }).from(mediasTable)

  return data[0].value
}

export const searchMedias = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  return db.query.mediasTable.findMany({
    where: (medias, { ilike }) => ilike(medias.name, `%${searchQuery}%`),
    limit: limit,
  })
}

export const searchMediasByCategory = async ({
  searchQuery,
  category,
  limit,
}: {
  searchQuery: string
  category: MediaCategory
  limit: number
}) => {
  return db.query.mediasTable.findMany({
    where: (medias, { and, ilike, eq }) =>
      and(
        eq(medias.category, category),
        ilike(medias.name, `%${searchQuery}%`),
      ),
    limit: limit,
  })
}
