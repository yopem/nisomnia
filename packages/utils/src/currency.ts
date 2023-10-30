export const formatIdr = (value: number) => {
  const idr = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  })

  return idr.format(value)
}
