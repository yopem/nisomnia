import * as React from "react"
import type { Metadata } from "next"

import type { LanguageType } from "@nisomnia/db"

import env from "@/env"
import { UploadMediaForm } from "./form"

export const metadata = {
  title: "Upload Media Dashboard",
  description: "Upload Media Dashboard",
  alternates: {
    canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/media/new/`,
  },
}

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
