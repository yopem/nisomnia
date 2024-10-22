import * as React from "react"
import { clsx, type ClassValue } from "clsx"
import dayjs from "dayjs"
import LocalizedFormat from "dayjs/plugin/localizedFormat"
import { customAlphabet } from "nanoid"
import { twMerge } from "tailwind-merge"

export function getValidChildren(children: React.ReactNode) {
  return React.Children.toArray(children).filter((child) =>
    React.isValidElement(child),
  ) as React.ReactElement[]
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const cuid = customAlphabet(
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  40,
)

export function getProtocol() {
  if (process.env.APP_ENV === "development") {
    return "http://"
  }

  return "https://"
}

export const getDomainWithoutSubdomain = (url: string) => {
  const urlParts = new URL(url).hostname.split(".")

  return urlParts
    .slice(0)
    .slice(-(urlParts.length === 4 ? 3 : 2))
    .join(".")
}

export const formatDate = (data: string | Date | null, format: string) => {
  dayjs.extend(LocalizedFormat)

  return dayjs(data).format(format)
}

export function date7DaysFromNow() {
  const currentDate = new Date()
  const futureDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000)
  const year = futureDate.getFullYear()
  const month = String(futureDate.getMonth() + 1).padStart(2, "0")
  const day = String(futureDate.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export const copyToClipboard = (value: string) => {
  void navigator.clipboard.writeText(value)
}

export const trimText = (text: string, maxLength: number): string => {
  const strippedText = text.replace(/(<([^>]+)>)/gi, "")

  if (strippedText.length <= maxLength) {
    return strippedText
  }

  return strippedText.substring(0, maxLength)
}

export const splitReactNodes = (elements: React.ReactNode[]) => {
  const splitIndex = Math.ceil(elements.length / 2)
  return {
    firstContent: elements.slice(0, splitIndex),
    secondContent: elements.slice(splitIndex),
  }
}
