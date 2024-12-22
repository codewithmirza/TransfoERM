export function parseD1Result<T>(result: unknown): T | null {
  if (!result) return null
  return result as T
} 