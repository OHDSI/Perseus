export function generateSessionId(): string {
  return Math.random().toString(36).substring(2)
}
