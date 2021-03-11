import { ArrowCache, ConstantCache } from './arrow-cache';
import { groupBy } from '../infrastructure/utility';
import { Mapping, MappingNode, MappingPair } from './mapping';
import { IConnection } from '../services/bridge.service';
import { IRow } from './row';
import { ITable } from './table';
import { getLookupType } from '../services/utilites/lookup-util';
import * as conceptMap from '../cdm/mapping/concept-fileds-list.json'
import { IConcept, ITableConcepts } from '../cdm/mapping/concept-transformation/model/concept';
import { conceptFieldsTypes } from '../app.constants';

export class MappingService {
  connections: Array<IConnection>;
  constants: Array<IRow>;
  sourceTableName: string;
  targetTableName: string;
  conceptFieldsMap = (conceptMap as any).default;
  concepts: ITableConcepts;
  clones: any;

  constructor(arrowCache: ArrowCache, constants: ConstantCache, sourceTableName: string, targetTableName: string, concepts: ITableConcepts, clones: any) {
    if (!arrowCache) {
      throw new Error('data should be not empty');
    }
    this.connections = Object.values(arrowCache);
    this.constants = Object.values(constants);
    this.sourceTableName = sourceTableName;
    this.targetTableName = targetTableName;
    this.concepts = concepts;
    this.clones = clones;
  }

  generate(): Mapping {
    const conceptTables = Object.keys(this.conceptFieldsMap);
    const merged = this.connections
      .filter(arrow => {
        let condition = arrow.target.tableName !== 'similar' &&
          arrow.source.tableName !== 'similar';
        if (this.sourceTableName) {
          condition = condition && arrow.source.tableName === this.sourceTableName;
        }
        if (this.clones[ arrow.target.tableName ]) {
          this.clones[ arrow.target.tableName ].forEach(item => {
            if (item.cloneConnectedToSourceName === this.sourceTableName) {
              condition = !!arrow.target.cloneTableName;
            }
          })
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
          targetColumnAlias: arrow.target.name,
          lookup: arrow.lookup && arrow.lookup[ 'applied' ] ? arrow.lookup[ 'name' ] : '',
          lookupType: getLookupType(arrow),
          sqlTransformation: this.getSqlTransformation(arrow),
          comments: arrow.source.comments,
          condition: arrow.target.condition,
          targetCloneName: arrow.target.cloneTableName,
        };
      });

    const bySource = groupBy(merged, 'sourceTable');

    const mapPairs: MappingPair[] = [];

    Object.keys(bySource).forEach(sourceTable => {
      if (this.sourceTableName && this.sourceTableName !== sourceTable) {
        return;
      }
      const byTargetTable = groupBy(bySource[ sourceTable ], 'targetTable');
      Object.keys(byTargetTable).forEach(targetTable => {
        if (this.targetTableName && this.targetTableName !== targetTable) {
          return;
        }

        const mappings = [];

        byTargetTable[ targetTable ].map(arrow => {

          if (!(conceptTables.includes(arrow.targetTable) && this.conceptFieldsMap[ arrow.targetTable ].includes(arrow.targetColumn))) {
            const node: MappingNode = {
              concept_id: '',
              source_field: arrow.sourceColumn,
              target_field: arrow.targetColumn,
              sql_field: arrow.sourceColumn,
              sql_alias: arrow.targetColumnAlias,
              lookup: arrow.lookup,
              lookupType: arrow.lookupType,
              sqlTransformation: arrow.sqlTransformation,
              comments: arrow.comments,
              condition: arrow.condition,
              targetCloneName: arrow.targetCloneName ? arrow.targetCloneName : '',
            };
            this.applyTransforms(node, arrow);
            mappings.push(node);
          }

        });
        mapPairs.push({
          source_table: sourceTable,
          target_table: targetTable,
          mapping: mappings
        });
      });
    });

    this.applyConstant(mapPairs, this.constants);

    let mapping: Mapping = Object.create(null);
    mapping.mapping_items = mapPairs;

    mapping = this.addConceptFields(mapping);

    return mapping;
  }


  addConceptFields(mapping: Mapping) {
    Object.keys(this.concepts).forEach(key => {
      const tableNames = key.split('|');
      const conceptTargetTable = tableNames[ 0 ];
      const conceptSourceTable = tableNames[ 1 ];

      if (!this.sourceTableName || this.sourceTableName === conceptSourceTable && this.targetTableName === conceptTargetTable) {
        let cloneExists = false;
        if (this.clones[ conceptTargetTable ] && this.clones[ conceptTargetTable ].length) {
          const existingClones = this.clones[ conceptTargetTable ].filter(item => item.cloneConnectedToSourceName === conceptSourceTable);
          cloneExists = !!existingClones.length;
        }
        if (this.concepts[ key ]) {
          if (conceptSourceTable !== 'similar' && (!this.sourceTableName || this.sourceTableName === conceptSourceTable)) {
            let mappingItemIndex = mapping.mapping_items.findIndex(item => item.source_table === conceptSourceTable && item.target_table === conceptTargetTable);
            if (mappingItemIndex === -1) {
              const mappingPair = {
                source_table: conceptSourceTable,
                target_table: conceptTargetTable,
                mapping: []
              };
              mapping.mapping_items.push(mappingPair)
            }
            mappingItemIndex = mapping.mapping_items.findIndex(item => item.source_table === conceptSourceTable && item.target_table === conceptTargetTable);
            this.concepts[ key ].conceptsList.forEach(conc => {
              conceptFieldsTypes.forEach(fieldType => {
                if (!(cloneExists && !conc.fields[ fieldType ].targetCloneName)) {
                  const newMappingNode = this.createConceptMappingNode(conc, fieldType, this.concepts[ key ].lookup);
                  if (newMappingNode) {
                    mapping.mapping_items[ mappingItemIndex ].mapping.push(newMappingNode);
                  }
                }
              })
            })
          }
        }
      }
    })

    return mapping;
  }

