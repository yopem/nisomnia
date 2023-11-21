"use client"

import * as React from "react"

import { Icon, IconButton } from "@nisomnia/ui/next"
import { toast } from "@nisomnia/ui/next-client"
import { copyToClipboard } from "@nisomnia/utils"

interface CopyLinkButonProps extends React.HTMLAttributes<HTMLDivElement> {
  url: string
}

export const CopyLinkButon: React.FunctionComponent<CopyLinkButonProps> = (
  props,
) => {
  const { url } = props

  return (
    <IconButton
      aria-label="Copy Link"
      variant="ghost"
      onClick={(e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault()
        copyToClipboard(url)
        toast({
          variant: "success",
          description: "Article Link Copied",
        })
      }}
    >
      <Icon.Copy />
    </IconButton>
  )
}
