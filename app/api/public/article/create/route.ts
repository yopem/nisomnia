import { NextResponse, type NextRequest } from "next/server"

import { db } from "@/lib/db"
import { cuid, trimText } from "@/lib/utils"
import { generateUniqueArticleSlug } from "@/lib/utils/slug"
import { createArticleSchema } from "@/lib/validation/article"
import { articleTopics, articles, articleTranslations, articleAuthors, articleEditors } from "@/lib/db/schema"

export async function POST(request: NextRequest) {
  try {

    const body = await request.json()
    const parsedInput = createArticleSchema.parse(body)
    const slug = await generateUniqueArticleSlug(parsedInput.title)

    const generatedExcerpt = !parsedInput.excerpt
      ? trimText(parsedInput.content, 160)
      : parsedInput.excerpt
    const generatedMetaTitle = !parsedInput.metaTitle
      ? parsedInput.title
      : parsedInput.metaTitle
    const generatedMetaDescription = !parsedInput.metaDescription
      ? generatedExcerpt
      : parsedInput.metaDescription


    const articleTranslationId = cuid()
    const articleId = cuid()


    const articleTranslation = await db
      .insert(articleTranslations)
      .values({
        id: articleTranslationId,
      })
      .returning()

    const data = await db.insert(articles).values({
      id: articleId,
      slug: slug,
      excerpt: generatedExcerpt,
      metaTitle: generatedMetaTitle,
      metaDescription: generatedMetaDescription,
      articleTranslationId: articleTranslation[0].id,
      ...parsedInput
    }).returning()

    const topicValues = parsedInput.topics.map((topic) => ({
      articleId: data[0].id,
      topicId: topic,
    }))

    const authorValues = parsedInput.authors.map((author) => ({
      articleId: data[0].id,
      userId: author,
    }))

    const editorValues = parsedInput.editors.map((editor) => ({
      articleId: data[0].id,
      userId: editor,
    }))

    await db.transaction(async () => {
      await db.insert(articleTopics).values(topicValues)
      await db.insert(articleAuthors).values(authorValues)
      await db.insert(articleEditors).values(editorValues)
    })

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json("Internal Server Error", { status: 500 })
  }
}
