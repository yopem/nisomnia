import env from "env"
import { BreadcrumbJsonLd, SiteLinksSearchBoxJsonLd } from "next-seo"

import type { LanguageType } from "@nisomnia/db"

import { Ad } from "@/components/Ad"
import { InfiniteScrollArticle } from "@/components/Article/client"
import { Container, Footer } from "@/components/Layout"
import { TopNav } from "@/components/Layout/client"
import { api } from "@/lib/trpc/server"

export default async function HomePage({
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
        <TopNav locale={locale} />
        <Container className="mt-20 min-h-screen px-2 lg:px-72">
          <section>
            {adsBelowHeader.length > 0 &&
              adsBelowHeader.map((ad) => {
                return <Ad key={ad.id} ad={ad} />
              })}
            <div className="flex w-full flex-col">
              <InfiniteScrollArticle
                articles={articles}
                locale={locale}
                index={2}
                totalPage={totalPage}
              />
            </div>
          </section>
        </Container>
        <Footer />
      </div>
    </>
  )
}
