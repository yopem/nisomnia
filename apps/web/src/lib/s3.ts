import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"

import env from "@/env"

export const s3Config = {
  region: env.R2_REGION,
  endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY,
    secretAccessKey: env.R2_SECRET_KEY,
  },
}

export const s3Client = new S3Client(s3Config)

interface UploadImageToS3Props {
  file: Buffer
  fileName: string
  contentType?: string
  width?: number
  height?: number
}

export async function uploadImageToS3({
  file,
  fileName,
  contentType = "image/webp",
}: UploadImageToS3Props): Promise<string> {
  const params = {
    Bucket: env.R2_BUCKET,
    Key: fileName,
    Body: file,
    ContentType: contentType,
  }

  const command = new PutObjectCommand(params)
  await s3Client.send(command)

  return fileName
}
