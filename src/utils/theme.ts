export const THEME_MAP = {
  light: "light",
  dark: "dark",
  system: undefined,
} as const

export type ThemeKey = keyof typeof THEME_MAP
export type ThemeValue = (typeof THEME_MAP)[ThemeKey]

export const STORAGE_THEME_KEY = "theme"
