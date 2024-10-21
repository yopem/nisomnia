/* eslint-disable no-useless-escape */

import { db } from "@/lib/db"

export function slugify(text: string) {
  return text
    .toString() // Cast to string (optional)
    .normalize("NFKD") // The normalize() using NFKD method returns the Unicode Normalization Form of a given string.
    .replace(/[\u0300-\u036f]/g, "") // remove all previously split accents
    .toLowerCase() // Convert the string to lowercase letters
    .trim() // Remove whitespace from both sides of a string (optional)
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\_/g, "-") // Replace _ with -
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/\-$/g, "") // Remove trailing -
}

export function slugifyUsername(text: string) {
  return text
    .toString() // Cast to string (optional)
    .normalize("NFKD") // The normalize() using NFKD method returns the Unicode Normalization Form of a given string.
    .replace(/[\u0300-\u036f]/g, "") // remove all previously split accents
    .toLowerCase() // Convert the string to lowercase letters
    .trim() // Remove whitespace from both sides of a string (optional)
    .replace(/\s+/g, "") // Replace spaces with non-space-chars
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-/g, "") // Replace - with non-space-chars
    .replace(/\_/g, "") // Replace _ with non-space-chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/\-$/g, "") // Remove trailing -
}

export function slugifyFile(text: string) {
  return text
    .toString() // Cast to string (optional)
    .normalize("NFKD") // The normalize() using NFKD method returns the Unicode Normalization Form of a given string.
    .replace(/[\u0300-\u036f]/g, "") // remove all previously split accents
    .toLowerCase() // Convert the string to lowercase letters
    .trim() // Remove whitespace from both sides of a string (optional)
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-.]+/g, "") // Remove all non-word chars execpt dots
    .replace(/\_/g, "-") // Replace _ with -
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/\-$/g, "") // Remove trailing -
}

export const generateUniqueArticleSlug = async (
  text: string,
): Promise<string> => {
  const slug = slugify(text)
  let uniqueSlug = slug
  let suffix = 1

  while (
    await db.query.articles.findFirst({
      where: (article, { eq }) => eq(article.slug, uniqueSlug),
    })
  ) {
    suffix++
    uniqueSlug = `${slug}-${suffix}`
  }

  return uniqueSlug
}

export const generateUniqueTopicSlug = async (
  text: string,
): Promise<string> => {
  const slug = slugify(text)
  let uniqueSlug = slug
  let suffix = 1

  while (
    await db.query.topics.findFirst({
      where: (topic, { eq }) => eq(topic.slug, uniqueSlug),
    })
  ) {
    suffix++
    uniqueSlug = `${slug}-${suffix}`
  }

  return uniqueSlug
}

export const generateUniqueMediaName = async (
  text: string,
  fileExtension: string,
): Promise<string> => {
  const mediaName = `${slugify(text)}.${fileExtension}`
  let uniqueMediaName = mediaName
  let suffix = 1

  while (
    await db.query.medias.findFirst({
      where: (media, { eq }) => eq(media.name, uniqueMediaName),
    })
  ) {
    suffix++
    uniqueMediaName = `${slugify(text)}-${suffix}.${fileExtension}`
  }

  return uniqueMediaName
}

export const generateUniqueUsername = async (name: string): Promise<string> => {
  const username = slugifyUsername(name)
  let uniqueUsername = username
  let suffix = 1

  while (
    await db.query.users.findFirst({
      where: (user, { eq }) => eq(user.username, uniqueUsername),
    })
  ) {
    suffix++
    uniqueUsername = `${username}${suffix}`
  }

  return uniqueUsername
}
