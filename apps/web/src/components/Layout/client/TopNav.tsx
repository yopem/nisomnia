"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import NextLink from "next/link"

import type { LanguageType } from "@nisomnia/db"
import { Button, Icon, IconButton } from "@nisomnia/ui/next"
import { Drawer, DrawerContent, DrawerTrigger } from "@nisomnia/ui/next-client"

import { Logo } from "@/components/Logo"
import type { UserMenuProps } from "@/components/User/client"

const SearchTopNav = dynamic(() =>
  import("./SearchTopNav").then((mod) => mod.SearchTopNav),
)
const UserMenu = dynamic(() =>
  import("@/components/User/client").then((mod) => mod.UserMenu),
)

interface TopNavProps
  extends React.HTMLAttributes<HTMLDivElement>,
    UserMenuProps {
  locale: LanguageType
}

export const TopNav: React.FunctionComponent<TopNavProps> = (props) => {
  const { locale, user, ...rest } = props

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
    <nav
      className="opacity-1 fixed left-auto top-0 z-40 -my-0 mx-auto box-border flex h-16 w-full items-center border-border bg-background px-4 py-0 align-baseline shadow-sm outline-none"
      {...rest}
    >
      <div className="container mx-auto flex flex-row items-center justify-between">
        <div className="flex lg:hidden">
          <Drawer>
            <DrawerTrigger asChild>
              <IconButton variant="ghost">
                <Icon.Menu />
              </IconButton>
            </DrawerTrigger>
            <DrawerContent position="left" className="w-full md:w-[250px]">
              <div className="flex flex-col items-start">
                <Button asChild variant="ghost">
                  <NextLink aria-label="Home" href="/">
                    Home
                  </NextLink>
                </Button>
                <Button asChild variant="ghost">
                  <NextLink aria-label="Article" href="/article">
                    Article
                  </NextLink>
                </Button>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
        <div className="flex flex-row">
          <NextLink
            aria-label="Home"
            href="/"
            className="flex items-center text-foreground"
          >
            <Logo />
          </NextLink>
          <div className="ml-4 hidden  md:flex">
            <Button asChild variant="ghost">
              <NextLink aria-label="Article" href="/article">
                Article
              </NextLink>
            </Button>
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
