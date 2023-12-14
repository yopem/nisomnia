import * as React from "react"
import NextLink from "next/link"

import type { Topic as TopicProps } from "@nisomnia/db"
import { Icon } from "@nisomnia/ui/next"

type TopicDataProps = Pick<TopicProps, "id" | "title" | "slug">

interface TopicCardProps {
  topic: TopicDataProps
}

export const TopicCard: React.FunctionComponent<TopicCardProps> = (props) => {
  const { topic } = props

  return (
    <NextLink href={`/article/topic/${topic.slug}`}>
      <div className="dark:bg-theme-700 my-2 h-[200px] max-w-[200px] rounded-md bg-white p-5 shadow-md">
        <div className="flex items-center justify-center">
          <Icon.Topic className="text-theme-800 hover:text-primary-400 dark:hover:text-primary-200 dark:text-theme-400 h-20 w-20" />
        </div>
        <div className="text-theme-800 hover:text-primary-400 dark:hover:text-primary-200 dark:text-theme-400 truncate p-5 text-center">
          {topic.title}
        </div>
      </div>
    </NextLink>
  )
}
