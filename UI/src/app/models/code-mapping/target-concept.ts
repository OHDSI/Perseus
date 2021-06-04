import { Concept } from './concept';

export interface TargetConcept {
  concept: Concept
  term: string[]
}

export function termFromTargetConcept(concept: TargetConcept) {
  return concept.term?.find(() => true)
}
