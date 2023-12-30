import * as React from "react"
import NextLink from "next/link"

import type { User as UserProps } from "@nisomnia/auth"
import { Icon } from "@nisomnia/ui/next"

import { Sidebar } from "@/components/Layout/Sidebar"
import { SidebarItem } from "@/components/Layout/SidebarItem"
import { SidebarToggleItem } from "@/components/Layout/SidebarToggleItem"
import { Logo } from "@/components/Logo"
import { useI18n, useScopedI18n } from "@/locales/client"

const SidebarToggle = React.lazy(async () => {
  const { SidebarToggle } = await import("@/components/Layout/SidebarToggle")
  return { default: SidebarToggle }
})

const ThemeSwitcher = React.lazy(async () => {
  const { ThemeSwitcher } = await import("@/components/Theme/ThemeSwitcher")
  return { default: ThemeSwitcher }
})

export interface DashboardSidebarProps {
  user: UserProps
}

export const DashboardSidebar: React.FunctionComponent<
  DashboardSidebarProps
> = (props) => {
  const { user } = props

  const t = useI18n()
  const tsAd = useScopedI18n("ad")
  const tsArticle = useScopedI18n("article")
  const tsMedia = useScopedI18n("media")
  const tsTopic = useScopedI18n("topic")
  const tsUser = useScopedI18n("user")

  return (
    <Sidebar>
      <div className="flex items-center gap-2">
        <NextLink
          aria-label="Home"
          href="/"
          className="my-0 flex items-center justify-center py-5"
        >
          <Logo />
        </NextLink>
        <div>
          <ThemeSwitcher />
        </div>
      </div>
      <SidebarItem icon={<Icon.Dashboard />} href="/dashboard">
        {t("dashboard")}
      </SidebarItem>
      <SidebarToggle icon={<Icon.Article />} title={t("article")}>
        <SidebarToggleItem href="/dashboard/article">
          {tsArticle("all")}
        </SidebarToggleItem>
        <SidebarToggleItem href="/dashboard/article/comment">
          {t("comments")}
        </SidebarToggleItem>
        <SidebarToggleItem href="/dashboard/article/new">
          {tsArticle("add")}
        </SidebarToggleItem>
      </SidebarToggle>
      <SidebarToggle icon={<Icon.Topic />} title={t("topic")}>
        <SidebarToggleItem href="/dashboard/topic">
          {tsTopic("all")}
        </SidebarToggleItem>
        <SidebarToggleItem href="/dashboard/topic/new">
          {tsTopic("add")}
        </SidebarToggleItem>
      </SidebarToggle>
      {user?.role === "admin" && (
        <SidebarToggle icon={<Icon.Ads />} title={t("ad")}>
          <SidebarToggleItem href="/dashboard/ad">
            {tsAd("all")}
          </SidebarToggleItem>
          <SidebarToggleItem href="/dashboard/ad/new">
            {tsAd("add")}
          </SidebarToggleItem>
        </SidebarToggle>
      )}
      <SidebarToggle icon={<Icon.Media />} title={t("media")}>
        <SidebarToggleItem href="/dashboard/media">
          {tsMedia("all")}
        </SidebarToggleItem>
        <SidebarToggleItem href="/dashboard/media/new">
          {tsMedia("add")}
        </SidebarToggleItem>
      </SidebarToggle>
      {user?.role === "admin" && (
        <>
          <SidebarToggle icon={<Icon.Users />} title={t("user")}>
            <SidebarToggleItem href="/dashboard/user">
              {tsUser("all")}
            </SidebarToggleItem>
          </SidebarToggle>
        </>
      )}
      <div className="py-5">
        <SidebarItem icon={<Icon.Person />} href="/setting/user/profile">
          {t("profile")}
        </SidebarItem>
      </div>
    </Sidebar>
  )
}
