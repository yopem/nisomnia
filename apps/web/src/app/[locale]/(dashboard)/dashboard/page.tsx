import * as React from "react"
import type { Metadata } from "next"

import type { LanguageType } from "@nisomnia/db"
import { Icon } from "@nisomnia/ui/next"

import { DashboardBox } from "@/components/Dashboard"
import env from "@/env"
import { api } from "@/lib/trpc/server"

export function generateMetadata({
  params,
}: {
  params: { locale: LanguageType }
}): Metadata {
  const { locale } = params

  return {
    title: "Dashboard",
    description: "Dashboard",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/`,
    },
    openGraph: {
      title: "Dashboard",
      description: "Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/`,
      locale: locale,
    },
  }
}

export default async function DashboardPage() {
  const totalArticles = await api.article.count.query()
  const totalTopics = await api.topic.count.query()
  const totalMedias = await api.media.count.query()
  const totalArticleComments = await api.articleComment.count.query()
  const totalUsers = await api.user.count.query()
  const totalAds = await api.ad.count.query()

  return (
    <div className="my-8">
      <h2 className="text-3xl">Statistics</h2>
      <div className="my-8 grid grid-cols-2 gap-3 md:grid-cols-5">
        <DashboardBox
          icon={<Icon.Article className="h-5 w-5" />}
          count={totalArticles}
          text="articles"
        />
        <DashboardBox
          icon={<Icon.Topic className="h-5 w-5" />}
          count={totalTopics}
          text="topics"
        />
        <DashboardBox
          icon={<Icon.Media className="h-5 w-5" />}
          count={totalMedias}
          text="medias"
        />
        <DashboardBox
          icon={<Icon.Comment className="h-5 w-5" />}
          count={totalArticleComments}
          text="comments"
        />

        <DashboardBox
          icon={<Icon.Users className="h-5 w-5" />}
          count={totalUsers}
          text="users"
        />
        <DashboardBox
          icon={<Icon.Ads className="h-5 w-5" />}
          count={totalAds}
          text="ads"
        />
      </div>
    </div>
  )
}

export const revalidate = 60
