import * as React from "react"

import { getCurrentUser } from "@nisomnia/auth"
import type { LanguageType } from "@nisomnia/db"

import { Container, Footer } from "@/components/Layout"

const TopNav = React.lazy(async () => {
  const { TopNav } = await import("@/components/Layout/client")
  return { default: TopNav }
})

interface TopicLayoutProps {
  params: {
    locale: LanguageType
  }
  children: React.ReactNode
}

export default async function TopicLayout({
  params,
  children,
}: TopicLayoutProps) {
  const { locale } = params

  const user = await getCurrentUser()

  return (
    <>
      <TopNav locale={locale} user={user!} />
      <Container className="mt-20 min-h-screen px-2 lg:px-80">
        {children}
      </Container>
      <Footer />
    </>
  )
}
