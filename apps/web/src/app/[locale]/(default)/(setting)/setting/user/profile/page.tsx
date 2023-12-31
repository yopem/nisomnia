import * as React from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { getCurrentUser } from "@nisomnia/auth"
import type { LanguageType } from "@nisomnia/db"

import { PageInfo } from "@/components/Layout/PageInfo"
import env from "@/env"
import { getI18n, getScopedI18n } from "@/locales/server"

const UserSettingForm = React.lazy(async () => {
  const { UserSettingForm } = await import("./form")
  return { default: UserSettingForm }
})

export function generateMetadata({
  params,
}: {
  params: { locale: LanguageType }
}): Metadata {
  const { locale } = params

  return {
    title: "Edit Profile",
    description: "Edit Profile",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/setting/user/profile/`,
    },
    openGraph: {
      title: "Edit Profile",
      description: "Edit Profile",
      url: `${env.NEXT_PUBLIC_SITE_URL}/setting/user/profile/`,
      locale: locale,
    },
  }
}

export default async function EditUserProfilePage() {
  const user = await getCurrentUser()

  const t = await getI18n()
  const ts = await getScopedI18n("user")

  if (!user) {
    return notFound
  }

  return (
    <>
      <PageInfo title={t("settings")} description={ts("setting_header")} />
      <UserSettingForm user={user} />
    </>
  )
}

export const revalidate = 60
