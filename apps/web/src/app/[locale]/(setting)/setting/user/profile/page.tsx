import * as React from "react"
import { notFound } from "next/navigation"
import env from "env"

import { getCurrentUser } from "@nisomnia/auth"

import { PageInfo } from "@/components/Layout"
import { UserSettingForm } from "./form"

export const metadata = {
  title: "Edit Profile",
  description: "Edit Profile",
  alternates: {
    canonical: `${env.NEXT_PUBLIC_SITE_URL}/setting/user/profile/`,
  },
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
