import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ imageId: string }> }
) {
  const imageId = (await params).imageId


  const data = await db.query.medias.findFirst({
    where: (media, { eq }) => eq(media.id, imageId),
  })

  return NextResponse.json(data, { status: 200 })
}
