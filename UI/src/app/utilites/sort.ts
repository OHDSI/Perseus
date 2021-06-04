export function asc(a: string, b: string) {
  const lowerA = a.toLowerCase()
  const lowerB = b.toLowerCase()

  if (lowerA < lowerB) {
    return -1
  } else if (lowerA > lowerB) {
    return 1
  } else {
    return 0
  }
}
