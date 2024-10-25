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
      ? parsedInput.overview
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

    if (parsedInput.productionCompanies) {
      const productionCompanyValues = parsedInput.productionCompanies.map(
        (productionCompany) => ({
          movieId: data[0].id,
          productionCompanyId: productionCompany,
        }),
      )

      await db
        .insert(movieProductionCompanies)
        .values(productionCompanyValues)
    }

    if (parsedInput.genres) {
      const genreValues = parsedInput.genres.map((genre) => ({
        movieId: data[0].id,
        genreId: genre,
      }))

      await db.insert(movieGenres).values(genreValues)
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json("Internal Server Error", { status: 500 })
  }
}
