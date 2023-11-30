import * as React from "react"
import type { Metadata } from "next"
import dynamic from "next/dynamic"

import type { LanguageType } from "@nisomnia/db"

import env from "@/env"

const UploadMediaForm = dynamic(async () => {
  const { UploadMediaForm } = await import("./form")
  return { default: UploadMediaForm }
})

export function generateMetadata({
  params,
}: {
  params: { locale: LanguageType }
}): Metadata {
  const { locale } = params

  return {
    title: "Upload Media Dashboard",
    description: "Upload Media Dashboard",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/media/new/`,
    },
    openGraph: {
      title: "Upload Media Dashboard",
      description: "Upload Media Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/media/new/`,
      locale: locale,
    },
  }
}

export default function UploadMediasDashboardPage() {
  return <UploadMediaForm />
}
