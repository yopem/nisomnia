import { and, count, eq } from "drizzle-orm"

import { db } from "@/server/db"
import { feedsTable, type LanguageType } from "@/server/db/schema"

export const getFeedsByLanguage = async ({
  language,
  page,
  perPage,
}: {
  language: LanguageType
  page: number
  perPage: number
}) => {
  return await db.query.feedsTable.findMany({
    where: (feeds, { eq, and }) =>
      and(eq(feeds.language, language), eq(feeds.status, "published")),
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (feeds, { desc }) => [desc(feeds.updatedAt)],
  })
}

export const getFeedsByTopicId = async ({
  topicId,
  language,
  page,
  perPage,
}: {
  topicId: string
  language: LanguageType
  page: number
  perPage: number
}) => {
  const feeds = await db.query.feedsTable.findMany({
    where: (feeds, { eq, and }) =>
      and(eq(feeds.language, language), eq(feeds.status, "published")),
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (feeds, { desc }) => [desc(feeds.updatedAt)],
    with: {
      topics: true,
    },
  })

  return feeds.filter((feed) =>
    feed.topics.some((topic) => topic.topicId === topicId),
  )
}

export const getFeedsByOwner = async ({
  owner,
  language,
  page,
  perPage,
}: {
  owner: string
  language: LanguageType
  page: number
  perPage: number
}) => {
  return await db.query.feedsTable.findMany({
    where: (feeds, { and, eq }) =>
      and(eq(feeds.language, language), eq(feeds.owner, owner)),
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (feeds, { desc }) => [desc(feeds.updatedAt)],
  })
}

export const getFeedsSitemap = async ({
  language,
  page,
  perPage,
}: {
  language: LanguageType
  page: number
  perPage: number
}) => {
  return await db.query.feedsTable.findMany({
    where: (feeds, { eq, and }) =>
      and(eq(feeds.language, language), eq(feeds.status, "published")),
    columns: {
      slug: true,
      updatedAt: true,
    },
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (feeds, { desc }) => [desc(feeds.id)],
  })
}

export const getFeedsCount = async () => {
  const data = await db
    .select({ value: count() })
    .from(feedsTable)
    .where(and(eq(feedsTable.status, "published")))

  return data[0].value
}

export const getFeedsCountByLanguage = async (language: LanguageType) => {
  const data = await db
    .select({ values: count() })
    .from(feedsTable)
    .where(
      and(
        eq(feedsTable.language, language),
        eq(feedsTable.status, "published"),
      ),
    )

  return data[0].values
}

export const searchFeeds = async ({
  language,
  searchQuery,
  limit,
}: {
  language: LanguageType
  searchQuery: string
  limit: number
}) => {
  return await db.query.feedsTable.findMany({
    where: (feeds, { eq, and, or, ilike }) =>
      and(
        eq(feeds.language, language),
        eq(feeds.status, "published"),
        or(
          ilike(feeds.title, `%${searchQuery}%`),
          ilike(feeds.slug, `%${searchQuery}%`),
        ),
      ),
    limit: limit,
  })
}
