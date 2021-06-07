import { MappingNode } from '@models/mapping';

export function logicForReport(mappingNode: MappingNode): string {
  return logics
    .filter(logic => logic.condition(mappingNode))
    .map(logic => logic.result(mappingNode))
    .join('\n');
}

interface Logic {
  name: string;
  condition: (mappingNode: MappingNode) => boolean;
  result: (mappingNode: MappingNode) => string;
}

const logics: Logic[] = [
  {
    name: 'Sql Function',
    condition: mappingNode => mappingNode.sqlTransformation as unknown as boolean,
    result: mappingNode => `SQL Function: '${mappingNode.sqlTransformation}'.`
  },
  {
    name: 'Lookup',
    condition: mappingNode => mappingNode.lookup as unknown as boolean,
    result: mappingNode => `Use filter:\n${mappingNode.lookupType}\n'${mappingNode.lookup}'.`
  },
  {
    name: 'Constant',
    condition: mappingNode => !mappingNode.source_field,
    result: mappingNode => `Constant value: '${mappingNode.sql_field}'.`
  }
];

