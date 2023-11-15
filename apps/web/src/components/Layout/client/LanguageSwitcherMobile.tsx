"use client"

import * as React from "react"
import NextLink from "next/link"
import { useParams, usePathname } from "next/navigation"

import { Button, Icon } from "@nisomnia/ui/next"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nisomnia/ui/next-client"

export const LanguageSwitcherMobile: React.FunctionComponent = () => {
  const params = useParams()
  const pathname = usePathname()

  return (
    <Popover>
      <PopoverTrigger asChild>
        {params?.locale === "id" ? (
          <Button variant="ghost">
            <Icon.IndonesiaFlag className="mr-2 h-5 w-5" />
            Bahasa Indonesia
          </Button>
        ) : (
          <Button variant="ghost">
            <Icon.USAFlag className="mr-2 h-5 w-5" />
            English
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="flex flex-col space-y-4">
        <NextLink href={pathname} locale="id" className="inline-flex">
          <Icon.IndonesiaFlag className="mr-2 h-5 w-5" />
          Bahasa Indonesia
        </NextLink>
        <NextLink href={pathname} locale="en" className="inline-flex">
          <Icon.USAFlag className="mr-2 h-5 w-5" />
          English
        </NextLink>
      </PopoverContent>
    </Popover>
  )
}
