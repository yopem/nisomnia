"use client"

import * as React from "react"
import NextLink from "next/link"

import LanguageSwitcher from "@/components/language-switcher"
import Sidebar from "@/components/layout/sidebar"
import SidebarItem from "@/components/layout/sidebar-item"
import Logo from "@/components/logo"
import ThemeSwitcher from "@/components/theme/theme-switcher"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { useOnClickOutside } from "@/hooks/use-on-click-outside"
import { logout } from "@/lib/auth/logout"
import type { SelectUser } from "@/lib/db/schema"
import { useI18n } from "@/lib/locales/client"
import type { LanguageType } from "@/lib/validation/language"
import GlobalSearchSidebar from "./global-search-sidebar"

interface GlobalSidebarProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  user: SelectUser | null
  locale: LanguageType
  onToggle: () => void
  isOpen: boolean
  onClose: () => void
}

const GlobalSidebar: React.FC<GlobalSidebarProps> = (props) => {
  const { user, locale, onToggle, onClose, isOpen } = props

  const ref = React.useRef(null)

  useOnClickOutside(ref as unknown as React.RefObject<HTMLElement>, onClose)

  const t = useI18n()

  return (
    <>
      <div className="flex items-center justify-between border-b border-border bg-background lg:hidden">
        <Button
          ref={ref}
          data-drawer-target="global-sidebar"
          data-drawer-toggle="global-sidebar"
          aria-controls="global-sidebar"
          variant="ghost"
          size="icon"
          className="m-3 flex lg:hidden"
          onClick={onToggle}
        >
          <span className="sr-only">Open sidebar</span>
          <Icon.Menu className="size-6" />
        </Button>
        <NextLink href="/">
          <Logo />
        </NextLink>
        <div className="m-3">
          <ThemeSwitcher />
        </div>
      </div>
      <Sidebar isOpen={isOpen}>
        <div className="h-full overflow-y-auto border-r border-border bg-background px-3 py-5">
          <div className="mb-4 hidden lg:flex">
            <NextLink href="/">
              <Logo />
            </NextLink>
          </div>
          <ul className="space-y-2">
            <SidebarItem href="/" icon={<Icon.Home />}>
              {t("home")}
            </SidebarItem>
            <GlobalSearchSidebar locale={locale} />
            {!user ? (
              <SidebarItem href="/auth/login" icon={<Icon.Login />}>
                {t("login")}
              </SidebarItem>
            ) : (
              <SidebarItem href={`/user/${user.username}`} icon={<Icon.User />}>
                {t("profile")}
              </SidebarItem>
            )}
            {user &&
              (user.role.includes("admin") || user.role.includes("author")) && (
                <SidebarItem href="/dashboard" icon={<Icon.Dashboard />}>
                  {t("dashboard")}
                </SidebarItem>
              )}
            <SidebarItem href="/article" icon={<Icon.Article />}>
              {t("articles")}
            </SidebarItem>
            <SidebarItem href="/movie" icon={<Icon.Movie />}>
              {t("movies")}
            </SidebarItem>
          </ul>
        </div>
        <div className="absolute bottom-0 left-0 z-20 flex w-full justify-center space-x-4 border-r border-border bg-background p-4">
          <LanguageSwitcher />
          <ThemeSwitcher />
          {user && (
            <>
              <Button asChild variant="ghost">
                <NextLink href="/setting">
                  <Icon.Setting />
                </NextLink>
              </Button>
              <form action={logout}>
                <Button variant="ghost" size="icon">
                  <Icon.Logout />
                </Button>
              </form>
            </>
          )}
        </div>
      </Sidebar>
      {isOpen && (
        <div className="fixed inset-0 z-30 bg-primary/50 dark:bg-primary/80"></div>
      )}
    </>
  )
}

export default GlobalSidebar
