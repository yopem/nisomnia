"use client"

import * as React from "react"
import NextLink from "next/link"

import type { LanguageType } from "@nisomnia/db"
import { Icon } from "@nisomnia/ui/next"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  type TooltipProps,
} from "@nisomnia/ui/next-client"

interface DashboardAddLanguageProps extends TooltipProps {
  triggerLink: string
  content: React.ReactNode
  language: LanguageType | undefined | null
}

export const DashboardAddLanguage: React.FunctionComponent<
  DashboardAddLanguageProps
> = (props) => {
  const { triggerLink, content, language } = props

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {
            <NextLink href={triggerLink}>
              <div className="relative h-3 w-4 cursor-pointer">
                {language === "en" ? (
                  <Icon.USAFlag />
                ) : language === "id" ? (
                  <Icon.IndonesiaFlag />
                ) : (
                  <Icon.Add />
                )}
              </div>
            </NextLink>
          }
        </TooltipTrigger>
        <TooltipContent>
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
