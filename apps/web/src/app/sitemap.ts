import type { MetadataRoute } from "next"
import env from "env"

import { api } from "@/lib/trpc/server"

interface RouteProps {
  url: string
  lastModified: string
}

export const dynamic = "force-dynamic"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articlesCountId = await api.article.countByLanguage.query("id")
  const articlesCountEn = await api.article.countByLanguage.query("en")
  const topicsCountId = await api.topic.countByLanguage.query("id")
  const topicsCountEn = await api.topic.countByLanguage.query("en")
  const perPage = 1000

  const articlePageCountId = Math.ceil((articlesCountId as number) / perPage)
  const articlePageCountEn = Math.ceil((articlesCountEn as number) / perPage)
  const topicPageCountId = Math.ceil((topicsCountId as number) / perPage)
  const topicPageCountEn = Math.ceil((topicsCountEn as number) / perPage)
  const articles: RouteProps[] = []

  if (typeof articlePageCountId === "number") {
    for (let i = 0; i < articlePageCountId; i++) {
      const obj = {
        url: `https://${`${env.NEXT_PUBLIC_DOMAIN}/sitemap/article/id/${
          i + 1
        }`}`,
        lastModified: new Date()
          .toISOString()
          .split("T")[0] as unknown as string,
      }
      articles.push(obj)
    }
  }

  const articlesEn: RouteProps[] = []
  if (typeof articlePageCountEn === "number") {
    for (let i = 0; i < articlePageCountEn; i++) {
      const obj = {
        url: `https://${`${env.NEXT_PUBLIC_DOMAIN}/sitemap/article/en/${
          i + 1
        }`}`,
        lastModified: new Date()
          .toISOString()
          .split("T")[0] as unknown as string,
      }
      articlesEn.push(obj)
    }
  }

  const topicsId: RouteProps[] = []
  if (typeof topicPageCountId === "number") {
    for (let i = 0; i < topicPageCountId; i++) {
      const obj = {
        url: `https://${`${env.NEXT_PUBLIC_DOMAIN}/sitemap/topic/id/${i + 1}`}`,
        lastModified: new Date()
          .toISOString()
          .split("T")[0] as unknown as string,
      }
      topicsId.push(obj)
    }
  }

  const topicsEn: RouteProps[] = []
  if (typeof topicPageCountEn === "number") {
    for (let i = 0; i < topicPageCountEn; i++) {
      const obj = {
        url: `https://${`${env.NEXT_PUBLIC_DOMAIN}/sitemap/topic/en/${i + 1}`}`,
        lastModified: new Date()
          .toISOString()
          .split("T")[0] as unknown as string,
      }
      topicsEn.push(obj)
    }
  }

  const routes = ["", "/article"].map((route) => ({
    url: `${env.NEXT_PUBLIC_DOMAIN}${route}`,
    lastModified: new Date().toISOString().split("T")[0],
  }))

  return [...routes, ...articles, ...articlesEn, ...topicsId, ...topicsEn]
}
