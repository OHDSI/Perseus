import { TargetConcept } from './target-concept';
import { Selectable } from '../grid/selectable';

export class ScoredConcept implements Selectable {
  term: string
  matchScore: number
  concept: TargetConcept
  selected: boolean
}
