import { resizeImage } from "@/lib/utils"
import type { MediaType } from "@/lib/validation/media"

interface MediaData {
  file: Blob
  type: MediaType
}

export async function uploadMultipleMediaAction(datas: MediaData[]) {
  const formData = new FormData()

  for (const data of datas) {
    const resizedImage = await resizeImage(data.file)
    formData.append("file", resizedImage)
    formData.append("type", data.type)
  }
  try {
    const response = await fetch("/api/media/images", {
      method: "POST",
      body: formData,
    })

    if (response.status === 200) {
      const uploadedFiles = await response.json()
      return { data: uploadedFiles, error: null }
    } else {
      console.error("Upload failed")
      return { data: null, error: response }
    }
  } catch (error) {
    console.error("Upload failed", error)
    return { data: null, error }
  }
}
