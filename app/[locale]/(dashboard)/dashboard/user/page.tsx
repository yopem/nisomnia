import type { Metadata } from "next"

import env from "@/env"
import type { LanguageType } from "@/lib/validation/language"
import DashboardUserContent from "./content"

export async function generateMetadata(props: {
  params: Promise<{ adId: string; locale: LanguageType }>
}): Promise<Metadata> {
  const params = await props.params
  const { locale } = params

  return {
    title: "User Dashboard",
    description: "User Dashboard",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/user`,
    },
    openGraph: {
      title: "User Dashboard",
      description: "User Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/user`,
      locale: locale,
    },
  }
}

export default function DashboardUserPage() {
  return <DashboardUserContent />
}
