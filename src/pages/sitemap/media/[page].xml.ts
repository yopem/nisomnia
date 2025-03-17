import type { APIRoute } from "astro"

import { api } from "@/trpc/server"

function generateSiteMap(
  medias:
    | {
        url: string
        updatedAt: Date | null
      }[]
    | null,
) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     ${
       medias
         ?.map((media) => {
           return `
       <url>
           <loc>${media.url}</loc>
           <lastmod>${
             new Date(media.updatedAt ?? new Date()).toISOString().split("T")[0]
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

  const medias = await api.media.sitemap({
    page,
    perPage: 10000,
  })

  const sitemap = generateSiteMap(medias)

  return new Response(sitemap, {
    status: 200,
    headers: {
      "Cache-control": "public, s-maxage=86400, stale-while-revalidate",
      "content-type": "application/xml",
    },
  })
}
