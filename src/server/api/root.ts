import { adRouter } from "./routes/ad"
import { createCallerFactory, createTRPCRouter } from "./trpc"

export const appRouter = createTRPCRouter({
  ad: adRouter,
})

export type AppRouter = typeof appRouter

export const createCaller = createCallerFactory(appRouter)
