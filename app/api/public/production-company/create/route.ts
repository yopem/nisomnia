import { NextResponse, type NextRequest } from "next/server"

import { db } from "@/lib/db"
import { cuid } from "@/lib/utils"
import { generateUniqueProductionCompanySlug } from "@/lib/utils/slug"
import { createProductionCompanySchema } from "@/lib/validation/production-company"
import { productionCompanies } from "@/lib/db/schema"

export async function POST(request: NextRequest) {
  try {

    const body = await request.json()
    const slug = await generateUniqueProductionCompanySlug(body.title)
    const parsedInput = createProductionCompanySchema.parse(body)

    const generatedMetaTitle = !parsedInput.metaTitle
      ? parsedInput.name
      : parsedInput.metaTitle
    const generatedMetaDescription = !parsedInput.metaDescription
      ? parsedInput.description
      : parsedInput.metaDescription

    const genreId = cuid()

    const data = await db.insert(productionCompanies).values({
      id: genreId,
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
