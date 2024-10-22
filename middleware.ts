import type { NextRequest } from "next/server"
import { createI18nMiddleware } from "next-international/middleware"

export default function middleware(request: NextRequest) {
  const I18nMiddleware = createI18nMiddleware({
    locales: ["id", "en"],
    defaultLocale: "id",
    urlMappingStrategy: "rewrite",
  })

  const response = I18nMiddleware(request)

  return response
}

export const config = {
  matcher: [
    "/((?!api|static|.*\\..*|_next|favicon|favicon.ico|sw.js|feed|sitemap|icon|robots.txt).*)",
  ],
}
