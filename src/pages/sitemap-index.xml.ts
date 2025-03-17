import type { APIRoute } from "astro"

import { api } from "@/trpc/server"
import { publicSiteUrl } from "@/utils/constant"

interface RouteProps {
  url: string
  lastModified: string
}

function generateSitemapIndex(sitemapUrls: RouteProps[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${sitemapUrls
        .map(
          (item) => `
        <sitemap>
          <loc>${item.url}</loc>
          <lastmod>${item.lastModified}</lastmod>
        </sitemap>
      `,
        )
        .join("")}
    </sitemapindex>
  `
}

export const GET: APIRoute = async () => {
  const perPage = 10000

  const articlesCount = await api.article.countByLanguage("id")
  const articlePageCount = Math.ceil(articlesCount / perPage)
  const articles: RouteProps[] = []

  const articlesEnCount = await api.article.countByLanguage("en")
  const articleEnPageCount = Math.ceil(articlesEnCount / perPage)
  const articlesEn: RouteProps[] = []

  const topicsCount = await api.topic.countByLanguage("id")
  const topicPageCount = Math.ceil(topicsCount / perPage)
  const topics: RouteProps[] = []

  const topicsEnCount = await api.topic.countByLanguage("en")
  const topicEnPageCount = Math.ceil(topicsEnCount / perPage)
  const topicsEn: RouteProps[] = []

  const moviesCount = await api.movie.count()
  const moviePageCount = Math.ceil(moviesCount / perPage)
  const movies: RouteProps[] = []

  const genresCount = await api.genre.count()
  const genrePageCount = Math.ceil(genresCount / perPage)
  const genres: RouteProps[] = []

  const productionCompaniesCount = await api.productionCompany.count()
  const productionCompanyPageCount = Math.ceil(
    productionCompaniesCount / perPage,
  )
  const productionCompanies: RouteProps[] = []

  const mediasCount = await api.media.count()
  const mediaPageCount = Math.ceil(mediasCount / perPage)
  const medias: RouteProps[] = []

  if (typeof articlePageCount === "number") {
    for (let i = 0; i < articlePageCount; i++) {
      const obj = {
        url: `${publicSiteUrl}/sitemap/article/${i + 1}.xml`,
        lastModified: new Date().toISOString().split("T")[0],
      }
      articles.push(obj)
    }
  }

  if (typeof articleEnPageCount === "number") {
    for (let i = 0; i < articleEnPageCount; i++) {
      const obj = {
        url: `${publicSiteUrl}/sitemap/article/en/${i + 1}.xml`,
        lastModified: new Date().toISOString().split("T")[0],
      }
      articlesEn.push(obj)
    }
  }

  if (typeof topicPageCount === "number") {
    for (let i = 0; i < topicPageCount; i++) {
      const obj = {
        url: `${publicSiteUrl}/sitemap/topic/${i + 1}.xml`,
        lastModified: new Date().toISOString().split("T")[0],
      }
      topics.push(obj)
    }
  }

  if (typeof topicEnPageCount === "number") {
    for (let i = 0; i < topicEnPageCount; i++) {
      const obj = {
        url: `${publicSiteUrl}/sitemap/topic/en/${i + 1}.xml`,
        lastModified: new Date().toISOString().split("T")[0],
      }
      topicsEn.push(obj)
    }
  }

  if (typeof moviePageCount === "number") {
    for (let i = 0; i < moviePageCount; i++) {
      const obj = {
        url: `${publicSiteUrl}/sitemap/movie/${i + 1}.xml`,
        lastModified: new Date().toISOString().split("T")[0],
      }
      movies.push(obj)
    }
  }

  if (typeof genrePageCount === "number") {
    for (let i = 0; i < genrePageCount; i++) {
      const obj = {
        url: `${publicSiteUrl}/sitemap/genre/${i + 1}.xml`,
        lastModified: new Date().toISOString().split("T")[0],
      }
      genres.push(obj)
    }
  }

  if (typeof productionCompanyPageCount === "number") {
    for (let i = 0; i < productionCompanyPageCount; i++) {
      const obj = {
        url: `${publicSiteUrl}/sitemap/production-company/${i + 1}.xml`,
        lastModified: new Date().toISOString().split("T")[0],
      }
      productionCompanies.push(obj)
    }
  }

  if (typeof mediaPageCount === "number") {
    for (let i = 0; i < mediaPageCount; i++) {
      const obj = {
        url: `${publicSiteUrl}/sitemap/media/${i + 1}.xml`,
        lastModified: new Date().toISOString().split("T")[0],
      }
      medias.push(obj)
    }
  }

  const routes = [
    "",
    "/article",
    "/topic",
    "/movie",
    "/genre",
    "/production-company",
  ].map((route) => ({
    url: `${publicSiteUrl}${route}`,
    lastModified: new Date().toISOString().split("T")[0],
  }))

  // NOTE: en content not yet ready
  const allSitemaps = [
    ...routes,
    ...articles,
    ...articlesEn,
    ...topics,
    ...topicsEn,
    ...movies,
    ...genres,
    ...productionCompanies,
    ...medias,
  ]

  const sitemap = generateSitemapIndex(allSitemaps)

  return new Response(sitemap, {
    status: 200,
    headers: {
      "Cache-control": "public, s-maxage=86400, stale-while-revalidate",
      "content-type": "application/xml",
    },
  })
}
