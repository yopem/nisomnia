import { adRouter } from "./routes/ad"
import { articleRouter } from "./routes/article"
import { feedRouter } from "./routes/feed"
import { createCallerFactory, createTRPCRouter } from "./trpc"

export const appRouter = createTRPCRouter({
  ad: adRouter,
  article: articleRouter,
  feed: feedRouter,
})

export type AppRouter = typeof appRouter

export const createCaller = createCallerFactory(appRouter)
