import dynamic from "next/dynamic"
import { BreadcrumbJsonLd, SiteLinksSearchBoxJsonLd } from "next-seo"

import { getCurrentUser } from "@nisomnia/auth"
import type { LanguageType } from "@nisomnia/db"

import { Container, Footer } from "@/components/Layout"
import env from "@/env"
import { api } from "@/lib/trpc/server"

const Ad = dynamic(async () => {
  const { Ad } = await import("@/components/Ad")
  return { default: Ad }
})

const InfiniteScrollArticles = dynamic(async () => {
  const { InfiniteScrollArticles } = await import("@/components/Article/client")
  return { default: InfiniteScrollArticles }
})

const TopNav = dynamic(async () => {
  const { TopNav } = await import("@/components/Layout/client")
  return { default: TopNav }
})

interface HomePageProps {
  params: {
    locale: LanguageType
  }
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = params

  const adsBelowHeader = await api.ad.byPosition.query("home_below_header")
  const user = await getCurrentUser()

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
      <div>
        <TopNav locale={locale} user={user!} />
        <Container className="mt-20 min-h-screen px-2 lg:px-80">
          <section>
            {adsBelowHeader.length > 0 &&
              adsBelowHeader.map((ad) => {
                return <Ad key={ad.id} ad={ad} />
              })}
            <div className="flex w-full flex-col">
              <InfiniteScrollArticles locale={locale} />
            </div>
          </section>
        </Container>
        <Footer />
      </div>
    </>
  )
}
