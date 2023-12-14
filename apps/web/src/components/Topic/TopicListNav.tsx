//TODO: change content if language switched

import * as React from "react"
import NextLink from "next/link"

import { Button } from "@nisomnia/ui/next"

export const TopicListNav: React.FunctionComponent = () => {
  const topics = [
    { id: 1, title: "Anime", slug: "anime_izghk" },
    { id: 2, title: "Game", slug: "game_srjgj" },
    { id: 3, title: "Film", slug: "film_kjud5" },
    { id: 4, title: "Novel", slug: "novel_e9szh" },
    { id: 5, title: "Teknologi", slug: "teknologi_3ince" },
  ]

  return (
    <>
      {topics.map((topic) => (
        <Button asChild variant="ghost" key={topic.id}>
          <NextLink
            aria-label={topic.title}
            href={`/article/topic/${topic.slug}`}
          >
            {topic.title}
          </NextLink>
        </Button>
      ))}
    </>
  )
}
