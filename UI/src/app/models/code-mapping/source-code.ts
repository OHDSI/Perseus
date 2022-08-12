import { Code } from './code';

export interface SourceCode {
  code: Code
  source_name?: string
  source_auto_assigned_concept_ids?: number[]
}
