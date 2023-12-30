"use client"

import * as React from "react"

import { Icon, IconButton } from "@nisomnia/ui/next"
import { toast } from "@nisomnia/ui/next-client"
import { copyToClipboard } from "@nisomnia/utils"

import { useScopedI18n } from "@/locales/client"

interface CopyMediaLinkButton {
  url: string
}

export const CopyMediaLinkButton: React.FunctionComponent<
  CopyMediaLinkButton
> = (props) => {
  const { url } = props

  const ts = useScopedI18n("media")

  return (
    <IconButton
      aria-label="Copy Media Link"
      size={null}
      className="absolute z-20 ml-8 h-[30px] w-[30px] rounded-full"
      onClick={(e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault()
        copyToClipboard(url)
        toast({
          variant: "success",
          description: ts("copy_link"),
        })
      }}
    >
      <Icon.Copy aria-label="Copy Media" />
    </IconButton>
  )
}
