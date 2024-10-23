import * as React from "react"
import dynamicFn from "next/dynamic"
import { notFound } from "next/navigation"

import { getCurrentSession } from "@/lib/auth/session"

const DashboardContainer = dynamicFn(async () => {
  const DashboardContainer = await import(
    "@/components/dashboard/dashboard-container"
  )
  return DashboardContainer
})

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = await getCurrentSession()

  if (!user?.role.includes("admin" || "author")) {
    return notFound()
  }

  return <DashboardContainer>{children}</DashboardContainer>
}
