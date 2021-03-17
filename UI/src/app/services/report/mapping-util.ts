import { MappingNode } from '../../models/mapping';

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
