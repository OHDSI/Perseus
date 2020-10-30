import { ArrowCache, ConstantCache } from './arrow-cache';
import { groupBy } from '../infrastructure/utility';
import { MappingPair, MappingNode, Mapping } from './mapping';
import { IConnection } from '../services/bridge.service';
import { IRow } from './row';

export class MappingService {
  connections: Array<IConnection>;
  constants: Array<IRow>;
  sourceTableName: string;
  targetTableName: string;

  constructor(arrowCache: ArrowCache, constants: ConstantCache, sourceTableName: string, targetTableName: string) {
    if (!arrowCache) {
      throw new Error('data should be not empty');
    }
    this.connections = Object.values(arrowCache);
    this.constants = Object.values(constants);
    this.sourceTableName = sourceTableName;
    this.targetTableName = targetTableName;
  }

  generate(): Mapping {
    const merged = this.connections
      .filter(arrow => {
        let condition = arrow.target.tableName !== 'similar';
        if (this.sourceTableName) {
          condition = condition && arrow.source.tableName === this.sourceTableName;
        }
        return condition;
      })
      .map(arrow => {
        return {
          transforms: arrow.transforms,
          sourceTable: arrow.source.tableName,
          sourceColumn: arrow.source.name,
          targetTable: arrow.target.tableName,
          targetColumn: arrow.target.name,
          lookup: arrow.lookup ? arrow.lookup['name'] : '',
          sqlTransformation: arrow.sql ? arrow.sql['name'] : '',
          comments: arrow.source.comments
        };
      });

    const bySource = groupBy(merged, 'sourceTable');

    const mapPairs: MappingPair[] = [];

    Object.keys(bySource).forEach(sourceTable => {
      if (this.sourceTableName && this.sourceTableName !== sourceTable) {
        return;
      }
      const byTargetTable = groupBy(bySource[sourceTable], 'targetTable');
      Object.keys(byTargetTable).forEach(targetTable => {
        if (this.targetTableName && this.targetTableName !== targetTable) {
          return;
        }
        const mappings = [];

        byTargetTable[targetTable].map(arrow => {
          const node: MappingNode = {
            source_field: arrow.sourceColumn,
            target_field: arrow.targetColumn,
            sql_field: arrow.sourceColumn,
            sql_alias: arrow.targetColumn,
            lookup: arrow.lookup,
            sqlTransformation: arrow.sqlTransformation,
            comments: arrow.comments
          };

          this.applyTransforms(node, arrow);

          mappings.push(node);
        });
        mapPairs.push({
          source_table: sourceTable,
          target_table: targetTable,
          mapping: mappings
        });
      });
    });

    this.applyConstant(mapPairs, this.constants);

    const mapping: Mapping = Object.create(null);
    mapping.mapping_items = mapPairs;

    return mapping;
  }

  applyTransforms(node: MappingNode, connector: any) {
    node.sql_field = connector.transforms.reduce((acc, transform) => {
      return transform.getSql(acc, transform);
    }, node.sql_field);
  }

  applyConstant(mapPairs: any[], rows: IRow[]) {
    const mappings = mapPairs.map(x => {
      return { table: x.target_table, mapping: x.mapping };
    });
    mappings.forEach((mapping: {}) => {
      rows.forEach(row => {
        if (mapping['table'] !== row.tableName) {
          return;
        }
        const constantObj = {
          source_field: '',
          sql_field: row.constant,
          sql_alias: row.name,
          target_field: row.name,
          comments: row.comments
        };
        mapping['mapping'].push(constantObj);
      });
    });
  }
}