  createConceptConstantNode(concept: IConcept, fieldType: string) {
    return {
      concept_id: concept.id,
      source_field: '',
      sql_field: concept.fields[fieldType].constant,
      sql_alias: concept.fields[fieldType].targetFieldName,
      target_field: concept.fields[fieldType].targetFieldName,
      comments: concept.fields[fieldType].comments,
      targetCloneName: concept.fields[fieldType].targetCloneName ? concept.fields[fieldType].targetCloneName : ''
    };
  }

  createConceptMappingNode(concept: IConcept, fieldType: string, lookup: any) {
    if (!concept.fields[ fieldType ].field && !concept.fields[ fieldType ].constant) {
      return;
    }
    if (concept.fields[ fieldType ].constantSelected && concept.fields[ fieldType ].constant) {
      return this.createConceptConstantNode(concept, fieldType);
    }
    const node: MappingNode = {
      concept_id: concept.id,
      source_field: concept.fields[ fieldType ].field,
      target_field: concept.fields[ fieldType ].targetFieldName,
      sql_field: concept.fields[ fieldType ].field,
      sql_alias: concept.fields[ fieldType ].targetFieldName,
      lookup,
      lookupType: this.getConceptLookupType(concept.fields[ fieldType ].targetFieldName),
      sqlTransformation: this.getConceptSqlTransformation(concept.fields[ fieldType ].sqlApplied, concept.fields[ fieldType ].sql, concept.fields[ fieldType ].targetFieldName, concept.fields[ fieldType ].targetCloneName),
      comments: concept.fields[ fieldType ].targetFieldName,
      condition: concept.fields[ fieldType ].condition,
      targetCloneName: concept.fields[ fieldType ].targetCloneName ? concept.fields[ fieldType ].targetCloneName : ''
    };
    return node;
  }

  getConceptLookupType(fieldName: string) {
    return fieldName.endsWith('source_concept_id') ? 'source_to_source' : 'source_to_standard';
  }

  getConceptSqlTransformation(sqlApplied: boolean, sql: string, fieldName: string, cloneTableName: string) {
    const target_column_name = cloneTableName ? `${cloneTableName}_${fieldName}` : fieldName;
    return sql && sqlApplied ? `${sql} as ${target_column_name}` : '';
  }

  getSqlTransformation(arrow: any) {
    const target_column_name = arrow.target.cloneTableName ? `${arrow.target.cloneTableName}_${arrow.target.name}` : arrow.target.name;
    return arrow.sql && arrow.sql[ 'applied' ] ? `${arrow.sql[ 'name' ]} as ${target_column_name}` : '';
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
          concept_id: '',
          sql_field: `'${row.constant}'`,
          sql_alias: row.name,
          target_field: row.name,
          comments: row.comments,
          targetCloneName: row.cloneTableName ? row.cloneTableName : ''
        };
        mapping['mapping'].push(constantObj);
      });
    });
  }
}

export function addViewsToMapping(mapping: Mapping, source: ITable): Mapping {
  const sql = source['sql'];
  if (sql) {
    if (!mapping['views']) {
      mapping['views'] = {};
    }
    mapping['views'][source.name] = sql;
  }

  return mapping;
}

export function addGroupMappings(mapping: Mapping, source: ITable) {
  if (source.name !== 'similar') {
    const mappingIndex = mapping.mapping_items.findIndex(item => item.source_table === source.name);
    let mappingItems = mapping.mapping_items[ mappingIndex ].mapping;
    const indexesToRemove = [];

    mappingItems.forEach((item, index) => {
      const field = source.rows.filter(row => row.name === item.source_field)[ 0 ];
      if (field && field.grouppedFields && field.grouppedFields.length) {
        const mappingsToAdd: MappingNode[] = field.grouppedFields.map(groupedField => {
          const regex = new RegExp('(' + field.name + ')(\\s|,|\\))', 'gi');
          return {
            concept_id: '',
            source_field: groupedField.name,
            target_field: item.target_field,
            sql_field: groupedField.name,
            sql_alias: item.sql_alias,
            lookup: item.lookup,
            lookupType: item.lookupType,
            sqlTransformation: item.sqlTransformation.replace(regex, `${groupedField.name}$2`),
            comments: item.comments,
            condition: item.condition,
            targetCloneName: item.targetCloneName ? item.targetCloneName : '',
            groupName: item.source_field
          };
        });

        mappingItems = mappingItems.concat(mappingsToAdd);
        indexesToRemove.push(index);
      }

    });

    while (indexesToRemove.length) {
      mappingItems.splice(indexesToRemove.pop(), 1);
    }

    mapping.mapping_items[ mappingIndex ].mapping = mappingItems;
  }
}

export function addClonesToMapping(mapping: Mapping): Mapping {
  mapping.mapping_items
    .forEach(mappingItem => {
      const clones = {};
      mappingItem.mapping.forEach(mappingNode => {
        const targetCloneName = mappingNode.targetCloneName;
        if (targetCloneName && targetCloneName !== '' && !clones.hasOwnProperty(targetCloneName)) {
          clones[mappingNode.targetCloneName] = mappingNode.condition;
        }
      });

      const clonesKeys = Object.keys(clones);
      if (clonesKeys.length > 0) {
        mappingItem.clones = clonesKeys.map(key => ({
          name: key,
          condition: clones[key]
        }));
      }
    });

  return mapping;
}
