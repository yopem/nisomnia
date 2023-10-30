import { NextResponse, type NextRequest } from "next/server"
import { DeleteObjectCommand } from "@aws-sdk/client-s3"
import env from "env"
import { z } from "zod"

import { getCurrentUserByRole } from "@nisomnia/auth"
import { db } from "@nisomnia/db"

import { s3Client } from "@/lib/s3"

const routeContextSchema = z.object({
  params: z.object({
    name: z.string({
      invalid_type_error: "Media Name must be a string",
    }),
  }),
})

export async function DELETE(
  _request: NextRequest,
  context: z.infer<typeof routeContextSchema>,
) {
  try {
    const { params } = routeContextSchema.parse(context)

    const authorize = getCurrentUserByRole("admin")

    if (!authorize) {
      return NextResponse.json("Only admin who can use this endpoint!", {
        status: 403,
      })
    }

    const fileProperties = {
      Bucket: env.R2_BUCKET,
      Key: params.name,
    }

    await s3Client.send(new DeleteObjectCommand(fileProperties))
    await db.media.delete({
      where: {
        name: params.name,
      },
    })

    return NextResponse.json("Delete Media Successfully!", { status: 200 })
  } catch (error) {
    console.log(error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(error?.issues[0]?.message, { status: 422 })
    }

    return NextResponse.json("Internal Server Error", { status: 500 })
  }
}
