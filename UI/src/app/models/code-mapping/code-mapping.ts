import { SourceCode } from './source-code';
import { TargetConcept } from './target-concept';
import { Selectable } from '../grid/selectable';
import { createNoFoundConcept } from '@models/code-mapping/concept'

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

export function withoutTargetConcepts(codeMapping: CodeMapping): CodeMapping {
  const targetConcepts = [{concept: createNoFoundConcept(), term: [codeMapping.sourceCode.source_name]}]
  return new CodeMapping(
    codeMapping.sourceCode,
    targetConcepts,
    codeMapping.matchScore,
    codeMapping.approved
  )
}
