import * as React from "react"
import type { Metadata } from "next"
import NextLink from "next/link"
import { notFound } from "next/navigation"
import { BreadcrumbJsonLd } from "next-seo"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Icon,
} from "@nisomnia/ui/next"

import env from "@/env"
import { api } from "@/lib/trpc/server"

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
  }
}

export default async function TopicArticlePage({
  params,
}: TopicArticlePageProps) {
  const { slug } = params

  const topicArticle = await api.topic.articlesByTopicSlug.query({
    slug: slug,
    page: 1,
    per_page: 10,
  })

  const totalPage =
    topicArticle?._count.articles &&
    Math.ceil(topicArticle._count.articles / 10)

  const adsBelowHeader = await api.ad.byPosition.query("article_below_header")

  if (!topicArticle) {
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
            name: topicArticle?.meta_title ?? topicArticle?.title,
            item: `${env.NEXT_PUBLIC_SITE_URL}/article/topic/${topicArticle?.slug}`,
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
              Article
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem currentPage>
            <BreadcrumbLink currentPage>{topicArticle.title}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <div className="my-8">
          <h1 className="text-center text-4xl">{`${topicArticle.title} Articles`}</h1>
        </div>
        <div className="flex w-full flex-col">
          {topicArticle && totalPage && topicArticle.articles && (
            <InfiniteScrollTopicArticles slug={topicArticle.slug} />
          )}
        </div>
      </section>
    </>
  )
}

export const revalidate = 0