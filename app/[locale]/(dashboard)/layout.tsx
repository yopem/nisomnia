import * as React from "react"
import dynamicFn from "next/dynamic"
import { notFound } from "next/navigation"

import { getSession } from "@/lib/auth/session"

const DashboardContainer = dynamicFn(
  async () => {
    const DashboardContainer = await import(
      "@/components/dashboard/dashboard-container"
    )
    return DashboardContainer
  },
  {
    ssr: false,
  },
)

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = await getSession()

  if (!user?.role.includes("admin" || "author")) {
    return notFound()
  }

  return (
    <>
      <DashboardContainer>{children}</DashboardContainer>
    </>
  )
}
