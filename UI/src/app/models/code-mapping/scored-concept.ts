import { Selectable } from '../grid/selectable';
import { Concept } from './concept';

export class ScoredConcept implements Selectable {
  term: string[]
  matchScore: number
  concept: Concept
  selected: boolean
}
