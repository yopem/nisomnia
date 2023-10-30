import * as React from "react"
import NextLink from "next/link"
import env from "env"
import { BreadcrumbJsonLd } from "next-seo"

import type { LanguageType } from "@nisomnia/db"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Icon,
} from "@nisomnia/ui/next"

import { Ad } from "@/components/Ad"
import { InfiniteScrollArticle } from "@/components/Article/client"
import { api } from "@/lib/trpc/server"

export const revalidate = 0

export const metadata = {
  title: "Article",
  description: "Article",
}

export default async function ArticlePage({
  params,
}: {
  params: { locale: LanguageType }
}) {
  const { locale } = params

  const articles = await api.article.byLanguage.query({
    language: locale,
    page: 1,
    per_page: 10,
  })

  const articlesCount = await api.article.count.query()

  const adsBelowHeader = await api.ad.byPosition.query("article_below_header")

  const totalPage = articlesCount && Math.ceil(articlesCount / 10)

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
        ]}
      />
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
          <BreadcrumbItem currentPage>
            <BreadcrumbLink currentPage>Articles</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <div className="flex w-full flex-col">
          <InfiniteScrollArticle
            articles={articles}
            locale={locale}
            index={2}
            totalPage={totalPage}
          />
        </div>
      </section>
    </>
  )
}
