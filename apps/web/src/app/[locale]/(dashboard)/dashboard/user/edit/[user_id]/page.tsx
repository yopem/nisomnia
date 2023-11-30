import * as React from "react"
import type { Metadata } from "next"
import dynamic from "next/dynamic"
import { notFound } from "next/navigation"

import type { LanguageType } from "@nisomnia/db"

import env from "@/env"
import { api } from "@/lib/trpc/server"

const EditUserForm = dynamic(async () => {
  const { EditUserForm } = await import("./form")
  return { default: EditUserForm }
})

export async function generateMetadata({
  params,
}: {
  params: { user_id: string; locale: LanguageType }
}): Promise<Metadata> {
  const { user_id, locale } = params

  const user = await api.user.byId.query(user_id)

  return {
    title: "Edit User Dashboard",
    description: "Edit User Dashboard",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/user/edit/${user?.id}`,
    },
    openGraph: {
      title: "Edit User Dashboard",
      description: "Edit User Dashboard",
      url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/user/edit/${user?.id}`,
      locale: locale,
    },
  }
}

interface EditUserDashboardProps {
  params: {
    user_id: string
  }
}

export default async function EditUserDashboardPage({
  params,
}: EditUserDashboardProps) {
  const { user_id } = params

  const user = await api.user.byId.query(user_id)

  if (!user) {
    notFound()
  }

  return (
    <div className="mb-[100px] mt-4 flex items-end justify-end">
      <div className="flex-1 space-y-4">
        <EditUserForm user={user} />
      </div>
    </div>
  )
}
