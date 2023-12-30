"use client"

import * as React from "react"

import { Icon, IconButton } from "@nisomnia/ui/next"
import { toast } from "@nisomnia/ui/next-client"
import { copyToClipboard } from "@nisomnia/utils"

import { useScopedI18n } from "@/locales/client"

interface CopyLinkButonProps extends React.HTMLAttributes<HTMLDivElement> {
  url: string
}

export const CopyLinkButon: React.FunctionComponent<CopyLinkButonProps> = (
  props,
) => {
  const { url } = props

  const ts = useScopedI18n("article")

  return (
    <IconButton
      aria-label="Copy Link"
      variant="ghost"
      onClick={(e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault()
        copyToClipboard(url)
        toast({
          variant: "success",
          description: ts("copy_link"),
        })
      }}
    >
      <Icon.Copy />
    </IconButton>
  )
}
