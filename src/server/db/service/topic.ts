import { and, count, desc, eq, sql } from "drizzle-orm"

import { db } from "@/server/db"
import {
  articleTopicsTable,
  topicsTable,
  type LanguageType,
} from "@/server/db/schema"

export const getTopicBySlug = async (slug: string) => {
  return await db.query.topicsTable.findFirst({
    where: (topic, { eq }) => eq(topic.slug, slug),
  })
}

export const getTopicsByLanguage = async ({
  language,
  page,
  perPage,
}: {
  language: LanguageType
  page: number
  perPage: number
}) => {
  return await db.query.topicsTable.findMany({
    where: (topics, { eq, and }) =>
      and(eq(topics.language, language), eq(topics.status, "published")),
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (topics, { desc }) => [desc(topics.updatedAt)],
  })
}

export const getTopicsByArticlesCount = async ({
  language,
  page,
  perPage,
}: {
  language: LanguageType
  page: number
  perPage: number
}) => {
  return await db
    .select({
      id: topicsTable.id,
      title: topicsTable.title,
      slug: topicsTable.slug,
      language: topicsTable.language,
      count: sql<number>`count(${articleTopicsTable.articleId})`.mapWith(
        Number,
      ),
    })
    .from(topicsTable)
    .where(
      and(
        eq(topicsTable.language, language),
        eq(topicsTable.status, "published"),
        eq(topicsTable.visibility, "public"),
      ),
    )
    .leftJoin(
      articleTopicsTable,
      eq(articleTopicsTable.topicId, topicsTable.id),
    )
    .limit(perPage)
    .offset((page - 1) * perPage)
    .groupBy(topicsTable.id)
    .orderBy(desc(count(articleTopicsTable.articleId)))
}

export const getTopicsSitemap = async ({
  language,
  page,
  perPage,
}: {
  language: LanguageType
  page: number
  perPage: number
}) => {
  return await db.query.topicsTable.findMany({
    where: (topics, { eq, and }) =>
      and(eq(topics.language, language), eq(topics.status, "published")),
    columns: {
      slug: true,
      updatedAt: true,
    },
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (topics, { desc }) => [desc(topics.updatedAt)],
  })
}

export const getTopicsCount = async () => {
  const data = await db
    .select({ count: count() })
    .from(topicsTable)
    .where(and(eq(topicsTable.status, "published")))

  return data[0].count
}

export const getTopicsCountByLanguage = async (language: LanguageType) => {
  const data = await db
    .select({ count: count() })
    .from(topicsTable)
    .where(
      and(
        eq(topicsTable.language, language),
        eq(topicsTable.status, "published"),
      ),
    )

  return data[0].count
}

export const searchTopics = async ({
  language,
  searchQuery,
  limit,
}: {
  language: LanguageType
  searchQuery: string
  limit: number
}) => {
  return await db.query.topicsTable.findMany({
    where: (topics, { eq, and, or, ilike }) =>
      and(
        eq(topics.language, language),
        eq(topics.status, "published"),
        or(
          ilike(topics.title, `%${searchQuery}%`),
          ilike(topics.slug, `%${searchQuery}%`),
        ),
      ),
    orderBy: (topics, { desc }) => [desc(topics.updatedAt)],
    limit: limit,
  })
}
