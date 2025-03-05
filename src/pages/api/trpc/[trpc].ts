import type { APIRoute } from "astro"
import { fetchRequestHandler } from "@trpc/server/adapters/fetch"

import { createContext } from "@/server/api/context"
import { appRouter } from "@/server/api/root"

export const ALL: APIRoute = (opts) => {
  return fetchRequestHandler({
    endpoint: "/trpc",
    req: opts.request,
    router: appRouter,
    createContext,
  })
}
