import { SourceConcept } from './source-concept';
import { TargetConcept } from './target-concept';

export interface CodeMapping {
  sourceCode: SourceConcept
  targetConcepts: TargetConcept[]
  matchScore: number
}
