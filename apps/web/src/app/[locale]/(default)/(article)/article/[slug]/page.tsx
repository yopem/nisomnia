import * as React from "react"
import type { Metadata } from "next"
import NextLink from "next/link"
import { notFound } from "next/navigation"
import { ArticleJsonLd, BreadcrumbJsonLd } from "next-seo"

import { getCurrentUser } from "@nisomnia/auth"
import type { LanguageType } from "@nisomnia/db"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Icon,
} from "@nisomnia/ui/next"

import { Image } from "@/components/Image"
import { Share } from "@/components/Share"
import { TransformContent } from "@/components/TransformContent"
import env from "@/env"
import { parseAndSplitHTMLString } from "@/lib/content"
import { readingTime } from "@/lib/reading-time"
import { api } from "@/lib/trpc/server"

const Ad = React.lazy(async () => {
  const { Ad } = await import("@/components/Ad")
  return { default: Ad }
})

const ArticleComment = React.lazy(async () => {
  const { ArticleComment } = await import("@/components/Article/ArticleComment")
  return { default: ArticleComment }
})

const InfiniteScrollArticles = React.lazy(async () => {
  const { InfiniteScrollArticles } = await import(
    "@/components/Article/InfiniteScrollArticles"
  )
  return { default: InfiniteScrollArticles }
})

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const { slug } = params

  const article = await api.article.bySlug.query(slug)

  return {
    title: article?.meta_title ?? article?.title,
    description: article?.meta_description ?? article?.excerpt,
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/article/${article?.slug}`,
    },
    openGraph: {
      title: article?.title,
      description: article?.meta_description ?? article?.excerpt,
      url: `${env.NEXT_PUBLIC_SITE_URL}/article/${article?.slug}`,
      locale: article?.language,
    },
  }
}

interface ArticleSlugPageProps {
  params: {
    slug: string
    locale: LanguageType
  }
}

export default async function ArticleSlugPage({
  params,
}: ArticleSlugPageProps) {
  const { locale, slug } = params

  const user = await getCurrentUser()
  const article = await api.article.bySlug.query(slug)

  if (!article) {
    notFound()
  }

  const adsBelowHeader = await api.ad.byPosition.query("article_below_header")
  const adsSingleArticleAboveContent = await api.ad.byPosition.query(
    "single_article_above_content",
  )
  const adsSingleArticleBelowContent = await api.ad.byPosition.query(
    "single_article_below_content",
  )
  const adsSingleArticleMiddleContent = await api.ad.byPosition.query(
    "single_article_middle_content",
  )

  const { firstHalf, secondHalf } = parseAndSplitHTMLString(article?.content)

  const firstContent = TransformContent({
    htmlInput: firstHalf,
    title: article?.title!,
  })

  const secondContent = TransformContent({
    htmlInput: secondHalf,
    title: article?.title!,
  })

  return (
    <>
      <BreadcrumbJsonLd
        useAppDir={true}
        itemListElements={[
          {
            position: 1,
            name: env.NEXT_PUBLIC_DOMAIN,
            item: env.NEXT_PUBLIC_SITE_URL,
          },
          {
            position: 2,
            name: "Article",
            item: `${env.NEXT_PUBLIC_SITE_URL}/article`,
          },
          {
            position: 3,
            name: article?.topics[0]?.title,
            item: `${env.NEXT_PUBLIC_SITE_URL}/article/topic/${article?.topics[0]?.slug}`,
          },
          {
            position: 4,
            name: article?.meta_title ?? article?.title,
            item: `${env.NEXT_PUBLIC_SITE_URL}/article/${article?.slug}`,
          },
        ]}
      />
      <ArticleJsonLd
        useAppDir={true}
        url={`${env.NEXT_PUBLIC_SITE_URL}/article/${article.slug}`}
        title={article.meta_title ?? article.title}
        images={[article.featured_image.url]}
        datePublished={JSON.stringify(article.createdAt)}
        dateModified={JSON.stringify(article.createdAt)}
        authorName={[
          {
            name: article?.authors[0]?.name,
            url: `${env.NEXT_PUBLIC_SITE_URL}/user/${article?.authors[0]?.username}`,
          },
        ]}
        publisherName={env.NEXT_PUBLIC_SITE_TITLE}
        publisherLogo={env.NEXT_PUBLIC_LOGO_URL}
        description={article.meta_description ?? article.excerpt}
        isAccessibleForFree={true}
      />
      <section>
        {adsBelowHeader.length > 0 &&
          adsBelowHeader.map((ad) => {
            return <Ad key={ad.id} ad={ad} />
          })}
        <div className="mb-5 md:mb-10">
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
            <BreadcrumbItem>
              <BreadcrumbLink
                as={NextLink}
                href={`/article/topic/${article?.topics[0]?.slug}`}
              >
                {article?.topics[0]?.title}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem currentPage>
              <BreadcrumbLink currentPage>{article.title}</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </div>
        <div className="space-y-4">
          <h1 className="text-xl md:text-3xl">{article.title}</h1>
          <div className="flex justify-between">
            <div className="inline-flex space-x-1">
              <NextLink
                aria-label={`${article?.authors[0]?.username} Profile`}
                href={`/user/${article?.authors[0]?.username}`}
                className="text-sm font-bold"
              >
                {article?.authors[0]?.name}
              </NextLink>
            </div>
            <p className="text-sm">
              <Icon.Read className="mr-1 inline-flex h-4 w-4" />
              {readingTime(article)}
            </p>
          </div>
          <div className="relative aspect-video w-full">
            <Image
              fill
              sizes="(max-width: 720px) 100vw, 50vw"
              src={article.featured_image.url}
              alt={article.title}
              className="w-full rounded-md object-cover"
            />
          </div>
          <div className="article-container" id="container">
            {adsSingleArticleAboveContent.length > 0 &&
              adsSingleArticleAboveContent.map((ad) => {
                return <Ad key={ad.id} ad={ad} />
              })}
            {firstContent as React.ReactNode}
            {adsSingleArticleMiddleContent.length > 0 &&
              adsSingleArticleMiddleContent.map((ad) => {
                return <Ad key={ad.id} ad={ad} />
              })}
            {secondContent as React.ReactNode}
          </div>
          <div className="my-4 space-x-2">
            {article.topics.map((topic) => {
              return (
                <Button
                  key={topic.slug}
                  size="sm"
                  variant="outline"
                  className="rounded-full uppercase"
                >
                  <NextLink
                    aria-label={topic.title}
                    href={`/article/topic/${topic.slug}`}
                  >
                    {topic.title}
                  </NextLink>
                </Button>
              )
            })}
          </div>
          <div className="my-4">
            {adsSingleArticleBelowContent.length > 0 &&
              adsSingleArticleBelowContent.map((ad) => {
                return <Ad key={ad.id} ad={ad} />
              })}
          </div>
          <Share
            url={`${env.NEXT_PUBLIC_SITE_URL}/article/${article.slug}`}
            text={article.title}
          />
          <ArticleComment article_id={article.id} user={user!} />
          <div className="flex w-full flex-col space-y-4">
            <h3>You may also like</h3>
            <InfiniteScrollArticles locale={locale} />
          </div>
        </div>
      </section>
    </>
  )
}

export const revalidate = 0