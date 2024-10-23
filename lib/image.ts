import sharp from "sharp"

export const resizeImage = async (buffer: Buffer) => {
  const image = sharp(buffer)
  const metadata = await image.metadata()

  let newWidth = metadata.width ?? 1280

  if (metadata.width && metadata.width > 1280) {
    newWidth = 1280
  } else if (metadata.width && metadata.width <= 1280) {
    newWidth = metadata.width
  }

  // Melakukan resize gambar
  const resizedImageBuffer = await image
    .resize(newWidth)
    .webp({ quality: 70 })
    .toBuffer()

  return resizedImageBuffer
}
