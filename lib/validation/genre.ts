import { z } from "zod"

import { LANGUAGE_TYPE } from "./language"

const genreInput = {
  tmdbId: z.string({
    required_error: "TMDB ID is required",
    invalid_type_error: "TMDB ID must be a string",
  }),
  title: z
    .string({
      required_error: "Title is required",
      invalid_type_error: "Title must be a string",
    })
    .min(2)
    .max(32),
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
  featuredImage: z
    .string({
      invalid_type_error: "Featured Image ID must be a string",
    })
    .optional()
    .nullish(),
  language: z.enum(LANGUAGE_TYPE, {
    invalid_type_error: "only id and en are accepted",
  }),
}

const translateGenreInput = {
  ...genreInput,
  genreTranslationId: z.string({
    required_error: "Genre Translation ID is required",
    invalid_type_error: "Genre Traslation Primary ID must be a string",
  }),
}

const updateGenreInput = {
  ...genreInput,
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

export const createGenreSchema = z.object({
  ...genreInput,
})

export const translateGenreSchema = z.object({
  ...translateGenreInput,
})

export const updateGenreSchema = z.object({
  ...updateGenreInput,
})

export type CreateGenreSchema = z.infer<typeof createGenreSchema>
export type UpdateGenreSchema = z.infer<typeof updateGenreSchema>
