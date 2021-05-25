import { Injectable, OnDestroy } from '@angular/core';
import { ScoredConcept } from '../../models/code-mapping/scored-concept';

@Injectable()
export class ScoredConceptsCacheService implements OnDestroy {

  private map = new Map<string, ScoredConcept[]>()

  ngOnDestroy(): void {
    this.clear()
  }

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
