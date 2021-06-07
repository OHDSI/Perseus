import { SourceCode } from './source-code';
import { TargetConcept } from './target-concept';
import { Selectable } from '../grid/selectable';

export class CodeMapping implements Selectable {

  constructor(public sourceCode: SourceCode,
              public targetConcepts: TargetConcept[],
              public matchScore: number,
              public approved = false) {
  }

  get selected() {
    return this.approved
  }

  set selected(selected: boolean) {
    this.approved = selected
  }
}
