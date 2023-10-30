import * as React from "react"

import type { LanguageType } from "@nisomnia/db"

import { Container, Footer } from "@/components/Layout"
import { TopNav } from "@/components/Layout/client"

interface TopicLayoutProps {
  params: {
    locale: LanguageType
  }
  children: React.ReactNode
}

export default function TopicLayout({ params, children }: TopicLayoutProps) {
  const { locale } = params

  return (
    <>
      <TopNav locale={locale} />
      <Container className="mt-20 min-h-screen px-2 lg:px-72">
        {children}
      </Container>
      <Footer />
    </>
  )
}
