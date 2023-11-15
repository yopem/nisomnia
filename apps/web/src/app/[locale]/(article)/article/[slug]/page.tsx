import * as React from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import env from "env"
import { ArticleJsonLd, BreadcrumbJsonLd } from "next-seo"

import type { LanguageType } from "@nisomnia/db"

import { ArticleContent } from "@/components/Article/client"
import { parseAndSplitHTMLString } from "@/lib/content"
import { transformContent } from "@/lib/transform-content"
import { api } from "@/lib/trpc/server"

export const revalidate = 0

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

  const firstContent = await transformContent(firstHalf, article?.title)

  const secondContent = await transformContent(secondHalf, article?.title)

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
        url={`${env.NEXT_PUBLIC_DOMAIN}/article/${article.slug}`}
        title={article.meta_title ?? article.title}
        images={[article.featured_image.url]}
        datePublished={article.createdAt as unknown as string}
        dateModified={article.createdAt as unknown as string}
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
        <ArticleContent
          article={article}
          adsBelowHeader={adsBelowHeader}
          adsAboveContent={adsSingleArticleAboveContent}
          adsMiddleContent={adsSingleArticleMiddleContent}
          adsBelowContent={adsSingleArticleBelowContent}
          locale={locale}
          firstContent={firstContent as React.ReactNode}
          secondContent={secondContent as React.ReactNode}
        />
      </section>
    </>
  )
}
