export function calculateWidth(text: string): string {
  const words = text.split(' ')
  const longestWordLength = Math.max(...words.map(s => s.length)) * 4 // 4 - Mean char length
  const coefficient = words.length / 3.3 // 3.3 - magic number
  return `${longestWordLength * coefficient}px`
}
