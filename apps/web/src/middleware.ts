import createMiddleware from "next-intl/middleware"

export default createMiddleware({
  locales: ["id", "en"],
  defaultLocale: "id",
  localePrefix: "never",
  localeDetection: true,
})

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
}
