import * as React from "react"
import NextLink from "next/link"
import env from "env"

import { Button, Icon, IconButton } from "@nisomnia/ui/next"

interface ReportButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  url: string
  variant?: "icon" | "default"
}

export const ReportButton: React.FunctionComponent<ReportButtonProps> = (
  props,
) => {
  const { url, variant = "default" } = props
  return (
    <div>
      <NextLink
        href={`mailto:halo@${
          env.NEXT_PUBLIC_DOMAIN
        }?subject=Report Problem: ${encodeURI(url)}&body=${encodeURI(url)}`}
        target="_blank"
      >
        {variant === "icon" ? (
          <IconButton variant="ghost">
            <Icon.Info className="h-5 w-5" />
          </IconButton>
        ) : (
          <Button variant="ghost">
            <Icon.Info className="h-5 w-5" />
            Report this page
          </Button>
        )}
      </NextLink>
    </div>
  )
}
