export interface Concept {
  conceptId: number | string
  conceptName: string
  domainId: string
  conceptClassId: string
  vocabularyId: string
  conceptCode: number | string
  standardConcept: string
  index?: number
  term?: string
}

export function createNoFoundConcept(): Concept {
  return {
    conceptId: '-',
    conceptName: '-',
    domainId: '-',
    conceptClassId: '-',
    vocabularyId: '-',
    conceptCode: '-',
    standardConcept: '-'
  }
}
