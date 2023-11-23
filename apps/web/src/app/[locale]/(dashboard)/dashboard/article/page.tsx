import * as React from "react"

import env from "@/env"
import { DashboardArticleContent } from "./content"

export const metadata = {
  title: "Article Dashboard",
  description: "Article Dashboard",
  alternates: {
    canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/article/`,
  },
}

export default function ArticleDashboardPage() {
  return <DashboardArticleContent />
}
