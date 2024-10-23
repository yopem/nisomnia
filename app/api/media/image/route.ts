import { NextResponse, type NextRequest } from "next/server"

import env from "@/env"
import { getCurrentSession } from "@/lib/auth/session"
import { db } from "@/lib/db"
import { medias } from "@/lib/db/schema/media"
import { resizeImage } from "@/lib/image"
import { uploadImageToR2 } from "@/lib/r2"
import { cuid } from "@/lib/utils"
import { generateUniqueMediaName } from "@/lib/utils/slug"
import { mediaType, type MediaType } from "@/lib/validation/media"

export async function POST(request: NextRequest) {
  try {
    const { session, user } = await getCurrentSession()

    if (!session) {
      return NextResponse.json("Unauthorized", { status: 403 })
    }

    const formData = await request.formData()

    const file = formData.get("file") as Blob | null
    const formType = formData.get("type") as MediaType

    const type = mediaType.parse(formType)

    if (!file) {
      return NextResponse.json("File blob is required.", { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    //@ts-ignore
    const [fileName, _fileType] = file?.name.split(".") || []
    const resizedImageBuffer = await resizeImage(buffer)

    const defaultFileType = "image/webp"
    const defaultFileExtension = "webp"

    const uniqueFileName = await generateUniqueMediaName(
      fileName,
      defaultFileExtension,
    )

    await uploadImageToR2({
      file: resizedImageBuffer,
      fileName: type + "/" + uniqueFileName,
      contentType: defaultFileType,
    })

    const data = await db.insert(medias).values({
      id: cuid(),
      name: uniqueFileName,
      url: `https://${env.R2_DOMAIN}/${type}/${uniqueFileName}`,
      type: type,
      imageType: defaultFileType,
      authorId: user.id,
    })

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json("Internal Server Error", { status: 500 })
  }
}
