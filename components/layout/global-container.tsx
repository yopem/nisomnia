"use client"

import * as React from "react"

import { useDisclosure } from "@/hooks/use-disclosure"
import type { SelectUser } from "@/lib/db/schema"
import type { LanguageType } from "@/lib/validation/language"
import GlobalSidebar from "./global-sidebar"

interface GlobalContainerProps
  extends React.HtmlHTMLAttributes<HTMLDivElement> {
  user: SelectUser | null
  locale: LanguageType
  children: React.ReactNode
}

const GlobalContainer: React.FC<GlobalContainerProps> = (props) => {
  const { user, locale, children } = props

  const { onToggle, onClose, isOpen } = useDisclosure()

  return (
    <>
      <GlobalSidebar
        user={user}
        locale={locale}
        onToggle={onToggle}
        onClose={onClose}
        isOpen={isOpen}
      />
      <main className="flex-1 p-4 sm:ml-64 md:px-56 md:py-8">{children}</main>
    </>
  )
}

export default GlobalContainer
