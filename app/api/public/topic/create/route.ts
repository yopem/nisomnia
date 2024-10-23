import { NextResponse, type NextRequest } from "next/server"

import { db } from "@/lib/db"
import { cuid } from "@/lib/utils"
import { generateUniqueTopicSlug } from "@/lib/utils/slug"
import { createTopicSchema } from "@/lib/validation/topic"
import { topics, topicTranslations } from "@/lib/db/schema"

export async function POST(request: NextRequest) {
  try {

    const body = await request.json()
    const slug = await generateUniqueTopicSlug(body.title)
    const parsedInput = createTopicSchema.parse(body)

    const generatedMetaTitle = !parsedInput.metaTitle
      ? parsedInput.title
      : parsedInput.metaTitle
    const generatedMetaDescription = !parsedInput.metaDescription
      ? parsedInput.description
      : parsedInput.metaDescription


    const topicTranslationId = cuid()
    const topicId = cuid()

    const topicTranslation = await db
      .insert(topicTranslations)
      .values({
        id: topicTranslationId,
      })
      .returning()

    const data = await db.insert(topics).values({
      id: topicId,
      slug: slug,
      metaTitle: generatedMetaTitle,
      metaDescription: generatedMetaDescription,
      topicTranslationId: topicTranslation[0].id,
      ...parsedInput
    }).returning()

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json("Internal Server Error", { status: 500 })
  }
}
