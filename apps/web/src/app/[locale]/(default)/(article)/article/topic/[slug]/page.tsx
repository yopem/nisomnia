import * as React from "react"
import type { Metadata } from "next"
import NextLink from "next/link"
import { notFound } from "next/navigation"
import { BreadcrumbJsonLd } from "next-seo"

import type { LanguageType } from "@nisomnia/db"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Icon,
} from "@nisomnia/ui/next"

import env from "@/env"
import { api } from "@/lib/trpc/server"
import { getI18n, getScopedI18n } from "@/locales/server"

const Ad = React.lazy(async () => {
  const { Ad } = await import("@/components/Ad")
  return { default: Ad }
})

const InfiniteScrollTopicArticles = React.lazy(async () => {
  const { InfiniteScrollTopicArticles } = await import(
    "@/components/Article/InfiniteScrollTopicArticles"
  )
  return { default: InfiniteScrollTopicArticles }
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
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/article/topic/${topic?.slug}`,
    },
    openGraph: {
      title: topic?.title,
      description: topic?.meta_description! ?? topic?.description!,
      url: `${env.NEXT_PUBLIC_SITE_URL}/article/topic/${topic?.slug}`,
      locale: topic?.language,
    },
  }
}

interface TopicArticlePageProps {
  params: {
    slug: string
    locale: LanguageType
  }
}

export default async function TopicArticlePage({
  params,
}: TopicArticlePageProps) {
  const { slug, locale } = params

  const t = await getI18n()
  const ts = await getScopedI18n("article")

  const topic = await api.topic.bySlug.query(slug)

  const adsBelowHeader = await api.ad.byPosition.query("article_below_header")

  if (!topic) {
    notFound()
  }

  return (
    <>
      <BreadcrumbJsonLd
        useAppDir={true}
        itemListElements={[
          {
            position: 1,
            name: env.NEXT_PUBLIC_DOMAIN,
          },
          {
            position: 2,
            name: `${env.NEXT_PUBLIC_SITE_URL}/article`,
          },
          {
            position: 4,
            name: topic?.meta_title ?? topic?.title,
            item: `${env.NEXT_PUBLIC_SITE_URL}/article/topic/${topic?.slug}`,
          },
        ]}
      />
      <section className="flex w-full flex-col">
        {adsBelowHeader.length > 0 &&
          adsBelowHeader.map((ad) => {
            return <Ad key={ad.id} ad={ad} />
          })}
        <Breadcrumb separator={<Icon.ChevronRight />}>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" aria-label="Home">
              <Icon.Home />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink as={NextLink} href="/article">
              {t("article")}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem currentPage>
            <BreadcrumbLink currentPage>{topic.title}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <div className="my-8">
          <h1 className="text-center text-4xl">
            {ts("topic", { title: topic.title })}
          </h1>
        </div>
        <div className="flex w-full flex-col">
          <InfiniteScrollTopicArticles slug={topic.slug} locale={locale} />
        </div>
      </section>
    </>
  )
}

export const revalidate = 0
