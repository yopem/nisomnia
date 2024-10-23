import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"
import { notFound } from "next/navigation"

import { PageInfo } from "@/components/layout/page-info"
import env from "@/env"
import { getCurrentSession } from "@/lib/auth/session"
import { getI18n, getScopedI18n } from "@/lib/locales/server"

const UserSettingForm = dynamicFn(async () => {
  const UserSettingForm = await import("./form")
  return UserSettingForm
})

export function generateMetadata(): Metadata {
  return {
    title: "Edit Profile",
    description: "Edit Profile",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/setting/`,
    },
    openGraph: {
      title: "Edit Profile",
      description: "Edit Profile",
      url: `${env.NEXT_PUBLIC_SITE_URL}/setting`,
    },
  }
}

export default async function EditUserProfilePage() {
  const { session, user } = await getCurrentSession()

  const t = await getI18n()
  const ts = await getScopedI18n("user")

  if (!session) {
    return notFound()
  }

  return (
    <div>
      <PageInfo title={t("settings")} description={ts("setting_header")} />
      <UserSettingForm user={user} />
    </div>
  )
}
