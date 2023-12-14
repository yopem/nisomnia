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
      <div className="my-2 h-[200px] max-w-[200px] rounded-lg bg-background p-5 shadow-md">
        <div className="flex items-center justify-center">
          <Icon.Topic className="h-20 w-20 text-foreground hover:text-foreground/90" />
        </div>
        <div className="truncate p-5 text-center text-foreground hover:text-foreground/90">
          {topic.title}
        </div>
      </div>
    </NextLink>
  )
}
