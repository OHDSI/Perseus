import { MappingNode } from '../../models/mapping';

export function logicForReport(mappingNode: MappingNode): string {
  const logics = [];

  if (mappingNode.sqlTransformation) {
    logics.push(`SQL Function: '${mappingNode.sqlTransformation}'.`);
  }
  if (mappingNode.lookup) {
    logics.push(`Lookup: '${mappingNode.lookup}'.`);
  }
  if (!mappingNode.source_field) {
    logics.push(`Constant value: '${mappingNode.sql_field}'.`);
  }

  return logics.join('\n');
}
