import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"

import env from "@/env"
import type { LanguageType } from "@/lib/validation/language"

const CreateFeedForm = dynamicFn(async () => {
  const CreateFeedForm = await import("./form")
  return CreateFeedForm
})

export async function generateMetadata(props: {
  params: Promise<{ locale: LanguageType }>
}): Promise<Metadata> {
  const params = await props.params
  const { locale } = params

  return {
    title: "Create Feed Dashboard",
    description: "Create Feed Dashboard",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/feed/new/`,
    },
    openGraph: {
      title: "Create Feed Dashboard",
      description: "Create Feed Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/feed/new`,
      locale: locale,
    },
  }
}

export default function CreateFeedDashboard() {
  return (
    <div className="mb-[100px] mt-4 flex items-end justify-end">
      <div className="flex-1 space-y-4">
        <CreateFeedForm />
      </div>
    </div>
  )
}
