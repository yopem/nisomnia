import { NextResponse, type NextRequest } from "next/server"

import { db } from "@/lib/db"
import { cuid } from "@/lib/utils"
import { generateUniqueMovieSlug } from "@/lib/utils/slug"
import { createMovieSchema } from "@/lib/validation/movie"
import { movieGenres, movieOverviews, movieProductionCompanies, movies, overviews } from "@/lib/db/schema"

export async function POST(request: NextRequest) {
  try {

    const body = await request.json()
    const slug = await generateUniqueMovieSlug(body.title)
    const parsedInput = createMovieSchema.parse(body)

    const generatedMetaTitle = !parsedInput.metaTitle
      ? parsedInput.title
      : parsedInput.metaTitle
    const generatedMetaDescription = !parsedInput.metaDescription
      ? (parsedInput.overview ?? parsedInput.title)
      : parsedInput.metaDescription

    const movieId = cuid()

    const data = await db.insert(movies).values({
      id: movieId,
      slug: slug,
      metaTitle: generatedMetaTitle,
      metaDescription: generatedMetaDescription,
      ...parsedInput
    }).returning()

    if (parsedInput.overview) {
      const overview = await db
        .insert(overviews)
        .values({
          id: cuid(),
          title: parsedInput.title,
          type: "movie",
          content: parsedInput.overview,
          // change if we have multiple languages
          language: "en",
        })
        .returning()

      await db.insert(movieOverviews).values({
        movieId: movieId,
        overviewId: overview[0].id,
      })
    }

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
