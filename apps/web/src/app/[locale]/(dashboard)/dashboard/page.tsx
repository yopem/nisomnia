import * as React from "react"
import type { Metadata } from "next"

import type { LanguageType } from "@nisomnia/db"
import { Icon } from "@nisomnia/ui/next"

import { DashboardBox } from "@/components/Dashboard/DashboardBox"
import env from "@/env"
import { api } from "@/lib/trpc/server"
import { getI18n } from "@/locales/server"

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

  const t = await getI18n()

  return (
    <div className="my-8">
      <h2 className="text-3xl">{t("statistics")}</h2>
      <div className="my-8 grid grid-cols-2 gap-3 md:grid-cols-5">
        <DashboardBox
          icon={<Icon.Article className="h-5 w-5" />}
          count={totalArticles}
          text={t("articles")}
        />
        <DashboardBox
          icon={<Icon.Topic className="h-5 w-5" />}
          count={totalTopics}
          text={t("topics")}
        />
        <DashboardBox
          icon={<Icon.Media className="h-5 w-5" />}
          count={totalMedias}
          text={t("medias")}
        />
        <DashboardBox
          icon={<Icon.Comment className="h-5 w-5" />}
          count={totalArticleComments}
          text={t("comments")}
        />

        <DashboardBox
          icon={<Icon.Users className="h-5 w-5" />}
          count={totalUsers}
          text={t("users")}
        />
        <DashboardBox
          icon={<Icon.Ads className="h-5 w-5" />}
          count={totalAds}
          text={t("ads")}
        />
      </div>
    </div>
  )
}

export const revalidate = 60
