import * as React from "react"
import type { Metadata } from "next"
import NextLink from "next/link"
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
import { getI18n } from "@/locales/server"

const Ad = React.lazy(async () => {
  const { Ad } = await import("@/components/Ad")
  return { default: Ad }
})

const InfiniteScrollArticles = React.lazy(async () => {
  const { InfiniteScrollArticles } = await import(
    "@/components/Article/InfiniteScrollArticles"
  )
  return { default: InfiniteScrollArticles }
})

export function generateMetadata({
  params,
}: {
  params: { locale: LanguageType }
}): Metadata {
  const { locale } = params

  return {
    title: "Article",
    description: "Article",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/article`,
    },
    openGraph: {
      title: "Article",
      description: "Article",
      url: `${env.NEXT_PUBLIC_SITE_URL}/article`,
      locale: locale,
    },
  }
}

export default async function ArticlePage({
  params,
}: {
  params: { locale: LanguageType }
}) {
  const { locale } = params

  const t = await getI18n()

  const adsBelowHeader = await api.ad.byPosition.query("article_below_header")

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
            <BreadcrumbLink currentPage>{t("articles")}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <div className="flex w-full flex-col">
          <InfiniteScrollArticles locale={locale} />
        </div>
      </section>
    </>
  )
}

export const revalidate = 0
