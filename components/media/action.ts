import type { MediaCategory, MediaType } from "@/lib/validation/media"

interface MediaData {
  file: Blob
  type: MediaType
  category: MediaCategory
}

export async function uploadMultipleMediaAction(datas: MediaData[]) {
  const formData = new FormData()

  for (const data of datas) {
    formData.append("file", data.file)
    formData.append("type", data.type)
    formData.append("category", data.category)
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
