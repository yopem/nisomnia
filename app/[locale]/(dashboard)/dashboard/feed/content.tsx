"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"

import { useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"
import DashboardFeedHeader from "./header"
import FeedTable from "./table"

export default function DashboardFeedContent() {
  const searchParams = useSearchParams()

  const page = searchParams.get("page")

  const ts = useScopedI18n("feed")

  const perPage = 10

  const { data: feedsCount, refetch: updateFeedsCount } =
    api.feed.count.useQuery()

  const lastPage = feedsCount && Math.ceil(feedsCount / perPage)

  const {
    data: feeds,
    isLoading,
    refetch: updateFeeds,
  } = api.feed.dashboard.useQuery({
    page: page ? parseInt(page) : 1,
    perPage: perPage,
  })

  React.useEffect(() => {
    if (lastPage && page && parseInt(page) !== 1 && parseInt(page) > lastPage) {
      window.history.pushState(null, "", `?page=${lastPage.toString()}`)
    }
  }, [lastPage, page])

  return (
    <>
      <DashboardFeedHeader />
      {!isLoading && feeds !== undefined && feeds.length > 0 ? (
        <FeedTable
          feeds={feeds ?? 1}
          paramsName="page"
          page={page ? parseInt(page) : 1}
          lastPage={lastPage ?? 3}
          updateFeeds={updateFeeds}
          updateFeedsCount={updateFeedsCount}
        />
      ) : (
        <div className="my-64 flex items-center justify-center">
          <h3 className="text-center text-4xl font-bold">{ts("not_found")}</h3>
        </div>
      )}
    </>
  )
}
