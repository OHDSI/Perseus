import { ArrowCache, Arrow } from './arrow-cache';
import { groupBy } from '../infrastructure/utility';
import { MappingPair, MappingNode, Mapping } from './mapping';
import { IConnection } from '../services/bridge.service';

export class MappingService {
  connections: Array<IConnection>;

  constructor(arrowCache: ArrowCache) {
    if (!arrowCache) {
      throw new Error('data should be not empty');
    }
    this.connections = Object.values(arrowCache);
  }

  generate(): Mapping {
    const merged = this.connections.map(arrow => {
      const merge: any = {};
      merge.transforms = arrow.transforms;
      merge.sourceTable = arrow.source.tableName;
      merge.sourceColumn = arrow.source.name;
      merge.targetTable = arrow.target.tableName;
      merge.targetColumn = arrow.target.name;
      return merge;
    });

    const bySource = groupBy(merged, 'sourceTable');

    const mapPairs = Object.keys(bySource).map(sourceTable => {
      const pair: MappingPair = {
        source_table: sourceTable,
        target_table: '',
        mapping: []
      };

      const byTargetTable = groupBy(bySource[sourceTable], 'targetTable');
      Object.keys(byTargetTable).forEach(targetTable => {
        pair.target_table = targetTable;

        byTargetTable[targetTable].map(arrow => {
          const node: MappingNode = {
            source_field: arrow.sourceColumn,
            target_field: arrow.targetColumn,
            sql_field: arrow.sourceColumn,
            sql_alias: arrow.targetColumn
          };

          this.applyTransforms(node, arrow);

          pair.mapping.push(node);
        });
      });

      return pair;
    });

    const mapping: Mapping = Object.create(null);
    mapping.mapping_items = mapPairs;

    return mapping;
  }

  applyTransforms(node: MappingNode, connector: any) {
    node.sql_field = connector.transforms.reduce((acc, transform) => {
      return `${transform}(${acc})`;
    }, node.sql_field);
  }
}
