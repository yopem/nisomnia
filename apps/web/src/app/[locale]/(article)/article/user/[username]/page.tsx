import * as React from "react"
import type { Metadata } from "next"
import NextLink from "next/link"
import { BreadcrumbJsonLd } from "next-seo"

import type { LanguageType } from "@nisomnia/db"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Icon,
} from "@nisomnia/ui/next"

import env from "@/env"
import { api } from "@/lib/trpc/server"

const InfiniteScrollUserArticles = React.lazy(async () => {
  const { InfiniteScrollUserArticles } = await import(
    "@/components/Article/InfiniteScrollUserArticles"
  )
  return { default: InfiniteScrollUserArticles }
})

export async function generateMetadata({
  params,
}: {
  params: { locale: LanguageType; username: string }
}): Promise<Metadata> {
  const { locale, username } = params

  const user = await api.user.byUsername.query({
    username: username,
    language: locale,
  })

  return {
    title: `${user?.name} Articles`,
    description: user?.about ?? `${user?.name} Articles`,
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/article/user/${user?.username}`,
    },
    openGraph: {
      title: `${user?.name} Articles`,
      description: user?.about ?? `${user?.name} Articles`,
      url: `${env.NEXT_PUBLIC_SITE_URL}/article/user/${user?.username}`,
      locale: locale,
    },
  }
}

interface UserArticlesPageProps {
  params: {
    username: string
    locale: LanguageType
  }
}

export default async function UserArticlesPage({
  params,
}: UserArticlesPageProps) {
  const { username, locale } = params

  const user = await api.user.byUsername.query({
    username: username,
    language: locale,
  })

  return (
    <>
      <BreadcrumbJsonLd
        useAppDir
        itemListElements={[
          {
            position: 1,
            name: env.NEXT_PUBLIC_DOMAIN,
            item: env.NEXT_PUBLIC_SITE_URL,
          },
          {
            position: 2,
            name: "Article",
            item: `${env.NEXT_PUBLIC_SITE_URL}/article`,
          },
          {
            position: 2,
            name: user?.name,
            item: `${env.NEXT_PUBLIC_SITE_URL}/article/user/${user?.username}`,
          },
        ]}
      />
      <section>
        <Breadcrumb separator={<Icon.ChevronRight />}>
          <BreadcrumbItem>
            <BreadcrumbLink as={NextLink} href="/" aria-label="Home">
              <Icon.Home />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink as={NextLink} href="/article">
              Article
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem currentPage>
            <BreadcrumbLink currentPage>{user?.username}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <div className="my-8">
          <h1 className="text-center text-4xl">
            Articles By {`${user?.name}`}
          </h1>
        </div>
        <div className="flex w-full flex-col">
          <InfiniteScrollUserArticles username={username} locale={locale} />
        </div>
      </section>
    </>
  )
}

export const revalidate = 0
