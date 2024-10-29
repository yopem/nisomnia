import type { NextRequest } from "next/server"

import env from "@/env"

export function GET(_request: NextRequest) {
  const response = new Response(
    `User-Agent: *
Allow: /

Disallow: /?p=*
Disallow: /cdn-cgi/bm/cv/
Disallow: /cdn-cgi/challenge-platform/
Disallow: /cdn-cgi/zaraz/s.js?z=

User-agent: Nuclei
User-agent: WikiDo
User-agent: Riddler
User-agent: PetalBot
User-agent: Zoominfobot
User-agent: Go-http-client
User-agent: Node/simplecrawler
User-agent: CazoodleBot
User-agent: dotbot/1.0
User-agent: Gigabot
User-agent: Barkrowler
User-agent: BLEXBot
User-agent: magpie-crawler
Disallow: /

Sitemap: ${env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
  )
  response.headers.set("Content-Type", "text/plain")

  return response
}
