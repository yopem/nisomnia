import type { NextRequest } from "next/server"

import env from "@/env"

export function GET(_request: NextRequest) {
  const response = new Response(
    `User-Agent: *
Allow: /
Sitemap: ${env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
  )
  response.headers.set("Content-Type", "text/plain")

  return response
}
