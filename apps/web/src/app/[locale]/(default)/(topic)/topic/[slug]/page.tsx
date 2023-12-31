//TODO: Handle seo

import * as React from "react"
import type { Metadata } from "next"
import NextLink from "next/link"
import { notFound } from "next/navigation"

import type { LanguageType } from "@nisomnia/db"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Icon,
} from "@nisomnia/ui/next"

import { ArticleCardVertical } from "@/components/Article/ArticleCardVertical"
import env from "@/env"
import { api } from "@/lib/trpc/server"
import { getI18n, getScopedI18n } from "@/locales/server"

const Ad = React.lazy(async () => {
  const { Ad } = await import("@/components/Ad")
  return { default: Ad }
})

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const { slug } = params

  const topic = await api.topic.bySlug.query(slug)

  return {
    title: topic?.meta_title ?? topic?.title,
    description: topic?.meta_description ?? topic?.description,
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/topic/${topic?.slug}`,
    },
    openGraph: {
      title: topic?.title,
      description: topic?.meta_description! ?? topic?.description!,
      url: `${env.NEXT_PUBLIC_SITE_URL}/topic/${topic?.slug}`,
      locale: topic?.language,
    },
  }
}

interface SingleTopicPageProps {
  params: {
    slug: string
    locale: LanguageType
  }
}

export default async function SingleTopicPage({
  params,
}: SingleTopicPageProps) {
  const { slug, locale } = params

  const t = await getI18n()
  const ts = await getScopedI18n("article")

  const topicArticle = await api.topic.articlesByTopicSlug.query({
    slug: slug,
    language: locale,
    page: 1,
    per_page: 10,
  })

  const adsBelowHeader = await api.ad.byPosition.query("article_below_header")

  if (!topicArticle) {
    notFound()
  }

  return (
    <section>
      {adsBelowHeader.length > 0 &&
        adsBelowHeader.map((ad) => {
          return <Ad key={ad.id} ad={ad} />
        })}
      <Breadcrumb separator={<Icon.ChevronRight />}>
        <BreadcrumbItem>
          <BreadcrumbLink as={NextLink} href="/" aria-label="Home">
            <Icon.Home />
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink as={NextLink} href="/topic">
            {t("topic")}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem currentPage>
          <BreadcrumbLink currentPage>{topicArticle.title}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <div className="my-8">
        <h1 className="text-center text-4xl">{topicArticle.title}</h1>
      </div>
      {(topicArticle.type === "article" || topicArticle.type === "all") && (
        <div className="flex w-full flex-col">
          <div className="my-2 flex flex-row items-center justify-between">
            <h2 className="text-2xl">{t("articles")}</h2>
            <NextLink
              aria-label={topicArticle.title}
              href={`/article/topic/${topicArticle.slug}`}
              className="text-sm"
            >
              {t("see_more")}
            </NextLink>
          </div>
          {topicArticle.articles.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {topicArticle.articles.map((article) => {
                return (
                  <ArticleCardVertical key={article.id} article={article} />
                )
              })}
            </div>
          ) : (
            <h3 className="my-16 text-center text-3xl">{ts("not_found")}</h3>
          )}
        </div>
      )}
    </section>
  )
}

export const revalidate = 0
