import * as React from "react"
import dynamic from "next/dynamic"
import { notFound } from "next/navigation"

import { getCurrentUser } from "@nisomnia/auth"

import { DashboardSidebar } from "@/components/Dashboard"

const DashboardContainer = dynamic(async () => {
  const { DashboardContainer } = await import("@/components/Dashboard/client")
  return { default: DashboardContainer }
})

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const user = await getCurrentUser()

  if (!user?.role?.includes("admin" || "author")) {
    return notFound()
  }

  return (
    <DashboardContainer sidebar={<DashboardSidebar user={user!} />}>
      {children}
    </DashboardContainer>
  )
}
