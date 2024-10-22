import sharp from "sharp"

export const resizeImage = async (buffer: Buffer) => {
  const image = sharp(buffer)
  const metadata = await image.metadata()

  let newWidth = metadata.width ?? 1280

  if (metadata.width && metadata.width > 1500) {
    newWidth = 1280
  } else if (metadata.width && metadata.width <= 1500) {
    newWidth = Math.floor(metadata.width * 0.7)
  }

  // Melakukan resize gambar
  const resizedImageBuffer = await image
    .resize(newWidth)
    .webp({ quality: 80 })
    .toBuffer()

  return resizedImageBuffer
}
