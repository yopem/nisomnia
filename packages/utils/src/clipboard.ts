export const copyToClipboard = (value: string) => {
  void navigator.clipboard.writeText(value)
}
