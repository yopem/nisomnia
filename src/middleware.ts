import { defineMiddleware } from "astro:middleware"

export const onRequest = defineMiddleware(({ url, redirect }, next) => {
  const pathname = url.pathname

  // Handle trailing slashes - redirect to non-trailing version
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return redirect(pathname.slice(0, -1), 301)
  }

  // Handle AMP redirects
  if (pathname.endsWith("/amp")) {
    return redirect(pathname.replace(/\/amp$/, ""), 301)
  }

  return next()
})
