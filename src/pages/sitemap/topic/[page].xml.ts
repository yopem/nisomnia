import type { APIRoute } from "astro"

import { api } from "@/trpc/server"
import { publicSiteUrl } from "@/utils/constant"

function generateSiteMap(
  topics:
    | {
        slug: string
        updatedAt: Date | null
      }[]
    | null,
) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     ${
       topics
         ?.map((topic) => {
           return `
       <url>
           <loc>${`${publicSiteUrl}/topic/${topic.slug}`}</loc>
           <lastmod>${
             new Date(topic.updatedAt ?? new Date()).toISOString().split("T")[0]
           }</lastmod>
       </url>
     `
         })
         .join("") ?? ""
     }
   </urlset>
 `
}

export const GET: APIRoute = async ({ params }) => {
  if (!params.page) {
    console.error("Page parameter is missing:", params)
    return new Response("Missing page parameter", { status: 400 })
  }

  const page = parseInt(params.page)

  const topics = await api.topic.sitemap({
    language: "id",
    page,
    perPage: 10000,
  })

  const sitemap = generateSiteMap(topics)

  return new Response(sitemap, {
    status: 200,
    headers: {
      "Cache-control": "public, s-maxage=86400, stale-while-revalidate",
      "content-type": "application/xml",
    },
  })
}
