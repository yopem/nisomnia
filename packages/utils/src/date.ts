import dayjs from "dayjs"
import LocalizedFormat from "dayjs/plugin/localizedFormat"

export const formatDate = (data: string | Date, format: string) => {
  dayjs.extend(LocalizedFormat)

  return dayjs(data).format(format)
}
