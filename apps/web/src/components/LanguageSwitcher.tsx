"use client"

import * as React from "react"
import NextLink from "next/link"
import { useParams, usePathname } from "next/navigation"
import env from "env"

import { Button, Icon } from "@nisomnia/ui/next"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nisomnia/ui/next-client"

export const LanguageSwitcher: React.FunctionComponent = () => {
  const params = useParams()
  const pathname = usePathname()

  return (
    <div className="flex">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost">
            {params?.locale === "id" ? (
              <Icon.IndonesiaFlag className="h-5 w-5" />
            ) : (
              <Icon.USAFlag className="h-5 w-5" />
            )}
            <span className="sr-only">Change Language</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="flex w-[50px] flex-col space-y-4">
          <NextLink href={`${env.NEXT_PUBLIC_SITE_URL}${pathname}`} locale="id">
            <Icon.IndonesiaFlag className="mr-2 h-5 w-5" />
          </NextLink>
          <NextLink href={`${env.NEXT_PUBLIC_SITE_URL}${pathname}`} locale="en">
            <Icon.USAFlag className="mr-2 h-5 w-5" />
          </NextLink>
        </PopoverContent>
      </Popover>
    </div>
  )
}
