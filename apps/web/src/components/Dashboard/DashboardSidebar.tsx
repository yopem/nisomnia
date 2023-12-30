import * as React from "react"
import NextLink from "next/link"

import type { User as UserProps } from "@nisomnia/auth"
import { Icon } from "@nisomnia/ui/next"

import { Sidebar } from "@/components/Layout/Sidebar"
import { SidebarItem } from "@/components/Layout/SidebarItem"
import { SidebarToggleItem } from "@/components/Layout/SidebarToggleItem"
import { Logo } from "@/components/Logo"
import { getI18n, getScopedI18n } from "@/locales/server"

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
> = async (props) => {
  const { user } = props

  const t = await getI18n()
  const tsAd = await getScopedI18n("ad")
  const tsArticle = await getScopedI18n("article")
  const tsMedia = await getScopedI18n("media")
  const tsTopic = await getScopedI18n("topic")
  const tsUser = await getScopedI18n("user")

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
