import { Code } from './code';
import { Column } from '../grid/grid';
import { CodeMappingParams } from './code-mapping-params';
import { CodeMapping } from './code-mapping';
import { ScoredConcept } from './scored-concept';

export interface ImportCodesState {
  codes: Code[]
  columns: Column[]
  mappingParams: CodeMappingParams
  codeMappings: CodeMapping[]
  sourceNameColumn: string // Term column using for search concepts
  scoredConcepts: ScoredConcept[]
}
