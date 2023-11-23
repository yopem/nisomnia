import { NextResponse, type NextRequest } from "next/server"

import { getCurrentUser } from "@nisomnia/auth"
import { db } from "@nisomnia/db"
import { slugifyFile, uniqueCharacter } from "@nisomnia/utils"

import env from "@/env"
import { uploadImageToS3 } from "@/lib/s3"

export async function POST(request: NextRequest) {
  try {
    const session = await getCurrentUser()

    if (!session) {
      return NextResponse.json("Unauthorized", { status: 403 })
    }

    const formData = await request.formData()

    const file = formData.get("file") as Blob | null
    if (!file) {
      return NextResponse.json("File blob is required.", { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    //@ts-ignore
    const [fileName, _fileType] = file?.name.split(".") || []

    const defaultFileType = "image/webp"
    const defaultFileExtension = "webp"

    const uniqueFileName = `${slugifyFile(
      fileName,
    )}_${uniqueCharacter()}.${defaultFileExtension}`

    await uploadImageToS3({
      file: buffer,
      fileName: uniqueFileName,
      contentType: defaultFileType,
    })

    const data = await db.media.create({
      data: {
        name: uniqueFileName,
        url: "https://" + env.R2_DOMAIN + "/" + uniqueFileName,
        type: defaultFileType,
        author_id: session.id,
      },
    })

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    return NextResponse.json("Internal Server Error", { status: 500 })
  }
}
