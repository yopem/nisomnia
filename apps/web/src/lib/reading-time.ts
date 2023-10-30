import type { Article as ArticleProps, Media as MediaProps } from "@nisomnia/db"

const countImages = (html: string) => {
  if (!html) {
    return 0
  }
  return (html.match(/<img(.|\n)*?>/g) ?? []).length
}

const countWords = (text: string) => {
  if (!text) {
    return 0
  }

  text = text.replace(/<(.|\n)*?>/g, " ")

  const pattern =
    /[a-zA-ZÀ-ÿ0-9_\u0392-\u03c9\u0410-\u04F9]+|[\u4E00-\u9FFF\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\uac00-\ud7af]+/g
  const match = text.match(pattern)
  let count = 0

  if (match === null) {
    return count
  }

  for (const char of match) {
    if (char.charCodeAt(0) >= 0x4e00) {
      count += char.length
    } else {
      count += 1
    }
  }
  return count
}

interface readingTimeProps {
  wordCount: number
  imageCount: number
}

const estimatedReadingTimeInMinutes = ({
  wordCount,
  imageCount,
}: readingTimeProps) => {
  const wordsPerMinute = 275
  const wordsPerSecond = wordsPerMinute / 60
  let readingTimeSeconds = wordCount / wordsPerSecond

  for (let i = 12; i > 12 - imageCount; i -= 1) {
    readingTimeSeconds += Math.max(i, 3)
  }

  const readingTimeMinutes = Math.round(readingTimeSeconds / 60)

  return readingTimeMinutes
}

const readingMinutes = (html?: string, additionalImages?: number): number => {
  if (!html) return 0

  let imageCount = countImages(html)
  const wordCount = countWords(html)

  if (additionalImages) imageCount += additionalImages

  return estimatedReadingTimeInMinutes({ wordCount, imageCount })
}

interface ReadingTimeOptions {
  minute?: string
  minutes?: string
}

type ArticleDataProps = Partial<ArticleProps> & {
  featured_image: Pick<MediaProps, "url">
}

export const readingTime = (
  article: ArticleDataProps,
  options: ReadingTimeOptions = {},
) => {
  const minuteStr =
    typeof options.minute === "string" ? options.minute : "1 min read"
  const minutesStr =
    typeof options.minutes === "string" ? options.minutes : "% min read"

  if (!article.content) return ""

  const imageCount = article.featured_image.url ? 1 : 0
  const time = readingMinutes(article.content, imageCount)

  let readingTime = ""
  if (time <= 1) {
    readingTime = minuteStr
  } else {
    readingTime = minutesStr.replace("%", `${time}`)
  }

  return readingTime
}
