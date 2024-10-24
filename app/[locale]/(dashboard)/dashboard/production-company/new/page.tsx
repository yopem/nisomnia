import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"

import env from "@/env"
import type { LanguageType } from "@/lib/validation/language"

const CreateProductionCompanyForm = dynamicFn(async () => {
  const CreateProductionCompanyForm = await import("./form")
  return CreateProductionCompanyForm
})

export async function generateMetadata(props: {
  params: Promise<{ locale: LanguageType }>
}): Promise<Metadata> {
  const params = await props.params
  const { locale } = params

  return {
    title: "Create Production Company Dashboard",
    description: "Create Production Company Dashboard",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/production-country/new/`,
    },
    openGraph: {
      title: "Create ProductionCompany Dashboard",
      description: "Create ProductionCompany Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/production-country/new`,
      locale: locale,
    },
  }
}

export default function CreateProductionCompanyDashboard() {
  return (
    <div className="mb-[100px] mt-4 flex items-end justify-end">
      <div className="flex-1 space-y-4">
        <CreateProductionCompanyForm />
      </div>
    </div>
  )
}
