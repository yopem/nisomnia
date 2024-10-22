"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useChangeLocale, useCurrentLocale } from "@/lib/locales/client"

const LanguageSwitcher: React.FunctionComponent = () => {
  const changeLocale = useChangeLocale()
  const locale = useCurrentLocale()

  return (
    <div className="flex">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="rounded-full">
            {locale === "id" ? (
              <span className="inline-flex flex-row">
                <Icon.IndonesiaFlag className="mr-2 size-5" />
                <span>Indonesia</span>
              </span>
            ) : (
              <span className="flex flex-row">
                <Icon.USAFlag className="mr-2 size-5" />
                English
              </span>
            )}
            <span className="sr-only">Change Language</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="flex w-full flex-col space-y-4">
          <Button
            variant="ghost"
            aria-label="Switch to Bahasa"
            onClick={() => changeLocale("id")}
          >
            <div className="flex flex-row">
              <Icon.IndonesiaFlag className="mr-2 size-5" />
              Indonesia
            </div>
          </Button>
          <Button
            variant="ghost"
            aria-label="Switch to English"
            onClick={() => changeLocale("en")}
            className="w-full"
          >
            <div className="flex flex-row">
              <Icon.USAFlag className="mr-2 size-5" />
              English
            </div>
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default LanguageSwitcher
