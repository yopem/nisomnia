// TODO: add amp, movie

import type { MetadataRoute } from "next"

import env from "@/env"
import { api } from "@/lib/trpc/server"

interface RouteProps {
  url: string
  lastModified: string
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const perPage = 1000

  const articlesCount = await api.article.countByLanguage("id")
  const articlePageCount = Math.ceil(articlesCount! / perPage)
  const articles: RouteProps[] = []

  const articlesEnCount = await api.article.countByLanguage("en")
  const articleEnPageCount = Math.ceil(articlesEnCount! / perPage)
  const articlesEn: RouteProps[] = []

  const topicsCount = await api.topic.countByLanguage("id")
  const topicPageCount = Math.ceil(topicsCount! / perPage)
  const topics: RouteProps[] = []

  const topicsEnCount = await api.topic.countByLanguage("en")
  const topicEnPageCount = Math.ceil(topicsEnCount! / perPage)
  const topicsEn: RouteProps[] = []

  if (typeof articlePageCount === "number") {
    for (let i = 0; i < articlePageCount; i++) {
      const obj = {
        url: `https://${`${env.NEXT_PUBLIC_DOMAIN}/sitemap/article/${i + 1}/data.xml`}`,
        lastModified: new Date()
          .toISOString()
          .split("T")[0] as unknown as string,
      }
      articles.push(obj)
    }
  }

  if (typeof articleEnPageCount === "number") {
    for (let i = 0; i < articleEnPageCount; i++) {
      const obj = {
        url: `https://${`${env.NEXT_PUBLIC_DOMAIN}/sitemap/article/en/${i + 1}/data.xml`}`,
        lastModified: new Date()
          .toISOString()
          .split("T")[0] as unknown as string,
      }
      articlesEn.push(obj)
    }
  }

  if (typeof topicPageCount === "number") {
    for (let i = 0; i < topicPageCount; i++) {
      const obj = {
        url: `https://${`${env.NEXT_PUBLIC_DOMAIN}/sitemap/topic/${i + 1}/data.xml`}`,
        lastModified: new Date()
          .toISOString()
          .split("T")[0] as unknown as string,
      }
      topics.push(obj)
    }
  }

  if (typeof topicEnPageCount === "number") {
    for (let i = 0; i < topicEnPageCount; i++) {
      const obj = {
        url: `https://${`${env.NEXT_PUBLIC_DOMAIN}/sitemap/topic/en/${i + 1}/data.xml`}`,
        lastModified: new Date()
          .toISOString()
          .split("T")[0] as unknown as string,
      }
      topicsEn.push(obj)
    }
  }

  const routes = ["", "/article", "/topic"].map((route) => ({
    url: `${env.NEXT_PUBLIC_SITE_URL}${route}`,
    lastModified: new Date().toISOString().split("T")[0],
  }))

  return [...routes, ...articles, ...articlesEn, ...topics, ...topicsEn]
}

export const dynamic = "force-dynamic"
