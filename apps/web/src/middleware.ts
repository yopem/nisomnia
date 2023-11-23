import type { NextRequest } from "next/server"
import createIntlMiddleware from "next-intl/middleware"

export default function middleware(request: NextRequest) {
  const defaultLocale = "id"

  const handleI18nRouting = createIntlMiddleware({
    locales: ["id", "en"],
    defaultLocale,
    localeDetection: false,
    localePrefix: "never",
  })

  const response = handleI18nRouting(request)

  response.headers.set("x-default-locale", defaultLocale)

  return response
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|public|sitemap|logo|icon|images|favicon.ico).*)",
  ],
}
