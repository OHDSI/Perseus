import { SourceCode } from './source-code';
import { TargetConcept } from './target-concept';
import { Selectable } from '../grid/selectable';

export class CodeMapping implements Selectable {

  constructor(public sourceCode: SourceCode,
              public targetConcepts: TargetConcept[],
              public matchScore: number) {
  }

  get selected() {
    return this.sourceCode.code.selected
  }

  set selected(selected: boolean) {
    this.sourceCode.code.selected = selected
  }
}
