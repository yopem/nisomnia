import { z } from "zod"

import { LANGUAGE_TYPE } from "./language"

const movieInput = {
  imdbId: z.string({
    required_error: "IMDB ID is required",
    invalid_type_error: "IMDB ID must be a string",
  }),
  tmdbId: z.string({
    required_error: "TMDB ID is required",
    invalid_type_error: "TMDB ID must be a string",
  }),
  title: z.string({
    required_error: "Title is required",
    invalid_type_error: "Title must be a string",
  }),
  otherTitle: z
    .string({
      invalid_type_error: "Other Title must be a string",
    })
    .optional(),
  tagline: z
    .string({
      invalid_type_error: "Tagline must be a string",
    })
    .optional(),
  overview: z
    .string({
      invalid_type_error: "Tagline must be a string",
    })
    .optional(),
  status: z
    .string({
      invalid_type_error: "Status must be a string",
    })
    .optional(),
  originCountry: z
    .string({
      invalid_type_error: "Origin Country must be a string",
    })
    .optional(),
  originalLanguage: z
    .string({
      invalid_type_error: "Original Language must be a string",
    })
    .optional(),
  spokenLanguaeg: z
    .string({
      invalid_type_error: "Spoken Language must be a string",
    })
    .optional(),
  releaseDate: z
    .date({
      invalid_type_error: "Origin Country must be a date",
    })
    .optional(),
  budget: z
    .number({
      invalid_type_error: "Budget must be a number",
    })
    .optional(),
  revenue: z
    .number({
      invalid_type_error: "Revenue must be a number",
    })
    .optional(),
  runtime: z
    .number({
      invalid_type_error: "Runtime must be a number",
    })
    .optional(),
  homepage: z
    .string({
      invalid_type_error: "Homepage must be a string",
    })
    .optional(),
  backdrop: z
    .string({
      invalid_type_error: "Backdrop must be a string",
    })
    .optional(),
  poster: z
    .string({
      invalid_type_error: "Poster must be a string",
    })
    .optional(),
  description: z
    .string({
      invalid_type_error: "Description must be a string",
    })
    .optional(),
  metaTitle: z
    .string({
      invalid_type_error: "Meta Title must be a string",
    })
    .optional(),
  metaDescription: z
    .string({
      invalid_type_error: "Meta Description must be a string",
    })
    .optional(),
  language: z.enum(LANGUAGE_TYPE, {
    invalid_type_error: "only id and en are accepted",
  }),
  genres: z
    .string({
      required_error: "Genre Id is required",
      invalid_type_error: "Genre Id must be a string",
    })
    .array(),
  productionCompanies: z
    .string({
      required_error: "Production Company Id is required",
      invalid_type_error: "Production Company Id must be a string",
    })
    .array(),
}

const translateMovieInput = {
  ...movieInput,
  movieTranslationId: z.string({
    required_error: "Movie Translation ID is required",
    invalid_type_error: "Movie Traslation Primary ID must be a string",
  }),
}

const updateMovieInput = {
  ...movieInput,
  id: z.string(),
  slug: z
    .string({
      required_error: "Slug is required",
      invalid_type_error: "Slug must be a string",
    })
    .regex(new RegExp(/^[a-zA-Z0-9_-]*$/), {
      message: "Slug should be character a-z, A-Z, number, - and _",
    }),
}

export const createMovieSchema = z.object({
  ...movieInput,
})

export const translateMovieSchema = z.object({
  ...translateMovieInput,
})

export const updateMovieSchema = z.object({
  ...updateMovieInput,
})

export type CreateMovieSchema = z.infer<typeof createMovieSchema>
export type UpdateMovieSchema = z.infer<typeof updateMovieSchema>
