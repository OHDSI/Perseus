import { CodeMapping } from '../models/code-mapping/code-mapping';

export function getTerm(codeMapping: CodeMapping, sourceNameColumn) {
  return codeMapping.sourceCode.code[sourceNameColumn]
}
