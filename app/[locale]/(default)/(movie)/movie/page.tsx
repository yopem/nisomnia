import type { Metadata } from "next"
import { BreadcrumbJsonLd, SiteLinksSearchBoxJsonLd } from "next-seo"

import MovieList from "@/components/movie/movie-list"
import env from "@/env"
import { getI18n } from "@/lib/locales/server"
import type { LanguageType } from "@/lib/validation/language"

export async function generateMetadata(props: {
  params: Promise<{ locale: LanguageType }>
}): Promise<Metadata> {
  const params = await props.params
  const { locale } = params

  return {
    title: "Movie",
    description: "Movie",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/genre`,
    },
    openGraph: {
      title: "Movie",
      description: "Movie",
      url: `${env.NEXT_PUBLIC_SITE_URL}/genre`,
      locale: locale,
    },
  }
}

export default async function Movie() {
  const t = await getI18n()

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
            name: "Movie",
            item: `${env.NEXT_PUBLIC_SITE_URL}/movie`,
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
      <h1>{t("movies")}</h1>
      <MovieList />
    </>
  )
}
