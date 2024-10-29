import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"

import env from "@/env"
import type { LanguageType } from "@/lib/validation/language"

const UploadMedia = dynamicFn(async () => {
  const UploadMedia = await import("@/components/media/upload-media")
  return UploadMedia
})

export async function generateMetadata(props: {
  params: Promise<{ locale: LanguageType }>
}): Promise<Metadata> {
  const params = await props.params
  const { locale } = params

  return {
    title: "Upload Media Dashboard",
    description: "Upload Media Dashboard",
    openGraph: {
      title: "Upload Media Dashboard",
      description: "Upload Media Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/media/new`,
      locale: locale,
    },
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/media/new`,
    },
  }
}

export default function UploadMediasDashboardPage() {
  return <UploadMedia toggleUpload={true} type="image" />
}
