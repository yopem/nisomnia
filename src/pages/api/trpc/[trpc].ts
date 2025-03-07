import type { APIRoute } from "astro"
import { fetchRequestHandler } from "@trpc/server/adapters/fetch"

import { appRouter } from "@/server/api/root"
import { createContext } from "@/trpc/server"

export const ALL: APIRoute = (opts) => {
  return fetchRequestHandler({
    endpoint: "/trpc",
    req: opts.request,
    router: appRouter,
    createContext,
  })
}
