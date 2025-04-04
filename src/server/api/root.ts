import { adRouter } from "./routes/ad"
import { articleRouter } from "./routes/article"
import { feedRouter } from "./routes/feed"
import { genreRouter } from "./routes/genre"
import { mediaRouter } from "./routes/media"
import { movieRouter } from "./routes/movie"
import { productionCompanyRouter } from "./routes/production-company"
import { topicRouter } from "./routes/topic"
import { userRouter } from "./routes/user"
import { createCallerFactory, createTRPCRouter } from "./trpc"

export const appRouter = createTRPCRouter({
  ad: adRouter,
  article: articleRouter,
  feed: feedRouter,
  genre: genreRouter,
  media: mediaRouter,
  movie: movieRouter,
  productionCompany: productionCompanyRouter,
  topic: topicRouter,
  user: userRouter,
})

export type AppRouter = typeof appRouter

export const createCaller = createCallerFactory(appRouter)
