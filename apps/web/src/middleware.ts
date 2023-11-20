import createMiddleware from "next-intl/middleware"

export default createMiddleware({
  locales: ["id", "en"],
  defaultLocale: "id",
  localePrefix: "never",
  //NOTE: disable this if language switcher work
  localeDetection: false,
  alternateLinks: false,
})

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
}
