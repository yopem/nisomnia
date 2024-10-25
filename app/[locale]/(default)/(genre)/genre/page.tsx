import type { Metadata } from "next"

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
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/genre/`,
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

  return <h1>{t("genres")}</h1>
}
