export function saveMappingToLocalStorage(mapping: string) {
  localStorage.setItem('perseus-mapping', mapping)
}

export function getMappingFromLocalStorage(): string {
  return localStorage.getItem('perseus-mapping')
}
