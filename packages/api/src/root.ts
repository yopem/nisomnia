import { adRouter } from "./modules/ad/ad.route"
import { articleCommentRouter } from "./modules/article-comment/article-comment.route"
import { articleRouter } from "./modules/article/article.route"
import { mediaRouter } from "./modules/media/media.route"
import { topicRouter } from "./modules/topic/topic.route"
import { userRouter } from "./modules/user/user.route"
import { createTRPCRouter } from "./trpc"

export const appRouter = createTRPCRouter({
  ad: adRouter,
  article: articleRouter,
  articleComment: articleCommentRouter,
  media: mediaRouter,
  topic: topicRouter,
  user: userRouter,
})

export type AppRouter = typeof appRouter
