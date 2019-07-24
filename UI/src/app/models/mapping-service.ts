import { ArrowCache, Arrow } from './arrow-cache';
import { groupBy } from '../infrastructure/utility';
import { MappingPair, MappingNode, Mapping } from './mapping';

export class MappingService {
  data: Array<Arrow>;

  constructor(data: ArrowCache) {
    if (!data) {
      throw new Error('data should be not empty');
    }
    this.data = Object.values(data);
  }

  generate(): Mapping {

    const merged = this.data.map(arrow => {
      const merge = {};
      merge['sourceTable'] = arrow.source.tableName;
      merge['sourceColumn'] = arrow.source.name;
      merge['targetTable'] = arrow.target.tableName;
      merge['targetColumn'] = arrow.target.name;
      return merge;
    });

	const bySource = groupBy(merged, 'sourceTable');


	const mapPairs = Object.keys(bySource).map(sourceTable => {
		const pair: MappingPair = {
      source_table: sourceTable,
      target_table: '',
      mapping: []
		}

    const bySourceBytable = groupBy(bySource[sourceTable], 'targetTable');
    Object.keys(bySourceBytable).forEach(targetTable => {
		  pair.target_table = targetTable;

      bySourceBytable[targetTable].map(arrow => {
        const node: MappingNode = {
          source_field: arrow.sourceColumn,
          target_field: arrow.targetColumn,
          sql_field: arrow.sourceColumn,
          sql_alias: arrow.targetColumn
        }
        pair.mapping.push(node);
      });

		});

    return pair;
	});

    const mapping: Mapping = Object.create(null);
    mapping.mapping_items=mapPairs;

    return mapping;
  }
}
