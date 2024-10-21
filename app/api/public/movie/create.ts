import { NextResponse, type NextRequest } from "next/server"

import { db } from "@/lib/db"
import { cuid } from "@/lib/utils"
import { generateUniqueMovieSlug } from "@/lib/utils/slug"
import { createMovieSchema } from "@/lib/validation/movie"
import { movieGenres, movieProductionCompanies, movies, movieTranslations } from "@/lib/db/schema"

export async function POST(request: NextRequest) {
  try {

    const body = await request.json()
    const slug = await generateUniqueMovieSlug(body.title)
    const parsedInput = createMovieSchema.parse(body)

    const generatedMetaTitle = !parsedInput.metaTitle
      ? parsedInput.title
      : parsedInput.metaTitle
    const generatedMetaDescription = !parsedInput.metaDescription
      ? generatedMetaTitle
      : parsedInput.metaDescription


    const movieTranslationId = cuid()
    const movieId = cuid()


    const movieTranslation = await db
      .insert(movieTranslations)
      .values({
        id: movieTranslationId,
      })
      .returning()

    const data = await db.insert(movies).values({
      id: movieId,
      slug: slug,
      metaTitle: generatedMetaTitle,
      metaDescription: generatedMetaDescription,
      movieTranslationId: movieTranslation[0].id,
      ...parsedInput
    }).returning()

    const genreValues = parsedInput.genres.map((genre) => ({
      movieId: data[0].id,
      genreId: genre,
    }))

    const productionCompnayValues = parsedInput.productionCompanies.map((p) => ({
      movieId: data[0].id,
      productionCompanyId: p,
    }))

    await db.transaction(async () => {
      await db.insert(movieGenres).values(genreValues)
      await db.insert(movieProductionCompanies).values(productionCompnayValues)
    })

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json("Internal Server Error", { status: 500 })
  }
}
