import sharp from "sharp"

export const resizeImage = async (buffer: Buffer) => {
  const image = sharp(buffer)
  const metadata = await image.metadata()

  let newWidth = metadata.width ?? 1280

  // Tentukan ukuran resize berdasarkan kondisi lebar gambar
  if (metadata.width && metadata.width > 1500) {
    newWidth = 1280 // Set ukuran jadi 1280px jika lebar lebih dari 1500px
  } else if (metadata.width && metadata.width <= 1500) {
    newWidth = Math.floor(metadata.width * 0.7) // Turunkan 70% jika lebar <= 1500px
  }

  // Melakukan resize gambar
  const resizedImageBuffer = await image
    .resize(newWidth)
    .webp({ quality: 80 })
    .toBuffer()

  return resizedImageBuffer
}
