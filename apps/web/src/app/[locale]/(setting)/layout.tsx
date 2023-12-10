import * as React from "react"
import { notFound } from "next/navigation"

import { getCurrentUser } from "@nisomnia/auth"
import type { LanguageType } from "@nisomnia/db"

import { Container } from "@/components/Layout/Container"
import { Footer } from "@/components/Layout/Footer"

const TopNav = React.lazy(async () => {
  const { TopNav } = await import("@/components/Layout/TopNav")
  return { default: TopNav }
})

interface SettingUserLayoutProps {
  params: {
    locale: LanguageType
  }
  children: React.ReactNode
}

export default async function SettingUserLayout({
  children,
  params,
}: SettingUserLayoutProps) {
  const { locale } = params

  const user = await getCurrentUser()

  if (!user) {
    return notFound
  }

  return (
    <>
      <TopNav locale={locale} user={user!} />
      <Container className="mt-20 min-h-screen px-2 lg:px-64">
        {children}
      </Container>
      <Footer />
    </>
  )
}
