import * as React from "react"
import type { Metadata } from "next"
import NextLink from "next/link"
import { notFound } from "next/navigation"
import { ArticleJsonLd, BreadcrumbJsonLd } from "next-seo"

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
import { api } from "@/lib/trpc/server"
import { getI18n } from "@/locales/server"

const Ad = React.lazy(async () => {
  const { Ad } = await import("@/components/Ad")
  return { default: Ad }
})

const ArticleComment = React.lazy(async () => {
  const { ArticleComment } = await import("@/components/Article/ArticleComment")
  return { default: ArticleComment }
})

const InfiniteScrollRelatedArticles = React.lazy(async () => {
  const { InfiniteScrollRelatedArticles } = await import(
    "@/components/Article/InfiniteScrollRelatedArticles"
  )
  return { default: InfiniteScrollRelatedArticles }
})

export function generateStaticParams() {
  return []
}

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
      images: [
        {
          url: article?.featured_image.url!,
          width: 1280,
          height: 720,
        },
      ],
      url: `${env.NEXT_PUBLIC_SITE_URL}/article/${article?.slug}`,
      locale: article?.language,
    },
    twitter: {
      title: env.NEXT_PUBLIC_TWITTER_USERNAME,
      card: "summary_large_image",
      images: [
        {
          url: article?.featured_image.url!,
          width: 1280,
          height: 720,
        },
      ],
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

  const t = await getI18n()

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
                {t("article")}
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
                aria-label={article?.authors[0]?.name!}
                href={`/user/${article?.authors[0]?.username}`}
                className="text-sm font-bold"
              >
                {article?.authors[0]?.name}
              </NextLink>
            </div>
          </div>
          <Image
            fill
            loading="eager"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw"
            priority
            placeholder="empty"
            src={article.featured_image.url}
            alt={article.title}
            className="!relative !h-auto !w-auto max-w-full rounded-md object-cover"
          />
          <article className="article-container" id="container">
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
          </article>
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
          <ArticleComment article_id={article.id} />
          <div className="flex w-full flex-col space-y-4">
            <InfiniteScrollRelatedArticles
              locale={locale}
              current_article_slug={article.slug}
              topic_slug={article?.topics[0]?.slug!}
            />
          </div>
        </div>
      </section>
    </>
  )
}

export const revalidate = 600
export const dynamic = "force-dynamic"
