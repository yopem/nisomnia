import * as React from "react"
import env from "env"

import { DashboardArticleCommentContent } from "./content"

export const metadata = {
  title: "Article Comment Dashboard",
  description: "Article Comment Dashboard",
  alternates: {
    canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/article/comment/`,
  },
}

export default function ArticleCommentDashboardPage() {
  return <DashboardArticleCommentContent />
}
