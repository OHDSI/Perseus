import { Concept } from './concept';

export interface SearchByTermParams {
  term: string,
  selectedConcepts: Concept[],
  sourceAutoAssignedConceptIds: number[]
}
