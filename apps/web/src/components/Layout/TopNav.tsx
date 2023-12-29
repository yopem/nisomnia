"use client"

import * as React from "react"
import NextLink from "next/link"

import type { LanguageType } from "@nisomnia/db"
import { Button, Icon, IconButton } from "@nisomnia/ui/next"

import { Logo } from "@/components/Logo"
import { TopicListNav } from "@/components/Topic/TopicListNav"
import type { UserMenuProps } from "@/components/User/UserMenu"
import { useI18n } from "@/locales/client"
import { MobileMenu } from "./MobileMenu"

const SearchTopNav = React.lazy(async () => {
  const { SearchTopNav } = await import("./SearchTopNav")
  return { default: SearchTopNav }
})

const UserMenu = React.lazy(async () => {
  const { UserMenu } = await import("@/components/User/UserMenu")
  return { default: UserMenu }
})

interface TopNavProps
  extends React.HTMLAttributes<HTMLDivElement>,
    UserMenuProps {
  locale: LanguageType
}

export const TopNav: React.FunctionComponent<TopNavProps> = (props) => {
  const { locale, user } = props

  const t = useI18n()

  const [searchVisibility, setSearchVisibility] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (searchVisibility) {
      const el: HTMLInputElement | null = document.querySelector(
        'input[type="search"]',
      )
      if (el) {
        el.focus()
      }
    }
  }, [searchVisibility])

  return (
    <nav className="opacity-1 fixed left-auto top-0 z-40 -my-0 mx-auto box-border flex h-16 w-full items-center border-border bg-background/90 bg-opacity-10 bg-clip-padding px-4 py-0 align-baseline shadow-sm outline-none backdrop-blur-md backdrop-filter">
      <div className="container mx-auto flex flex-row items-center justify-between">
        <MobileMenu locale={locale} />
        <div className="flex flex-row">
          <NextLink
            aria-label="Home"
            href="/"
            className="flex items-center text-foreground"
          >
            <Logo />
          </NextLink>
          <div className="ml-4 hidden lg:flex">
            <Button asChild variant="ghost">
              <NextLink aria-label="Home" href="/">
                {t("home")}
              </NextLink>
            </Button>
            <TopicListNav locale={locale} />
          </div>
        </div>
        <div className="flex justify-center">
          <IconButton
            variant="ghost"
            aria-label="Search"
            onClick={() => setSearchVisibility((prev) => !prev)}
          >
            <Icon.Search className="h-5 w-5 px-0" />
          </IconButton>
          <UserMenu user={user} />
        </div>
      </div>
      <SearchTopNav
        hideSearchVisibility={() => {
          setSearchVisibility(false)
        }}
        searchVisibility={searchVisibility}
        locale={locale}
      />
    </nav>
  )
}
