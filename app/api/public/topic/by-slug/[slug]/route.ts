
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const slug = (await params).slug


  const data = await db.query.topics.findFirst({
    where: (topic, { eq }) => eq(topic.slug, slug),
  })

  return NextResponse.json(data, { status: 200 })
}

