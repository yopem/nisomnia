import { NextResponse, type NextRequest } from "next/server"

import { db } from "@/lib/db"
import { cuid } from "@/lib/utils"
import { generateUniqueGenreSlug } from "@/lib/utils/slug"
import { createGenreSchema } from "@/lib/validation/genre"
import { genres } from "@/lib/db/schema"

export async function POST(request: NextRequest) {
  try {

    const body = await request.json()
    const slug = await generateUniqueGenreSlug(body.title)
    const parsedInput = createGenreSchema.parse(body)

    const generatedMetaTitle = !parsedInput.metaTitle
      ? parsedInput.title
      : parsedInput.metaTitle
    const generatedMetaDescription = !parsedInput.metaDescription
      ? parsedInput.description
      : parsedInput.metaDescription


    const data = await db.insert(genres).values({
      id: cuid(),
      slug: slug,
      metaTitle: generatedMetaTitle,
      metaDescription: generatedMetaDescription,
      ...parsedInput
    }).returning()

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json("Internal Server Error", { status: 500 })
  }
}
