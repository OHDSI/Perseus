import { MappingNode } from '@models/etl-mapping-for-zip-xml-generation';
import { ITable } from '@models/table'
import { TargetConfig } from '@models/target-config'

export function parseMappingNodesByGroups(mappingNodes: MappingNode[]): MappingNode[] {
  const groupReducer = (accumulator: {[key: string]: MappingNode}, currentValue: MappingNode) => {
    const currentNode = accumulator[currentValue.groupName + currentValue.target_field];
    if (currentNode) {
      currentNode.source_field = `${currentNode.source_field}\n${currentValue.source_field}`;
    } else {
      accumulator[currentValue.groupName + currentValue.target_field] = {...currentValue}; // Copy object
    }

    return accumulator;
  };

  const mappingWithGroupsMap = mappingNodes
    .filter(node => node.groupName)
    .reduce(groupReducer, {});

  const mappingWithGroups: MappingNode[] = Object.keys(mappingWithGroupsMap)
    .map(groupKey => mappingWithGroupsMap[groupKey]);

  const mappingWithoutGroups = mappingNodes
    .filter(node => !node.groupName);

  return [
    ...mappingWithGroups,
    ...mappingWithoutGroups
  ];
}

export function canOpenMappingPage(targetTableNames: string[], targetConfig: TargetConfig): boolean {
  return !!targetTableNames.find(it => targetConfig[it]?.data?.length > 1)
}

export function isSourceUploaded(source: ITable[]): boolean {
  return !!source?.length
}

export function isTablesMapped(targetConfig: TargetConfig) {
  const targetTables = Object.keys(targetConfig)
  return targetTables?.some(tableName => targetConfig[tableName].data.length > 1)
}

export function isViewCreated(source: ITable[]): boolean {
  return source?.some(table => table.sql)
}

export function isTablesMappedOrViewCreated(targetConfig: TargetConfig, source: ITable[]): boolean {
  return isTablesMapped(targetConfig) || isViewCreated(source)
}
