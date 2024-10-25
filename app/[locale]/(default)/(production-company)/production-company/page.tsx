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
    title: "Production Company",
    description: "Production Company",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/production-company/`,
    },
    openGraph: {
      title: "Production Company",
      description: "Production Company",
      url: `${env.NEXT_PUBLIC_SITE_URL}/production-company`,
      locale: locale,
    },
  }
}

export default async function ProductionCompany() {
  const t = await getI18n()

  return <h1>{t("production_companies")}</h1>
}
