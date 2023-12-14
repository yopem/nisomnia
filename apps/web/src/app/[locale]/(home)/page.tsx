import * as React from "react"
import NextLink from "next/link"
import { BreadcrumbJsonLd, SiteLinksSearchBoxJsonLd } from "next-seo"

import type { LanguageType } from "@nisomnia/db"
import { Button } from "@nisomnia/ui/next"

import { ArticleListByTopic } from "@/components/Article/ArticleListByTopic"
import { ArticleListHome } from "@/components/Article/ArticleListHome"
import { FeaturedArticles } from "@/components/Article/FeaturedArticles"
import { PopularTopics } from "@/components/Topic/PopularTopics"
import env from "@/env"
import { api } from "@/lib/trpc/server"

const Ad = React.lazy(async () => {
  const { Ad } = await import("@/components/Ad")
  return { default: Ad }
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
      <section className="mx-0 space-y-4 lg:mx-48">
        {adsBelowHeader.length > 0 &&
          adsBelowHeader.map((ad) => {
            return <Ad key={ad.id} ad={ad} />
          })}
        <FeaturedArticles locale={locale} />
        <PopularTopics locale={locale} />
        <ArticleListByTopic
          locale={locale}
          topic_title="Anime"
          topic_slug="anime_izghk"
          className="bg-sky-200"
        />
        <ArticleListByTopic
          locale={locale}
          topic_title="Game"
          topic_slug="game_srjgj"
          className="bg-lime-200"
        />
        <ArticleListByTopic
          locale={locale}
          topic_title="Film"
          topic_slug="film_kjud5"
          className="bg-violet-200"
        />
        <ArticleListByTopic
          locale={locale}
          topic_title="Novel"
          topic_slug="novel_e9szh"
          className="bg-orange-200"
        />
        <ArticleListByTopic
          locale={locale}
          topic_title="Teknologi"
          topic_slug="teknologi_3ince"
          className="bg-zinc-200"
        />
        <ArticleListHome locale={locale} />
        <div className="flex flex-row items-center justify-center">
          <Button asChild>
            <NextLink aria-label="See more" href="/article">
              See more
            </NextLink>
          </Button>
        </div>
      </section>
    </>
  )
}
