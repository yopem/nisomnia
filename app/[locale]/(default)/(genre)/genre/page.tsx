import type { Metadata } from "next"
import { BreadcrumbJsonLd, SiteLinksSearchBoxJsonLd } from "next-seo"

import env from "@/env"
import { getI18n } from "@/lib/locales/server"
import type { LanguageType } from "@/lib/validation/language"

export async function generateMetadata(props: {
  params: Promise<{ locale: LanguageType }>
}): Promise<Metadata> {
  const params = await props.params
  const { locale } = params

  return {
    title: "Genre",
    description: "Genre",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/genre`,
    },
    openGraph: {
      title: "Genre",
      description: "Genre",
      url: `${env.NEXT_PUBLIC_SITE_URL}/genre`,
      locale: locale,
    },
  }
}

export default async function Genre() {
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
            name: "Genre",
            item: `${env.NEXT_PUBLIC_SITE_URL}/genre`,
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
      <h1>{t("genres")}</h1>
    </>
  )
}
