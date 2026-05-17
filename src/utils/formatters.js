export const formatNumber = (num) => {
  if (!num) return "0"

  return new Intl.NumberFormat("id-ID").format(num)
}

export const formatPercent = (num) => {
  if (!num) return "0%"

  return `${Number(num).toFixed(2)}%`
}

export const formatMiliar = (num) => {
  if (!num) return "0 M"

  return `${Number(num).toLocaleString("id-ID")} M`
}