export function formatNum(n: number): string {
  if (n < 1000) return n.toString()
  const k = n / 1000
  return `${Number.isInteger(k) ? k : k.toFixed(1)}k`
}
