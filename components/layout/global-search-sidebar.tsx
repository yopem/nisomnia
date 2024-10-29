"use client"

import * as React from "react"

import ArticleCardSearch from "@/components/article/article-card-search"
import MovieCardSearch from "@/components/movie/movie-card-search"
import TopicCardSearch from "@/components/topic/topic-card-search"
import {
  Dialog,
  DialogContent,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Icon } from "@/components/ui/icon"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import UserCardSearch from "@/components/user/user-card-search"
import { useI18n, useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"
import type { LanguageType } from "@/lib/validation/language"
import SidebarItem from "./sidebar-item"

interface GlobalSearchSidebarProps {
  locale: LanguageType
}

const GlobalSearchSidebar: React.FC<GlobalSearchSidebarProps> = (props) => {
  const { locale } = props

  const [openDialog, setOpenDialog] = React.useState<boolean>(false)
  const [searchQuery, setSearchQuery] = React.useState<string>("")
  const [searched, setSearched] = React.useState<boolean>(false)

  const inputRef = React.useRef<HTMLInputElement>(null)

  const t = useI18n()
  const ts = useScopedI18n("search")

  const { data: articles } = api.article.search.useQuery(
    {
      searchQuery,
      language: locale,
    },
    {
      enabled: !!searched,
    },
  )

  const { data: movies } = api.movie.search.useQuery(
    {
      searchQuery,
    },
    {
      enabled: !!searched,
    },
  )

  const { data: topics } = api.topic.search.useQuery(
    {
      searchQuery,
      language: locale,
    },
    {
      enabled: !!searched,
    },
  )

  const { data: users } = api.user.search.useQuery(
    { searchQuery: searchQuery, limit: 10 },
    {
      enabled: !!searched,
    },
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const value = e.target.value
    setSearchQuery(value)
    setSearched(value.length > 2)
  }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <SidebarItem icon={<Icon.Search />}>{t("search")}</SidebarItem>
      </DialogTrigger>
      <DialogPortal>
        <DialogContent className="min-h-full w-full min-w-full">
          <div>
            <DialogTitle>{t("search")}</DialogTitle>
            <form
              onSubmit={(e) => {
                e.preventDefault()
              }}
              autoComplete="off"
              className="my-5"
            >
              <Input
                type="search"
                name="q"
                onChange={handleSearchChange}
                autoComplete="off"
                placeholder={ts("placeholder")}
                required
                ref={inputRef}
              />
            </form>
            {searched && searchQuery && (
              <div className="space-y-4 bg-background">
                <ScrollArea className="h-[80vh]">
                  {articles && articles.length > 0 && (
                    <>
                      <h4>{t("article")}</h4>
                      <div className="flex flex-col">
                        {articles.map((article) => (
                          <ArticleCardSearch
                            key={article.id}
                            article={article}
                            onClick={() => {
                              setOpenDialog(false)
                              setSearched(false)
                              setSearchQuery("")
                            }}
                          />
                        ))}
                      </div>
                    </>
                  )}
                  {movies && movies.length > 0 && (
                    <>
                      <h4>{t("movie")}</h4>
                      <div className="flex flex-col">
                        {movies.map((movie) => (
                          <MovieCardSearch
                            key={movie.id}
                            movie={movie}
                            onClick={() => {
                              setOpenDialog(false)
                              setSearched(false)
                              setSearchQuery("")
                            }}
                          />
                        ))}
                      </div>
                    </>
                  )}
                  {topics && topics.length > 0 && (
                    <>
                      <h4>{t("topic")}</h4>
                      <div className="flex flex-col">
                        {topics.map((topic) => (
                          <TopicCardSearch
                            key={topic.id}
                            topic={topic}
                            onClick={() => {
                              setOpenDialog(false)
                              setSearched(false)
                              setSearchQuery("")
                            }}
                          />
                        ))}
                      </div>
                    </>
                  )}
                  {users && users.length > 0 && (
                    <>
                      <h4>{t("user")}</h4>
                      <div className="flex flex-col">
                        {users.map((user) => (
                          <UserCardSearch
                            key={user.id}
                            user={user}
                            onClick={() => {
                              setOpenDialog(false)
                              setSearched(false)
                              setSearchQuery("")
                            }}
                          />
                        ))}
                      </div>
                    </>
                  )}
                  {(!articles || articles.length === 0) &&
                    (!topics || topics.length === 0) &&
                    (!users || users.length === 0) && (
                      <p className="text-lg font-semibold">{ts("not_found")}</p>
                    )}
                </ScrollArea>
              </div>
            )}
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}

export default GlobalSearchSidebar
