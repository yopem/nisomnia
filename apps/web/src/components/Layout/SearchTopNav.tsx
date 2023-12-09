"use client"

import * as React from "react"

import type { LanguageType } from "@nisomnia/db"
import { Icon } from "@nisomnia/ui/next"
import { Input } from "@nisomnia/ui/next-client"

import { ArticleCardSearch } from "@/components/Article/ArticleCardSearch"
import { Container } from "@/components/Layout/Container"
import { TopicCardSearch } from "@/components/Topic/TopicCardSearch"
import { UserCardSearch } from "@/components/User/UserCardSearch"
import { api } from "@/lib/trpc/react"

interface SearchTopNavProps extends React.HTMLAttributes<HTMLDivElement> {
  hideSearchVisibility: () => void
  searchVisibility: boolean
  locale: LanguageType
}

export const SearchTopNav: React.FunctionComponent<SearchTopNavProps> = (
  props,
) => {
  const { searchVisibility, hideSearchVisibility, locale } = props
  const [searchQuery, setSearchQuery] = React.useState("")
  const [searched, setSearched] = React.useState<boolean>(false)

  const { data: articles } = api.article.search.useQuery({
    search_query: searchQuery,
    language: locale,
  })

  const { data: topics } = api.topic.search.useQuery({
    search_query: searchQuery,
    language: locale,
  })

  const { data: users } = api.user.search.useQuery(searchQuery)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.value.length > 2) {
      setSearched(true)
      setSearchQuery(e.target.value)
    } else if (searched && e.target.value.length < 1) {
      setSearched(false)
    }
  }

  return (
    <div
      className={`absolute inset-x-0 ${
        searchVisibility ? "top-0 h-[90vh]" : "top-[-100%] h-0"
      } z-20 transition-all duration-200`}
      onClick={hideSearchVisibility}
    >
      <Container className="my-0 bg-background px-2 md:px-0">
        <form onSubmit={(e) => e.preventDefault()} autoComplete="false">
          <div
            className="relative flex w-full min-w-full lg:w-[500px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute bottom-0 left-0 top-[4px] flex items-center pl-3">
              <span className="h-5 w-5 text-foreground">
                <Icon.Search />
              </span>
            </div>
            <Input
              type="search"
              name="q"
              className="py-3"
              onChange={handleSearchChange}
              autoComplete="off"
              placeholder="Search..."
              required
            />
          </div>
        </form>
        {searched && searchQuery && (
          <div
            className={`${
              searchVisibility ? "block" : "hidden"
            } space-y-4 bg-background p-5 shadow-lg`}
            onClick={hideSearchVisibility}
            aria-expanded={searchVisibility ? "true" : "false"}
          >
            {articles !== undefined && articles.length > 0 && (
              <>
                <h4 className="mb-2 border-b">Article</h4>
                <div className="flex flex-col">
                  {articles.map((article) => {
                    return (
                      <ArticleCardSearch key={article.slug} article={article} />
                    )
                  })}
                </div>
              </>
            )}
            {topics !== undefined && topics.length > 0 && (
              <>
                <h4 className="mb-2 border-b">Topic</h4>
                <div className="flex flex-col">
                  {topics.map((topic) => {
                    return <TopicCardSearch key={topic.slug} topic={topic} />
                  })}
                </div>
              </>
            )}
            {users !== undefined && users && users.length > 0 && (
              <>
                <h4 className="mb-2 border-b">User</h4>
                <div className="flex flex-col">
                  {users.map((user) => {
                    return <UserCardSearch key={user.username} user={user} />
                  })}
                </div>
              </>
            )}
            {articles !== undefined &&
              articles.length === 0 &&
              topics !== undefined &&
              topics.length === 0 &&
              users !== undefined &&
              users.length === 0 && (
                <p className="semibold text-lg">results not found!</p>
              )}
          </div>
        )}
      </Container>
    </div>
  )
}
