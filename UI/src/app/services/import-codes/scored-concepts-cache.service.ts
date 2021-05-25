import { Injectable } from '@angular/core';
import { ScoredConcept } from '../../models/code-mapping/scored-concept';

@Injectable()
export class ScoredConceptsCacheService {

  private map = new Map<string, ScoredConcept[]>()

  add(term: string, concepts: ScoredConcept[]): void {
    this.map.set(term, concepts)
  }

  get(term: string): ScoredConcept[] {
    return this.map.get(term)
  }

  clear(): void {
    this.map.clear()
  }
}
