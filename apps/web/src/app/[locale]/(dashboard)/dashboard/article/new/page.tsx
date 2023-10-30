import * as React from "react"
import env from "env"

import { getCurrentSession } from "@nisomnia/auth"

import { CreateArticleForm } from "./form"

export const metadata = {
  title: "Create Article Dashboard",
  description: "Create Article Dashboard",
  alternates: {
    canonical: `${env.NEXT_PUBLIC_SITE_URL}/dashboard/article/new`,
  },
}

export default async function CreateArticlesDashboard() {
  const session = await getCurrentSession()
  return <CreateArticleForm session={session} />
}
