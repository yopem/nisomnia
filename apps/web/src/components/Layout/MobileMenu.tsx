import * as React from "react"
import NextLink from "next/link"

import type { LanguageType } from "@nisomnia/db"
import { Button, Icon } from "@nisomnia/ui/next"

import { TopicListNav } from "@/components/Topic/TopicListNav"
import { useI18n } from "@/locales/client"

interface MobileMenuProps {
  locale: LanguageType
}

export const MobileMenu: React.FunctionComponent<MobileMenuProps> = (props) => {
  const { locale } = props

  const t = useI18n()

  return (
    <div className="relative z-10 flex lg:hidden">
      <input className="peer hidden" type="checkbox" id="mobile-menu" />
      <label
        className="relative z-10 cursor-pointer px-3 py-6"
        htmlFor="mobile-menu"
      >
        <Icon.Menu aria-label="Mobile Menu" />
        <div className="z-5 fixed left-0 top-[64px] h-full w-full translate-x-full transform transition-transform duration-500 ease-in-out">
          <div className="float-left min-h-full w-[80%] border-r border-t border-border bg-background px-2.5 pt-12">
            <menu className="flex flex-col items-start">
              <Button asChild variant="ghost">
                <NextLink aria-label={t("home")} href="/">
                  {t("home")}
                </NextLink>
              </Button>
              <TopicListNav locale={locale} />
            </menu>
          </div>
        </div>
      </label>
    </div>
  )
}
