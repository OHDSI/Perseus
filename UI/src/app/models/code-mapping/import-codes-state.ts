import { Code } from './code';
import { Column } from '../grid/grid';
import { CodeMappingParams } from './code-mapping-params';
import { CodeMapping } from './code-mapping';
import { SearchConceptFilters } from './search-concept-filters';

export interface ImportCodesState {
  codes: Code[]
  columns: Column[]
  mappingParams: CodeMappingParams
  codeMappings: CodeMapping[],
  filters: SearchConceptFilters
}

export function columnsFromSourceCode(code: Code): Column[] {
  return Object.keys(code)
    .filter(key => key !== 'selected')
    .map(key => ({
      field: key,
      name: key
    }))
}
