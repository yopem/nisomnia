import * as React from "react"
import NextLink from "next/link"

import { Button, Icon } from "@nisomnia/ui/next"

import { TopicListNav } from "../Topic/TopicListNav"

export const MobileMenu: React.FunctionComponent = () => {
  return (
    <div className="relative z-10 flex lg:hidden">
      <input className="peer hidden" type="checkbox" id="mobile-menu" />
      <label
        className="relative z-10 cursor-pointer px-3 py-6"
        htmlFor="mobile-menu"
      >
        <Icon.Menu aria-label="Mobile Menu" />
        <div className="z-5 fixed left-0 top-[64px] h-full w-full translate-x-full transform transition-transform duration-500 ease-in-out">
          <div className="float-left min-h-full w-[80%] border-r border-t border-border bg-background px-2.5 pt-12">
            <menu className="flex flex-col items-start">
              <Button asChild variant="ghost">
                <NextLink aria-label="Home" href="/">
                  Home
                </NextLink>
              </Button>
              <TopicListNav />
            </menu>
          </div>
        </div>
      </label>
    </div>
  )
}
