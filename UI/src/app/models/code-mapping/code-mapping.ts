import { SourceConcept } from './source-concept';
import { TargetConcept } from './target-concept';
import { Selectable } from '../grid/selectable';

export class CodeMapping implements Selectable {

  constructor(public sourceCode: SourceConcept,
              public targetConcept: TargetConcept,
              public matchScore: number) {
  }

  get selected() {
    return this.sourceCode.selected
  }

  set selected(selected: boolean) {
    this.sourceCode.selected = selected
  }
}
