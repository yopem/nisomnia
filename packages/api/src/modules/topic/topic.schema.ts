import { z } from "zod"

import { LANGUAGE_TYPE } from "../language/language.schema"

export const TOPIC_TYPE = [
  "all",
  "article",
  "review",
  "tutorial",
  "movie",
  "tv",
  "game",
] as const

const topicInput = {
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
  meta_title: z
    .string({
      invalid_type_error: "Meta Title must be a string",
    })
    .optional(),
  meta_description: z
    .string({
      invalid_type_error: "Meta Description must be a string",
    })
    .optional(),
  type: z
    .enum(TOPIC_TYPE, {
      invalid_type_error:
        "only all, article, review ,tutorial, download, movie, tv, game are accepted",
    })
    .optional(),
  featured_image_id: z
    .string({
      invalid_type_error: "Featured Image ID must be a string",
    })
    .optional(),
  language: z.enum(LANGUAGE_TYPE, {
    invalid_type_error: "only id and en are accepted",
  }),
}

const translateTopicInput = {
  ...topicInput,
  topic_translation_primary_id: z.string({
    required_error: "Topic Translation Primary ID is required",
    invalid_type_error: "Topic Traslation Primary ID must be a string",
  }),
}

const updateTopicInput = {
  ...topicInput,
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

export const createTopicSchema = z.object({
  ...topicInput,
})

export const translateTopicSchema = z.object({
  ...translateTopicInput,
})

export const updateTopicSchema = z.object({
  ...updateTopicInput,
})
