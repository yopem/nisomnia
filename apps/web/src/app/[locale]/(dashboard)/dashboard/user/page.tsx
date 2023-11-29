import * as React from "react"
import type { Metadata } from "next"

import type { LanguageType } from "@nisomnia/db"

import env from "@/env"
import { DashboardUserContent } from "./content"

export const metadata = {
  title: "User Dashboard",
  description: "User Dashboard",
  alternates: {
    canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/user/`,
  },
}

export function generateMetadata({
  params,
}: {
  params: { locale: LanguageType }
}): Metadata {
  const { locale } = params

  return {
    title: "User Dashboard",
    description: "User Dashboard",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/user/`,
    },
    openGraph: {
      title: "User Dashboard",
      description: "User Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/user/`,
      locale: locale,
    },
  }
}

export default function UserDashboardPage() {
  return <DashboardUserContent />
}
