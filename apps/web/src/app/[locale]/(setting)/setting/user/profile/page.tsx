import * as React from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { getCurrentUser } from "@nisomnia/auth"
import type { LanguageType } from "@nisomnia/db"

import { PageInfo } from "@/components/Layout"
import env from "@/env"
import { UserSettingForm } from "./form"

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

export const revalidate = 60

export default async function EditUserProfilePage() {
  const user = await getCurrentUser()

  if (!user) {
    return notFound
  }

  return (
    <>
      <PageInfo title="Settings" description="Manage your account." />
      <UserSettingForm user={user} />
    </>
  )
}
