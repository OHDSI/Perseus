import { SourceConcept } from './source-concept';
import { TargetConcept } from './target-concept';
import { Selectable } from '../grid/selectable';

export class CodeMapping implements Selectable {

  constructor(public sourceConcept: SourceConcept,
              public targetConcept: TargetConcept,
              public matchScore: number) {
  }

  get selected() {
    return this.sourceConcept.selected
  }

  set selected(selected: boolean) {
    this.sourceConcept.selected = selected
  }
}
