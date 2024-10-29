import type { Metadata } from "next"
import dynamicFn from "next/dynamic"

import env from "@/env"
import type { LanguageType } from "@/lib/validation/language"

const DashboardAdContent = dynamicFn(async () => {
  const DashboardAdContent = await import("./content")
  return DashboardAdContent
})

export async function generateMetadata(props: {
  params: Promise<{ adId: string; locale: LanguageType }>
}): Promise<Metadata> {
  const params = await props.params
  const { locale } = params

  return {
    title: "Ad Dashboard",
    description: "Ad Dashboard",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/ad`,
    },
    openGraph: {
      title: "Ad Dashboard",
      description: "Ad Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/ad`,
      locale: locale,
    },
  }
}

export default function DashboardAdPage() {
  return <DashboardAdContent />
}
