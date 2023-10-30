"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import NextLink from "next/link"
import env from "env"
import { useInView } from "react-intersection-observer"

import type {
  Ad as AdProps,
  Article as ArticleProps,
  LanguageType,
  Media as MediaProps,
  Topic as TopicProps,
  User as UserProps,
} from "@nisomnia/db"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Icon,
} from "@nisomnia/ui/next"

import { Ad } from "@/components/Ad"
import { Image } from "@/components/Image"
import { readingTime } from "@/lib/reading-time"
import {
  InfiniteScrollArticle,
  type InfinteScrollArticleDataProps,
} from "./InfiniteScrollArticle"

const ArticleMenu = dynamic(() =>
  import("./ArticleMenu").then((mod) => mod.ArticleMenu),
)

type AdDataProps = Pick<AdProps, "id" | "type" | "content">

type ArticleDataProps = Pick<
  ArticleProps,
  "id" | "title" | "content" | "slug"
> & {
  featured_image: Pick<MediaProps, "url">
  topics: Pick<TopicProps, "title" | "slug">[]
  authors: Pick<UserProps, "name" | "username">[]
  editors: Pick<UserProps, "name" | "username">[]
}

interface ArticleContentProps {
  adsBelowHeader: AdDataProps[]
  adsAboveContent: AdDataProps[]
  adsBelowContent: AdDataProps[]
  adsMiddleContent: AdDataProps[]
  article: ArticleDataProps
  articles: InfinteScrollArticleDataProps[]
  articlesCount: number
  firstContent: React.ReactNode
  secondContent: React.ReactNode
  locale: LanguageType
}

export const ArticleContent: React.FunctionComponent<ArticleContentProps> = (
  props,
) => {
  const {
    adsBelowHeader,
    adsAboveContent,
    adsBelowContent,
    adsMiddleContent,
    article,
    articles,
    articlesCount,
    firstContent,
    secondContent,
    locale,
  } = props

  const { ref: ActionRef, inView: ActionStopFixed } = useInView()

  return (
    <>
      {adsBelowHeader.length > 0 &&
        adsBelowHeader.map((ad) => {
          return <Ad key={ad.id} ad={ad} />
        })}
      <div className="mb-5 md:mb-10">
        <Breadcrumb separator={<Icon.ChevronRight />}>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" aria-label="Home">
              <Icon.Home />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink as={NextLink} href="/article">
              Article
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink
              as={NextLink}
              href={`/article/topic/${article?.topics[0]?.slug}`}
            >
              {article?.topics[0]?.title}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem currentPage>
            <BreadcrumbLink currentPage>{article.title}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <div className="space-y-4">
        <h1 className="text-xl md:text-3xl">{article.title}</h1>
        <div className="flex justify-between">
          <div className="inline-flex space-x-1">
            <NextLink
              href={`/user/${article?.authors[0]?.username}`}
              className="text-sm font-bold"
            >
              {article?.authors[0]?.name}
            </NextLink>
          </div>
          <p className="text-sm">
            <Icon.Read className="mr-1 inline-flex h-4 w-4" />
            {readingTime(article)}
          </p>
        </div>
        <div className="relative aspect-video w-full">
          <Image
            fill
            sizes="(max-width: 720px) 100vw, 50vw"
            src={article.featured_image.url}
            alt={article.title}
            className="aspect-video w-full rounded-md"
          />
        </div>
        <div className="article-container" id="container">
          {adsAboveContent.length > 0 &&
            adsAboveContent.map((ad) => {
              return <Ad key={ad.id} ad={ad} />
            })}
          {firstContent}
          {adsMiddleContent.length > 0 &&
            adsMiddleContent.map((ad) => {
              return <Ad key={ad.id} ad={ad} />
            })}
          {secondContent}
          <div ref={ActionRef}>
            <ArticleMenu
              url={`http://${env.NEXT_PUBLIC_DOMAIN}/${locale}/article/${article.slug}`}
              text={article.title}
              mediaSrc={article.featured_image.url}
              className={ActionStopFixed ? "hidden" : "fixed"}
              article_id={article.id}
            />
            <div className="my-4 space-x-2">
              {article.topics.map((topic) => {
                return (
                  <Button
                    key={topic.slug}
                    size="sm"
                    variant="ghost"
                    className="mx-2 rounded-full uppercase"
                  >
                    <NextLink href={`/article/topic/${topic.slug}`}>
                      {topic.title}
                    </NextLink>
                  </Button>
                )
              })}
              {adsBelowContent.length > 0 &&
                adsBelowContent.map((ad) => {
                  return <Ad key={ad.id} ad={ad} />
                })}
            </div>
            <div className="flex w-full flex-col space-y-4">
              <h3>You may also like</h3>
              <InfiniteScrollArticle
                articles={articles}
                locale={locale}
                index={2}
                totalPage={articlesCount}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
