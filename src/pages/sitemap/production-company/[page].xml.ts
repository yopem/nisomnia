import type { APIRoute } from "astro"

import { api } from "@/trpc/server"
import { publicSiteUrl } from "@/utils/constant"

function generateSiteMap(
  productionCompanies:
    | {
        slug: string
        updatedAt: Date | null
      }[]
    | null,
) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     ${
       productionCompanies
         ?.map((productionCompany) => {
           return `
       <url>
           <loc>${`${publicSiteUrl}/production-company/${productionCompany.slug}`}</loc>
           <lastmod>${
             new Date(productionCompany.updatedAt ?? new Date())
               .toISOString()
               .split("T")[0]
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

  const productionCompanies = await api.productionCompany.sitemap({
    page,
    perPage: 10000,
  })

  const sitemap = generateSiteMap(productionCompanies)

  return new Response(sitemap, {
    status: 200,
    headers: {
      "Cache-control": "public, s-maxage=86400, stale-while-revalidate",
      "content-type": "application/xml",
    },
  })
}
