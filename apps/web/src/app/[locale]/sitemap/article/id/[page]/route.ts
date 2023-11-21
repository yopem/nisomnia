/* eslint-disable @typescript-eslint/restrict-template-expressions */

import type { NextRequest } from "next/server"
import env from "env"

import { api } from "@/lib/trpc/server"

function generateSiteMap(
  articles:
    | {
        slug: string
        updatedAt: Date
      }[]
    | null,
) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     ${
       articles
         ?.map((article) => {
           return `
       <url>
           <loc>${`${env.NEXT_PUBLIC_SITE_URL}/article/${article.slug}`}</loc>
           <lastmod>${article.updatedAt}</lastmod>
       </url>
     `
         })
         .join("") ?? []
     }
   </urlset>
 `
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { page: string } },
) {
  const page = parseInt(params.page)

  const articles = await api.article.sitemap.query({
    language: "id",
    page: page,
    per_page: 1000,
  })

  const sitemap = generateSiteMap(articles)

  return new Response(sitemap, {
    status: 200,
    headers: {
      "Cache-control": "public, s-maxage=86400, stale-while-revalidate",
      "content-type": "application/xml",
    },
  })
}
