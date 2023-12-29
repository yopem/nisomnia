"use client"

import * as React from "react"

import { Button, Icon } from "@nisomnia/ui/next"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nisomnia/ui/next-client"

import { useChangeLocale, useCurrentLocale } from "@/locales/client"

export const LanguageSwitcher: React.FunctionComponent = () => {
  const changeLocale = useChangeLocale()
  const locale = useCurrentLocale()

  return (
    <div className="flex">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost">
            {locale === "id" ? (
              <Icon.IndonesiaFlag className="h-5 w-5" />
            ) : (
              <Icon.USAFlag className="h-5 w-5" />
            )}
            <span className="sr-only">Change Language</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="flex w-[50px] flex-col space-y-4">
          <button
            aria-label="Switch to Bahasa"
            onClick={() => changeLocale("id")}
          >
            <Icon.IndonesiaFlag className="h-5 w-5" />
          </button>
          <button
            aria-label="Switch to English"
            onClick={() => changeLocale("en")}
          >
            <Icon.USAFlag className="h-5 w-5" />
          </button>
        </PopoverContent>
      </Popover>
    </div>
  )
}
