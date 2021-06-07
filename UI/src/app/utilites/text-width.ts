export function calculateWidthByLongestWord(text: string, charWidth = 4): string {
  const words = text.split(' ')
  const longestWordLength = Math.max(...words.map(s => s.length)) * charWidth
  const coefficient = words.length / 3.3 // 3.3 - Magic number
  return `${longestWordLength * coefficient}px`
}
