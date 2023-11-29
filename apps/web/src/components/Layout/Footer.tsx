import * as React from "react"
import NextLink from "next/link"

import { cn, Icon, IconButton } from "@nisomnia/ui/next"
import { Separator } from "@nisomnia/ui/next-client"

import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { ThemeSwitcher } from "@/components/Theme/client"
import env from "@/env"

interface FooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Footer: React.FunctionComponent<FooterProps> = (props) => {
  const { className, ...rest } = props
  return (
    <footer
      className={cn(
        "sticky top-[100vh] z-40 mt-auto border-t border-border px-6 py-4 text-center",
        className,
      )}
      {...rest}
    >
      <div className="m-6 flex flex-col justify-between md:flex-row">
        <div className="flex-row space-x-3 font-semibold">
          &copy;&nbsp;
          {new Date().getFullYear()}&nbsp;
          <span className="font-bold">{env.NEXT_PUBLIC_SITE_TITLE}</span>
        </div>
        <div className="flex flex-row items-center justify-center md:order-1">
          <IconButton asChild aria-label="Facebook" variant="ghost">
            <NextLink
              aria-label="Facebook"
              href={`https://facebook.com/${env.NEXT_PUBLIC_FACEBOOK_USERNAME}`}
              target="_blank"
            >
              <Icon.Facebook />
            </NextLink>
          </IconButton>
          <IconButton asChild aria-label="X" variant="ghost">
            <NextLink
              aria-label="X"
              href={`https://twitter.com/${env.NEXT_PUBLIC_TWITTER_USERNAME}`}
              target="_blank"
            >
              <Icon.Twitter />
            </NextLink>
          </IconButton>
          <IconButton asChild aria-label="Instagram" variant="ghost">
            <NextLink
              aria-label="Instagram"
              href={`https://instagram.com/${env.NEXT_PUBLIC_INSTAGRAM_USERNAME}`}
              target="_blank"
            >
              <Icon.Instagram />
            </NextLink>
          </IconButton>
          <IconButton asChild aria-label="Pinterest" variant="ghost">
            <NextLink
              aria-label="Pinterest"
              href={`https://pinterest.com/${env.NEXT_PUBLIC_PINTEREST_USERNAME}`}
              target="_blank"
            >
              <Icon.Pinterest />
            </NextLink>
          </IconButton>
          <Separator orientation="vertical" className="mx-4 hidden lg:block" />
          <ThemeSwitcher />
          <LanguageSwitcher />
        </div>
      </div>
    </footer>
  )
}
