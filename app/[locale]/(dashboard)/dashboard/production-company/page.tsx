import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"

import env from "@/env"
import type { LanguageType } from "@/lib/validation/language"

const DashboardProductionCompanyContent = dynamicFn(async () => {
  const DashboardProductionCompanyContent = await import("./content")
  return DashboardProductionCompanyContent
})

export async function generateMetadata(props: {
  params: Promise<{ locale: LanguageType }>
}): Promise<Metadata> {
  const params = await props.params
  const { locale } = params

  return {
    title: "Production Company Dashboard",
    description: "Production Company Dashboard",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/prodcution-company/`,
    },
    openGraph: {
      title: "Production Company Dashboard",
      description: "Production Company Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/prodcution-company/`,
      locale: locale,
    },
  }
}

export default function DashboardProductionCompanyPage() {
  return <DashboardProductionCompanyContent />
}
