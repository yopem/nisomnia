import Resizer from "react-image-file-resizer"

export const resizeImage = (file: Blob): Promise<Blob> =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      1280,
      720,
      "webp",
      70,
      0,
      (uri) => {
        //@ts-ignore
        resolve(uri)
      },
      "file",
    )
  })
