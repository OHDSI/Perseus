export function calculateWidth(text: string): string {
  const words = text.split(' ')
  const longestWordLength = Math.max(...words.map(s => s.length)) * 4 // 4 - Mean char length in px
  const coefficient = words.length / 3.3 // 3.3 - Magic number
  return `${longestWordLength * coefficient}px`
}
