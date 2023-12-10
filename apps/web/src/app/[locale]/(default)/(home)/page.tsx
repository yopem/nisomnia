import * as React from "react"
import { BreadcrumbJsonLd, SiteLinksSearchBoxJsonLd } from "next-seo"

import type { LanguageType } from "@nisomnia/db"

import env from "@/env"
import { api } from "@/lib/trpc/server"

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

interface HomePageProps {
  params: {
    locale: LanguageType
  }
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = params

  const adsBelowHeader = await api.ad.byPosition.query("home_below_header")

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
        ]}
      />
      <SiteLinksSearchBoxJsonLd
        useAppDir={true}
        url={env.NEXT_PUBLIC_SITE_URL}
        potentialActions={[
          {
            target: `${env.NEXT_PUBLIC_SITE_URL}/search?q`,
            queryInput: "search_term_string",
          },
        ]}
      />
      <section>
        {adsBelowHeader.length > 0 &&
          adsBelowHeader.map((ad) => {
            return <Ad key={ad.id} ad={ad} />
          })}
        <div className="flex w-full flex-col">
          <InfiniteScrollArticles locale={locale} />
        </div>
      </section>
    </>
  )
}
