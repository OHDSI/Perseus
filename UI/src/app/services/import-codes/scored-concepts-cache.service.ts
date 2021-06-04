import { Injectable, OnDestroy } from '@angular/core';
import { ScoredConceptCache } from '../../models/code-mapping/scored-concept-cache';

@Injectable()
export class ScoredConceptsCacheService implements OnDestroy {

  private map = new Map<string, ScoredConceptCache>()

  ngOnDestroy(): void {
    this.clear()
  }

  add(term: string, value: ScoredConceptCache): void {
    this.map.set(term, {...value})
  }

  get(term: string): ScoredConceptCache {
    return {...this.map.get(term)}
  }

  clear(): void {
    this.map.clear()
  }
}
