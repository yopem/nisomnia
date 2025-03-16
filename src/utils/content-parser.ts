import { parse } from "node-html-parser"

import { publicAdsenseClientId } from "./constant"

export interface HtmlContentPart {
  type: "html"
  content: string
}

export interface ImageContentPart {
  type: "image"
  src: string
  alt: string
}

export type ContentPart = HtmlContentPart | ImageContentPart

/**
 * Parses HTML content and splits it into parts separating images from text
 * @param content HTML content to parse
 * @param defaultAlt Default alt text to use for images without alt attribute
 * @returns Array of content parts (HTML and images)
 */
export function parseContent(
  content: string,
  defaultAlt: string,
): ContentPart[] {
  if (!content) return []

  const contentParts: ContentPart[] = []

  // Parse the HTML content
  const root = parse(content)

  // Find all image elements
  const images = root.querySelectorAll("img")

  if (images.length > 0) {
    // Process each image and split content around them
    let currentPos = 0

    images.forEach((img) => {
      const imgPos = content.indexOf(img.toString(), currentPos)
      if (imgPos > currentPos) {
        // Add the content before the image
        contentParts.push({
          type: "html",
          content: content.substring(currentPos, imgPos),
        })
      }

      // Add the image as a separate part
      contentParts.push({
        type: "image",
        src: img.getAttribute("src") ?? "",
        alt: img.getAttribute("alt") ?? defaultAlt,
      })

      currentPos = imgPos + img.toString().length
    })

    // Add remaining content after the last image
    if (currentPos < content.length) {
      contentParts.push({
        type: "html",
        content: content.substring(currentPos),
      })
    }
  } else {
    // No images found, just add the content as is
    contentParts.push({
      type: "html",
      content: content,
    })
  }

  // Split the content into two parts with a heading in the middle
  const result: ContentPart[] = []
  const middleIndex = Math.floor(contentParts.length / 2)

  // Add first half
  result.push(...contentParts.slice(0, middleIndex))

  // Add the heading in the middle
  result.push({
    type: "html",
    content: `<ins 
      class="adsbygoogle manual-adsense h-auto w-screen min-w-full sm:w-full"
      style="display:block"
      data-ad-client="ca-${publicAdsenseClientId}"
      data-ad-slot="6709218890"
      data-ad-format="auto"
      data-full-width-responsive="true"></ins>`,
  })

  // Add second half
  result.push(...contentParts.slice(middleIndex))

  return result
}
