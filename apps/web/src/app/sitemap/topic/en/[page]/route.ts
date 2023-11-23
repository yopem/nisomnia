/* eslint-disable @typescript-eslint/restrict-template-expressions */

import type { NextRequest } from "next/server"
import env from "env"

import { api } from "@/lib/trpc/server"

function generateSiteMap(
  topics:
    | {
        updatedAt: Date
        slug: string
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
           <loc>${`${env.NEXT_PUBLIC_SITE_URL}/topic/${topic.slug}`}</loc>
           <lastmod>${topic.updatedAt}</lastmod>
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

  const topics = await api.topic.sitemap.query({
    language: "en",
    page: page,
    per_page: 1000,
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
