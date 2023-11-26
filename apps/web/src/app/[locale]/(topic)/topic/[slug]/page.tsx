//TODO: Handle seo

import * as React from "react"
import type { Metadata } from "next"
import dynamic from "next/dynamic"
import NextLink from "next/link"
import { notFound } from "next/navigation"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Icon,
} from "@nisomnia/ui/next"

import { ArticleCardVertical } from "@/components/Article"
import env from "@/env"
import { api } from "@/lib/trpc/server"

const Ad = dynamic(async () => {
  const { Ad } = await import("@/components/Ad")
  return { default: Ad }
})

export const revalidate = 0

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
  }
}

export default async function SingleTopicPage({
  params,
}: SingleTopicPageProps) {
  const { slug } = params

  const topicArticle = await api.topic.articlesByTopicSlug.query({
    slug: slug,
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
            Topic
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
            <h2 className="text-2xl">Articles</h2>
            <NextLink
              className="text-sm"
              href={`/article/topic/${topicArticle.slug}`}
            >
              See more
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
            <h3 className="my-16 text-center text-3xl">Article Not Found</h3>
          )}
        </div>
      )}
    </section>
  )
}
